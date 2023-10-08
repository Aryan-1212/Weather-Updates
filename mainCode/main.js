get_lat_lon = async (lat_lon) => {
  try {
    const responce = await fetch(lat_lon);
    const data = await responce.json();
    const lat = await data['features'][0]['properties']['lat'];
    const lon = await data['features'][0]['properties']['lon'];
    console.log(lon +'  '+ lat);
    const weather = `http://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`;
    return weather;
  } catch (error) {
    console.log("Can't fetch cordinates: " + error);
    return null;
  }
}

get_weather = async (lat_lon) => {

  const weatherUrl = await get_lat_lon(lat_lon);
  if(weatherUrl !== null){
  try {
    const responce = await fetch(weatherUrl);
    var data = await responce.json();
    console.log(data)
    const lengthOfTime = data['dataseries']['length'];

    for(i=0;i<4;i++){
      const weather_update = data['dataseries'][i]['weather'];
      const temprature = data['dataseries'][i]['temp2m'] + '°';
      const humidity = data['dataseries'][i]['rh2m'];
      const wind_speed = data['dataseries'][i]['wind10m']['speed'];
      const wind_direction = data['dataseries'][i]['wind10m']['direction'];

      const weatherTimePoint = data['dataseries'][i]['timepoint'];
      const time = getWeatherTime(weatherTimePoint);

      if (weather_update.includes('day')) {
        weather_day = weather_update.replace('day', '');
      }
      else {
        weather_day = weather_update.replace('night', '');
      }


      weather_image = document.getElementsByClassName("weather-image")[i];

      imagePath = "../images/" + weather_day + ".png";
      weather_image.style.backgroundImage = `url(${imagePath})`;

      document.getElementsByClassName('weather')[i].innerHTML = weather_update;
      document.getElementsByClassName('temprature')[i].innerHTML = temprature;
      document.getElementsByClassName('humidity')[i].innerHTML = humidity;
      document.getElementsByClassName('wind_speed')[i].innerHTML = wind_speed;
      document.getElementsByClassName('wind_direction')[i].innerHTML = wind_direction;
      document.getElementsByClassName('weather-time')[i].innerHTML = time;
    }      
      document.getElementById("previousSection3").style.display = "none";
      document.getElementById("section3").style.display = "block";

  }
 catch (error){
    console.log(error);
}
}
else{
  console.log("URL not Found");
}
}

function getWeather(){

  document.getElementById("previousSection3").style.display = 'block';
  document.getElementById("previousSection3").scrollIntoView({behavior: "smooth"});
  document.getElementById("section3").style.display = "none";

  const state = document.getElementById("state").value;
  const city = document.getElementById("city").value;
  
  const cityState = `Weather Updates of ${city}, ${state}`;
  document.getElementById("cityStateDetails").innerHTML = cityState;

  var lat_lon = `https://api.geoapify.com/v1/geocode/search?text=${city},${state}&apiKey=202263fda10b4bac95e6585466ed2585`;
  get_weather(lat_lon);
}

function getWeatherTime(weatherTime) {
  const today = new Date();
  today.setUTCHours(today.getUTCHours()+weatherTime)

  var hours = today.getUTCHours();
  const minutes = today.getUTCMinutes();

  const amOrPm = hours>=12 ? 'PM':'AM';
  hours = (hours%12) || 12;

  today.setUTCHours(today.getUTCHours()-3)
  const previousHours = today.getUTCHours();

  var previousAmOrPm = previousHours>=12 ? 'PM':'AM';
  PreviousHours = (previousHours%12) || 12;

  const time = PreviousHours+":"+minutes+' '+previousAmOrPm +' - '+hours+":"+minutes+' '+amOrPm;
  return time;
}
