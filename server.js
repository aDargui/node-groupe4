// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })
// Connexion à la BDD

fastify.register(require('fastify-mongodb') ,{ 
	// force la fermeture de la connexion mongodb lorsque l'application s'arrête 
	// la valeur par défaut est false 
	forceClose : true ,
	url: 'mongodb://localhost:27017/superheroes' 
  } )
// users
// user.role = user
// user.role = admin
// heroes
// conversations


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
	// pour se connecter à ma bdd
	const collection = fastify.mongo.db.collection("heroes")
	console.log (collection)
	collection.insertOne(request.body)
	return null
	// reply.send(null)
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
