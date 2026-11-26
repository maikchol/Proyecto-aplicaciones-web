const express = require('express');
const Evento = require('../models/evento');

const router = express.Router();

router.get('/', async (req, res) => {
    try{
        const resultado = await Evento.find().populate('recinto');

        if (resultado.length === 0){
            return res.status(500).json({ error: 'No se han encontrado eventos', ok: false });
        }

        res.status(200).json({ resultado, ok: true });
    }
    catch (error) {
        res.status(500).json({ error: 'No se han encontrado eventos', ok: false });
    }
});

router.get('/:id', async (req, res) => {
    try{
        const resultado = await Evento.findById(req.params.id).populate('recinto');

        if (resultado == null) {
            return res.status(404).json({ error: `Evento ${req.params.id} no encontrado`, ok: false });
        }

        res.status(200).json({ resultado, ok: true });
    }
    catch (error) {
        res.status(404).json({ error: `Evento ${req.params.id} no encontrado`, ok: false });
    }
});

router.get('/localidad/:nombre', async (req, res) => {
    try{
        let resultado = await Evento.find({ fecha: { $gte: new Date() }}).populate('recinto');
        resultado = resultado.filter(e => e.recinto && e.recinto.localidad === req.params.nombre);

        if (resultado.length === 0) {
            return res.status(404).json({ error: `No se han encontrado eventos`, ok: false });
        }

        res.status(200).json({ resultado, ok: true});
    }
    catch (error){
        res.status(404).json({ error: `No se han encontrado eventos`, ok: false });
    }
});

router.post('/', async (req, res) => {
    try{
        let resultado = new Evento(req.body);
        await resultado.save();
        resultado = await resultado.populate('recinto');
        res.status(201).json({ resultado, ok: true });
    }
    catch (error) {
        res.status(500).json({ error: 'Error añadiendo evento', ok: false });
    }
});

router.put('/:id', async (req, res) => {
    try{
        const resultado = await Evento.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('recinto');

        if (resultado == null) {
            return res.status(404).json({ error: `Error actualizando evento ${req.params.id}`, ok: false });
        }

        res.status(200).json({ resultado, ok: true });
    }
    catch (error) {
        res.status(404).json({ error: `Error actualizando evento ${req.params.id}`, ok: false });
    }
});

router.delete('/:id', async (req, res) => {
    try{
        const resultado = await Evento.findByIdAndDelete(req.params.id).populate('recinto');

        if (resultado == null) {
            return res.status(404).json({ error: `Error eliminando evento ${req.params.id}`, ok: false });
        }

        res.status(200).json({ resultado, ok: true });
    }
    catch (error){
        res.status(404).json({ error: `Error eliminando evento ${req.params.id}`, ok: false });
    }
});

router.get('/entradas/:idEvento/:tipoEntrada', async (req, res) => {
    try{
        let entradas = await Evento.findById(req.params.idEvento);
        entradas = entradas.entradas.filter(e => e.tipo === req.params.tipoEntrada);

        let resultado = {
            precio: entradas[0].precio,
            disponibles: entradas[0].disponibles
        }

        if (resultado.disponibles == null || resultado.precio == null) {
            return res.status(404).json({ error: `Error obteniendo datos de entrada para evento ${req.params.idEvento}`, ok: false });
        }

        res.status(200).json({ resultado, ok: true });
    }
    catch (error) {
        res.status(404).json({ error: `Error obteniendo datos de entrada para evento ${req.params.idEvento}`, ok: false });
    }
});

router.put('/entradas/:idEvento/:tipoEntrada/:cantidad', async (req, res) => {
    try{
        const evento = await Evento.findById(req.params.idEvento).populate('recinto');
        const cantidad = Number(req.params.cantidad);

        if (!evento || isNaN(cantidad) || cantidad < 0) {
            return res.status(404).json({ error: `Error actualizando entradas del evento ${req.params.idEvento}`, ok: false });
        }

        const entrada = evento.entradas.find(e => e.tipo === req.params.tipoEntrada);

        if (!entrada || entrada.disponibles < cantidad) {
          return res.status(404).json({ error: `Error actualizando entradas del evento ${req.params.idEvento}`, ok: false });
        }

        entrada.disponibles -= cantidad;
        const resultado = await evento.save();

        res.status(200).json({ resultado, ok: true });
    }
    catch (error) {
        res.status(404).json({ error: `Error actualizando entradas del evento ${req.params.idEvento}`, ok: false });
    }
});

router.get('/agotados', async (req, res) => {
    try{
        let resultado = await Evento.find(e => e.entradas.every(entrada => entrada.disponibles === 0)).populate('recinto');
        res.status(200).json({ resultado, ok: true });
    }
    catch (error) {
        res.status(404).json({ error: `Error obteniendo eventos agotados`, ok: false });
    }
});

router.post('/entradas/:idEvento', async (req, res) => {
    try{
        let nuevos_datos = new Evento(req.body);
        let evento = await Evento.findById(req.params.idEvento);
        let entradas = nuevos_datos.entradas;

        if (entradas.tipo == null || entradas.tipo === "" || entradas.precio == null || entradas.precio === "" || entradas.disponibles == null || entradas.disponibles === "") {
            return res.status(400).json({ error: `Error: Datos inválidos para el evento ${req.params.idEvento}`, ok: false });
        }

        evento.entradas.tipo = entradas.tipo;
        evento.entradas.precio = entradas.precio;
        evento.entradas.disponibles = entradas.disponibles;

        let resultado = await evento.save();
        res.status(201).json({ resultado, ok: true });
    }
    catch (error) {
        res.status(500).json({ error: `Error añadiendo entradas al evento ${req.params.idEvento}`, ok: false });
    }
});

module.exports = router;