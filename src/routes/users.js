const { ObjectId } = require('mongodb') 
const argon2 = require('argon2')

async function routes(fastify, options) {

// Exercice:
// Je souhaite:
// Une route qui me permette de créer un nouvel utilisateur (user) dans une collection users
// 		- email
// 		- password
// 		- role (user/admin)
// Une route qui me permette de récupérer tout les utilisateurs
// Une route qui me permette de récupérer un utilisateur par son id
// Une route qui me permette de mettre à jour un utilisateur par son id
// Une route qui me permette de supprimer un utilisateur par son id

// CREATE_POST
fastify.post('/users', async (request, reply) => {
	try {
		const collection = fastify.mongo.db.collection('users')
		const {
			email,
			password,
			role
		} = request.body



		// On récupère l'adresse email dans la request, puis on va chercher dans la bdd si cette derniere existe
		// Si elle existe, on genere une erreur indiquant que l'email existe deja
		// Si non, on ajoute l'utilisateur à notre bdd

		const userExist = await collection.findOne({
			email
		})
		//	email: email <=> email
		console.log(userExist)
		if (userExist) //ou if (userExist !== null)
		{
			// STOP
			// "createError": plutôt pour les erreurs client
			return createError(409, "Cet email est déjà pris")
			// throw new Error ("Cet email est déjà pris")
		}
		// const password = request.body.password
		// hash: on "hash" le mot de passe sans être en capacité de retrouver le mot de passe d'origine

		if (password.length < 3) {
			// throw new Error ("Mot de passe trop court - au moins 3 caractères")
			return createError.NotAcceptable("Mot de passe trop court - au moins 3 caractères")
		}

		const hash = await argon2.hash(password)
		const newUser = {
			email: request.body.email,
			password: hash,
			role: request.body.role
		}
		const result = await collection.insertOne(newUser)
		//"collection.insertOne" permet de créer un vouvel utilisateur
		//"await" permet d'attendre le résultat d'une promesse

		//return result.ops[0]
		reply.code(201).send(result.ops[0])
		// le "catch": plutôt pour les erreurs du au serveur et non du au client
	} catch (err) {
		console.error(err)
		// reply.code(409).send({
		// 	error:true,
		// 	message: err.message
		// })
		return createError(409, err.message)
		return createError.Conflict(err.message)
	}
})

// READ_GET
fastify.get('/users', async (request, reply) => {
	const collection = fastify.mongo.db.collection('users')
	//correspond à la collection users dans la BD mango.db
	const result = await collection.find({}).toArray()
	return result
})


fastify.get('/users/:id', async (request, reply) => {
	const collection = fastify.mongo.db.collection('users')
	//correspond à la collection users dans la BD mango.db
	// const id = request.params.id
	const {
		id
	} = request.params
	const result = await collection.findOne({
		_id: new ObjectId(id)
	})
	// "findOne" est mon filtre de recherce
	// reply.code(200).send(result)
	return result
})

// UPDATE_PATCH
fastify.patch('/users/:id', async (request, reply) => {
	const collection = fastify.mongo.db.collection('users')
	const {
		id
	} = request.params
	const result = await collection.findOneAndUpdate({
			_id: new ObjectId(id)
		}, {
			$set: request.body
		}, {
			returnDocument: 'after'
		}
		// "returnDocument" a 2 valeurs: sa valeur par défaut est "before". "after", nous retourne le document après sa mise à jour
	)
	reply.code(200).send(result)
	// return result
})

// DELETE
fastify.delete('/users/:id', async (request, reply) => {
	const collection = fastify.mongo.db.collection('users')
	const {
		id
	} = request.params
	const res = await collection.findOneAndDelete({
		_id: new ObjectId(id)
	})
	// return res
	reply.code(200).send(res)
})
}
module.exports = routes
