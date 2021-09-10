const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const { v4 } = require('uuid');
const favicon = require('serve-favicon');
const path = require('path');
const PORT = process.env.PORT || 3000

const renderPagesController = require('./controllers/renderPagesControllers')
const {Velha} = require('./model/Velha')

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(favicon(path.join(__dirname, 'public', 'images/favicon.png')));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use('/', renderPagesController)

const secoesConectadas = {}

io.on('connection', (socket) => {
  socket.on('new-player', () => {
    socket.emit('new-player', {id: socket.id})
  })

  socket.on('send-queue', () => {
    let encontrouSecao = false
    let secaoGerada = v4()

    for(secaoId in secoesConectadas) {
      if (secoesConectadas[secaoId].filaVazia()) {
        encontrouSecao = true
        secaoGerada = secaoId
        secoesConectadas[secaoId].definePlayer2(socket.id)
      }
    }

    socket.emit('send-queue', {secao:secaoGerada})

    if (!encontrouSecao) {
      secoesConectadas[secaoGerada] = new Velha(socket.id, 'x')
    } else { // Encontrou uma seção e já pode jogar

      // Retorna os dados de seção a ambos os usuários
      socket.emit('find-session', secoesConectadas[secaoGerada].retornarInstancia())
      socket.broadcast.emit('find-session', secoesConectadas[secaoGerada].retornarInstancia())
    }
  })

  socket.on('cancel-queue', (data) => {
    delete secoesConectadas[data.secao]
  }) 

  // Um clique foi enviado
  socket.on('new-click', (data) => {
      let jogada = secoesConectadas[data.secao].realizarJogada(socket.id, data.i)
      if (!jogada) { return }
      let player1 = secoesConectadas[data.secao].retornarInstancia().player1
      let player2 = secoesConectadas[data.secao].retornarInstancia().player2
      
      // Envia os dados a ambos os usuários
      socket.emit('new-click', {jogada:data.i, player1, player2, quemfez:socket.id})
      socket.broadcast.emit('new-click', {jogada:data.i, player1, player2, quemfez:socket.id})
  })

  socket.on('disconnect', () => {
  })
})


http.listen(PORT, () => {
  console.log('server is running!')
})
