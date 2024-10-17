const express = require("express");
const app = express();
const https = require("https");

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(__dirname+ "/public"));

app.engine("ejs", require("ejs").renderFile);
app.set("view engine", "ejs");

app.route("/")
.get((req, res)=>{
    const url = `https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`;
    https.get(url, (response)=>{
        var data = "";
        response.on("data", (chunk)=>{
            data += chunk;
    }).on("end", ()=>{
        var pokedex = JSON.parse(data);
        var pokemons = pokedex.results;
        info = []
        pokemons.forEach((pokemon)=>{
            try{
                const urlPokemon = pokemon.url;
                var data2 = "";
                https.get(urlPokemon, (response2)=>{
                    response2.on("data", (chunk2)=>{
                        data2 += chunk2;
                    }).on("end", ()=>{
                        var poke = JSON.parse(data2);
                        
                    })
                })
            }catch(error){
    
            }
        })
        });
    });
});

app.post("/search", (req, res)=>{
    var pokemonName = req.body.name;
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
    
});

app.listen(3000, ()=>{
    console.log("Listening to port 3000");
})