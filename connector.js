const fastifyPlugin = require('fastify-plugin')

async function dbConnector (fastify, options) {
    //Connexion à la BDD
    fastify.register(require('fastify-mongodb'), {
        // force to close the mongodb connection when app stopped
        // the default value is false
        forceClose: true,
        // url: 'mongodb://mongo/mydb'
        url: 'mongodb://localhost:27017/superheroes'
      })
}

// Wrapping a plugin function with fastify-plugin exposes the decorators    
// and hooks, declared inside the plugin to the parent scope.
module.exports = fastifyPlugin(dbConnector)