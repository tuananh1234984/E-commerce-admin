import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";


// Khởi tạo app
admin.initializeApp();
const db = admin.firestore();

// (Để cho hàm createEmployee hoạt động)
// Định nghĩa lại UserProfile (giống hệt bên Angular)
export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: string; // 'admin' | 'editor'
  phone?: string;
  status?: string;
}

/**
 * TRIGGER 1: Tự động cập nhật dashboard khi có đơn hàng mới(hoặc bị sửa/xóa)
 */
export const updateDashboardOnOrderChange = functions.firestore
  .document("orders/{orderId}")
  .onWrite(async (change, context) => {
    // 1. SỬA LỖI: sumary -> summary
    const statsRef = db.doc("dashboard_stats/summary");

    // Lấy dữ liệu trước và sau khi thay đổi
    const dataBefore = change.before.data();
    const dataAfter = change.after.data();

    // Dùng Transaction để đảm bảo an toàn dữ liệu
    return db.runTransaction(async (transaction) => {
      const statsDoc = await transaction.get(statsRef);
      if (!statsDoc.exists) {
        // 1. SỬA LỖI: sumary -> summary
        console.log("Document 'summary' không tồn tại!");
        return;
      }

      const currentStats = statsDoc.data()!;
      let newStats = {...currentStats}; // Tạo bản sao để cập nhật

      // 1. Tính Toán khi tạo/sửa/xóa
      if (!change.before.exists && change.after.exists) {
        // == Tạo mới (create) ==
        if (dataAfter!.trangThai === "Hoàn tất") {
          newStats = handleNewCompletedOrder(newStats, dataAfter);
        }
        // Luôn cộng đơn hàng hôm nay
        newStats.donHangHomNay += 1;
      } else if (change.before.exists && change.after.exists) {
        // == Cập nhật (update) ==
        if (
          dataBefore!.trangThai !== "Hoàn tất" &&
          dataAfter!.trangThai === "Hoàn tất"
        ) {
          newStats = handleNewCompletedOrder(newStats, dataAfter);
        }
        if (
          dataBefore!.trangThai === "Hoàn tất" &&
          dataAfter!.trangThai === "Hủy" // (Nên là "Đã hủy"?)
        ) {
          newStats = handleCancelledOrder(newStats, dataBefore);
        }
      } else if (change.before.exists && !change.after.exists) {
        // == Xóa (delete) ==
        if (dataBefore!.trangThai === "Hoàn tất") {
          newStats = handleCancelledOrder(newStats, dataBefore);
        }
      }

      transaction.update(statsRef, newStats);
    });
  });

/**
 * TRIGGER 2: Cron JOB - chạy vào 00:00 mỗi ngày để reset
 */
export const resetDailyStats = functions.pubsub
  .schedule("0 0 * * *")
  .onRun(async (context) => {
    console.log("Reset thống kê hàng ngày");
    // 1. SỬA LỖI: sumary -> summary
    const statsRef = db.doc("dashboard_stats/summary");

    return statsRef.update({
      donHangHomNay: 0,
      khachHangMoiTuan: 0, // (Giả sử bạn có logic cập nhật trường này)
    });
  });

// Cron job để reset doanhThuHangThang vào ngày 1 hàng tháng
export const resetMonthlyRevenue = functions.pubsub
  .schedule("0 0 1 * *")
  .onRun(async (context) => {
    console.log("Reset doanh thu hàng tháng");
    // 1. SỬA LỖI: sumary -> summary
    const statsRef = db.doc("dashboard_stats/summary");

    // 2. SỬA LỖI: doanhThuHangThang -> doanhThuThang (cho khớp)
    return statsRef.update({
      "doanhThuThang": 0,
      // (Bạn cũng nên reset 2 biểu đồ về 0)
      "chartDoanhThuThang.T1": 0,
      "chartDoanhThuThang.T2": 0,
      "chartDoanhThuThang.T3": 0,
      "chartDoanhThuThang.T4": 0,
      "chartDoanhThuThang.T5": 0,
      "chartDoanhThuThang.T6": 0,
      "chartDoanhThuThang.T7": 0,
      "chartDoanhThuThang.T8": 0,
      "chartDoanhThuThang.T9": 0,
      "chartDoanhThuThang.T10": 0,
      "chartDoanhThuThang.T11": 0,
      "chartDoanhThuThang.T12": 0,
    });
  });

// --- (Các hàm helper cho Dashboard - Giữ nguyên) ---

function handleNewCompletedOrder(stats: any, orderData: any): any {
  const orderDate = orderData.ngay.toDate(); // Chuyển Timestamp
  const monthKey = `T${orderDate.getMonth() + 1}`; // ví dụ: T11
  const categoryKey = orderData.danhMuc.toLowerCase() || "khac"; // ví dụ: 'dienTu'

  // Cộng dồn
  stats.doanhThuThang += orderData.tongTien;

  if (stats.chartDoanhThuThang[monthKey] !== undefined) {
    stats.chartDoanhThuThang[monthKey] += orderData.tongTien;
  }

  if (stats.chartTyTrongDanhMuc[categoryKey] !== undefined) {
    stats.chartTyTrongDanhMuc[categoryKey] += orderData.tongTien;
  }

  return stats;
}

function handleCancelledOrder(stats: any, orderData: any): any {
  const orderDate = orderData.ngay.toDate();
  const monthKey = `T${orderDate.getMonth() + 1}`;
  const categoryKey = orderData.danhMuc.toLowerCase() || "khac";

  stats.doanhThuThang -= orderData.tongTien;

  if (stats.chartDoanhThuThang[monthKey] !== undefined) {
    stats.chartDoanhThuThang[monthKey] -= orderData.tongTien;
  }

  if (stats.chartTyTrongDanhMuc[categoryKey] !== undefined) {
    stats.chartTyTrongDanhMuc[categoryKey] -= orderData.tongTien;
  }

  return stats;
}

// ==========================================================
// 3. THÊM MỚI: FUNCTION ĐỂ TẠO NHÂN VIÊN
// (Đã chuyển sang cú pháp v1 `functions.https.onCall`)
// ==========================================================
export const createEmployee = functions.https.onCall(async (data, context) => {
  // 1. [Bảo mật] Kiểm tra xem người gọi có phải là ADMIN không
  // (Sử dụng context.auth thay vì request.auth)
  if (context.auth?.token.role !== "admin") {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Chỉ có Admin mới được tạo tài khoản nhân viên."
    );
  }

  // 2. Lấy dữ liệu từ Angular (Sử dụng data thay vì request.data)
  // (Đây là dữ liệu mà component của bạn (bản xịn) gửi lên)
  const {email, password, name, role, phone, photoUrl, status} = data;

  if (!email || !password || !name || !role) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Vui lòng cung cấp đầy đủ: email, password, name (displayName), role."
    );
  }

  try {
    // 3. (Admin SDK) Tạo tài khoản trên AUTHENTICATION
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: name, // Dùng 'name' từ form
    });

    // 4. (Admin SDK) Gán vai trò (role) tùy chỉnh
    await admin.auth().setCustomUserClaims(userRecord.uid, {role: role});

    // 5. (Admin SDK) Tạo document trong FIRESTORE (Đã cập nhật)
    const newUser: UserProfile = {
      uid: userRecord.uid,
      email: email,
      displayName: name,
      role: role,
      phone: phone || "", // (Lưu trường 'phone' từ form)
      photoURL: photoUrl || "", // (Lưu trường 'photoUrl' từ form)
      status: status || "Active", // (Lưu trường 'status' từ form)
    };
    await db.doc(`users/${userRecord.uid}`).set(newUser);

    // 6. Trả về thành công
    return {
      status: "success",
      message: `Tạo thành công nhân viên ${name} với vai trò ${role}.`,
      uid: userRecord.uid,
    };
  } catch (error: any) {
    // Xử lý lỗi (ví dụ: email-already-exists)
    console.error("Lỗi khi tạo nhân viên:", error);
    throw new functions.https.HttpsError("unknown", error.message);
  }
});

// ==========================================================
// 4. Thêm mới: FUNCTION để cập nhật nhân viên
// ==========================================================
export const updateEmployee = functions.https.onCall(async (data, context) => {
  // 1. [Bảo mật] luôn kiểm tra Admin
  if (context.auth?.token.role !== "admin") {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Chỉ có Admin mới được cập nhật thông tin nhân viên."
    );
  }
  // 2. Lấy dữ liệu từ Angular
  const {uid, updateData} = data;
  if (!uid || !updateData) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Thiếu ID nhân viên hoặc dữ liệu cập nhật."
    );
  }
  try {
    // 3. Cập nhật 3 nơi (Auth, Claims và Firestore)
    // a) Cập nhật Authentication (Tên, Email, Ảnh)
    await admin.auth().updateUser(uid, {
      email: updateData.email,
      displayName: updateData.name,
      photoURL: updateData.photoUrl,
    });
    // b) Cập nhật vai trò (Role) trong Custom Claims
    await admin.auth().setCustomUserClaims(uid, {
      role: updateData.role,

    });
    const {password, ...firestoreData} = updateData;
    await db.doc(`users/${uid}`).set(firestoreData, {merge: true});

    return {
      status: "success",
      Message: `Cập nhật thành công nhân viên ${updateData.name}.`,
    };
  } catch (error: any) {
    console.error("Lỗi khi cập nhật nhân viên:", error);
    throw new functions.https.HttpsError("unknown", error.message);
  }
});
// ==============================================================
// 5. Thêm mới: FUNCTION để xóa nhân viên
// ===============================================================
export const deleteEmployee = functions.https.onCall(async (database, context) => {
  // 1. [Bảo mật] luôn kiểm tra Admin
  if (context.auth?.token.role !== "admin") {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Chỉ có Admin mới được xóa nhân viên."
    );
  }
  // 2. Lấy dữ liệu
  const {uid} = database;
  if (!uid) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Thiếu ID nhân viên."
    );
  }
  // TODO (Nâng cao): Xóa file ảnh của user này trong Storage
  try {
    // 3. Xóa 2 nơi (Rất quan trọng: Xóa Auth trước)
    // a) Xóa khỏi Authentication
    await admin.auth().deleteUser(uid);
    // b) Xóa khỏi Firestore
    await db.doc(`users/${uid}`).delete();

    return {
      status: "success",
      message: `Xóa thành công nhân viên có UID: ${uid}.`,
    };
  } catch (error: any) {
    console.error("Lỗi khi xóa nhân viên: ", error);
    throw new functions.https.HttpsError("unknown", error.message);
  }
});
