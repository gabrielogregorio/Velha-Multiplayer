const { verifyState } = require('../functions/functions')

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


module.exports = { Velha } 