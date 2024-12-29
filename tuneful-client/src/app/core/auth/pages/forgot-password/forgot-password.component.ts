import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import {
  CardComponent,
  ELogo,
} from '../../../../shared/components/card/card.component';
import { FloatLabelInputComponent } from '../../../../shared/components/float-label-input/float-label-input.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    ButtonDirective,
    CardComponent,
    FloatLabelInputComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
    });
  }

  submit(): void {
    console.log(this.forgotPasswordForm.controls['email'].value);
  }

  protected readonly ELogo = ELogo;
}
