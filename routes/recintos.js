const express = require('express');
const Recinto = require('../models/recinto');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const resultado = await Recinto.find();

        if (resultado.length === 0) {
            return res.status(500).json( { error: 'No se han encontrado recintos', ok: false } );
        }

        res.status(200).json({ resultado, ok: true });
    }
    catch (error) {
        res.status(500).json({ error: 'No se han encontrado recintos', ok: false });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const resultado = await Recinto.findById(req.params.id);

        if (resultado == null) {
            return res.status(404).json( { error: `Recinto ${req.params.id} no encontrado`, ok: false } );
        }

        return res.status(200).json({ resultado, ok: true });
    }
    catch (error) {
        res.status(404).json( { error: `Recinto ${req.params.id} no encontrado`, ok: false})
    }
});

router.get('/localidad/:nombre', async (req, res) => {
    try{
        const resultado = await Recinto.find( { localidad: req.params.nombre } );

        if (resultado.length === 0) {
            return res.status(404).json( { error: `No se han encontrado recintos de la localidad indicada`, ok: false } );
        }

        res.status(200).json({ resultado, ok: true });
    }
    catch (error) {
        res.status(404).json( { error: `No se han encontrado recintos de la localidad indicada`, ok: false})
    }
});

router.post('/', async (req, res) => {
    try{
        const recinto = new Recinto(req.body);
        const resultado = await recinto.save();
        res.status(201).json({ resultado, ok: true });
    }
    catch (error) {
        res.status(500).json({ error: 'Error añadiendo recinto', ok: false });
    }
});

router.delete('/:id', async (req, res) => {
    try{
        const resultado = await Recinto.findByIdAndDelete(req.params.id);

        if (resultado == null) {
            return res.status(404).json({ error: `Error eliminando recinto ${req.params.id}`, ok: false });
        }

        res.status(200).json({ resultado, ok: true });
    }
    catch (error) {
        res.status(404).json({ error: `Error eliminando recinto ${req.params.id}`, ok: false });
    }
});

module.exports = router;