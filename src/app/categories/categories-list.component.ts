import { Subscription } from 'rxjs';

import {Component, OnInit, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { CategoriesService, Category } from './categories-list.service';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  //4. Cập nhật import
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './categories-list.component.html',
})
export class CategoriesListComponent implements OnInit {
  //Biến danh sách và tìm kiếm
  categories: Category[] = [];
  q = '';

  //Biến cho Form
  showForm = false;
  editId: string | null = null;
  form!: FormGroup;
  isLoading = false;

  private fb = inject(FormBuilder);
  private svc = inject(CategoriesService);

  constructor(){}
  ngOnInit(): void {
      this.form = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(2)]],
        description: [''],
      });
      //Tải danh sách
      this.svc.list().subscribe((items) => (this.categories = items));
  }
  // Lọc danh sách (cho ô tìm kiếm)
  filteredCategories(): Category[] {
    const s = (this.q || '').toLowerCase().trim();
    if (!s) return this.categories;
    return this.categories.filter((c) => 
      c.name.toLowerCase().includes(s)
    );
  }
  //8. Các hàm điều khiển Form
  startCreate(): void {
    this.editId = null;
    this.form.reset({ name: '', description: ''})
    this.showForm = true;
  }

  startEdit(c: Category): void {
    if (!c.id) return;
    this.editId = c.id;
    this.form.reset({ name: c.name, description: c.description});
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
    this.editId = null;
  }
  //9. Hàm lưu (Tạo mới hoặc cập nhật)
  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      alert('Tên danh mục là bắt buộc (tối thiểu 2 ký tự).');
      return;
    }
    this.isLoading = true;
    const value = this.form.value as Omit<Category, 'id' | 'createAt'>;

    try {
      if (this.editId) {
        // --- Chế dộ sửa ---
        await this.svc.update(this.editId, value);
      }else {
        // --- Chế độ tạo mới ---
        await this.svc.create(value);
      }
      this.cancelForm();
    }catch (e: any) {
      console.error(e);
      alert(
        `Lưu thất bại. Lỗi: {e.message} (Bạn có phải là Admin/Editor không?)`
      );
    }finally {
      this.isLoading = false;
    }
  }

  //10. Hàm xóa
  async delete(c: Category): Promise<void>{
    if (!c.id) return;
    if (confirm(`Bạn có chắc muốn xóa danh mục "${c.name}"?`)){
      try {
        await this.svc.remove(c.id);
      }catch (e: any){
        console.error(e);
        alert(`Xóa thất bại. Lỗi: "${e.message}"`);
      }
    }
  }
}