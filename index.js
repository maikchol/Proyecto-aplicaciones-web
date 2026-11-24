const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Cargar enrutadores
const recintos = require("./routes/recintos");
const eventos = require("./routes/eventos");

// Conectar con la base de datos (Atlas en Render o local)
const urlBD = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eventos";
mongoose.connect(urlBD)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error conectando a MongoDB:", err));

// Habilitar Express y middlewares
const app = express();
app.use(cors());
app.use(express.json());

// Cargar rutas
app.use("/recintos", recintos);
app.use("/eventos", eventos);

// Poner en marcha el servidor
const puerto = process.env.PORT || 8080;
app.listen(puerto, () => {
  console.log(`Servidor escuchando en el puerto ${puerto}`);
});
