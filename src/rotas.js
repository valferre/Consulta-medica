const express = require('express'); 
const consultas = require('./controladores/consultasMedicas'); 
const { validarSenha } = require('./intermediarios');

const rotas = express(); 

rotas.get('/consultas', validarSenha, consultas.listarConsultas); 
rotas.post('/consulta', consultas.criarNovaConsulta); 
rotas.put('/consulta/:identificadorConsulta/paciente', consultas.atualizarConsulta);
rotas.delete('/consulta/:identificadorConsulta', consultas.excluirConsulta);
rotas.post('/consulta/finalizar', consultas.finalizarConsultaMedica);
rotas.get('/consulta/laudo', consultas.listarLaudo);
rotas.get('/consultas/medico', consultas.listarConsultasMedico);

module.exports = rotas; 