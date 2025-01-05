import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faBars,
  faChevronLeft,
  faChevronRight,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { TranslocoPipe } from '@jsverse/transloco';
import { MenuModule } from 'primeng/menu';
import {
  CardComponent,
  ELogo,
} from '../../../shared/components/card/card.component';
import { ChangePasswordModalComponent } from '../../../shared/components/change-password-modal/change-password-modal.component';
import { DeleteAccountModalComponent } from '../../../shared/components/delete-account-modal/delete-account-modal.component';
import { LogoComponent } from '../../../shared/components/logo/logo.component';
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
    MenuModule,
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
