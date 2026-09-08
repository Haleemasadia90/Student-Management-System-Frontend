import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangePassword } from '../auth/change-password/change-password';


@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ChangePassword],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {

  activeOption = signal<string | 'change-password'>('change-password');

  options = [
    { key: 'change-password', label: '', icon: 'ti ti-lock', desc: 'Update your account password' },
    
  ];

  selectOption(key: string): void {
  
    this.activeOption.set(this.activeOption() === key ? '' : key);
  }
}

