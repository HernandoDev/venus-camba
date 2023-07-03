import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const imageValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const imagen = control.get('imagen');
  if (imagen!.value !== '') {
    const isSizeValid = imagen!.value <= 5000000;
    return isSizeValid ? null : { sizeInvalido: true };
  }

  return null;
};
