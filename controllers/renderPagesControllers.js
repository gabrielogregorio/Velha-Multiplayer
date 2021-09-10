const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('index')
})

router.get('/fila', (req, res) => {
  res.render('fila')
})

router.get('/bot', (req, res) => {
  res.render('bot')
})

router.get('/voce', (req, res) => {
  res.render('voce')
})

module.exports = router