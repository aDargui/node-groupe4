const { ObjectId } = require('mongodb') 
const argon2 = require('argon2')

async function routes(fastify, options) {

fastify.post('/login', async (request, reply) => {
	//Action qu'on va faire: je récupère l'email et le password dans la requête (request), 
	// Je cherche si un utilisateur possède cet émail,
	//S'il existe:
	// - On vérifie que les password correspondent
	// - sinon, on génère une erreur

	const {
		email,
		password
	} = request.body
	const collection = fastify.mongo.db.collection('users')

	const userExists = await collection.findOne({
		email
	})

	if (!userExists) {
		return createError(400, "Email et/ou mot de passe incorrect")
	}
	// console.log(userExists.password)
	const match = await argon2.verify(userExists.password, password)

	if (!match) {
		return createError(400, "Email et/ou mot de passe incorrect")
	}

	// je sais que l'émail et le mot de passe sont correctes, j'envoi un token au client
	//  (permettant d'ainsi l'authentification)
	// "const token" permet de générer un nouveau token
	const token = fastify.jwt.sign({
		id: userExists._id,
		role: userExists.role
	})

	return {
		token
	}
})

fastify.get('/protected', async (request, reply) => {
	// Si l'utilisateur ne m'envoie pas de token, je dois lui retourner une erreur
	// Sinon, je lui retourne un objet contenant la propriété message avec Bienvenue comme valeur
	const result = await request.jwtVerify()
	// const tokenString = request.headers.authorization // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZTZkMTU4NjdhZGI1M2NkY2JhY2FhYSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjI1NzUzOTQyfQ.bSuxO2z_-ZDXtFZ4bgvqucrkNqDML2e81rxrXXnxzKo
	// 	const token = tokenString.split(" ")[1]
	// 	const decoded = jwt.verify(token, "monsupersecretamoiestungangster")
	// 	if (!decoded) {
	// 		createError(400, "Mauvais token")
	return {
		message: "Bienvenue"
	}
})
}
module.exports = routes