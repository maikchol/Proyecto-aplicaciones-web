const axios = require("axios");

async function insertarRecintos() {
  const url = "http://localhost:8080/recintos";

  try {
    for (let i = 1; i <= 2; i++) {
      const nuevoRecinto = {
        nombre: `Recinto a`,
        direccion: `Dirección ${i}`,
        localidad: `Localidad ${i}`,
      };

      await axios.post(url, nuevoRecinto);
    }
    console.log("2 recintos insertados correctamente");
  } catch (error) {
    console.error("Error en la inserción:", error.message);
  }
}

insertarRecintos(); 