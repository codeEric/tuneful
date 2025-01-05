import { Component, forwardRef, Input } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroupDirective,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

type formType = 'text' | 'password' | 'email';

export const INPUT_CONROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FloatLabelInputComponent),
  multi: true,
};

@Component({
  selector: 'app-float-label-input',
  standalone: true,
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,
    FormsModule,
    FloatLabelModule,
    InputTextModule,
    PasswordModule,
  ],
  providers: [INPUT_CONROL_VALUE_ACCESSOR],
  templateUrl: './float-label-input.component.html',
  styleUrl: './float-label-input.component.scss',
})
export class FloatLabelInputComponent implements ControlValueAccessor {
  @Input() idFor!: string;
  @Input() label!: string;
  @Input() type!: formType;
  @Input() formControlName!: string;
  @Input() withFeedback: boolean = false;

  value: string = '';
  onChange!: (value?: string) => void;
  onTouch!: (ev: any) => void;

  constructor(private formGroupDirective: FormGroupDirective) {}

  get control(): FormControl {
    return this.formGroupDirective.form.controls[
      this.formControlName
    ] as FormControl;
  }

  get isInvalid(): boolean {
    const control = this.control;
    return control.invalid && control.touched && !control['pristine'];
  }

  get isDisabled(): boolean {
    return this.control.disabled;
  }

  writeValue(value: any) {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  onInput(value: string) {
    this.value = value;
    if (this.onChange) {
      this.onChange(value);
    }
  }

  onTouched(value: any) {
    if (this.onTouch) {
      this.onTouch(value);
    }
  }
}
