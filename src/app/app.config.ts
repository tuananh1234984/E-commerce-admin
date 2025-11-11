// src/app/app.config.ts

import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './routes'; // Dùng file routes.ts của bạn
import { environment } from '../environments/environment';

// 1. Import 'getApp'
import { provideFirebaseApp, initializeApp, getApp } from '@angular/fire/app'; 

// Import các hàm provider
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
// --- THÊM MỚI ---
import { provideFunctions, getFunctions } from '@angular/fire/functions'; // <-- 1. IMPORT

// Import các Pipe
import { DatePipe, DecimalPipe } from '@angular/common';

// Import các Service (đảm bảo đường dẫn đúng)
import { AuthService } from './auth/auth.service'; 
import { DashboardService } from './dashboard/dashboard.service';
// --- THÊM MỚI ---
import { EmployeeService } from './employees/employee.service'; // <-- 2. IMPORT

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    
    // Cung cấp các Pipe (cho Dashboard)
    importProvidersFrom(DatePipe, DecimalPipe),

    // Cung cấp App (Khởi tạo 1 lần)
    provideFirebaseApp(() => initializeApp(environment.firebase)),

    // Cung cấp các service của Firebase (đã sửa)
    provideAuth(() => getAuth(getApp())),
    provideFirestore(() => getFirestore(getApp())),
    provideStorage(() => getStorage(getApp())),
    // --- THÊM MỚI ---
    provideFunctions(() => getFunctions(getApp())), // <-- 3. THÊM DÒNG NÀY

    // Cung cấp các Service của chúng ta
    AuthService,
    DashboardService,
    EmployeeService, // <-- 4. THÊM DÒNG NÀY
  ],
};