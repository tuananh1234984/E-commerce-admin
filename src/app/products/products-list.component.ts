import { Component, inject, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core'; // 1. THÊM OnInit
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { ProductService, Product } from './product.service';
import { CategoriesService, Category } from '../categories/categories-list.service'; // Đảm bảo đúng đường dẫn
import { Observable } from 'rxjs';
import { Modal } from 'bootstrap'; 
@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './product-list.component.html',
})
export class ProductsListComponent implements OnInit { // 2. IMPLEMENTS OnInit
  products: Product[] = [];
  q = '';
  //showForm = false;
  editId: string | null = null;
  form!: FormGroup; // 3. KHAI BÁO BIẾN (vẫn giữ '!')

  // (Các biến cho upload và danh mục)
  uploading = false;
  fileToUpload: File | null = null;
  placeholderImg = 'https://images.unsplash.com/photo-1531123414780-f742a4da8ca1?q=80&w=800&auto=format&fit=crop'; // Dùng link ổn định
  public categories$!: Observable<Category[]>;

  private productModal: Modal | undefined;
  @ViewChild('productModal') productModalEl!: ElementRef;

  // Inject service
  private fb = inject(FormBuilder);
  private svc = inject(ProductService);
  private catSvc = inject(CategoriesService);
  constructor() {
    // 4. CONSTRUCTOR NÊN TRỐNG
    // (Không gọi service hay khởi tạo form ở đây)
  }

  // 5. DI CHUYỂN TẤT CẢ LOGIC KHỞI TẠO VÀO ngOnInit
  ngOnInit(): void {
    
    // 6. KHỞI TẠO FORM (Sửa lỗi đỏ)
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      sku: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9_-]+$/)]],
      price: [null, [Validators.required, Validators.min(0)]],
      stock: [null, [Validators.required, Validators.min(0)]],
      status: ['active', [Validators.required]],
      description: [''],
      category: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]],
    });

    // 7. GỌI DỮ LIỆU (Sửa lỗi vàng 'collectionData')
    this.svc.list().subscribe((items) => (this.products = items));
    this.categories$ = this.catSvc.list();
  }

  // Khởi tạo modal sau khi view tải xong
  ngAfterViewInit(): void {
    this.productModal = new Modal(this.productModalEl.nativeElement);
  }

  // --- (Toàn bộ các hàm startCreate, startEdit, cancelForm, onSubmit, delete, v.v.
  //      giữ nguyên y hệt như code lúc đầu ) ---

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.fileToUpload = input.files[0];
      const reader = new FileReader();
      reader.onload = () =>
        this.form.patchValue({ imageUrl: reader.result as string });
      reader.readAsDataURL(this.fileToUpload);
    }
  }

  startCreate(): void {
    this.editId = null;
    this.fileToUpload = null;
    this.form.reset({ //  (this.form) để khởi tạo form
      name: '', sku: '', price: null, stock: null, status: 'active',
      description: '', category: '', imageUrl: ''
    });
    this.productModal?.show();
  }

  startEdit(p: Product): void {
    if (!p.id) return;
    this.editId = p.id;
    this.fileToUpload = null;
    this.form.reset({ // <-- (this.form) để khởi tạo form
      name: p.name, sku: p.sku, price: p.price, stock: p.stock, status: p.status,
      description: p.description, category: p.category, imageUrl: p.imageUrl
    });
    this.productModal?.show();
  }

  cancelForm(): void {
    this.productModal?.hide();
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      alert('Vui lòng kiểm tra lại form, có trường bị thiếu hoặc sai.');
      return;
    }
    this.uploading = true;
    try {
      if (this.fileToUpload) {
        const newImageUrl = await this.svc.uploadPhoto(
          this.fileToUpload,
          this.editId || undefined
        );
        this.form.patchValue({ imageUrl: newImageUrl });
      }
      const value = this.form.value as Omit<Product, 'id' | 'createdAt'>;
      if (this.editId) {
        await this.svc.update(this.editId, value);
      } else {
        await this.svc.create(value);
      }
      this.productModal?.hide();
    } catch (e: any) {
      console.error(e);
      alert('Lỗi: ' + e.message);
    } finally {
      this.uploading = false;
    }
  }

  async delete(p: Product): Promise<void> {
    if (!p.id) return;
    if (confirm(`Xóa sản phẩm "${p.name}"?`)) {
      try {
        if (p.imageUrl) {
          // (Chúng ta sẽ sửa hàm deletePhoto sau)
          // await this.svc.deletePhoto(p.imageUrl); 
        }
        await this.svc.remove(p.id);
      } catch (e: any) {
        alert('Lỗi khi xóa: ' + e.message);
      }
    }
  }

  filteredProducts(): Product[] {
    const s = (this.q || '').toLowerCase().trim();
    if (!s) return this.products;
    return this.products.filter(
      (p) =>
        p.name.toLowerCase().includes(s) || p.sku.toLowerCase().includes(s)
    );
  }
  trackByProductId(index: number, item: Product): string {
    return item.id!;
  }
}