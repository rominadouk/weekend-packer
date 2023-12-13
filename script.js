//Variables
const locationTxt = document.getElementById('location-txt');
const listHeadingTxt = document.getElementById('list-header');
const listSection = document.getElementById('list-section');
const table = document.getElementById('table-container');
let forecasts = '';
let destination = {
    country: '',
    state: '',
    city: ''
};



//Friday Info
const fridayDate = document.getElementById('friday-date');
const fridayHigh = document.querySelector('#friday-card p');
const fridayLow = document.querySelector('#friday-card p:nth-child(2)');
const fridayIcon = document.getElementById('friday-icon');

//Saturday Info
const saturdayDate = document.getElementById('saturday-date');
const saturdayHigh = document.querySelector('#saturday-card p');
const saturdayLow = document.querySelector('#saturday-card p:nth-child(2)');
const saturdayIcon = document.getElementById('saturday-icon');

//Sunday Info
const sundayDate = document.getElementById('sunday-date');
const sundayHigh = document.querySelector('#sunday-card p');
const sundayLow = document.querySelector('#sunday-card p:nth-child(2)');
const sundayIcon = document.getElementById('sunday-icon');


//Toggle List
// const toggleList = () => {
//     //for class list property use contains,
//     if(listSection.classList.contains('hidden')) {
//         listSection.classList.remove('hidden')
//         listHeadingTxt.classList.remove('hidden')
        
//     } else {
//         listSection.classList.add('hidden')
//         listHeadingTxt.classList.add('hidden')
//     }
// };

//toggle class hidden and block for visibility

//to display items in the packing list it will be getItems()
//suggested list will be conditionally rendered based on forecast.
//If name to lowercase includes america, string will be united states of america, default to united states of America.

const handleDestinationInputChange = (e) => {
    //spread operator, copy objects contents  and dynamically set properties
    destination = {
        ...destination,
        [e.target.name]: e.target.value
    }
};

 const handleDestinationSubmit = async (e) => {
    e.preventDefault();
    //use asynchronous function to ping the backend, send as json data and wait for a response.
    //https://weekend-packer-backend-b1bfbc58a5f2.herokuapp.com/forecast
    try {
        const response = await fetch('https://weekend-packer-backend-b1bfbc58a5f2.herokuapp.com/forecast', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON. stringify(destination)
        })
        forecasts = await response.json();
        // console.log(forecasts)
        locationTxt.innerHTML = `${forecasts.location.name}, ${forecasts.location.region} `
        filterForecasts(forecasts)
    } catch (err) {
        console.log(err)
    }
 };

 //function uses the dates, turns it into a string, checks to see if its friday sat or sunday and manipulates DOM accordingly
const filterForecasts = (forecasts) => {
    let fridayForecast, saturdayForecast, sundayForecast;

    forecasts.forecast.forecastday.forEach((oneDay) => {
        // console.log(oneDay)
        const date = new Date(oneDay.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        if(formattedDate.toLowerCase().includes('friday')) {
            fridayForecast = oneDay
            // console.log(fridayForecast)
            fridayDate.innerHTML = `${formattedDate}`
            fridayHigh.innerHTML = `High: ${Math.round(oneDay.day.maxtemp_f)}`
            fridayLow.innerHTML = `Low: ${Math.round(oneDay.day.mintemp_f)}`

            fridayIcon.style.backgroundImage = `url('https:${oneDay.day.condition.icon}')`;
            fridayIcon.style.backgroundSize = 'contain';
            // console.log(oneDay.day.condition.icon);

        } else if (formattedDate.toLowerCase().includes('saturday')) {
            saturdayForecast = oneDay
            // console.log(saturdayForecast)
            saturdayDate.innerHTML = `${formattedDate}`
            saturdayHigh.innerHTML = `High: ${Math.round(oneDay.day.maxtemp_f)}`
            saturdayLow.innerHTML = `Low: ${Math.round(oneDay.day.mintemp_f)}`

            saturdayIcon.style.backgroundImage = `url('https:${oneDay.day.condition.icon}')`;
            saturdayIcon.style.backgroundSize = 'contain';
        } else if (formattedDate.toLowerCase().includes('sunday')) {
            sundayForecast = oneDay
            // console.log(sundayForecast)
            sundayDate.innerHTML = `${formattedDate}`
            sundayHigh.innerHTML = `High: ${Math.round(oneDay.day.maxtemp_f)}`
            sundayLow.innerHTML = `Low: ${Math.round(oneDay.day.mintemp_f)}`

            sundayIcon.style.backgroundImage = `url('https:${oneDay.day.condition.icon}')`;
            sundayIcon.style.backgroundSize = 'contain';
        }
    // unites states of america
    return { fridayForecast, saturdayForecast, sundayForecast };

    });
    generateSuggestions({fridayForecast, saturdayForecast, sundayForecast})
    //work with the returned forecast data here to conditionally render suggestions based on fridayForecast.condition.text

};


const generateSuggestions = (forecasts) => {
    const cloudySuggestions = [
        {
            name: 'jacket',
            type: 'clothing'
        },
        {
            name: 'light sunblock',
            type: 'misc.'
        },
        {
            name: 'hoodie',
            type: 'clothing'
        }

    ]

    const rainSuggestions = [
        {
            name: 'jacket with a hood',
            type: 'clothing'
        },
        {
            name: 'umbrella',
            type: 'misc.'
        },
        {
            name: 'hat',
            type: 'clothings'
        },
        {
            name: 'rainboots',
            type: 'clothings'
        },
        {
            name: 'gloves',
            type: 'clothings'
        },

    ];

    const sunnySuggestions = [
        {
            name: 'hat',
            type: 'clothing'
        },
        {
            name: 'sunblock',
            type: 'misc.'
        },
        {
            name: 'short sleeve',
            type: 'clothing'
        }

    ];

    // console.log(forecasts)
    //each forecast is a value of a larger object
    Object.values(forecasts).forEach((forecast) => {
        let suggestions = [];

            //check the conditions of the condition.txt, set suggestions based on condition
            if(forecast.day.condition.text.toLowerCase().includes('cloudy')) {
                suggestions = cloudySuggestions;
            } else if(forecast.day.condition.text.toLowerCase().includes('rainy')) {
                suggestions = rainSuggestions;
            } else if(forecast.day.condition.text.toLowerCase().includes('sunny')) {
                suggestions = sunnySuggestions;
            }
            //for each element in the suggestions that were in coditions, manpulate the dom
            suggestions.forEach((item) => {
                const row = document.createElement('div');
                row.classList.add('row');
                //name
                let nameColumn = document.createElement('div');
                nameColumn.classList.add('column');
                nameColumn.innerHTML = `${item.name}`;

                //type
                let typeColumn = document.createElement('div');
                typeColumn.classList.add('column');
                typeColumn.innerHTML = `${item.type}`;
                //appending
                row.appendChild(nameColumn);
                row.appendChild(typeColumn);
                table.append(row);
            });


    });
}


const getItems = async () => {
    try {
        const response  = await fetch('https://weekend-packer-backend-b1bfbc58a5f2.herokuapp.com/items')
        let allItems = await response.json() //parse JSON body
        return allItems
    } catch (err) {
        console.log(err)
    }
};

//call functions
getItems();

