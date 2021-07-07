const { default: fastifyMongodb } = require('fastify-mongodb')

// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })
const{ObjectID}= require("mongodb")
// ou const mongodb = require("mongodb")


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

// heroes GET - Obtiens la liste des héros
fastify.get('/heroes', async () => {
	const collection = fastify.mongo.db.collection("heroes")
	const result = await collection.find({}).toArray()
	// "toArray()" permet d'obtenir un tableau de résultat
	return result
})

// /heroes/69 GET - Obtiens le héros ayant l'id 69
fastify.get('/heroes/:heroesId', async (request, reply) => {

//Documentation: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
const {heroesId} = request.params
//  ou const heroesId = request.params.heroesId
//"request.params"=> ".params" est un objet
const collection = fastify.mongo.db.collection("hereos")
const result = await collection.findOne({
	_id: new ObjectID(heroesId)
})
return result
// return result.name // ou return result ["name"]
})

fastify.get('/heroes/bio/:heroesId', async (request, reply) => {
	const collection = fastify.mongo.db.collection('heroes')
	const { heroesId } = request.params
	const result = await collection.findOne({
		_id: new ObjectId(heroesId)
	})

	// // Version ES6
	const { 
		name, 
		biography,
		powerstats: { intelligence, speed },
	 } = result
	
	// Template literals: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
	return `${name} connu sous le nom de ${biography["full-name"]}.
	Je suis née à ${biography["place-of-birth"]}.
	J'ai ${intelligence} en intelligence, et ${speed} en vitesse.`

	// ou return `${name} connu sous le nom de result.biography.full-name. Je suis née à result.biography.place-of-birth.
	//  J'ai ${result.powerstats.intelligence} en intelligence, et ${result.powerstats.speed} en vitesse.`

	// Version ESS (vieux JS)
	// const name = result.name ou const name = result["name"]
	// const fullName = result.biography["full-name"]
	// const placeOfBirth = result.biography["full-name"]
	// const intelligence = result.powerstats.intelligence["full-name"]
	// const speed = result.powerstats.speed["full-name"]

	// return name + "connu sous le nom de " + fullName + ". Je suis née à " + placeOfBirth + ". j'ai " + intelligence, et " + speed + " en vitesse.

})

// /heroes POST - Ajouter un nouvel héro
fastify.post ('/heroes', async (request, reply) => {
	console.log(request.body)
	// pour se connecter à ma bdd
const collection = fastify.mongo.db.collection("heroes")
	console.log (collection)
const result = await collection.insertOne(request.body)
	return result.ops[0]
	// reply.send(null)
})

fastify.delete('/heroes/:heroesId', async (request, reply)=> {
	const collection = fastify.mongo.db.collection('heroes')
	const { heroesId } = request.params
	const result = await collection.findOneAndDelete({
	  _id: new ObjectId(heroesId)
	})
	return result
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

