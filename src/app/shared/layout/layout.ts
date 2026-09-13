import { Component, Input, signal } from '@angular/core';
import { NavItem } from '../../models/nav-item.model';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  @Input({required:true}) navItems: NavItem[] = [];
  @Input() panelTitle: string = '';
  @Input() username: string | null = null;
  @Input() profilePicture: string | null = null;
  @Input() logoutFn!: ()=> void;

  isSidebarOpen = signal(false);
  isCollapsed = signal(false);
  imageLoadFailed = signal(false);
  expandedItem = signal<string | null>(null);

  get avatarUrl(): string {
    return 'http://localhost:8080/uploads/profile-pictures/' + this.profilePicture;
  }

  get initials(): string {
    return this.username ? this.username.charAt(0).toUpperCase() : '?';
  }

  onImageError(): void {
    this.imageLoadFailed.set(true);
  }

  toggleExpand(item: NavItem): void {
    this.expandedItem.set(this.expandedItem() === item.label ? null : item.label);
  }

  onParentClick(item: NavItem): void {
    if (item.children) {
      this.toggleExpand(item);
    } else {
      this.closeSidebar();
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen.update(v => !v);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }

  toggleCollapse(): void {
    this.isCollapsed.update(v => !v);
  }

  logout():void{
    this.logoutFn();
  }
}