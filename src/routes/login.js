const argon2 = require('argon2') 
//https://www.npmjs.com/package/argon2 //faut installer npm install argon2
const createError = require('http-errors') //https://www.npmjs.com/package/http-errors


async function routes (fastify, options) {
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

}
  
module.exports = routes