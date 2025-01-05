import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { DialogModule } from 'primeng/dialog';
import { ModalService } from '../../../core/services/modal-service.service';
import { UserService } from '../../services/user.service';
import { strongPasswordRegx } from '../../utils/regex-patterns';
import { matchPasswords } from '../../validators/match-password.validator';
import { FloatLabelInputComponent } from '../float-label-input/float-label-input.component';

@Component({
  selector: 'app-change-password-modal',
  standalone: true,
  imports: [
    DialogModule,
    ReactiveFormsModule,
    TranslocoPipe,
    FloatLabelInputComponent,
  ],
  templateUrl: './change-password-modal.component.html',
  styleUrl: './change-password-modal.component.scss',
})
export class ChangePasswordModalComponent implements OnInit {
  passwordForm!: FormGroup;

  isVisible: boolean = false;
  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    private userService: UserService
  ) {
    this.modalService.showPasswordModal$.subscribe((state: boolean) => {
      this.isVisible = state;
    });
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.passwordForm = this.fb.group(
      {
        currPassword: ['', Validators.compose([Validators.required])],
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
        validators: [matchPasswords('newPassword')],
      }
    );
  }

  submit() {
    if (!this.passwordForm.valid) return;
    this.userService
      .updatePassword(this.passwordForm.controls['newPassword'].value)
      .subscribe();
  }

  closeModal() {
    this.modalService.closePasswordModal();
  }
}
