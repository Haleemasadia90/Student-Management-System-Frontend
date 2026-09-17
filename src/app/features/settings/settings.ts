import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangePassword } from '../auth/change-password/change-password'; 
// 

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ChangePassword],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {

  options = [
    { key: 'profile', label: 'Profile', icon: 'ti ti-user-circle' },
    { key: 'password', label: 'Password', icon: 'ti ti-lock' },
  ];

  // Default: pehla option hamesha selected rahe (jaisa "General" screenshot mein hai)
  selectedOption = signal<string>('profile');

  selectOption(key: string): void {
    this.selectedOption.set(key);
  }
}