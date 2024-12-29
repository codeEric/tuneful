import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { ChangePasswordModalComponent } from '../../../shared/components/change-password-modal/change-password-modal.component';
import { DeleteAccountModalComponent } from '../../../shared/components/delete-account-modal/delete-account-modal.component';
import { MediaPlayerComponent } from '../../../shared/components/media-player/media-player.component';
import { NewMelodyModalComponent } from '../../../shared/components/new-melody-modal/new-melody-modal.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    SidebarComponent,
    RouterOutlet,
    FaIconComponent,
    NgClass,
    MediaPlayerComponent,
    NewMelodyModalComponent,
    DeleteAccountModalComponent,
    ChangePasswordModalComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  expanded: boolean = true;

  constructor(public router: Router) {}

  toggleExpand() {
    this.expanded = !this.expanded;
  }

  protected readonly faChevronLeft = faChevronLeft;
  protected readonly faChevronRight = faChevronRight;
}
