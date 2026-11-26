const axios = require("axios");
const uri = "http://localhost:8080/eventos";
const nuevoTipo = {
    tipo: "Tipo ",
    precio: 30,
    disponibles: 10,
}
const nuevoEvento = {
    nombre: "Evento de prueba",
    fecha: "2024-07-01",
    recinto: "64a0f3e1c5b6f8d2e4a1b2c3"
};

async function anyadir(){
    await axios.post(uri, nuevoEvento);
    console.log("Evento creado correctamente");
}

async function pruebas(){
    try{

        for (let i = 1; i <= 2; i++) {
            nuevoTipo.tipo = `Tipo ${i}`;
            nuevoTipo.disponibles = i;

            await axios.post(uri + "/entradas/6b07fdde7fab043f64f24163", nuevoTipo);
        };
    }
    catch (error){
        console.error("Error en la inserción:", error.message);
    }

    try{
        await axios.get(uri + "/agotados");
    }
    catch (error){
        console.error("Error en la obtención de eventos agotados:", error.message);
    }

    try{
        await axios.post(uri + "/entradas/6b07fdde7fab043f64f24163", nuevoTipo);
    }
    catch (error){
        console.error("Error en la inserción de entradas:", error.message);
    }
    
};

anyadir();
pruebas();