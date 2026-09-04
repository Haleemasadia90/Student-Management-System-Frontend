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

  activeOption = signal<string | null>(null);

  options = [
    { key: 'change-password', label: 'Change Password', icon: 'ti ti-lock', desc: 'Update your account password' },
    // future options yahan add hote jayenge, e.g.:
    // { key: 'profile', label: 'Edit Profile', icon: 'ti ti-user', desc: 'Update your name, DP and info' },
  ];

  selectOption(key: string): void {
    // agar wahi option dobara click ho, to band (collapse) kar do; warna khol do
    this.activeOption.set(this.activeOption() === key ? null : key);
  }
}

