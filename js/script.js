document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("quote-form");
  const esEstudianteCheckbox = document.getElementById("es_estudiante");
  const institucionWrapper = document.getElementById("institucion-wrapper");
  const institucionInput = document.getElementById("institucion");
  const msg = document.getElementById("form-msg");
  const submitBtn = form.querySelector("button[type=submit]");
  const submitBtnDefaultText = submitBtn.textContent;

  esEstudianteCheckbox.addEventListener("change", function () {
    const isStudent = esEstudianteCheckbox.checked;
    institucionWrapper.hidden = !isStudent;
    institucionInput.required = isStudent;
    if (!isStudent) institucionInput.value = "";
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    msg.textContent = "";
    msg.classList.remove("error");

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const fechaInicio = document.getElementById("fecha_inicio").value;
    const fechaRegreso = document.getElementById("fecha_regreso").value;
    if (fechaRegreso < fechaInicio) {
      msg.textContent = "La fecha de regreso no puede ser anterior a la fecha de inicio del viaje.";
      msg.classList.add("error");
      return;
    }

    const data = {
      "_subject": "Nueva cotización - Terrawind Asistencias",
      "Nombre completo": document.getElementById("nombre").value.trim(),
      "Edad": document.getElementById("edad").value,
      "Tipo de asistencia": document.getElementById("tipo_asistencia").value,
      "País de origen": document.getElementById("pais_origen").value.trim(),
      "País de destino": document.getElementById("pais_destino").value.trim(),
      "Fecha de inicio del viaje": fechaInicio,
      "Fecha de regreso": fechaRegreso,
      "Correo electrónico": document.getElementById("email").value.trim(),
      "Teléfono / WhatsApp": document.getElementById("telefono").value.trim(),
      "¿Es estudiante?": esEstudianteCheckbox.checked ? "Sí" : "No",
      "Institución de educación superior": esEstudianteCheckbox.checked
        ? institucionInput.value.trim()
        : "",
      "Fecha de solicitud": new Date().toLocaleString("es-CO")
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando...";

    fetch(form.action, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(function (response) {
        if (response.ok) {
          msg.textContent = "¡Listo! Hemos recibido tu solicitud. Te contactaremos pronto vía WhatsApp o correo electrónico.";
          form.reset();
          institucionWrapper.hidden = true;
          institucionInput.required = false;
        } else {
          throw new Error("Formspree respondió con error");
        }
      })
      .catch(function (err) {
        msg.textContent = "No se pudo enviar tu solicitud. Por favor intenta de nuevo o escríbenos por WhatsApp.";
        msg.classList.add("error");
        console.error(err);
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtnDefaultText;
      });
  });
});
