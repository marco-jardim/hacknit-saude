var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var Nightmare = require('nightmare')
const config = require("./config.json")
var bodyParser = require('body-parser');
const Web3 = require('web3');

var web3 =  new Web3('https://ropsten.infura.io/v3/fb38680fa08c4affa4bde2af50690a35');

const AbiOfContract = [ { "constant": false, "inputs": [ { "name": "cpf", "type": "uint256" }, { "name": "userEmail", "type": "string" }, { "name": "userAge", "type": "uint256" }, { "name": "name", "type": "string" }, { "name": "phone", "type": "uint256" }, { "name": "dueDate", "type": "uint256" } ], "name": "insertUser", "outputs": [ { "name": "index", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x0ddfa81c" }, { "constant": true, "inputs": [ { "name": "userCPF", "type": "uint256" } ], "name": "isUser", "outputs": [ { "name": "isIndeed", "type": "bool", "value": false } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x18a9cc1b" }, { "constant": false, "inputs": [ { "name": "cpf", "type": "uint256" }, { "name": "userEmail", "type": "string" } ], "name": "updateUserEmail", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x2a27ad26" }, { "constant": false, "inputs": [ { "name": "cpf", "type": "uint256" } ], "name": "deleteUser", "outputs": [ { "name": "index", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x38f14845" }, { "constant": false, "inputs": [ { "name": "cpf", "type": "uint256" }, { "name": "userAge", "type": "uint256" } ], "name": "updateUserAge", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x7562b210" }, { "constant": true, "inputs": [ { "name": "cpf", "type": "uint256" } ], "name": "getUser", "outputs": [ { "name": "userEmail", "type": "string", "value": "a@b.com" }, { "name": "userAge", "type": "uint256", "value": "10" }, { "name": "name", "type": "string", "value": "nome da pessoa" }, { "name": "phone", "type": "uint256", "value": "27147876" }, { "name": "dueDate", "type": "uint256", "value": "1566735158000" }, { "name": "index", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0xb0467deb" }, { "constant": true, "inputs": [], "name": "getUserCount", "outputs": [ { "name": "count", "type": "uint256", "value": "1" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0xb5cb15f7" }, { "constant": false, "inputs": [ { "name": "cpf", "type": "uint256" }, { "name": "dueDate", "type": "uint256" } ], "name": "updateDueDate", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0xb9ce5a86" }, { "constant": true, "inputs": [ { "name": "index", "type": "uint256" } ], "name": "getUserAtIndex", "outputs": [ { "name": "cpf", "type": "uint256", "value": "1234" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0xffcc7bbf" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "cpf", "type": "uint256" }, { "indexed": false, "name": "index", "type": "uint256" }, { "indexed": false, "name": "userEmail", "type": "string" }, { "indexed": false, "name": "userAge", "type": "uint256" }, { "indexed": false, "name": "name", "type": "string" }, { "indexed": false, "name": "phone", "type": "uint256" }, { "indexed": false, "name": "dueDate", "type": "uint256" } ], "name": "LogNewUser", "type": "event", "signature": "0xf342a36bbe43a8dc7f49c4030f0fd6b066be49db2403b165528c17ef82d7ee1c" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "cpf", "type": "uint256" }, { "indexed": false, "name": "index", "type": "uint256" }, { "indexed": false, "name": "userEmail", "type": "string" }, { "indexed": false, "name": "userAge", "type": "uint256" }, { "indexed": false, "name": "name", "type": "string" }, { "indexed": false, "name": "phone", "type": "uint256" }, { "indexed": false, "name": "dueDate", "type": "uint256" } ], "name": "LogFullUpdate", "type": "event", "signature": "0xd9b0119fabcad066ab00f9144c7554b4b13261937ae1cc50a4c59b77659a924e" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "cpf", "type": "uint256" }, { "indexed": false, "name": "index", "type": "uint256" }, { "indexed": false, "name": "userEmail", "type": "string" } ], "name": "LogUpdateUserEmail", "type": "event", "signature": "0xbbfa434374a125a57178dbed9a2b54cbd7ace85cae47910311235980e0ab665c" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "cpf", "type": "uint256" }, { "indexed": false, "name": "index", "type": "uint256" }, { "indexed": false, "name": "dueDate", "type": "uint256" } ], "name": "LogUpdateUserDueDate", "type": "event", "signature": "0xfac4c808fbf643865c95d5f2507f2e1b20627f5f64a662158a9e214736512858" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "cpf", "type": "uint256" }, { "indexed": false, "name": "index", "type": "uint256" }, { "indexed": false, "name": "age", "type": "uint256" } ], "name": "LogUpdateUserAge", "type": "event", "signature": "0xa6a3e41b0b72d48652bec055bb1e142741be1705ecc34b2312b0d567551a5f50" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "cpf", "type": "uint256" }, { "indexed": false, "name": "index", "type": "uint256" } ], "name": "LogDeleteUser", "type": "event", "signature": "0x223b022b9516cbdc9f2f98166ee2d537ca148adea24d342ae38cf0ce615ec25a"}];

const Accountaddress = '0xd60faa57cfaece7d4f125890e72e9ff392c4c2fb';
const contractAddress = '0x11D78F274Bc9FbAfdD1596FB2037a59d7D6FD801';

const asyncMiddleware = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
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

app.post('/api/insertVacinas', asyncMiddleware(async (req, res, next) => {
  var nome = req.body.nome;
  var nomeMae = req.body.nomeMae;
  var imunobiologico = req.body.imunobiologico;
  var laboratorio = req.body.laboratorio;
  var dose = req.body.dose;
  console.log(req.body);
  var result;
  try {
      result = await startPostVacinas(nome, nomeMae, imunobiologico, dose, laboratorio);
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

async function startPostVacinas(nome, nomeMae, imunobiologico, dose, laboratorio) {
  console.log("startPostVacinas");
  let data = await postVacinas(nome, nomeMae, imunobiologico, dose, laboratorio);
  return data;
}

async function startGetTelefone(nome, nomeMae) {
  let data = await getTelefone(nome, nomeMae);
  return data;
}

async function getVacinas(nome, nomeMae) {
var nightmare = Nightmare({ show: false, height: 900, width: 1600, waitTimeout: 180000, // in ms
            loadTimeout: 180000,
            executionTimeout: 180000
        }).on('console', (log, ...msg) => {
            console.log(msg);
        });
var myContract = new web3.eth.Contract(AbiOfContract, contractAddress, {
  from: Accountaddress, // default from address
  gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
});
myContract.methods.getUser(1234).call({from: Accountaddress}, function(error, result){
    console.log(result);
});

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
// var imunobiologico = "Tríplice viral - SCR";// DTP/HB/Hib - Penta
// var dose = "1ª Dose";
// var laboratorio = "NOVARTIS";

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

function getDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!

  var yyyy = today.getFullYear();
  if(dd<10){
      dd='0'+dd;
  } 
  if(mm<10){
      mm='0'+mm;
  } 
  var today = dd+'/'+mm+'/'+yyyy;
  return today;
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
    console.log(success);
    return success;
  })
  .catch(error => {
    console.error('Search failed:', error)
  })
  return result;
}