window.addEventListener("load", function () {
  /* ---------------------- obtenemos variables globales ---------------------- */
  const form = document.forms[0];
  const email = document.querySelector("#inputEmail");
  const password = document.getElementById("inputPassword");
  // const password = document.querySelector("#inputPassword");
  email.setAttribute("name", "Email")
  password.setAttribute("name", "Contraseña")

  const url = "https://todo-api.ctd.academy/v1";

  const errors = {
    email: false,
    password: false,
  };

  email.addEventListener("input", (e) => validarEmail(e));
  password.addEventListener("input", (e) => validarContrasenia(e));

  email.addEventListener("blur", (e) =>
    isEmpty(`⚠️ Se requiere que ingrese su ${email.name}`, e)
  );
  password.addEventListener("blur", (e) =>
    isEmpty(`⚠️ Se requiere que ingrese su ${password.name}`, e)
  );
z
  /* -------------------------------------------------------------------------- */
  /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
  /* -------------------------------------------------------------------------- */
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    //Cuerpo de la request (petición al servidor)
    const datos = {
      email: email.value,
      password: password.value,
    };
    console.log(datos);

    //Configuración de la request del fetch
    const settings = {
      method: "POST",
      body: JSON.stringify(datos),
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Disparar la consulta del login a la API
    realizarLogin(settings);

    // Limpiar el formulario
    form.reset();
  });

  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 2: Realizar el login [POST]                    */
  /* -------------------------------------------------------------------------- */
  function realizarLogin(settings) {
    console.log(settings);
    console.log("Lanzar la consulta a la API...");

    fetch(`${url}/users/login`, settings)
      .then((response) => {
        console.log(response);

        // Manejar el error de la request.
        if (response.ok) return response.json();

        // En caso de que la propiedad ok de la respuesta en false
        return Promise.reject(response);
      })
      .then((data) => {
        console.log("Promesa cumplida💍");
        console.log(data);

        if (data.jwt) {
          // Guardar el dato jwt en el local storage (este token de autenticación)
          localStorage.setItem("jwt", JSON.stringify(data.jwt));

          // Redirigir al dashboard
          location.replace("./mis-tareas.html");
        }
      })
      .catch((err) => {
        console.warn("Promesa rechazada 🙅🏻‍♀️");
        console.log(err);
        if (err.status == 400) {
          console.warn("Contraseña incorrecta");
          alert("Contraseña incorrecta");
        } else if (err.status == 404) {
          console.warn("El usuario no existe");
          alert("El usuario no existe");
        } else {
          console.error("Error del servidor | url no existe");
          alert("Error del servidor | url no existe");
        }
      });
  }
});
