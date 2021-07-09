// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })
const { ObjectId } = require('mongodb')

// const jwt = require('jsonwebtoken'); //https://www.npmjs.com/package/jsonwebtoken
//pour fastify-jwt faut installer : npm install fastify-jwt
// https://www.npmjs.com/package/fastify-jwt
fastify.register(require('fastify-jwt'), {
  secret: 'supersecret'
})

// Faut installer npm i fastify-cors
fastify.register(require ('fastify-cors'),{
  origin: "*"
})

// Connexion à la base de donnee -- https://github.com/fastify/fastify-mongodb
fastify.register(require('./connector'))

// Importation de la route heroes
fastify.register(require('./src/routes/heroes'))

// Importation de la route users
fastify.register(require('./src/routes/users'))

// Importation de la route / login
fastify.register(require('./src/routes/login'))


// METHOD API REST
// GET - READ
// POST - CREATE
// PATCH / PUT - UPDATE
// DELETE - DELETE


// Declare a route
fastify.get('/', (request, reply) => {
  return { hello: 'world 2' }
})

// Déclarer la route /heroes - cette route retournera la liste des avengers
const avengers = ["Iron man", "Captain america", "Spiderman"]

// heroes GET - Obtiens la liste des héros
fastify.get('/heroesTest', ()=>{
    return avengers //equivalent à avengers: avengers
})


fastify.get('/me', (request, reply) => {
    //ici on retourne un objet javascript qui va etre converti en json
    //(JavaScript Object Notation)
    return { 
        prenom: 'Abdallah',
        nom: "Dargui d",
        job: "developpeur web 3",
     }
  })

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3000)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()

