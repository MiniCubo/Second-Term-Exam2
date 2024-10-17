const express = require("express");
const app = express();
const https = require("https");

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(__dirname+ "/public"));

app.engine("ejs", require("ejs").renderFile);
app.set("view engine", "ejs");

var info = []

var initialized = false;
app.use("/", (req, res, next)=>{
    if(!initialized){
        const url = `https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`;
    https.get(url, (response) => {
        var data = "";
        response.on("data", (chunk) => {
            data += chunk;
        }).on("end", async () => {
            var pokedex = JSON.parse(data);
            var pokemons = pokedex.results;

            for (let pokemon of pokemons) {
                try {
                    const urlPokemon = pokemon.url;
                    var data2 = await fetchPokemonData(urlPokemon);
                    var poke = JSON.parse(data2);
                    var name = poke.name;
                    var sprite = poke.sprites.front_default;
                    const pokemonInfo = {
                        name: name,
                        sprite: sprite
                    };
                    info.push(pokemonInfo); 
                } catch (error) {
                    console.error(`error: ${error}`);
                }
            }
            initialized = true;
            next();
        });
    }).on("error", (error) => {
        console.error(`error: ${error}`);
    });
    }
    else{
        next();
    }
});

function fetchPokemonData(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            var data = "";
            response.on("data", (chunk) => {
                data += chunk;
            }).on("end", () => {
                resolve(data);  
            }).on("error", (error) => {
                reject(error);  
            });
        });
    });
}

app.route("/")
.get((req, res)=>{
    res.send(info)
});

app.post("/search", (req, res)=>{
    var pokemonName = req.body.name;
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
    
});

app.listen(3000, ()=>{
    console.log("Listening to port 3000");
})