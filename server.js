const {
	default: fastifyMongodb
} = require('fastify-mongodb')

// Require the framework and instantiate it
const fastify = require('fastify')({
	logger: true
})
const {
	ObjectId
} = require('mongodb')
const argon2 = require('argon2')
const createError = require('http-errors')

fastify.register(require('fastify-jwt'), {
	secret: 'monsupersecretestmoi'
	// le secret ne doit être divulgué à personne 
})
// Connexion à la BDD
fastify.register(require('./connector'))
//importation de la route "heroes"
fastify.register(require('./src/routes/heroes'))
//importation de la route "users"
fastify.register(require('./src/routes/users'))



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