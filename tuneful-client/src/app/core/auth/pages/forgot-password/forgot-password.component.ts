import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { MessageService } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import {
  CardComponent,
  ELogo,
} from '../../../../shared/components/card/card.component';
import { FloatLabelInputComponent } from '../../../../shared/components/float-label-input/float-label-input.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    ButtonDirective,
    CardComponent,
    FloatLabelInputComponent,
    FormsModule,
    ReactiveFormsModule,
    TranslocoModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  showMessage: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
    });
  }

  submit(): void {
    this.authService
      .sendResetPasswordEmail(this.forgotPasswordForm.controls['email'].value)
      .subscribe((response) => {
        if (response) {
          this.messageService.add({
            severity: 'success',
            summary: this.translocoService.translate(
              'password_reset_link_send',
              { email: this.forgotPasswordForm.controls['email'].value }
            ),
          });
          return;
        }
      });
  }

  protected readonly ELogo = ELogo;
}
