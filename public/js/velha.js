/* Cópia de Model e de functions para o cliente 

==== Não realizar alterações ====

*/


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


class Velha {
  constructor(idPlayer1, bonecoPlayer1) {
    this.player1 = {id: idPlayer1, boneco: bonecoPlayer1}
    this.player2 = null
    this.vezAtual = bonecoPlayer1
    this.resultado = { vitoria: false, velha: false }
    this.tabuleiro = ['', '', '', '', '', '', '', '', '', ]
  }

  filaVazia() {
    return this.player2 === null ? true : false
  }

  definePlayer2(idPlayer1) {
    let bonecoPlayer2 = this.player1.boneco === 'x' ? 'y' : 'x'
    this.player2 = {id: idPlayer1, boneco: bonecoPlayer2}
  }

  retornarInstancia() {
    return this
  }

  trocarVez() {
    this.vezAtual = this.vezAtual === 'x' ? 'y' : 'x'
  }

  realizarJogada(playerId, posicao) {
    if(this.resultado.vitoria === true || this.resultado.velha === true || this.filaVazia()) {
      return false
    }
    // Obter o player que vai fazer a jogada
    let player = this.player1.id === playerId ? this.player1 : this.player2

    // É a vez do player
    if(this.vezAtual === player.boneco) {
      if (this.tabuleiro[posicao] === '') {
        this.tabuleiro[posicao] = player.boneco
        this.trocarVez()
        this.resultado = verifyState(this.tabuleiro)
        return true
      } else {
        return false
      }
    }
    return false

  }

  verificarVitoria() {
    return this.resultado.vitoria
  }

  verificarPosicoesVitoria() {
    if(this.verificarVitoria()){
      return this.resultado.posicoes
    }
    return []
  }

  verificarVelha() {
    return this.resultado.velha
  }
}
