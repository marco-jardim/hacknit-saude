var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var Nightmare = require('nightmare')
const config = require("./config.json")
var bodyParser = require('body-parser');

const asyncMiddleware = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({	extended: true })); // support encoded bodies
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/api/vacinas', asyncMiddleware(async (req, res, next) => {
	var nome = req.body.nome;
 	var nomeMae = req.body.nomeMae;
 	console.log(req.body);
 	var result;
 	try {
  		result = await startGetVacinas(nome, nomeMae);
  	} catch (error) {
  		result = ["not found"];
  	}
  	res.send(result)
}))

app.post('/api/dados', asyncMiddleware(async (req, res, next) => {
	var nome = req.body.nome;
 	var nomeMae = req.body.nomeMae;
 	console.log(req.body);
 	var result;
 	try {
  		result = await startGetTelefone(nome, nomeMae);
  	} catch (error) {
  		result = ["not found"];
  	}
  	res.send(result)
}))


// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);


// crawler
const UF = "RIO DE JANEIRO";


async function startGetVacinas(nome, nomeMae) {
  let data = await getVacinas(nome, nomeMae);
  return data;
}

async function startPostVacinas(nome, nomeMae) {
  let data = await getVacinas(nome, nomeMae);
  return data;
}

async function startGetTelefone(nome, nomeMae) {
  let data = await getTelefone(nome, nomeMae);
  return data;
}

async function getVacinas(nome, nomeMae) {
var nightmare = Nightmare({ show: false, height: 900, width: 1600 })
var result = await nightmare
  .goto('http://tr-sipni.datasus.gov.br/si-pni-web/faces/inicio.jsf')
  .insert('#j_idt22\\:usuario', config.username)
  .insert('#j_idt22\\:senha', config.password)
   .click('#j_idt22\\:j_idt35')
   .wait(1000)
   .goto("http://tr-sipni.datasus.gov.br/si-pni-web/faces/paciente/listarPaciente.jsf")
   .wait(1000)
   .click('[data-label="' + UF + '"]')
   .insert("#pacienteForm\\:nomePaciente", nome)
   .insert("#pacienteForm\\:nomeMaePaciente", nomeMae)
   .wait(500)
   .click("#pacienteForm\\:j_idt98")
   .wait(1000)
   .click('#pacienteForm\\:listaPacienteTable\\:0\\:j_idt133')
   .wait(1000)
  .evaluate(() => {
    var historico = jQuery('#tvVacina\\:listaLancamento_data tr').get().map(function(row) {
      return jQuery(row).find('td').get().map(function(cell) {
        return jQuery(cell).html();
      });
    });
    var aprazamento = jQuery('#tvVacina\\:listaAprazamento_data tr').get().map(function(row) {
      return jQuery(row).find('td').get().map(function(cell) {
        return jQuery(cell).html();
      });
    });
    var table = {historico, aprazamento};
    return(table)
  })
  .end()
  .then((success) => {
  	console.log(success);
    return success;
  })
  .catch(error => {
    console.error('Search failed:', error)
    reject(error);
  })
  return result;
}

async function postVacinas(nome, nomeMae, imunobiologico, dose, laboratorio) {
var grupo = "População geral";
var estrategia = "Rotina";
var imunobiologico = "Tríplice viral - SCR";// DTP/HB/Hib - Penta
var dose = "1ª Dose";
var laboratorio = "NOVARTIS";

//12 meses
// {Tríplice viral - SCR, 1ª Dose, NOVARTIS}
// {Meningocócica conjugada C - Men Conj C, 1º Reforço, NOVARTIS}
// {Pneumocócica 10V  - Pncc10V, 1º Reforço, FIOCRUZ}


var nightmare = Nightmare({ show: false, height: 900, width: 1600 })
var result = await nightmare
  .goto('http://tr-sipni.datasus.gov.br/si-pni-web/faces/inicio.jsf')
  .insert('#j_idt22\\:usuario', config.username)
  .insert('#j_idt22\\:senha', config.password)
   .click('#j_idt22\\:j_idt35')
   .wait(1000)
   .goto("http://tr-sipni.datasus.gov.br/si-pni-web/faces/paciente/listarPaciente.jsf")
   .wait(1000)
   .click('[data-label="' + UF + '"]')
   .insert("#pacienteForm\\:nomePaciente", nome)
   .insert("#pacienteForm\\:nomeMaePaciente", nomeMae)
   .wait(500)
   .click("#pacienteForm\\:j_idt98")
   .wait(1000)
   .click('#pacienteForm\\:listaPacienteTable\\:0\\:j_idt133')
   .wait(1000)
   .insert("#tvVacina\\:dataAplicacao_input", getDate())
   .wait(1000)
   .click('[data-label="' + grupo + '"]')
   .wait(100)
   .click('#tvVacina\\:estrategia_panel [data-label="' + estrategia + '"]')
   .wait(1000)
   .click('#tvVacina\\:produto_panel [data-label="' + imunobiologico + '"]')
   .wait(1000)
   .click('#tvVacina\\:dose_panel [data-label="' + dose + '"]')
   .wait(1000)
   .click('#tvVacina\\:produtor_panel [data-label="' + laboratorio + '"]')
   .wait(1000)
   .click('#tvVacina\\:j_idt166')
   .wait(1000)
   .click('#tvVacina\\:btn1')
   .wait(1000)
   .click('[name="tvVacina:j_idt233"]')
   .wait(1000)
  .end()
  .then((success) => {
    console.log("success");
    return "success";
  })
  .catch(error => {
    console.error('Search failed:', error)
  })
  return result;
}

async function getTelefone(nome, nomeMae) {
var nightmare = Nightmare({ show: false, height: 900, width: 1600 })
var result = await nightmare
  .goto('http://tr-sipni.datasus.gov.br/si-pni-web/faces/inicio.jsf')
  .insert('#j_idt22\\:usuario', config.username)
  .insert('#j_idt22\\:senha', config.password)
   .click('#j_idt22\\:j_idt35')
   .wait(1000)
   .goto("http://tr-sipni.datasus.gov.br/si-pni-web/faces/paciente/listarPaciente.jsf")
   .wait(1000)
   .click('[data-label="' + UF + '"]')
   .insert("#pacienteForm\\:nomePaciente", nome)
   .insert("#pacienteForm\\:nomeMaePaciente", nomeMae)
   .wait(500)
   .click("#pacienteForm\\:j_idt98")
   .wait(1000)
   .click('#pacienteForm\\:listaPacienteTable\\:0\\:j_idt129')
   .wait(5000)
  .evaluate(() => {
    var telefone = jQuery("#telefone").attr("value");
    return(telefone);
  })
  .end()
  .then((success) => {
    console.log("telefone", success);
    return success;
  })
  .catch(error => {
    console.error('Search failed:', error)
  })
  return result;
}