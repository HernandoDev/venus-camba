import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const dateValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const fechaInicio = control.get('fechaInicio');
  const fechaFin = control.get('fechaFin');
  return fechaInicio!.value !== null &&
    fechaFin!.value !== null &&
    fechaInicio!.value <= fechaFin!.value
    ? null
    : { fechaInvalida: true };
};
