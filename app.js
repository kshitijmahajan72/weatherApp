const yargs = require('yargs');
const axios = require('axios');
const argv = yargs.
        options({
            address:{
                demandOption:true,
                alias: 'a',
                describe: 'Address to be fetched for weather info',
                string : true
            }
        })
        .help()
        .alias('help','h')
        .argv;

var encodedAddress = encodeURIComponent(argv.address);
var geocodeUrl = `http://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;

axios.get(geocodeUrl).then((response)=>{
    if(response.data.status === 'ZERO_RESULTS'){
        throw new Error('Unable to find the address');
    }
    var lat = response.data.results[0].geometry.location.lat;
    var lng = response.data.results[0].geometry.location.lng;
    var weatherUrl =`https://api.darksky.net/forecast/58f331e8137ab9258257f7ba29e3e4af/${lat},${lng}?units=si`;
    console.log(response.data.results[0].formatted_address);
    return axios.get(weatherUrl);
}).then((response)=>{
    var temperature = response.data.currently.temperature;
    var apparentTemperature = response.data.currently.temperature;
    console.log(`hey there the temprature outside is ${temperature}.\n But it feels like ${apparentTemperature}!!`);
}).catch((e)=>{
    if(e.code === 'ENOTFOUND'){
        console.log('unable to connect to API servers');
    }
    else{
        console.log(e.message);
    }
});
