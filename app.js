const weatherIcons = {
    "Rain": "wi wi-day-rain",
    "Clouds": "wi wi-day-cloudy",
    "Clear": "wi wi-day-sunny",
    "Snow": "wi wi-day-snow",
    "Mist": "wi wi-day-fog",
    "Drizzle": "wi wi-day-sleet",
}

function capitalize(str){
    return str[0].toUpperCase() + str.slice(1);
}

async function main(withIp = true){
    let ville;

    if (withIp) {
        // On récupère l'adresse IP de l'utilisateur grâce à l'API ipify.org,
        const ip = await fetch('https://api.ipify.org?format=json')
            .then(resultat => resultat.json())
            .then(json => json.ip)
    
        // pour retrouver sa ville de connexion grâce à l'API ipsatck.com,
        ville = await fetch(`http://api.ipstack.com/${ip}?access_key=13d6aa2601f46509be09d76eb59a55ce`)
            .then(resultat => resultat.json())
            .then(json => json.city)
    }else{
        ville = document.querySelector('#ville').textContent;
    }

    //et récupérer les informations météos grâce à l'API openweathermap.org !
    const meteo = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${ville}&APPID=b7f13582854c2cf55297dfdbd7b8a665&lang=fr&units=metric`)
        .then(resultat => resultat.json())
        .then(json => json)

    // const previsionsMeteo = await fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${ville}&APPID=b7f13582854c2cf55297dfdbd7b8a665&lang=fr&units=metric`)
    //     .then(resultat => resultat.json())
    //     .then(json => json)
        
    // console.log(previsionsMeteo);

    // const demain = new Date(previsionsMeteo.list[0].dt*1000);
    // console.log(demain.getDate() + "/" + (demain.getMonth() + 1) + "/" + demain.getFullYear() + " à " + demain.getHours() + "h00");
    
    displayWeatherInfos(meteo)
}

const aujourdhui = new Date();

function displayWeatherInfos(data){
    const name = data.name;
    const temperature = data.main.temp;
    const conditions = data.weather[0].main;
    const description = data.weather[0].description;

    document.querySelector('#ville').textContent = name;
    document.querySelector('#temperature').textContent = Math.round(temperature);
    document.querySelector('#conditions').textContent = capitalize(description);
    document.querySelector('#date-du-jour').textContent = "le " + aujourdhui.getDate() + "/" + (aujourdhui.getMonth() + 1) + "/" + aujourdhui.getFullYear() 
        + " à " + aujourdhui.getHours() + "h" + aujourdhui.getMinutes();
    document.querySelector('i.wi').className = weatherIcons[conditions];

    document.body.className = conditions.toLowerCase();
}

const ville = document.querySelector('#ville');

ville.addEventListener('click', () => {
    ville.contentEditable = true;
})

ville.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
        e.preventDefault();
        ville.contentEditable = false;
        main(false);
    }
})

main()