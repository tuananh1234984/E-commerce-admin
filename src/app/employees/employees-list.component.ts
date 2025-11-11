import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { EmployeeService, Employee } from './employee.service';

@Component({
  selector: 'app-employees-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
  <div class="container-fluid p-4">
    <div class="row g-4">
      <!-- Cột bên trái: Form thêm/sửa nhân viên -->
      <div class="col-lg-4">
        <div class="card shadow">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">{{ editId ? 'Cập nhật thông tin' : 'Thêm nhân viên' }}</h6>
          </div>
          <div class="card-body">
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label class="form-label">Họ tên</label>
                <input type="text" class="form-control" formControlName="name" />
              </div>
              <div class="mb-3">
                <label class="form-label">Chức vụ</label>
                <input type="text" class="form-control" formControlName="role" />
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" formControlName="email" />
              </div>
              <div class="mb-3" *ngIf="!editId">
                <label class="form-label">Mật khẩu (tạm thời)</label>
                <input type="password" class="form-control" formControlName="password" />
              </div>
              <div class="mb-3">
                <label class="form-label">Điện thoại</label>
                <input type="text" class="form-control" formControlName="phone" />
              </div>
              <div class="mb-3">
                <label class="form-label">Ảnh (URL)</label>
                <input type="text" class="form-control" formControlName="photoUrl" placeholder="Dán URL ảnh" />
              </div>
              <div class="mb-3">
                <label class="form-label">Hoặc tải ảnh lên</label>
                <ng-container *ngIf="uploadAvailable; else urlOnlyInfo">
                  <div class="d-flex align-items-center">
                    <input type="file" accept="image/*" class="form-control" (change)="onFileSelected($event)" />
                    <span *ngIf="uploading" class="small text-muted ms-2"><i class="fas fa-spinner fa-spin me-1"></i>Đang tải...</span>
                  </div>
                </ng-container>
                <ng-template #urlOnlyInfo>
                  <div class="small text-warning">
                    Upload tạm thời không khả dụng. Hãy dán URL ảnh ở ô trên.
                  </div>
                </ng-template>
                <div class="mt-2" *ngIf="form.get('photoUrl')?.value as p">
                  <img [src]="p" alt="preview" style="height:80px; width:80px; object-fit:cover; border-radius:4px; border:1px solid rgba(0,0,0,.1)" />
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Trạng thái</label>
                <select class="form-select" formControlName="status">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div class="d-flex justify-content-end">
                <button class="btn btn-secondary me-2" type="button" (click)="cancelForm()">Hủy</button>
                <button class="btn btn-primary" type="submit" [disabled]="form.invalid">{{ editId ? 'Lưu' : 'Thêm' }}</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Cột bên phải: Danh sách nhân viên -->
      <div class="col-lg-8">
        <div class="card shadow">
          <div class="card-header py-3 d-flex justify-content-between align-items-center">
            <h6 class="m-0 font-weight-bold text-primary">Danh sách nhân viên</h6>
            <input class="form-control form-control-sm w-auto" placeholder="Tìm kiếm..." [(ngModel)]="q" />
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Hình ảnh</th>
                    <th>Họ và tên</th>
                    <th>Chức vụ</th>
                    <th>Email</th>
                    <th>Điện thoại</th>
                    <th>Trạng thái</th>
                    <th class="text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let e of filteredEmployees()">
                    <td>
                      <img [src]="e.photoUrl || placeholder" [alt]="e.name" class="rounded-circle" style="width: 50px; height: 50px; object-fit: cover;">
                    </td>
                    <td>{{ e.name }}</td>
                    <td>{{ e.role }}</td>
                    <td>{{ e.email }}</td>
                    <td>{{ e.phone }}</td>
                    <td>
                      <span class="badge" [class.bg-success]="e.status==='Active'" [class.bg-secondary]="e.status==='Inactive'">{{ e.status }}</span>
                    </td>
                    <td class="text-center">
                      <button class="btn btn-sm btn-outline-secondary me-1" title="Sửa" (click)="startEdit(e)">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-danger" title="Xóa" (click)="remove(e)">
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
})
export class EmployeesListComponent {
  employees: Employee[] = [];
  q = '';
  placeholder = 'https://images.unsplash.com/photo-1531123414780-f742a4da8ca1?q=80&w=800&auto=format&fit=crop';

  editId: string | null = null;
  form!: FormGroup;
  uploading = false;
  uploadAvailable = true;

  constructor(private fb: FormBuilder, private svc: EmployeeService) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      role: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      photoUrl: [''],
      status: ['Active', [Validators.required]],
      password: [''],
    });
    // Thêm logic validation động
    this.form.get('password')?.setValidators(this.editId ? [] : [Validators.required, Validators.minLength(6)]);
    this.svc.list().subscribe(items => (this.employees = items));
  }

  startEdit(e: Employee): void {
    if (!e.id) return;
    this.editId = e.id;
    this.form.reset({ name: e.name, role: e.role, email: e.email, phone: e.phone, photoUrl: e.photoUrl || '', status: e.status });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.form.get('password')?.clearValidators();
    this.form.get('password')?.updateValueAndValidity();
  }
  cancelForm(): void {
    this.editId = null;
    this.form.reset({ name: '', role: '', email: '', phone: '', photoUrl: '', status: 'Active' });
    this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.form.get('password')?.updateValueAndValidity();
  }

  async onFileSelected(evt: Event): Promise<void> {
    const input = evt.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    this.uploading = true;
    try {
      const url = await this.svc.uploadPhoto(file, this.editId || undefined);
      this.form.patchValue({ photoUrl: url });
    } catch (e: any) {
      const code = e?.code || 'unknown';
      const message = e?.message || '';
      alert(`Tải ảnh thất bại (${code}). Hãy kiểm tra quyền Storage hoặc App Check.`);
      // eslint-disable-next-line no-console
      console.error('Storage upload error:', { code, message, error: e });
      // Nếu lỗi do chưa bật Storage / thiếu quyền / App Check, ẩn tính năng upload để tránh gây nhầm lẫn
      if (code === 'storage/unauthorized' || code === 'storage/canceled' || code === 'storage/unknown' || message?.includes('CORS') || message?.includes('preflight')) {
        this.uploadAvailable = false;
      }
    } finally {
      this.uploading = false;
      // reset input so selecting the same file again still triggers change
      input.value = '';
    }
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;
    const value = this.form.value as Employee;
    if (this.editId) {
      await this.svc.update(this.editId, value);
    } else {
      await this.svc.create(value);
    }
    this.cancelForm();
  }

  async remove(e: Employee): Promise<void> {
    if (!e.id) return;
    if (confirm(`Xóa nhân viên \"${e.name}\"?`)) await this.svc.remove(e.id);
  }

  filteredEmployees(): Employee[] {
    const s = (this.q || '').toLowerCase().trim();
    if (!s) return this.employees;
    return this.employees.filter(e => e.name.toLowerCase().includes(s) || e.role.toLowerCase().includes(s));
  }
}
