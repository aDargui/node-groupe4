// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })
const { ObjectId } = require('mongodb')
const argon2 = require('argon2') //https://www.npmjs.com/package/argon2
const createError = require('http-errors') //https://www.npmjs.com/package/http-errors
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
// fastify.register(require('./connector'))
fastify.register(require('fastify-mongodb'), {
  // force to close the mongodb connection when app stopped
  // the default value is false
  forceClose: true,
  
  // url: 'mongodb://mongo/mydb'
  url: 'mongodb://localhost:27017/superheroes'
  // url: 'mongodb://localhost:27017/bdd-test'
})

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
fastify.get('/heroes', ()=>{
    return avengers //equivalent à avengers: avengers
})

// // /heroes/69 GET - Obtiens le héros ayant l'id 69
// fastify.get('/heroes/:heroesId', async (request, reply) => {
//   // console.log({
//   //   id: request.id,
//   //   params: request.params
//   // })
//   const heroesId = request.params.heroesId
//   const db = fastify.mongo.db
//   const collection = db.collection('heroes')
//   const result = await collection.findOne({
//     // id: "69"
//     id: heroesId
//   })
//   // return["name"]
//   // return result.name
//   return result
  
// })

// Recuperer l'ID de Mongodb
fastify.get('/heroes/:heroesId', async (request, reply) => {
  // console.log({
  //   id: request.id,
  //   params: request.params
  // })
  const { heroesId } = request.params
  const db = fastify.mongo.db
  const collection = db.collection('heroes')
  const result = await collection.findOne({
    // id: "69"
    _id: new ObjectId(heroesId)
  })
  // return["name"]
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
  // return result.name
  return result
  
})

// /heros/bio/id
// cette route devra retourner: nomDuHero connu sous le nom de vraiNom.
// je suis née à lieuDeNaissance. j'ai XX en intelligence, et YY en vitesse.
fastify.get('/heroes/bio/:heroesId', async (request, reply) => {
  const db = fastify.mongo.db
  const collection = db.collection('heroes')
     const { heroesId } = request.params
  const result = await collection.findOne({
    // id: "69"
    _id: new ObjectId(heroesId)
  })
  
 /** Version ES 6  NOUVEAU *******/
//  const {name, biography, powerstats: {intelligence, speed} } = result
 const {
   name,
   biography,
   powerstats: {intelligence, speed},
 } = result
  //Template literals : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
  // return  `${result.name} connu sous le nom de result.biography.full-name. je suis née à  j'ai ${result.powerstats.intelligence}, et ${result.powerstats.speed} en vitesse .`

  //result.biography.full-name ===> ${biography["full-name"]}
  //autre Methode pour éviter la repetition de result result ..

  // const {name, biography, powerstats} = result 
  // const{intelligence,speed}= powerstats
  // Ou pour change cette methode  ${powerstats.speed} à ${speed}


   
  return  `${name} connu sous le nom de ${biography["full-name"]}. je suis née à ${biography["place-of-birth"]} j'ai ${intelligence} en intelligence, et ${speed} en vitesse .`

  //***  Version ES5 (Vieux JS) ********/
  /** 
   * const name = result.name
  const fullName = result.biography["full-name"]
  const placeOfBirth = result.biography["place-of-birth"]
  const intelligence = result.powerstats.intelligence
  const speed = result.powerstats.speed

  return "Version ES5 : " + name + " connu sous le nom de " + fullName + ". je suis née à "+ placeOfBirth + ". J'ai " + intelligence + " en intelligence, et + " + speed + " en vitesse"
  */

  /**** fin Version ES5 */
})



// heroes POST Ajoute un nouvel héro
fastify.post('/heroes', async (request, reply) => {
  console.log(request.body)
  const db = fastify.mongo.db
  const collection = db.collection('heroes')

  // console.log(collection);
  // db.collection('inserts')
  // Insert a single document


  // collection.insertOne({
  //   name: request.body.name,
  //   powerstats: request.body.powerstats,
  // })
  const result = await collection.insertOne(request.body)
  return result


  // return null
  // reply.send(null)
  
})
// Methode DELETE ************ /////
fastify.delete('/heroes/:heroesId', async (request, replay) => {
  const collection = fastify.mongo.db.collection('heroes')
  const{heroesId} = request.params
  const result = await collection.findOneAndDelete({
    _id: new ObjectId(heroesId)
  })

  return result
})

// methode PATCH -- mettre à jour par ID
fastify.patch('/heroes/:id', async (request, replay) => {
  const collection = fastify.mongo.db.collection('heroes')
  const { id } = request.params
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: request.body },
    { returnDocument: 'after'},
    
  )
  return result
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

// Exercice :
// Une route qui me permette de creer un nouvel utilisateur (user) dans une collection users
//-email
//-password
//-Role (user/admin)
// Une route qui me permette de récupérer tout les utilisateurs
// Une route qui me permette de récupérer un utilisateur par son id
// Une route qui me permette de mettre à jour un utilisateur par son id
// Une route qui me permette de supprimer un utilisateur par son id





// fastify.register(require('fastify-mongodb'), {
//   forceClose: true,
//   url: 'mongodb://localhost:27017/bdd-test'
// })

//------ creer un nouvel utilisateur
fastify.post('/users', async (request, reply) => {
  
  try {
    const collection = fastify.mongo.db.collection('users')  
    const{ email, password, role } = request.body
  
    // collection.findOne({email: email})
    const userExist = await collection.findOne({ email })
    // if (userExist !== null){
    if (userExist){
      throw new Error("Cet email est déja pris")
      // return createError(409, "cet email est déjà pris")
    }

    if(password.length < 3) {
      // throw new Error ("Mot de passe trop court - au moins 3 caractères")
      return createError.NotAcceptable('Mot de passe trop court - au moins 3 caractères')
      //pour createError faut installer : npm install http-errors
    }

    // const db = fastify.mongo.db
    // const collection = db.collection('users')
  
    // const password = request.body.password
    // const { password } = request.body
    const hash = await argon2.hash(password)
    const newUser = {
      email: request.body.email,
      password: hash,
      role: request.body.role
    }
    const result = await collection.insertOne(newUser)
    // return result
    // return result.ops[0] 
    reply.code(201).send(result.ops[0]) 
  } catch (err) {
    console.error(err)
    // reply.code(409).send({
    //   error: true,
    //   message: err.message
    // })

    // return createError(409,err.message)
    return createError.Conflict(err.message)
  }
})

//------ 

fastify.get('/users', async (request, reply) => {
  const db = fastify.mongo.db
  const collection = db.collection('users')
  const result = await collection.find({}).toArray()
  //https://mongodb.github.io/node-mongodb-native/3.6/api/Cursor.html
  return result
})

// Faut d'abord installer : npm install jsonwebtoken
// https://www.npmjs.com/package/jsonwebtoken

fastify.post('/login', async (request,replay) =>{
  //Je récupère l'email et le password dans request,
  // Je cherche si un utiliseur possede cet email,
  // s'il existe, on vérifie que les password correspondent
  // Sinon, on génère une erreur

  const {email, password} = request.body
  const collection = fastify.mongo.db.collection('users')
  const userExists = await collection.findOne({email})

  if(!userExists){
    return createError(400, "Email et/ou mot de passe incorrect")
  }
  console.log(userExists.password)
  const match = await argon2.verify(userExists.password, password)
  if(!match){
    return createError(400, "Email et/ou mot de passe incorrect")
  }

  //Je sais que l'email et le mot de passe sont corrects, j'envoi un token au client (permettant d'ainsi l'authentifier)
  const token = fastify.jwt.sign({ id: userExists._id, role: userExists.role})
  return {token}
  // return null
})
//------- récupérer l'utilisateur par son id

fastify.get('/protected', async (request, reply) =>{
  //Si l'utilisateur ne m'envoie pas de token, je dois lui retourner une erreur
  // Sinon, je lui retourne un objet contenant la propriété message avec Bienvenue comme valeur
  const result = await request.jwtVerify()

  //-----  const result = await request.jwtVerify() remplace ce code :
  /** 
  const tokenString = request.headers.authorization // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZTZkMTU4NjdhZGI1M2NkY2JhY2FhYSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjI1NzUzOTQyfQ.bSuxO2z_-ZDXtFZ4bgvqucrkNqDML2e81rxrXXnxzKo
	const token = tokenString.split(" ")[1]
	const decoded = jwt.verify(token, "monsupersecretamoiestungangster")
	if (!decoded) {
		createError(400, "Mauvais token")
  }
  */
  //----
  console.log(result)
  return {message : `Bienvenu`}
 
})



// })
fastify.get('/users/:userId', async (request, reply) => {
  const { userId } = request.params
  const db = fastify.mongo.db
  const collection = db.collection('users')
  const result = await collection.findOne({
    _id: new ObjectId(userId)
  })
  return result
})

// ------ mettre à jour un utilisateur par son id
fastify.patch('/users/:id', async (request, replay) => {
  const collection = fastify.mongo.db.collection('users')
  const { id } = request.params
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: request.body },
    { returnDocument: 'after'},
  )
  // return result
  replay.code(200).send(result)
})

// ----- Supprimer un utilisateur par son ID
fastify.delete('/users/:id', async (request, replay) => {
  const collection = fastify.mongo.db.collection('users')
  const{id} = request.params
  const res = await collection.findOneAndDelete({
    _id: new ObjectId(id)
  })
  // return result
  replay.code(200).send(res)
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

const student = "Siham"
const age = 18
//dans un objet,si une clé et sa valeur portent le même nom, on pourra utiliser la forme raccourcie
const data ={
    //cle : valeur
    //student // est équivaut à écrire student : student
    student,
    age,
}

//Equivalent à

// const data2 ={
//     student = student,
//     age = age,
// }