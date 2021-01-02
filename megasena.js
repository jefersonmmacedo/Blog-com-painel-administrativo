var numeros_ignorados = [0];
var quantidade_de_jogos = 9; // pode mudar a quantidade aqui
var jogos = [];

function gerarNumero(existentes) {
   var novoNumero = parseInt(Math.random() * 59, 10) + 1;
   if (existentes.indexOf(novoNumero) != -1 || numeros_ignorados.indexOf(novoNumero) != -1) novoNumero = gerarNumero(existentes);
   return novoNumero;
}

function chaveExistente(chave) {
   var chaves = jogos.map(function (chv) {
       return chv.join();
   });
   return chaves.indexOf(chave.join()) != -1;
}

for (var i = 0; i < quantidade_de_jogos; i++) {
   var numeros = [];
   while (numeros.length < 6) {
       numeros.push(gerarNumero(numeros));
   }
   numeros = numeros.sort();
   chaveExistente(numeros) ? quantidade_de_jogos++ : jogos.push(numeros);
}
console.log(JSON.stringify(jogos, null, 4));
