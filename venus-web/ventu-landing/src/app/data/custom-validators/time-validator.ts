import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const timeValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const fechaInicio = control.get('fechaInicio');
  const fechaFin = control.get('fechaFin');
  const horaInicio = control.get('horaInicio');
  const horaFin = control.get('horaFin');

  if (
    fechaInicio!.value !== null &&
    fechaFin!.value !== null &&
    horaInicio!.value !== null &&
    horaFin!.value !== null
  ) {
    if (fechaInicio!.value === fechaFin!.value) {
      if (horaInicio!.value <= horaFin!.value) {
        return null;
      } else {
        return { horaInvalida: true };
      }
    } else {
      return null;
    }
  }
  return null;
};
