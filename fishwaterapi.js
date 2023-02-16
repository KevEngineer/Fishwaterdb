const express = require("express");
const axios = require("axios");
var cache = require('memory-cache');


const app = express();
const port = process.env.PORT || 8787;


//initialize redis client



async function fetchApiData(species) {
    const apiResponse = await axios.get(
        `https://www.fishwatch.gov/api/species/${species}`
    );
    console.log("Request sent to the API");
    // console.log(apiResponse.data)
    return apiResponse.data;
}


async function getSpeciesData(req, res) {
    const species = req.params.species;
    let results;
    let isCached = false;
    try {
        const cachedResult=cache.get('species')
        if(cachedResult){
            isCached=true
            results=cachedResult
        }
        results = await fetchApiData(species);
        if (results.length === 0) {
            throw "API returned an empty array";
        }
        cache.put('species',JSON.stringify(results),10000)
        



        res.send({
            fromCache: isCached,
            data: results,
        });
    } catch (error) {
        console.error(error);
        res.status(404).send("Data unavailable");
    }
}


app.get("/fish/:species", getSpeciesData);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});