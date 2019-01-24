var express = require("express");
var fs = require("fs");
var XMLHttpRequest = require('xhr2');
var app = express();
var xhr = new XMLHttpRequest();
getDatabase();
app.use(express.static(__dirname + "/public"));

app.get("/countries", function(req, res){
    var content = fs.readFileSync("cities.json", "utf8");
    var cities = JSON.parse(content);
    var countries = [];
    var i=0;
    for (key in cities){
      countries[i]=key;
      i++;
    }
    res.send(countries);
});

app.get("/cities/:country", function(req, res){
      
    var country = req.params.country; 
    var content = fs.readFileSync("cities.json", "utf8");
    var cities = JSON.parse(content);
    var citiesOfCountry = null;
    for (key in cities){
        if (key==country){
            citiesOfCountry = cities[key];
            break;
        }
      }
    if(citiesOfCountry){
        res.send(citiesOfCountry);
    }
    else{
        res.status(404).send();
    }
});

app.get("/info/:city", function(req, res){
    var city = req.params.city; 
    xhr.open('GET', 'http://api.geonames.org/wikipediaSearchJSON?q='+city+'&maxRows=10&username=tomas', true);
    xhr.send();
    xhr.onreadystatechange = function() {
      if (this.readyState != 4) return;
      var info = JSON.parse(this.responseText);
      if (info.geonames.length==0){
        res.send("information is unavaible");
      }
      else {
      res.send(""+info.geonames[0].summary);}
    }
    
      
});

app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
});

function getDatabase(){
xhr.open('GET', 'https://raw.githubusercontent.com/David-Haim/CountriesToCitiesJSON/master/countriesToCities.json', true);
xhr.send();
xhr.onreadystatechange = function() {
  if (this.readyState != 4) return;
  if (this.status != 200) {
    console.log("Загрузка базы данных не удалась");
    return;
  }
  console.log("Загрузка базы данных прошла успешно");
  fs.writeFile("cities.json", this.responseText, function(err){if(err)throw err;});
}
}
