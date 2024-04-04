// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.

/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener("load", function () {
  /* ----------------Variables globales y llamado a funciones ---------------- */
  // Recuperar el JWT de localStorage
  const jwtFromLocalStorage =
    localStorage.getItem("jwt") != null
      ? localStorage.getItem("jwt")
      : location.replace("./index.html");

  console.log(jwtFromLocalStorage);
  const jwtData = JSON.parse(jwtFromLocalStorage);
  console.log(jwtData); // Aquí el JWT recuperado del localStorage

  const url = "https://todo-api.ctd.academy/v1";
  obtenerNombreUsuario();
  consultarTareas();
  // renderizarTareas()}

  const btnCerrarSesion = document.querySelector("#closeApp");
  const formCrearTarea = document.forms[0];
  const nuevaTarea = document.getElementById("nuevaTarea");

  /* -------------------------------------------------------------------------- */
  /*                          FUNCIÓN 1 - Cerrar sesión                         */
  /* -------------------------------------------------------------------------- */

  btnCerrarSesion.addEventListener("click", function () {
    comfirLogOut();

    async function comfirLogOut() {
      try {
        const result = await Swal.fire({
          title: "¿Estás seguro que deseas cerrar sesión?",
          text: "¡Te desconectarás!",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3333ffff",
          cancelButtonColor: "#d33",
          confirmButtonText: "Sí, confirmo!",
          background: "black",
        });

        if (result.isConfirmed) {
          clearAndClouse();
          await Swal.fire({
            title: "!Hasta luego!",
            text: "Te esperamos pronto.",
            icon: "success",
            background: "black",
          });
        }
      } catch (error) {
        console.error(error);
      }
    }

    function clearAndClouse() {
      // Borrar el JWT del localStorage
      localStorage.removeItem("jwt");

      // Verificar si el JWT ha sido borrado
      const jwtFromLocalStorage = localStorage.getItem("jwt");

      if (jwtFromLocalStorage === null) {
        console.log("El JWT ha sido borrado del localStorage.");
      } else {
        console.log("El JWT aún está presente en el localStorage.");
        borrarAllLocatStorague();
      }

      setTimeout(() => {
        // Redirigir al login
        location.replace("./index.html");
      }, 2000);

      console.log("Después de 2 segundos goTo inicio");

      // // Borrar todos los elementos del localStorage
      function borrarAllLocatStorague() {
        localStorage.clear();

        // Verificar si el localStorage está vacío
        if (localStorage.length === 0) {
          console.log("El localStorage está vacío.");
        } else {
          console.log("El localStorage aún contiene elementos.");
        }
      }
    }
  });

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 2 - Obtener nombre de usuario [GET]                */
  /* -------------------------------------------------------------------------- */

  function obtenerNombreUsuario() {
    const settings = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: jwtData,
        // authorization: jwtFromLocalStorage,
      },
    };
    console.log(settings);
    console.log("Lanzar la consulta a la API...");

    fetch(`${url}/users/getMe`, settings)
      .then((response) => {
        console.log(response);

        // Manejar el error de la request.
        return response.ok
          ? response.json()
          : // En caso de que la propiedad ok de la respuesta en false
            Promise.reject(response);
      })
      .then((data) => {
        console.log("Promesa cumplida💍");
        console.log("Response:", data);

        if (data.id) {
          console.log(`User: ${data.firstName} ${data.lastName}`);
          const userName = document.querySelector(".user-info p");
          userName.textContent = `${data.firstName} ${data.lastName}`;
        }
      })
      .catch((err) => {
        if (err.status) {
          err.text().then((mjs) => {
            console.log("Status Code " + err.status);
            console.log(mjs);
          });
        } else {
          console.log("Time out network issue ");
        }
      });
  }
  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
  /* -------------------------------------------------------------------------- */

  function consultarTareas() {
    const settings = {
      method: "GET",
      headers: {
        // "Content-Type": "application/json",
        authorization: jwtData,
        // authorization: jwtFromLocalStorage,
      },
    };
    console.log(settings);
    console.log("Lanzar la consulta a la API...");

    fetch(`${url}/tasks`, settings)
      .then((response) => {
        console.log(response);

        // Manejar el error de la request.
        return response.ok
          ? response.json()
          : // En caso de que la propiedad ok de la respuesta en false
            Promise.reject(response);
      })
      .then((data) => {
        console.log("Promesa cumplida💍");
        console.log("Response:", data);

        renderizarTareas(data);
      })
      .catch((err) => {
        if (err.status) {
          err.text().then((mjs) => {
            console.log("Status Code " + err.status);
            console.log(mjs);
          });
        } else {
          console.log("Time out network issue ");
        }
      });
  }
  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
  /* -------------------------------------------------------------------------- */

  formCrearTarea.addEventListener("submit", function (event) {
    event.preventDefault();

    //Cuerpo de la request (petición al servidor)
    const datos = {
      description: nuevaTarea.value,
      completed: false,
    };
    console.log(datos);

    //Configuración de la request del fetch
    const settings = {
      method: "POST",
      body: JSON.stringify(datos),
      headers: {
        "Content-Type": "application/json",
        authorization: jwtData,
      },
    };

    // Disparar la consulta del login a la API
    creaTarea(settings);
    function creaTarea(settings) {
      console.log(settings);
      console.log("Lanzar la consulta a la API...");

      fetch(`${url}/tasks`, settings)
        .then((response) => {
          console.log(response);

          // Manejar el error de la request.
          return response.ok
            ? response.json()
            : // En caso de que la propiedad ok de la respuesta en false
              Promise.reject(response);
        })
        .then((data) => {
          console.log("Promesa cumplida💍");
          console.log("Response:", data);

          if (data.id) {
            console.log(`User: ${data.description} ${data.createdAt}`);

            //
            consultarTareas();
            //
          }
        })
        .catch((err) => {
          if (err.status) {
            err.text().then((mjs) => {
              console.log("Status Code " + err.status);
              console.log(mjs);
            });
          } else {
            console.log("Time out network issue ");
          }
        });
    }
    // Limpiar el formulario
    formCrearTarea.reset();
  });

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
  /* -------------------------------------------------------------------------- */
  function renderizarTareas(listado) {
    console.log(listado);
    const contenedor = document.querySelector(".tareas-pendientes");
    const contenedorFin = document.querySelector(".tareas-terminadas");

    contenedor.innerHTML = "";
    contenedorFin.innerHTML = "";
    listado.forEach((task) => {
    let fechaActual = new Date(task.createdAt);
    let nuevaFecha = new Date(
        fechaActual.getFullYear(),
        fechaActual.getMonth(),
        fechaActual.getDate()
      );

    let dia = nuevaFecha.getDate();
    let mes = nuevaFecha.getMonth() + 1;
    let año = nuevaFecha.getFullYear();

      dia = (dia < 10 ? "0" : "") + dia;
      mes = (mes < 10 ? "0" : "") + mes;

    let fechaFormateada = dia + "/" + mes + "/" + año;
      console.log(fechaFormateada);

      if (!task.completed) {
        contenedor.innerHTML += `<li class="tarea">
        <button id="${task.id}"><i class="fa-regular fa-circle"></i></button>
        <span class="descripcion">
          <span class="nombre">${task.description}</span>
          <span class="timestamp">${fechaFormateada}</span>
        </span>
      </li>`;
      } else {
        contenedorFin.innerHTML += `<li class="tarea">
        <span class ="hecha"><i class="fa-regular fa-circle-check"></i></span>
        <span class="descripcion cambios-estados">
          <span class="nombre">${task.description}</span>
          <button class="incompleta"><i class="fa-solid fa-rotate-right"></i></button>
          <button id="${task.id}" class="borrar"><i class="fa-solid fa-trash-can"></i></button>
        </span>
      </li>`;
      }
    });

    console.log(contenedor);
    console.log(contenedorFin);

    const taskFinalizadas = document.querySelector("#cantidad-finalizadas");
    taskFinalizadas.textContent =
      contenedorFin.querySelectorAll(".borrar").length;

    contenedor.style.transform = "translateX(-400px)";

    // Iniciar la animación
  let incremento = 8; // Incremento para la animación
  let finalPosition = 0; // Posición final
  let animationId;

    function animate() {
    let currentTranslateX = parseInt(
        contenedor.style.transform.replace("translateX(", "").replace("px)", "")
      );
    let nextTranslateX = currentTranslateX + incremento;

      if (nextTranslateX < finalPosition) {
        contenedor.style.transform = "translateX(" + nextTranslateX + "px)";
        animationId = requestAnimationFrame(animate);
      } else {
        contenedor.style.transform = "translateX(" + finalPosition + "px)";
        contenedor.style.pointerEvents = "auto"; // Habilitar eventos de clic después de la animación
      }
    }

    // Iniciar la animación
    animationId = requestAnimationFrame(animate);

    // Definir la rotación inicial y final
  let initialRotation = 0; // Rotación inicial
  let finalRotation = 360; // Rotación final

    // Iniciar la animación
  let rotationIncrement = 1.5; // Incremento para la rotación
  let currentRotation = initialRotation; // Inicializar la rotación actual
    //let animationId;

    function rotate() {
      currentRotation += rotationIncrement; // Incrementar la rotación actual
      contenedorFin.style.transform = "rotateX(" + currentRotation + "deg)"; // Aplicar la rotación en el eje X al contenedor

      if (currentRotation < finalRotation) {
        animationId = requestAnimationFrame(rotate); // Solicitar el siguiente cuadro de animación
      } else {
        contenedorFin.style.pointerEvents = "auto"; // Habilitar eventos de clic después de la animación
      }
    }

    // Iniciar la animación
    animationId = requestAnimationFrame(rotate);
  }

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
  /* -------------------------------------------------------------------------- */
  const botonPendient = document.querySelector(".tareas-pendientes");
  botonPendient.addEventListener("mouseenter", botonesCambioEstado);

  function botonesCambioEstado() {
    console.log(botonPendient);
    const contenedorIndivi = botonPendient.querySelectorAll("button");
    console.log(contenedorIndivi);

    contenedorIndivi.forEach((element) => {
      let btnId = element.getAttribute("id");
      console.log(btnId);
      let FinBtn = document.getElementById(`${btnId}`);
      FinBtn.addEventListener("click", function () {
        console.log("Cambiando de estado a complete ", btnId);
        cambioEstadoApi(btnId);
      });
    });
  }

  function cambioEstadoApi(id) {
    //Cuerpo de la request (petición al servidor)
    const datos = {
      completed: true,
    };
    console.log(datos);

    //Configuración de la request del fetch
    const settings = {
      method: "PUT",
      body: JSON.stringify(datos),
      headers: {
        "Content-Type": "application/json",
        authorization: jwtData,
      },
    };

    // Disparar la consulta del login a la API

    console.log(settings);
    console.log("Lanzar la consulta a la API...");

    fetch(`${url}/tasks/${id}`, settings)
      .then((response) => {
        console.log(response);

        // Manejar el error de la request.
        return response.ok
          ? response.json()
          : // En caso de que la propiedad ok de la respuesta en false
            Promise.reject(response);
      })
      .then((data) => {
        console.log("Promesa cumplida💍");
        console.log("Response:", data);

        if (data.id) {
          console.log(`User: ${data.description} ${data.createdAt}`);

          //
          consultarTareas();
          //
        }
      })
      .catch((err) => {
        if (err.status) {
          err.text().then((mjs) => {
            console.log("Status Code " + err.status);
            console.log(mjs);
          });
        } else {
          console.log("Time out network issue ");
        }
      });
  }

  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
  /* -------------------------------------------------------------------------- */
  const botonPendient2 = document.querySelector(".tareas-terminadas");
  botonPendient2.addEventListener("mouseenter", handleMouseOver);

  function handleMouseOver(event) {
    botonesCambioEstado2();
  }

  function botonesCambioEstado2() {
    console.log(botonPendient2);
    const contenedorIndivi = botonPendient2.querySelectorAll(".borrar");
    console.log(contenedorIndivi);

    contenedorIndivi.forEach((element) => {
      let btnId = element.getAttribute("id");
      console.log(btnId);
      let FinBtn = document.getElementById(`${btnId}`);
      FinBtn.addEventListener("click", function () {
        console.log("eliminando", btnId);
        confirmar(btnId);
      });
    });
  }

  function borrarTareaAPI(id) {
    //Configuración de la request del fetch
    const settings = {
      method: "DELETE",

      headers: {
        authorization: jwtData,
      },
    };

    // Disparar la consulta del login a la API

    console.log(settings);
    console.log("Lanzar la consulta delete a la API...", id);

    fetch(`${url}/tasks/${id}`, settings)
      .then((response) => {
        console.log(response);

        // Manejar el error de la request.
        return response.ok
          ? response.json()
          : // En caso de que la propiedad ok de la respuesta en false
            Promise.reject(response);
      })
      .then((data) => {
        console.log("Promesa cumplida💍 delete a la API...", id);
        console.log("Response:", data);
        if (data) {
          consultarTareas();
          //
        }
      })
      .catch((err) => {
        if (err.status) {
          err.text().then((mjs) => {
            console.log("Status Code " + err.status);
            console.log(mjs);
          });
        } else {
          console.log("Time out network issue ");
        }
      });
  }

  function confirmar(id) {
    Swal.fire({
      title: "¿Confirma eliminar la tarea?",
      text: "No seras capaz de revertir este cambio!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3333ffff",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar!",
      background: "black",
    }).then((result) => {
      if (result.isConfirmed) {
        borrarTareaAPI(id);
        Swal.fire({
          title: "Tarea eliminada!",
          text: "Su tarea ha sido eliminada.",
          icon: "success",
          background: "black",
        });
      }
    });
  }
});
