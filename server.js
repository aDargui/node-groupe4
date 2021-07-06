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

// heroes GET - on obtient la liste des héros
fastify.get('/heroes', () => {
	// return {
	// 	avengers // équivalent à avengers: avengers
	// }
	return avengers
})

// /heroes POST - Ajouter un nouvel héro
fastify.post ('/heroes', (request, reply) => {
	console.log(request.body)
	return null
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
