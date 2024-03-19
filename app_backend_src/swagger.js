const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ShareUPEC',
      description: "API endpoints for a file link share space services documented on swagger",
      contact: {
        name: "William Mesnil",
        email: "william.mesnil@etu.u-pec.fr",
        url: "https://github.com/MesnilWilliam/ShareUpec"
      },
      version: '1.0.0',
    },
    servers: [
      {
        url: "http://localhost:4000/",
        description: "Local server"
      },
      {
        url: "NULL",
        description: "Live server"
      },
    ]
  },
  // looks for configuration in specified directories
  apis: ['./routes/*.js'],
}
const swaggerSpec = swaggerJsdoc(options)
function swaggerDocs(app, port) {
  // Swagger Page
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  // Documentation in JSON format
  app.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })
}

module.exports = swaggerDocs;
