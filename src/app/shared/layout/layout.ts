import {Component, inject, Input, signal} from '@angular/core';

import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

import { CommonModule } from '@angular/common';

import { NavItem } from '../../models/nav-item.model';

import { AvatarModule } from 'primeng/avatar';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';

import { StudentService } from '../../features/student/student-service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, AvatarModule, DialogModule, TagModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {
  readonly studentService = inject(StudentService);

  @Input({ required: true })
  navItems: NavItem[] = [];

  @Input()
  panelTitle: string = '';

  @Input()
  username: string | null = null;

  @Input()
  profilePicture: string | null = null;

  @Input()
  role: string | null = null;

  @Input()
  logoutFn!: () => void;


  isSidebarOpen = signal(false);
  isCollapsed = signal(false);
  expandedItem = signal<string | null>(null);


  imageLoadFailed = signal(false);
  showProfilePicture = signal(false);


  get avatarUrl(): string {

    if (!this.profilePicture) {
      return '';
    }

    return this.studentService.getProfilePictureUrl(
    this.profilePicture
  );
}


  get initials(): string {

    if (!this.username) {
      return '?';
    }

    return this.username
      .charAt(0)
      .toUpperCase();
  }


  onImageError(): void {

    this.imageLoadFailed.set(true);
  }



  openProfilePicture(): void {

    this.showProfilePicture.set(true);
  }



  closeProfilePicture(): void {

    this.showProfilePicture.set(false);
  }



  onParentClick(item: NavItem): void {

    if (
      item.children &&
      item.children.length > 0
    ) {
      this.toggleExpand(item);
    } else {
      this.closeSidebar();
    }
  }


  toggleExpand(item: NavItem): void {

    this.expandedItem.update(current =>
      current === item.label
        ? null
        : item.label
    );
  }


  toggleSidebar(): void {

    this.isSidebarOpen.update(
      value => !value
    );
  }


  closeSidebar(): void {

    this.isSidebarOpen.set(false);
  }


  toggleCollapse(): void {

    this.isCollapsed.update(
      value => !value
    );

    if (this.isCollapsed()) {

      this.expandedItem.set(null);
    }
  }


  logout(): void {

    if (this.logoutFn) {
      this.logoutFn();
    }
  }
}