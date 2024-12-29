import {Component} from '@angular/core';
import {ButtonDirective} from "primeng/button";
import {CardComponent, ELogo} from "../../../../shared/components/card/card.component";
import {FloatLabelInputComponent} from "../../../../shared/components/float-label-input/float-label-input.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TranslocoDirective} from "@jsverse/transloco";
import {strongPasswordRegx} from "../../../../shared/utils/regex-patterns";
import {matchPasswords} from "../../../../shared/validators/match-password.validator";

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    ButtonDirective,
    CardComponent,
    FloatLabelInputComponent,
    ReactiveFormsModule,
    TranslocoDirective
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {

  resetPasswordForm!: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', Validators.compose([Validators.required, Validators.pattern(strongPasswordRegx)])],
      confPassword: ['', Validators.compose([Validators.required])]
    }, {
        validators: [matchPasswords()]
      });
  }

  submit(): void {
    console.log(this.resetPasswordForm.controls['email'].value);
  }

  protected readonly ELogo = ELogo;
}
