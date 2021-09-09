const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const { v4 } = require('uuid');
app.use(express.static('public'))

// Seções conectadas
const secoes = {}


io.on('connection', (socket) => {

  // Usuário conectou ao servidor pela primeira vez
  socket.on('new-player', () => {
    let encontrouSecao = false
    let secao = v4()

    // Percorrer pelas seções para achar alguma com precisando de um 
    // player 2
    for(secaoId in secoes) {
      let player1 = secoes[secaoId].player1
      let player2 = secoes[secaoId].player2

      // Seção precisando de um player 2
      if (player2 === undefined) {
        encontrouSecao = true
        secao = secaoId // Sobrescreve a seção

        // Adiciona o player 2
        secoes[secaoId].player2 = { id:socket.id, boneco: player1.boneco === 'x' ? 'y' : 'x' }
      }
    }

    // Retornar o id da seção e o código do usuário
    socket.emit('new-player', {secao, id: socket.id})

    // Não tinha seção e o usuário terá que esperar
    if (!encontrouSecao) {
      // Cria uma seção
      secoes[secao] = {
        player1: {id: socket.id, boneco:'x'},
        vezAtual: 'x',
        tabuleiro: ['', '', '', '', '', '', '', '', '', ]
      }
    } else { // Encontrou uma seção e já pode jogar

      // Retorna os dados de seção a ambos os usuários
      socket.emit('find-session', secoes[secao])
      socket.broadcast.emit('find-session', secoes[secao])
    }
  })


  // Um clique foi enviado
  socket.on('new-click', (data) => {
      // Posição do tabuleiro é vazia ??
      // É a vez do jogador ??
      // Essas informações podem ser manipuladas pelo usuário, mas 
      // Não é o foco por enquanto
      if (
        secoes[data.secao].tabuleiro[data.i] === '' &&
        secoes[data.secao].vezAtual === data.jogador) {

      // Troca a vez atual
      secoes[data.secao].vezAtual = secoes[data.secao].vezAtual === 'x' ? 'y' : 'x'

      // Marca a jogada no tabuleiro
      secoes[data.secao].tabuleiro[data.i] = data.jogador  

      // Verifica o resultado

      // Envia os dados a ambos os usuários
      socket.emit('new-click', secoes[data.secao])
      socket.broadcast.emit('new-click', secoes[data.secao])
    }
  })

  socket.on('disconnect', () => {
  })
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

const PORT = process.env.PORT || 3000

http.listen(PORT, () => {
  console.log('server is running!')
})
