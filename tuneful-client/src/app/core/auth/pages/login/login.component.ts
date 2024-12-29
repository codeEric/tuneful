import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { ButtonDirective } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import {
  CardComponent,
  ELogo,
} from '../../../../shared/components/card/card.component';
import { FloatLabelInputComponent } from '../../../../shared/components/float-label-input/float-label-input.component';
import { StorageService } from '../../../../shared/services/storage.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CardComponent,
    TranslocoDirective,
    FloatLabelInputComponent,
    ReactiveFormsModule,
    ButtonDirective,
    RouterLink,
    MessagesModule,
    TranslocoPipe,
    NgClass,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  error: boolean = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required])],
    });
  }

  submit(): void {
    this.authService
      .login(
        this.loginForm.controls['email'].value,
        this.loginForm.controls['password'].value
      )
      .subscribe((data) => {
        if (data) {
          this.storageService.setToken(data.access_token);
          this.router.navigate(['/home']);
        } else {
          this.error = true;
        }
      });
  }

  protected readonly ELogo = ELogo;
}
