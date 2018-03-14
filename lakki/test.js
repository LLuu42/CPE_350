var accessToken = "ya29.Glt5BcDHCXdVgOnpLC1gvQk9OpgPyMECf0-u98-CU1-MfsERkuaTBrstE7v8OO_vmiy8meTp9P-ESqbcDfXVlOeJT8bqajj3bvQsoLg4iODGmMr6s-fZhuyvw_zC"
var Gmail = require('node-gmail-api')
var gmail = new Gmail(accessToken)
s = gmail.messages('label:inbox', {max:10})

s.on('data', function(d) {
    console.log(d.snippet)
})
