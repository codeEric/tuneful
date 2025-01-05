import { NgClass } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faBars,
  faCircleInfo,
  faGear,
  faHome,
  faMoon,
  faPen,
  faPlusSquare,
  faRightFromBracket,
  faSun,
  faXmark,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import {
  SelectButtonChangeEvent,
  SelectButtonModule,
} from 'primeng/selectbutton';
import { Subject, switchMap, takeUntil } from 'rxjs';
import {
  CardComponent,
  ELogo,
} from '../../../shared/components/card/card.component';
import { LogoComponent } from '../../../shared/components/logo/logo.component';
import { NavItemComponent } from '../../../shared/components/nav-item/nav-item.component';
import { ETheme, ThemeService } from '../../../shared/services/theme.service';
import { UserService } from '../../../shared/services/user.service';
import { AuthService } from '../../auth/services/auth.service';
import { ModalService } from '../../services/modal-service.service';

export interface ILanguage {
  code: string;
  name: string;
}

export enum ERouterPaths {
  HOME = '/home',
  EDIT = '/edit',
  SETTINGS = '/settings',
  HELP = '/help',
}

export interface ISelectButton {
  label?: string;
  value: string;
  icon?: IconDefinition;
  disabled?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    NgClass,
    FaIconComponent,
    NavItemComponent,
    TranslocoPipe,
    LogoComponent,
    SelectButtonModule,
    FormsModule,
    DropdownModule,
    CardComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  @Input() expanded: boolean = true;
  selectedLanguage!: ILanguage;
  languages: ILanguage[] = [
    {
      code: 'en',
      name: 'english',
    },
    {
      code: 'lt',
      name: 'lithuanian',
    },
  ];
  userName: string = 'Unknown';
  themes: ISelectButton[] = [
    { icon: faMoon, value: ETheme.DARK },
    { icon: faSun, value: ETheme.LIGHT },
  ];
  theme: ETheme = ETheme.DARK;

  showMobileMenu: boolean = false;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private modalService: ModalService,
    private authService: AuthService,
    private userService: UserService,
    private ts: TranslocoService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.userService.getUserName().subscribe((data) => {
      if (!data) {
        return;
      }
      this.userName = data;
    });

    this.userService.updateData$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.userService.getUserName())
      )
      .subscribe((data) => {
        if (!data) {
          return;
        }
        this.userName = data;
      });

    this.themeService.currentTheme$.subscribe((theme) => {
      this.theme = theme;
      this.themes.find((value) => value.value === this.theme)!.disabled = true;
    });

    const lang = this.ts.getActiveLang();
    this.selectedLanguage = { code: lang, name: '' };
    switch (lang) {
      case 'en':
        this.selectedLanguage.name = 'english';
        break;
      case 'lt':
        this.selectedLanguage.name = 'lithuanian';
        break;
    }
  }

  isRoute(routeName: ERouterPaths): boolean {
    return this.router.url === routeName;
  }

  openModal() {
    this.modalService.openNewMelodyModal();
  }

  onSelectButtonChange(ev: SelectButtonChangeEvent) {
    this.themes.forEach((theme) => {
      if (theme.value === ev.value) {
        theme.disabled = true;
      } else {
        theme.disabled = false;
      }
    });
    this.themeService.updateTheme(this.theme);
  }

  onLanguageChange(ev: DropdownChangeEvent) {
    if (!ev?.value) {
      return;
    }
    this.ts.setActiveLang(ev.value.code);
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  protected readonly ELogo = ELogo;
  protected readonly faHome = faHome;
  protected readonly faPen = faPen;
  protected readonly faGear = faGear;
  protected readonly faCircleInfo = faCircleInfo;
  protected readonly ERouterPaths = ERouterPaths;
  protected readonly faPlusSquare = faPlusSquare;
  protected readonly faRightFromBracket = faRightFromBracket;
  protected readonly faBars = faBars;
  protected readonly faXmark = faXmark;
}
