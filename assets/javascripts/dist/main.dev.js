"use strict";

// @doc https://webdesign.tutsplus.com/tutorials/build-a-simple-weather-app-with-vanilla-javascript--cms-33893
var weatherForm = document.getElementById("weatherForm");
var input = document.querySelector(".header-section input");
var cities = document.querySelector(".ajax-section .cities");
var message = document.querySelector(".msg");
var input_city = document.getElementById("city");
var apiKey = "4d8fb5b93d4af21d66a2948710284366";
weatherForm.addEventListener("submit", function (e) {
  e.preventDefault();
  var inputVal = input.value;
  var listItems = cities.querySelectorAll(".ajax-section .city");
  var listItemsArray = Array.from(listItems);

  if (listItemsArray.length > 0) {
    var filteredArray = listItemsArray.filter(function (el) {
      var content = "";

      if (inputVal.includes(",")) {
        if (inputVal.split(",")[1].length > 2) {
          inputVal = inputVal.split(",")[0];
          content = el.querySelector(".city-name span").textContent.toLowerCase();
        } else {
          content = el.querySelector(".city-name").dataset.name.toLowerCase();
        }
      } else {
        content = el.querySelector(".city-name span").textContent.toLowerCase();
      }

      return content == inputVal.toLowerCase();
    });

    if (filteredArray.length > 0) {
      message.textContent = "Hai gi\xE0 cercato questa citt\xE0 \"".concat(filteredArray[0].querySelector(".city-name span").textContent, "\"");
      weatherForm.reset();
      input.focus();
      return;
    }
  }

  var url = "https://api.openweathermap.org/data/2.5/weather?q=".concat(inputVal, "&lang=it&appid=").concat(apiKey, "&units=metric");
  fetch(url).then(function (response) {
    return response.json();
  }).then(function (data) {
    var main = data.main,
        name = data.name,
        sys = data.sys,
        weather = data.weather,
        id = data.id;
    console.log(data);
    var svgIcon = weather[0]["icon"];
    var icon = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/".concat(svgIcon, ".svg");
    var description = weather[0]["description"];
    var li = document.createElement("li");
    li.classList.add("city");
    li.dataset.identity = id;
    var cardTemplate = "\n                <h2 class=\"city-name\">\n                    <span>".concat(name, "</span>\n                    <sup class=\"country\">").concat(sys.country, "</sup>\n                </h2>\n                <div class=\"city-temp\">\n                    <span>").concat(Math.round(main.temp), "</span>\n                    <sup>\xB0C</sup>\n                </div>\n                <figure class=\"city-description\">\n                    <img class=\"icon\" src=\"").concat(icon, "\" alt=\"").concat(description, "\">\n                    <figcaption>").concat(description, "</figcaption>\n                </figure>\n            ");
    console.log("".concat(description));
    li.innerHTML = cardTemplate;
    cities.appendChild(li);
    setTimeout(function () {
      window.scrollTo(0, document.body.scrollHeight);
    }, 200);
  })["catch"](function () {
    //message.textContent = 'Città inesistente, ritenta sarai più fortunato';
    alert("Errore, valore inserito non valido");
    input.classList.add('error');
  });
  input.classList.remove('error');
  input.textContent = '';
  weatherForm.reset();
  return;
});
/**
 * 
 * TODO
 * 
 * Permettere all'utente di scegliere se unità di misura in metrico/imperiale
 *      select
 *      chiedendo la lingua impostata sul browser
 *      NB se cambia unità di misura, aggiornare anche le varie particelle di testo es. "C"
 * 
 * Permettere di ottenere il meteo della posizione geografica in cui si trova l'utente
 * 
 * Controllare che non vengano richiesti più volte gli stessi dati
 *  
 * LO STILE, liberi di impostare lo stile che desiderato
 * 
 * Reset di tutti gli elementi aggiunti nella DOM
 * 
 * Se possibile scrivere in linea i file SVG
 * 
 */