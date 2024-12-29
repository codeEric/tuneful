import { Component, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { ETheme, ThemeService } from './shared/services/theme.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [],
})
export class AppComponent {
  title = 'tuneful-client';

  result: any;
  status: string = 'Initializing';

  constructor(
    private primengConfig: PrimeNGConfig,
    private renderer: Renderer2,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.themeService.loadTheme();
    this.primengConfig.ripple = true;
    this.themeService.currentTheme$.subscribe((theme) => {
      this.renderer.removeClass(
        document.body,
        theme === ETheme.DARK ? ETheme.LIGHT : ETheme.DARK
      );
      this.renderer.addClass(document.body, theme);
    });
  }
}
