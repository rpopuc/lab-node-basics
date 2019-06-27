const express = require('express')

const server = express()
server.use(express.json())

// Query params = ?teste=1
// Route params = /users/1
// Request body = { "name": "Robson", "email": "robson@localhost.local" }

const users = [
    'Diego',
    'Robson',
    'Vitor',
]

// server.get('/teste', (req, res) => {
//     const nome = req.query.nome

//     res.json({msg: `Hello ${nome}`})
// })

// Middleware global
server.use((req, res, next) => {
    console.time('Request')
    console.log(`${req.method} URL: ${req.url}`)
    next()
    console.timeEnd('Request')
})

// Middleware local
const checkUserExists = (req, res, next) => {
    if (! req.body.name) {
        return res.status(400).json({ error: 'User name is required' });
    }

    return next()
}

const checkUserInArray = (req, res, next) => {
    if (! users[req.params.index]) {
        return res.status(400).json({ error: 'User does not exist' });
    }

    req.user = users[req.params.index]
    return next()
}

server.get('/users', (req, res) => {
    return res.json(users)
})

server.get('/users/:index', checkUserInArray, (req, res) => {
    return res.json(req.user)
})

server.post('/users', checkUserExists, (req, res) => {
    const { name } = req.body

    users.push(name)

    return res.json(users)
})

server.put('/users/:index', checkUserExists, checkUserInArray, (req, res) => {
    const { index } = req.params
    const { name } = req.body

    users[ index ] = name

    return res.json(users)
})

server.delete('/users/:index', checkUserInArray, (req, res) => {
    const { index } = req.params

    users.splice(index, 1)

    return res.json({ok: true})
})

server.listen(3000)