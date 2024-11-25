const Disco = require('../models/discoModel');
const path = require('path');

async function criarDisco(req, res) {
    try {
        if (!req.file) {
            return res.status(400).send('A imagem do disco é obrigatória');
        }
        const { titulo, ano, faixa, genero } = req.body;
        const imagem = '/uploads/' + req.file.filename; 
        const generoFormatado = Array.isArray(genero) ? genero.join(',') : genero;


        const novoDisco = await Disco.create({ titulo, ano, imagem, faixa, genero:generoFormatado });

        res.redirect('/');
    } catch (error) {
        console.error('Erro ao criar disco:', error);
        res.status(500).send('Erro ao criar disco.');
    }
}

async function editarDisco(req,res) {
    try {
        const { titulo, ano, faixa, genero } = req.body;  
        const disco = await Disco.findByPk(req.params.id);  
        if (disco) {
            const generoFormatado = Array.isArray(genero) ? genero.join(',') : genero;
            await disco.update({
                titulo,
                ano,
                faixa,
                imagem: req.file ? '/uploads/' + req.file.filename : disco.imagem,  
                genero: generoFormatado
            });
            res.redirect('/catalogo'); 
        } else {
            res.status(404).send('Disco não encontrado');  
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao atualizar disco');  
    }
}

async function verDisco(req, res) {
    try {
        const disco = await Disco.findByPk(req.params.id);  
        if (disco) {
            res.render('editarDisco', { disco });  
        } else {
            res.status(404).send('Disco não encontrado'); 
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao buscar disco'); 
    }
}

async function deletarDisco(req, res) {
    try {
        const id = req.params.id; 
        const disco = await Disco.findByPk(id); 

        if (!disco) {
            return res.status(404).send('Disco não encontrado'); 
        }

        await disco.destroy(); 
        res.redirect('/catalogo'); 
    } catch (error) {
        console.error('Erro ao deletar disco:', error);
        res.status(500).send('Erro ao deletar disco');
    }
}



module.exports = { criarDisco, editarDisco, verDisco, deletarDisco };