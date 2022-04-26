// @doc https://webdesign.tutsplus.com/tutorials/build-a-simple-weather-app-with-vanilla-javascript--cms-33893

const weatherForm = document.getElementById("weatherForm");
const input = document.querySelector(".header-section input");
const cities = document.querySelector(".ajax-section .cities");
const message = document.querySelector(".msg");
const input_city = document.getElementById("city");

const apiKey = "4d8fb5b93d4af21d66a2948710284366";



weatherForm.addEventListener("submit", e => {
    
	e.preventDefault();

    let inputVal = input.value;

    const listItems = cities.querySelectorAll(".ajax-section .city");
    const listItemsArray = Array.from(listItems);

    if (listItemsArray.length > 0) {
        
        const filteredArray = listItemsArray.filter(el => {
            let content = "";

            if (inputVal.includes(",")) {
                
                if (inputVal.split(",")[1].length > 2) {
                    inputVal = inputVal.split(",")[0];
                    content = el
                    .querySelector(".city-name span")
                    .textContent.toLowerCase();
                } else {
                    content = el.querySelector(".city-name").dataset.name.toLowerCase();
                }

            } else {
                content = el.querySelector(".city-name span").textContent.toLowerCase();
            }
            return content == inputVal.toLowerCase();
        });

        if (filteredArray.length > 0) {
            
            message.textContent = `Hai già cercato questa città "${
                filteredArray[0].querySelector(".city-name span").textContent
            }"`;

            
            weatherForm.reset();
            input.focus();
            return;
        }
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&lang=it&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {

            const { main, name, sys, weather, id } = data;

            console.log(data);

            const svgIcon = weather[0]["icon"];
            const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${svgIcon}.svg`;
            const description = weather[0]["description"];
            const li = document.createElement("li");
            li.classList.add("city");

            li.dataset.identity = id;

            const cardTemplate = `
                <h2 class="city-name">
                    <span>${name}</span>
                    <sup class="country">${sys.country}</sup>
                </h2>
                <div class="city-temp">
                    <span>${Math.round(main.temp)}</span>
                    <sup>°C</sup>
                </div>
                <figure class="city-description">
                    <img class="icon" src="${icon}" alt="${description}">
                    <figcaption>${description}</figcaption>
                </figure>
            `;

            console.log(`${description}`);

            li.innerHTML = cardTemplate;
            cities.appendChild(li);


            
            setTimeout(() => {  window.scrollTo(0, document.body.scrollHeight); }, 200);
        
            
            
        })
        .catch(() => {
            //message.textContent = 'Città inesistente, ritenta sarai più fortunato';
			alert("Errore, valore inserito non valido");
            input.classList.add('error');
        })



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