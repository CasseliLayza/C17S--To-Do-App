// Método para verificar si el campo está vacio y si hay errores
const setErrors = (message, field, isError = true) => {
  if (isError) {
    field.classList.add("invalid");
    field.nextElementSibling.classList.add("error");
    field.nextElementSibling.textContent = message;
  } else {
    field.classList.remove("invalid");
    field.nextElementSibling.classList.remove("error");
    field.nextElementSibling.textContent = message;
  }
};

// Método para verificar si el input esta vacío
const isEmpty = (message, e) => {
  console.log(e.target);
  const field = e.target;
  const fieldValue = normalizarEmail(field.value);

  if (fieldValue.length == 0) {
    setErrors(message, field);
  }
};

/* ---------------------------------- texto --------------------------------- */
function validarTexto(e,flag =  false) {
  const soloLetras = /^[a-zA-Z ]+$/;
  const field = e.target;
  const fieldValue = normalizarTexto(field.value);

  if (!soloLetras.test(fieldValue) || fieldValue.length < 4) {
    setErrors(
      `🚨Por favor ingrese ${field.name} válido, que sea mayor a 3 caracteres y solo letrads`,
      field
    );
  } else {
    setErrors("", field, false);
    validations.name =true
    if(flag){
      validations.lastname =true
    }
  }
}

function normalizarTexto(texto) {
  return texto.trim();
}

/* ---------------------------------- email --------------------------------- */

function validarEmail(e) {
  const field = e.target;
  const fieldValue = normalizarEmail(field.value);
  const regex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);

  if (fieldValue.length > 4 && !regex.test(fieldValue)) {
    setErrors(`🚨 Por favor ingrese un ${field.name} válido`, field);
  } else {
    setErrors("", field, false);
    validations.mail =true

  }
}

function normalizarEmail(email) {
  return email.trim().toLowerCase();
}

/* -------------------------------- password -------------------------------- */
// function validarContrasenia(contrasenia) {
function validarContrasenia(e) {
  const field = e.target;
  const fieldValue = normalizarTexto(field.value);

  if (fieldValue.length < 6) {
    setErrors(
      `🚨Por favor ingrese ${field.name} válido, que sea mayor a 6 caracteres`,
      field
    );
  } else {
    setErrors("", field, false);
    validations.pass1 =true

  }
}

function compararContrasenias(contrasenia_1, contrasenia_2) {
  console.log(contrasenia_1.target);
  console.log(contrasenia_2);

  const field = contrasenia_1.target;
  const field2 = contrasenia_2;
  const fieldValue = normalizarTexto(field.value);
  const fieldValue2 = normalizarTexto(field2);

  if (!(fieldValue == fieldValue2)) {
    setErrors(
      `🚨Por favor, intente nuevamente la ${field.name} no coincide`,
      field
    );
  } else {
    setErrors("Crear Cuenta", field, false);
    validations.pass2 =true

  }
}

const validations = {
  name: "",
  lastname: "",
  mail:"",
  pass1: "",
  pass2: "",
};