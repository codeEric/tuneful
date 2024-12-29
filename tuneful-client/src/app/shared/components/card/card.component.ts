import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { LogoComponent } from '../logo/logo.component';

export enum ELogo {
  ICON = 'Logo',
  FULL_LARGE = 'Logo-lg',
  FULL_SMALL = 'Logo-sm',
}

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [RouterLink, FaIconComponent, LogoComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input() width: string | null = null;
  @Input() height: string | null = null;
  @Input() icon: ELogo | null = null;
  @Input() navigateBack: boolean = false;
  protected readonly faArrowLeft = faArrowLeft;
}
