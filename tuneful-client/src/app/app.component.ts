import { Component, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ETheme, ThemeService } from './shared/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService],
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
