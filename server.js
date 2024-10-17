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

                var pokemonPromises = pokemons.map(async (pokemon) => {
                    return new Promise(async(resolve, reject) => {
                        try {
                            const urlPokemon = pokemon.url;
                            var data2 = "";
                            var b = https.get(urlPokemon, (response2) => {
                                response2.on("data", (chunk2) => {
                                    data2 += chunk2;
                                }).on("end", () => {
                                    var poke = JSON.parse(data2);
                                    var name = poke.name;
                                    var sprite = poke.sprites.front_default;
                                    const pokemonInfo = {
                                        name: name,
                                        sprite: sprite
                                    };
                                    info.push(pokemonInfo);
                                    resolve(); 
                                });
                            }).on("error", (error) => reject(error)); 
                        } catch (error) {
                            reject(error);
                        }
                    });
                });
                await Promise.all(pokemonPromises);
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