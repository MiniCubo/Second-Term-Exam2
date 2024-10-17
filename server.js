const exp = require("constants");
const express = require("express");
const app = express();
const https = require("https");

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(__dirname+ "/public"));

app.engine("ejs", require("ejs").renderFile);
app.set("view engine", "ejs");

var info = []
var index = 0;
const tamPerPage = 20;

app.use("/pokedex/:index", (req, res, next)=>{
    index = req.params.index;
    info = [];
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${tamPerPage}&offset=${index*tamPerPage}`;
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
);

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

function buildPokemonData(data) {
    return new Promise((resolve) => {
        var poke = JSON.parse(data);
        var name = poke.name;
        var id = poke.id;
        var height = poke.height/10;
        var experience = poke.base_experience;
        var sprite = poke.sprites.front_default;
        var type = poke.types;
        var weight = poke.weight;
        var stats = poke.stats;
        const pokemonInfo = {
            name: name,
            sprite: sprite,
            id: id,
            h: height,
            xp: experience,
            types: type,
            w: weight,
            stats: stats
        };
        resolve(pokemonInfo);
        });
}

app.route("/")
.get((req, res)=>{
    res.redirect("/pokedex/0");
});

app.get("/pokedex/:index", (req,res)=>{
    res.render("index2", {info, tamPerPage});
    //res.render("index", {});
});

var pokemon = "";

app.post("/search", async (req, res)=>{
    var pokemonName = req.body.name;
    var pokemonID = req.body.id;
    var placeholder = "";
    if (pokemonName) placeholder = pokemonName
    else placeholder = pokemonID
    const url = `https://pokeapi.co/api/v2/pokemon/${placeholder}`;
    var data = await fetchPokemonData(url);
    if(data == "Not Found"){
        res.redirect("/error");
    }
    else{
        pokemon = await buildPokemonData(data);
        res.redirect("/pokemon");
    }
});

app.get("/pn/:id", async (req, res)=>{
    var pokemonID = req.params.id;
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonID}`;
    var data = await fetchPokemonData(url);
    pokemon = await buildPokemonData(data);
    res.redirect("/pokemon");
});

app.get("/pokemon", (req, res)=>{
    res.render("pokemon", {pokemon:pokemon});
});

app.get("/error", (req, res)=>{
    res.render("error", {});
})

app.listen(3000, ()=>{
    console.log("Listening to port 3000");
})