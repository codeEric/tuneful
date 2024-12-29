import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { ButtonDirective } from 'primeng/button';
import {
  CardComponent,
  ELogo,
} from '../../../../shared/components/card/card.component';
import { FloatLabelInputComponent } from '../../../../shared/components/float-label-input/float-label-input.component';
import { strongPasswordRegx } from '../../../../shared/utils/regex-patterns';
import { matchPasswords } from '../../../../shared/validators/match-password.validator';
import { UserService } from './../../../../shared/services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CardComponent,
    FloatLabelInputComponent,
    ReactiveFormsModule,
    TranslocoDirective,
    ButtonDirective,
    RouterLink,
    NgClass,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  addClass: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.compose([Validators.required])],
        email: [
          '',
          Validators.compose([Validators.required, Validators.email]),
        ],
        password: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(strongPasswordRegx),
          ]),
        ],
        confPassword: ['', Validators.compose([Validators.required])],
      },
      {
        validators: [matchPasswords()],
      }
    );
  }

  get registerFormControls() {
    return this.registerForm.controls;
  }

  submit(): void {
    if (!this.registerForm.valid) return;
    this.userService
      .register({
        name: this.registerFormControls['name'].value,
        email: this.registerFormControls['email'].value,
        password: this.registerFormControls['password'].value,
        confirmPassword: this.registerFormControls['confPassword'].value,
      })
      .subscribe((data) => {
        if (!data) return;

        this.router.navigate(['/login']);
      });
  }

  protected readonly ELogo = ELogo;
}
