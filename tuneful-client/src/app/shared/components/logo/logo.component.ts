import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ETheme, ThemeService } from '../../services/theme.service';
import { ELogo } from '../card/card.component';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
})
export class LogoComponent implements OnInit, OnDestroy {
  @Input() logoSize: ELogo = ELogo.FULL_LARGE;

  logoColor: 'white' | 'black' = 'white';
  private themeSubscription!: Subscription;

  constructor(
    private themeService: ThemeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.themeSubscription = this.themeService.currentTheme$.subscribe(
      (theme) => {
        this.logoColor = theme === ETheme.DARK ? 'white' : 'black';
        this.cdr.detectChanges();
      }
    );
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

  protected readonly ELogo = ELogo;
}
