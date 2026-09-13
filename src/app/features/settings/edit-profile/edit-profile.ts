import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { StudentService } from '../../student/student-service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css',
})
export class EditProfile implements OnInit {
  readonly studentService = inject(StudentService);

  profilePic = signal<string | null>(null);
  imageLoadFailed = signal(false);
  successMsg = signal('');
  errorMsg = signal('');

  profileForm = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    fullName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^[0-9+\-\s]{7,15}$/)] }),
  });

  get avatarUrl(): string {
    const pic = this.profilePic();
    return pic ? 'http://localhost:8080/uploads/profile-pictures/' + pic : '';
  }

  get initials(): string {
    const name = this.profileForm.get('username')?.value;
    return name ? name.charAt(0).toUpperCase() : '?';
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.studentService.getMyRecord().subscribe({
      next: (data) => {
        this.profilePic.set(data.profilePicture ?? null);
        this.profileForm.patchValue({ username: data.username,
          fullName: data.fullName ?? '',
          phone: data.phone ?? '', });
        this.imageLoadFailed.set(false);
      },
      error: (err) => console.error('Error loading profile:', err)
    });
  }

  onImageError(): void {
    this.imageLoadFailed.set(true);
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.studentService.uploadProfilePicture(file).subscribe({
      next: () => {
        this.loadProfile();
        this.studentService.notifyProfileUpdated();
      },
      error: (err) => console.error('Upload failed:', err)
    });
  }

  saveProfile(): void {
    this.successMsg.set('');
    this.errorMsg.set('');

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.studentService.updateProfile(this.profileForm.getRawValue()).subscribe({
      next: () => {
        this.successMsg.set('Profile updated successfully.');
        this.studentService.notifyProfileUpdated();
        localStorage.setItem('username', this.profileForm.getRawValue().username);
      },
      error: (err) => this.errorMsg.set(err.error || 'Failed to update profile.')
    });
  }
}