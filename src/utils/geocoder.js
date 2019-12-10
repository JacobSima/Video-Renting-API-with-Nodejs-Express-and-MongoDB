const NodeGeocoder = require('node-geocoder')
const options = {
   provider:'mapquest',
   // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: process.env.GEO_LOCATION_KEY, // for Mapquest, OpenCage, Google Premier
  formatter: null     // 'gpx', 'string', ...
}

const geocoder =  NodeGeocoder(options)
module.exports = geocoder