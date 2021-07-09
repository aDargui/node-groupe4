//https://www.fastify.io/docs/latest/Getting-Started/#install
async function routes (fastify, options) {

// Déclarer la route / heroes - Cette route retourenera la liste des heros
// heroes GET - obtiens la liste des héros
    //------ récupérer tout les heroes
fastify.get('/heroes', async (request, reply) => {
        const db = fastify.mongo.db
        const collection = db.collection('heroes')
        const result = await collection.find({}).toArray()
        //https://mongodb.github.io/node-mongodb-native/3.6/api/Cursor.html
        return result
    })

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


    
}
  module.exports = routes