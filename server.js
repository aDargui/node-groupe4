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
	// Ici on retourne un objet javascript qui va être converti en JSON (JavaScript Object Notation)
	return {
		hello: 'world'
	}
})



fastify.get('/me', function () {
	return {
		prenom: "Leititia",
		nom: "BOUANGA",
		job: "chef de projet web",
	}
})


// Run the server!
const start = async () => {
	try {
		console.log("Serveur lancé: http:// localhost:4000")
		await fastify.listen(4000)
	} catch (err) {
		fastify.log.error(err)
		process.exit(1)
	}
}
start()