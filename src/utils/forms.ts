export const ERROR_MESSAGES = {
  required: "Este campo es requerido",
  minLength: (min: number) => `Debe tener al menos ${min} caracteres`,
  maxLength: (max: number) => `Debe tener máximo ${max} caracteres`,
  min: (min: number) => `Debe ser mayor o igual a ${min}`,
  max: (max: number) => `Debe menor o igual a ${max}`,
};
