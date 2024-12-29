import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { Subject, takeUntil } from 'rxjs';
import { FloatLabelInputComponent } from '../../../shared/components/float-label-input/float-label-input.component';
import { UserService } from '../../../shared/services/user.service';
import { ModalService } from '../../services/modal-service.service';
import { StorageService } from './../../../shared/services/storage.service';

export interface IUser {
  name: string;
  email: string;
}

export type TFormName = 'name' | 'email';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    TranslocoPipe,
    ReactiveFormsModule,
    FloatLabelInputComponent,
    FormsModule,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit, OnDestroy {
  nameForm!: FormGroup;
  emailForm!: FormGroup;
  destroy$: Subject<void> = new Subject<void>();
  userData?: IUser;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private modalService: ModalService,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.userService
      .getAuthenticatedUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (!data) {
          return;
        }
        this.userData = data;
        this.initForm(this.userData);
      });
  }

  initForm(userData: IUser) {
    this.nameForm = this.fb.group({
      name: [
        { value: userData.name, disabled: true },
        Validators.compose([
          Validators.required,
          Validators.min(3),
          Validators.max(50),
          Validators.pattern('^[a-zA-Z]*$'),
        ]),
      ],
    });
    this.emailForm = this.fb.group({
      email: [
        { value: userData.email, disabled: true },
        Validators.compose([Validators.required, Validators.email]),
      ],
    });
  }

  editForm(formName: TFormName) {
    switch (formName) {
      case 'name':
        this.nameForm.controls[formName].enable();
        break;
      case 'email':
        this.emailForm.controls[formName].enable();
    }
  }

  saveForm(formName: TFormName) {
    switch (formName) {
      case 'name':
        if (this.nameForm.invalid) {
          return;
        }
        this.nameForm.controls[formName].disable();
        this.userService
          .updateName(this.nameForm.controls[formName].value)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data) => {
            if (!data) {
              return;
            }
            this.storageService.setToken(data.access_token);
            this.userService.updateData();
          });
        break;
      case 'email':
        if (this.emailForm.invalid) {
          return;
        }
        this.emailForm.controls[formName].disable();
        this.userService
          .updateEmail(this.nameForm.controls[formName].value)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data) => {
            if (!data) {
              return;
            }
            this.storageService.setToken(data.access_token);
          });
    }
  }

  cancelForm(formName: TFormName) {
    switch (formName) {
      case 'name':
        this.nameForm.controls[formName].disable();
        this.nameForm.controls[formName].patchValue(this.userData?.name);
        break;
      case 'email':
        this.emailForm.controls[formName].disable();
        this.emailForm.controls[formName].patchValue(this.userData?.email);
    }
  }

  onChangePasswordClick() {
    this.modalService.openPasswordModal();
  }

  onDeleteAccountClick() {
    this.modalService.openDeleteAccountModal();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete;
  }
}
