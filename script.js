// Obtener el contenedor donde se mostrarán las piscinas
const poolContainer = document.getElementById("piscinas-container");

// La lista de las piscinas con su nombre y ocupación
const pools = [
  { id: "aforo-piscinas_2", name: "Mendizorrotza + Kirolklub" },
  { id: "aforo-piscinas_28", name: "Abetxuko" },
  { id: "aforo-piscinas_35", name: "Aldabe" },
  { id: "aforo-piscinas_34", name: "Hegoalde" },
  { id: "aforo-piscinas_54", name: "Ibaiondo" },
  { id: "aforo-piscinas_4", name: "Iparralde" },
  { id: "aforo-piscinas_6", name: "Judimendi" },
  { id: "aforo-piscinas_26", name: "Lakua" },
  { id: "aforo-piscinas_49", name: "San Andrés" },
  { id: "aforo-piscinas_65", name: "Salburua" },
  { id: "aforo-piscinas_64", name: "Zabalgana" }
];

// Elemento donde se mostrará la última hora de actualización
const lastUpdatedElement = document.getElementById("last-updated");

// Función para obtener los datos de ocupación de las piscinas
async function fetchData() {
  try {
    const response = await fetch('http://localhost:3000/ocupacion');
    const data = await response.json();

    // Asignamos los datos de ocupación a cada piscina
    pools.forEach(pool => {
      pool.occupancy = data[pool.id] || 'No disponible';
    });

    // Ahora generamos los elementos HTML de las piscinas
    poolContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar los elementos

    pools.forEach(pool => {
      const poolElement = document.createElement("div");
      poolElement.classList.add("pool-circle");
      
      // Asignamos el color basado en la ocupación de cada piscina
      poolElement.style.backgroundColor = getColorByOccupancy(pool);

      poolElement.innerHTML = `
        <div class="pool-name">${pool.name}</div>
        <div class="pool-occupancy">${pool.occupancy}</div>
      `;

      poolContainer.appendChild(poolElement);
    });

    // Actualizamos la hora de la última comprobación
    updateLastUpdatedTime();

  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }
}

// Función para asignar el color según la ocupación
function getColorByOccupancy(pool) {
  if (pool.occupancy === 'No disponible') {
    return "#bdc3c7"; // Color gris para 'No disponible'
  }

  const occupancyValue = parseInt(pool.occupancy);

  // Obtener los valores de ocupación
  const occupancyValues = pools.map(pool => pool.occupancy === 'No disponible' ? 0 : parseInt(pool.occupancy));
  const maxOccupancy = Math.max(...occupancyValues);
  const minOccupancy = Math.min(...occupancyValues);

  // Si la piscina está en la posición con la máxima ocupación, asignamos el color rojo
  if (parseInt(pool.occupancy) === maxOccupancy) {
    return "#e74c3c"; // Rojo (máxima ocupación)
  }

  // Si la piscina está en la posición con la mínima ocupación, asignamos el color verde
  if (parseInt(pool.occupancy) === minOccupancy) {
    return "#2ecc71"; // Verde fuerte (mínima ocupación)
  }

  // Para el resto de piscinas asignamos un color azul por defecto
  return "#3498db"; // Azul por defecto (ocupación media)
}

// Función para actualizar la hora de la última comprobación
function updateLastUpdatedTime() {
  const currentTime = new Date();
  const hours = currentTime.getHours().toString().padStart(2, "0");
  const minutes = currentTime.getMinutes().toString().padStart(2, "0");
  const seconds = currentTime.getSeconds().toString().padStart(2, "0");

  lastUpdatedElement.textContent = `Última actualización: ${hours}:${minutes}:${seconds}`;
}

// Llamamos a la función para cargar los datos de ocupación al cargar la página
fetchData();

// Ejecutar el scraper cada 1 minuto (60,000 milisegundos)
setInterval(fetchData, 1 * 60 * 1000);
