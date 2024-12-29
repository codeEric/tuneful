import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function matchPasswords(firstControlName?: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (
      control &&
      control.get(firstControlName ?? 'password') &&
      control.get('confPassword')
    ) {
      const password = control.get(firstControlName ?? 'password')?.value;
      const confPassword = control.get('confPassword')?.value;
      if (password && confPassword) {
        return password !== confPassword ? { passwordsMustMatch: true } : null;
      }
      return null;
    }
    return null;
  };
}
