const axios = require("axios");

async function insertarLibros() {
  const url = "http://localhost:8080/libros";

  try {
    for (let i = 1; i <= 10000; i++) {
      const nuevoLibro = {
        titulo: `Libro ${i}`,
        autor: `Autor ${i}`,
        precio: 15,
      };

      await axios.post(url, nuevoLibro);
    }
    console.log("10.000 libros insertados correctamente");
  } catch (error) {
    console.error("Error en la inserción:", error.message);
  }
}

insertarLibros();