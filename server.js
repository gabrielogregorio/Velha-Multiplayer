const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const { v4 } = require('uuid');
const favicon = require('serve-favicon');
const path = require('path');
const { verifyState } = require('./functions')

app.use(express.static('public'))
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));


const secoesConectadas = {}

io.on('connection', (socket) => {

  socket.on('new-player', () => {
    socket.emit('new-player', {id: socket.id})
  })

  socket.on('send-queue', () => {
    let encontrouSecao = false
    let secaoGerada = v4()

    for(secaoId in secoesConectadas) {
      let player1 = secoesConectadas[secaoId].player1
      let player2 = secoesConectadas[secaoId].player2

      // Seção precisando de um player 2
      if (player2 === undefined) {
        encontrouSecao = true
        secaoGerada = secaoId // Sobrescreve a seção

        
        // Adiciona o player 2
        secoesConectadas[secaoId].player2 = {
          id:socket.id,
          resultado: {
            velha:false,
            vitoria:false
          },
          boneco: player1.boneco === 'x' ? 'y' : 'x' }
      }
    }

    // Retornar o id da seção e o código do usuário
    socket.emit('send-queue', {secao:secaoGerada})

    // Não tinha seção e o usuário terá que esperar
    if (!encontrouSecao) {
      // Cria uma seção
      secoesConectadas[secaoGerada] = {
        player1: {id: socket.id, boneco:'x'},
        vezAtual: 'x',
        resultado: { vitoria: false, velha: false },
        tabuleiro: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ]
      }
    } else { // Encontrou uma seção e já pode jogar

      // Retorna os dados de seção a ambos os usuários
      socket.emit('find-session', secoesConectadas[secaoGerada])
      socket.broadcast.emit('find-session', secoesConectadas[secaoGerada])
    }
  })

  socket.on('cancel-queue', (data) => {
    delete secoesConectadas[data.secao]
  }) 

  // Um clique foi enviado
  socket.on('new-click', (data) => {
      // Posição do tabuleiro é vazia ??
      // É a vez do jogador ??
      // Essas informações podem ser manipuladas pelo usuário, mas 
      // Não é o foco por enquanto
      if (
        secoesConectadas[data.secao].tabuleiro[data.i] === ' ' &&
        secoesConectadas[data.secao].vezAtual === data.jogador && 
        secoesConectadas[data.secao].resultado.vitoria === false
        && secoesConectadas[data.secao].resultado.velha === false) {

      // Troca a vez atual
      secoesConectadas[data.secao].vezAtual = secoesConectadas[data.secao].vezAtual === 'x' ? 'y' : 'x'

      // Marca a jogada no tabuleiro
      secoesConectadas[data.secao].tabuleiro[data.i] = data.jogador  

      // Verifica o resultado
      let resultado = verifyState(secoesConectadas[data.secao].tabuleiro)
      secoesConectadas[data.secao].resultado = resultado

      // Envia os dados a ambos os usuários
      socket.emit('new-click', secoesConectadas[data.secao])
      socket.broadcast.emit('new-click', secoesConectadas[data.secao])
    }
  })

  socket.on('disconnect', () => {
  })
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.get('/fila', (req, res) => {
  res.sendFile(__dirname + '/fila.html')
})


const PORT = process.env.PORT || 3000

http.listen(PORT, () => {
  console.log('server is running!')
})
