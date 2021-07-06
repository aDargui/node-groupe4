// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })

// METHOD API REST
// GET - READ
// POST - CREATE
// PATCH / PUT - UPDATE
// DELETE - DELETE

// Declare a route
fastify.get('/', (request, reply) => {
	// Ici on retourne un objet javascript qui va être converti en JSON (JavaScript Object Notation)
  return { hello: 'world' }
})

// Déclarer la route /heroes - Cette route retournera la liste des avengers
const avengers = ["Iron man", "Captain america", "Spiderman"]

fastify.get('/heroes', () => {
	// return {
	// 	avengers // équivalent à avengers: avengers
	// }
	return avengers
})

fastify.get('/me', function () {
	return {
		prenom: "Fabio",
		nom: "Ginja",
		job: "developpeur",
	}
})


// Run the server!
const start = async () => {
  try {
    await fastify.listen(4000)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
