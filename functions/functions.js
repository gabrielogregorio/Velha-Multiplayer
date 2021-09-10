
function testarPosicoes(tabuleiro, posicoes, jogador) {
  let vitoria = true
  for (let i = 0; i < posicoes.length ; i++ ) {
    if (tabuleiro[posicoes[i]] !== jogador) {
      vitoria = false
    }
  }
  return {vitoria, posicoes}
}

function testeJogador(tabuleiro, jogador) {
  // {vitoria: false, velha: false, posicoes = [[1,2,3], [3, 2, 1]]}
  let vitoria = {vitoria: false, velha: false, posicoes: []} 

  let teste;

  // Posicoes laterais
  teste = testarPosicoes(tabuleiro, [0, 1, 2], jogador)
  if(teste.vitoria) {    
    vitoria.posicoes.push(teste.posicoes)
  }


  teste = testarPosicoes(tabuleiro, [3, 4, 5], jogador) 
  if(teste.vitoria) {    
    vitoria.posicoes.push(teste.posicoes)
  }
  
  teste = testarPosicoes(tabuleiro, [6, 7, 8], jogador)
  if(teste.vitoria) {    
    vitoria.posicoes.push(teste.posicoes)
  }


  // Posicoes verticais
  teste = testarPosicoes(tabuleiro, [0, 3, 6], jogador)
  if(teste.vitoria) {    
    vitoria.posicoes.push(teste.posicoes)
  }

  teste = testarPosicoes(tabuleiro, [1, 4, 7], jogador)
  if(teste.vitoria) {    
    vitoria.posicoes.push(teste.posicoes)
  }

  teste = testarPosicoes(tabuleiro, [2, 5, 8], jogador)
  if(teste.vitoria) {    
    vitoria.posicoes.push(teste.posicoes)
  }

  // Posicoes transversais
  teste = testarPosicoes(tabuleiro, [0, 4, 8], jogador)
  if(teste.vitoria) {    
    vitoria.posicoes.push(teste.posicoes)
  }

  teste = testarPosicoes(tabuleiro, [2, 4, 6], jogador)
  if(teste.vitoria) {    
    vitoria.posicoes.push(teste.posicoes)
  }

  if(vitoria.posicoes.length !== 0) {
    vitoria.vitoria = true
  }
  return vitoria
}


function verifyState(tabuleiro) {
  let resultado;
  resultado = testeJogador(tabuleiro, 'x')
  if (resultado.vitoria === true) {
    resultado.jogador = 'x'
    resultado.velha = false
    return resultado
  }

  resultado = testeJogador(tabuleiro, 'y')
  if (resultado.vitoria === true) {
    resultado.jogador = 'y'
    resultado.velha = false
    return resultado
  }

  // Percorrer o tabuleiro para ver se tem algum campo ainda disponível
  for(let i = 0; i < tabuleiro.length; i++) {
    if (tabuleiro[i] === '') {
      resultado = {vitoria:false, velha: false}
      return resultado
    }
  }

  // Nenhum campo disponível, deu velha
  resultado = {vitoria:false, velha: true}
  return resultado
}


module.exports = {verifyState}