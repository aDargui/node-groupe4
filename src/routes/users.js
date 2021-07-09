const argon2 = require('argon2') //https://www.npmjs.com/package/argon2
const createError = require('http-errors') //https://www.npmjs.com/package/http-errors
const { ObjectId } = require('mongodb')

async function routes (fastify, options) {
    // Exercice :
    // Une route qui me permette de creer un nouvel utilisateur (user) dans une collection users
    //-email
    //-password
    //-Role (user/admin)
    // Une route qui me permette de récupérer tout les utilisateurs
    // Une route qui me permette de récupérer un utilisateur par son id
    // Une route qui me permette de mettre à jour un utilisateur par son id
    // Une route qui me permette de supprimer un utilisateur par son id

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
  
  //------ récupérer tout les utilisateurs
  fastify.get('/users', async (request, reply) => {
    const db = fastify.mongo.db
    const collection = db.collection('users')
    const result = await collection.find({}).toArray()
    //https://mongodb.github.io/node-mongodb-native/3.6/api/Cursor.html
    return result
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
    

}
  
  module.exports = routes