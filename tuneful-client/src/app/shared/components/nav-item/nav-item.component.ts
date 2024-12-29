import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  FaIconComponent,
  IconDefinition,
} from '@fortawesome/angular-fontawesome';
import { ERouterPaths } from '../../../core/layout/sidebar/sidebar.component';

@Component({
  selector: 'app-nav-item',
  standalone: true,
  imports: [FaIconComponent, NgClass, RouterLink],
  templateUrl: './nav-item.component.html',
  styleUrl: './nav-item.component.scss',
})
export class NavItemComponent {
  @Input() expanded: boolean = true;
  @Input() title: string | null = null;
  @Input() icon: IconDefinition | null = null;
  @Input() selected: boolean = false;
  @Input() link: ERouterPaths = ERouterPaths.HOME;
  @Input() elementType: 'button' | 'link' = 'link';
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  handleClick() {
    this.clicked.emit();
  }
}
