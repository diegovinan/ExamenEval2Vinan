document.addEventListener("DOMContentLoaded", function () {
    const url = "https://zaragoza.es/sede/servicio/informacion-polen.json";
    const mockAPI = "https://67c0b13bb9d02a9f224aab44.mockapi.io/polen/guardar"; // URL de MockAPI.io
    const tablaBody = document.getElementById("tabla-body");
    let polenData = null; // Variable para almacenar los datos obtenidos

    // Obtener los datos de la API y mostrarlos en la tabla
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log("📊 Datos obtenidos del JSON:", data);
            polenData = data; // Guardamos los datos para usarlos luego

            data.result.forEach(planta => {
                const observacion = planta.observation[0];
                let nivel = observacion.value.toLowerCase();
                let nivelTexto = nivel === "nulo" ? "Nada" : observacion.value.toUpperCase();
                let claseColor = (nivel === "alto" || nivel === "medio" || nivel === "bajo") ? nivel : "nada";

                console.log(`📌 Especie: ${planta.title}, Fecha: ${observacion.publicationDate.split("T")[0]}, Nivel: ${nivelTexto}`);

                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${observacion.publicationDate.split("T")[0]}</td>
                    <td>${planta.title}</td>
                    <td><img src="${planta.image}" alt="${planta.title}" width="50"></td>
                    <td class="${claseColor}">${nivelTexto}</td>
                `;
                tablaBody.appendChild(fila);
            });
        })
        .catch(error => console.error("❌ Error al obtener los datos:", error));

    // Esperar a que el DOM cargue antes de obtener el botón
    document.addEventListener("DOMContentLoaded", function () {
        const guardarBtn = document.getElementById("guardar-btn");

        if (!guardarBtn) {
            console.error("❌ Error: No se encontró el botón con id 'guardar-btn'");
            return;
        }

        guardarBtn.addEventListener("click", function() {
            const nombre = document.getElementById("nombre").value;
            if (!nombre) {
                alert("Por favor, introduce tu nombre antes de guardar.");
                return;
            }

            if (polenData && polenData.result) {
                polenData.result.forEach(planta => {
                    const observacion = planta.observation[0];
                    let nivel = observacion.value.toLowerCase();
                    let nivelTexto = nivel === "nulo" ? "Nada" : observacion.value.toUpperCase();

                    const payload = {
                        nombre: nombre,
                        fecha: observacion.publicationDate.split("T")[0],
                        especie: planta.title,
                        concentracion: nivelTexto
                    };

                    console.log("📤 Enviando datos a MockAPI:", JSON.stringify(payload)); // Verificar qué se envía

                    fetch(mockAPI, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(payload)
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(result => {
                        console.log("✅ Datos guardados en MockAPI.io:", result);
                        alert("Datos guardados correctamente en la API.");
                    })
                    .catch(error => console.error("❌ Error al guardar los datos en MockAPI.io:", error));
                });
            } else {
                console.error("❌ No hay datos disponibles para guardar.");
            }
        });
    });
});
