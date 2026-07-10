document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("quote-form");
  const esEstudianteCheckbox = document.getElementById("es_estudiante");
  const institucionWrapper = document.getElementById("institucion-wrapper");
  const institucionInput = document.getElementById("institucion");
  const msg = document.getElementById("form-msg");

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

    try {
      downloadAsExcel(data);
      msg.textContent = "¡Listo! Tu solicitud se descargó en Excel. Te contactaremos pronto.";
      form.reset();
      institucionWrapper.hidden = true;
      institucionInput.required = false;
    } catch (err) {
      msg.textContent = "No se pudo generar el archivo Excel. Intenta de nuevo.";
      msg.classList.add("error");
      console.error(err);
    }
  });

  function downloadAsExcel(data) {
    const worksheet = XLSX.utils.json_to_sheet([data]);
    worksheet["!cols"] = Object.keys(data).map(() => ({ wch: 28 }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cotización");

    const nombreArchivo = "cotizacion_" +
      (data["Nombre completo"] || "solicitud").replace(/\s+/g, "_") +
      "_" + new Date().toISOString().slice(0, 10) + ".xlsx";

    XLSX.writeFile(workbook, nombreArchivo);
  }
});
