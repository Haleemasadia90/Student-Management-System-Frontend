import { Component, Input } from '@angular/core';
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
  @Input() username:string | null = null;

  @Input() logoutFn!: ()=> void;

  logout():void{
    this.logoutFn();
  }
}
