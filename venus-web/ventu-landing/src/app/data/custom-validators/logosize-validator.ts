import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const logoValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const logo = control.get('logo');
  if (logo!.value !== '') {
    const isSizeValid = logo!.value <= 5000000;
    return isSizeValid ? null : { sizeInvalido: true };
  }

  return null;
};
