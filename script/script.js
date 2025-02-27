document.addEventListener("DOMContentLoaded", function () {
    const url = "https://zaragoza.es/sede/servicio/informacion-polen.json";
    const tablaBody = document.getElementById("tabla-body");

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log("📊 Datos obtenidos del JSON:", data); // Imprime todos los datos en consola

            data.result.forEach(planta => {
                const observacion = planta.observation[0];
                let nivel = observacion.value.toLowerCase();

                // Si el nivel es "nulo", cambiar a "Nada" y aplicar clase "nada"
                let nivelTexto = nivel === "nulo" ? "Nada" : observacion.value.toUpperCase();
                let claseColor = (nivel === "alto" || nivel === "medio" || nivel === "bajo") ? nivel : "nada";

                // Imprimir cada fila de datos en consola
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
});
