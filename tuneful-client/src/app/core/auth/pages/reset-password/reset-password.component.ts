import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { MessageService } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { catchError, Subject, takeUntil } from 'rxjs';
import {
  CardComponent,
  ELogo,
} from '../../../../shared/components/card/card.component';
import { FloatLabelInputComponent } from '../../../../shared/components/float-label-input/float-label-input.component';
import { UserService } from '../../../../shared/services/user.service';
import { strongPasswordRegx } from '../../../../shared/utils/regex-patterns';
import { matchPasswords } from '../../../../shared/validators/match-password.validator';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    ButtonDirective,
    CardComponent,
    FloatLabelInputComponent,
    ReactiveFormsModule,
    TranslocoDirective,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  resetPasswordForm!: FormGroup;
  resetToken!: string;
  destroy$: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translocoService: TranslocoService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.resetToken = params['token'];
        if (!this.resetToken) {
          this.redirectToLogin();
          return;
        }
        this.verifyToken();
      });
  }
  verifyToken(): void {
    this.authService
      .verifyPasswordToken(this.resetToken!)
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => {
          this.redirectToLogin();
          return [];
        })
      )
      .subscribe((response) => {
        if (response) {
          this.initForm();
        } else {
          this.redirectToLogin();
        }
      });
  }
  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }

  initForm(): void {
    this.resetPasswordForm = this.fb.group(
      {
        newPassword: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(strongPasswordRegx),
          ]),
        ],
        confPassword: ['', Validators.compose([Validators.required])],
      },
      {
        validators: [matchPasswords('confPassword')],
      }
    );
  }

  submit(): void {
    console.log('Submit');
    this.userService
      .changePassword(
        this.resetPasswordForm.controls['newPassword'].value,
        this.resetToken
      )
      .subscribe((response) => {
        if (response) {
          this.messageService.add({
            severity: 'success',
            summary: this.translocoService.translate(
              'password-changed-successfully'
            ),
          });
          this.router.navigate(['/login']);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected readonly ELogo = ELogo;
}
