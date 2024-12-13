const puppeteer = require('puppeteer');
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

let poolsOccupancy = {}; // Objeto para almacenar la ocupación de cada piscina

// Habilitar CORS para permitir solicitudes desde cualquier origen
app.use(cors());

// Ruta para obtener la ocupación de todas las piscinas
app.get('/ocupacion', (req, res) => {
    res.json(poolsOccupancy);  // Retornamos el objeto con las ocupaciones
});

// Función para hacer scraping y actualizar los datos
async function scrapeData() {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://www.vitoria-gasteiz.org/wb021/was/contenidoAction.do?idioma=es&uid=_cd7e443_12210c43e5f__7fd5');

        // Array con los IDs de las 11 piscinas
        const poolIds = [
            'aforo-piscinas_2', 'aforo-piscinas_28', 'aforo-piscinas_35',
            'aforo-piscinas_34', 'aforo-piscinas_54', 'aforo-piscinas_4',
            'aforo-piscinas_6', 'aforo-piscinas_26', 'aforo-piscinas_49',
            'aforo-piscinas_65', 'aforo-piscinas_64'
        ];

        // Extraemos el dato de ocupación de cada piscina
        for (const poolId of poolIds) {
            const ocupacion = await page.$eval(`#${poolId}`, el => el.textContent.trim());
            poolsOccupancy[poolId] = ocupacion || "No disponible";  // Actualizamos el objeto de ocupación
        }

        await browser.close();

        console.log('Ocupaciones actualizadas:', poolsOccupancy);
    } catch (error) {
        console.error('Error al hacer scraping:', error);
        poolsOccupancy = { error: 'Error al obtener datos' };  // Actualizamos con un mensaje de error
    }
}

setInterval(scrapeData, 1 * 60 * 1000); // Ejecuta el scraper cada 1 minuto (60,000 milisegundos)

// Ejecutar el scraper inmediatamente al iniciar el servidor
scrapeData();

// Iniciar el servidor Express
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
