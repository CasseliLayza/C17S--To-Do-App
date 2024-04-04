window.addEventListener("load", function () {
  /* ---------------------- obtenemos variables globales ---------------------- */
  const form = document.forms[0];
  const nombre = document.querySelector("#inputNombre");
  const apellido = document.querySelector("#inputApellido");
  const email = document.getElementById("inputEmail");
  const contrasena = document.getElementById("inputPassword");
  const repetircontrasena = document.getElementById("inputPasswordRepetida");
  const btn = document.querySelector("button");
  nombre.setAttribute("name", "nombre");
  apellido.setAttribute("name", "apellido");
  email.setAttribute("name", "email");
  contrasena.setAttribute("name", "contraseña");
  repetircontrasena.setAttribute("name", "contraseña");

  const url = "https://todo-api.ctd.academy/v1";

  const errors = {
    nombre: false,
    apellido: false,
    email: false,
    contraseña: false,
    repetircontraseña: false,
  };

  nombre.addEventListener("input", (e) => validarTexto(e));

  apellido.addEventListener("input", (e) => validarTexto(e, true));
  email.addEventListener("input", (e) => validarEmail(e));
  contrasena.addEventListener("input", (e) => validarContrasenia(e));

  form.addEventListener("change", function () {
    console.log(contrasena.value);

    repetircontrasena.addEventListener("input", (e) =>
      compararContrasenias(e, contrasena.value)
    );

    console.log(validations);

    if (
      !(
        validations.name &&
        validations.lastname &&
        validations.pass1 &&
        validations.pass2
      )
    ) {

      btn.setAttribute("disabled", true);
    } else {
      btn.removeAttribute("disabled");
    }
  });

  nombre.addEventListener("blur", (e) =>
    isEmpty(`⚠️ Se requiere que ingrese su '${nombre.name}'`, e)
  );
  apellido.addEventListener("blur", (e) =>
    isEmpty(`⚠️ Se requiere que ingrese su '${apellido.name}'`, e)
  );
  email.addEventListener("blur", (e) =>
    isEmpty(`⚠️ Se requiere que ingrese su '${email.name}'`, e)
  );
  contrasena.addEventListener("blur", (e) =>
    isEmpty(`⚠️ Se requiere que ingrese su '${contrasena.name}'`, e)
  );
  repetircontrasena.addEventListener("blur", (e) =>
    isEmpty(`⚠️ Se requiere que 'confirme su ${repetircontrasena.name}'`, e)
  );

 
  /* -------------------------------------------------------------------------- */
  /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
  /* -------------------------------------------------------------------------- */
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    //Cuerpo de la request (petición al servidor)
    const datos = {
      firstName: nombre.value,
      lastName: apellido.value,
      email: email.value,
      password: contrasena.value,
      // repetircontraseña: repetircontrasena.value
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

    // Disparar la consulta del sightup a la API opc1 opc2

    realizarRegister(settings);
    // fetchData(settings);

    // Limpiar el formulario
    form.reset();
  });

  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 2: Realizar el signup [POST]                    */
  /* -------------------------------------------------------------------------- */

  // opc 1
  async function fetchData(settings) {
    try {
      const response = await fetch(`${url}/users`, settings);
      console.log(response);

      if (!response.ok) {
        throw response;
      }

      // return response.json()
      response.json().then((data) => {
        console.log(data);
        // Guardar el dato jwt en el local storage (este token de autenticación)
        localStorage.setItem("jwt", JSON.stringify(data.jwt));

        setTimeout(() => {
          // Redirigir al dashboard
          location.replace("./index.html");
        }, 60000);

        console.log("Después de 60 segundos to index");
      });
    } catch (errorResponse) {
      console.log(`Status code ${errorResponse.status}`);
      const errorText = await errorResponse.text(); // Aquí obtienes el texto de la respuesta
      console.log(errorText); // Aquí puedes hacer lo que desees con el texto del error
      alert(errorText);
    }
  }

  // opcc 2
  function realizarRegister(settings) {
    console.log(settings);
    console.log("Lanzar la consulta a la API...");

    fetch(`${url}/users`, settings)
      .then((response) => {
        console.log(response);

        // Manejar el error de la request.
        return response.ok ? response.json() : Promise.reject(response);

      })
      .then((data) => {
        console.log("Promesa cumplida💍");
        console.log(data);

        if (data.jwt) {
          // Guardar el dato jwt en el local storage (este token de autenticación)
          localStorage.setItem("jwt", JSON.stringify(data.jwt));

          // Redirigir al dashboard
          location.replace("./index.html");
        }
      })
      .catch((err) => {
        console.warn("Promesa rechazada 🙅🏻‍♀️");
        console.log(err);

        if (err.status) {
          err.text().then((errText) => {
            console.log("Status Code " + err.status);
            console.log(errText);
            if (errText) {
              statusMessage(errText);
            }
          });
        } else {
          console.log("Time out network issue ");
        }
      });
  }

  function statusMessage(er) {
    Swal.fire({
      title: er,
      text: "Oops...Mensaje de error :(",
      icon: "warning",
      confirmButtonColor: "#3333ffff",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar",
      background: "black",
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        location.reload();
      }
    });
  }
});


