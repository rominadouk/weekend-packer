//Variables
const locationTxt = document.getElementById('location-txt');
const suggestionButton = document.getElementById('suggestion-button');
const packingListButton = document.getElementById('packing-list-button');
const listHeadingTxt = document.getElementById('list-header-title');
const listSection = document.getElementById('list-section');
const suggestionTable = document.getElementById('suggestion-table-container');
const packinglistTable = document.getElementById('packing-list-table-container');
const addSection = document.getElementById('add-item-section');
const allListElements = document.getElementById('all-list-elements');
const allForecastElements = document.getElementById('all-forecast-elements');
//* selects all elements in heading
const allMainHeadingElements = document.querySelectorAll('#heading *');

let forecasts = '';
let destination = {
    country: '',
    state: '',
    city: ''
};
let newItem = {
    name: '',
    category: ''
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

 //function typing directly into object as input changes; utilize spread operator
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
    try {
        const response = await fetch('https://weekend-packer-backend-b1bfbc58a5f2.herokuapp.com/forecast', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(destination)
        })
        forecasts = await response.json();
        // console.log(forecasts)
        locationTxt.innerHTML = `${forecasts.location.name}, ${forecasts.location.region} `
        filterForecasts(forecasts)
    } catch (err) {
        console.log(err)
    }
 };

 //function typing directly into object as input changes
 const handleAddInputChange = (e) => {
    //spread operator, copy objects contents  and dynamically set properties
    newItem = {
        ...newItem,
        [e.target.name]: e.target.value
    }
};

//when submit is clicked in add itemo bject to database
 const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('https://weekend-packer-backend-b1bfbc58a5f2.herokuapp.com/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(newItem)
        })
        document.getElementById('name').value = '';
        document.getElementById('category').value = '';
        //re-render packing list without refresh
        showPackingList();

    } catch(err) {
        console.log(err)
    }
 };

 //handle delete item

 const handleDeleteItem = async (event, itemId) => {
    if(event) {
        event.preventDefault()
    }

    try {
        const response = await fetch(`https://weekend-packer-backend-b1bfbc58a5f2.herokuapp.com/items/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        //re-render packing list without refresh
        showPackingList();

    } catch(err) {
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
    generateSuggestions( {fridayForecast, saturdayForecast, sundayForecast} )
    //work with the returned forecast data here to conditionally render suggestions based on fridayForecast.condition.text

};


const generateSuggestions = (forecasts) => {
        //have to clear items from table otherwise it will duplicate!
        suggestionTable.innerHTML = '';
    const cloudySuggestions = [
        {
            name: 'jacket',
            category: 'clothing'
        },
        {
            name: 'light sunblock',
            category: 'misc.'
        },
        {
            name: 'hoodie',
            category: 'clothing'
        }

    ]

    const rainSuggestions = [
        {
            name: 'jacket with a hood',
            category: 'clothing'
        },
        {
            name: 'umbrella',
            category: 'misc.'
        },
        {
            name: 'hat',
            category: 'clothing'
        },
        {
            name: 'rainboots',
            category: 'clothing'
        },
        {
            name: 'gloves',
            category: 'clothing'
        },

    ];

    const sunnySuggestions = [
        {
            name: 'hat',
            category: 'clothing'
        },
        {
            name: 'sunblock',
            category: 'misc.'
        },
        {
            name: 'short sleeve',
            category: 'clothing'
        }

    ];

    console.log(forecasts)
    //each forecast is a value of a larger object
    Object.values(forecasts).forEach((forecast) => {
        let suggestions = []

        //check the conditions of the condition.txt, set suggestions based on condition
        if(forecast.day.condition.text.toLowerCase().includes('cloudy')) {
            suggestions = cloudySuggestions;
            console.log(suggestions)
        } else if(forecast.day.condition.text.toLowerCase().includes('rain')) {
            suggestions = rainSuggestions;
            console.log(suggestions)
        } else if(forecast.day.condition.text.toLowerCase().includes('sunny')) {
            suggestions = sunnySuggestions;
            console.log(suggestions)
        }
        //for each element in the suggestions that were in coditions, manpulate the dom
        suggestions.forEach((suggestion) => {

            const row = document.createElement('div');
            row.classList.add('row');
            //name
            let nameColumn = document.createElement('div');
            nameColumn.classList.add('column');
            nameColumn.innerHTML = `${suggestion.name}`;

            //type
            let typeColumn = document.createElement('div');
            typeColumn.classList.add('column');
            typeColumn.innerHTML = `${suggestion.category}`;
            //appending
            row.appendChild(nameColumn);
            row.appendChild(typeColumn);
            suggestionTable.append(row);
        });
    });

    //anything you want to appear when data renders make it appear here, remove hidden.
    allListElements.classList.remove('hidden');
    allForecastElements.classList.remove('hidden');
    allMainHeadingElements.forEach((element) => {
        element.classList.remove('text-center')
        element.classList.add('desktop-txt-margin-left')
    });
    document.querySelector('#heading > :nth-child(3)').classList.add('hidden');
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



//VISIBILITY FUNCTIONS 

//SHOW PACKING LIST
const showPackingList = async (event) => {
    if(event) {
        event.preventDefault();
    }

    //have to clear items from table otherwise it will duplicate!
    packinglistTable.innerHTML = '';
    //Datatable header creation for packing list
    let header = document.createElement('div');
    header.classList.add('header')

    let nameColumn = document.createElement('div');
    const nameTxt = document.createTextNode('Name')
    nameColumn.appendChild(nameTxt);
    nameColumn.classList.add('column');

    let categoryColumn = document.createElement('div');
    categoryColumn.classList.add('column');
    const columnTxt = document.createTextNode('Category')
    categoryColumn.appendChild(columnTxt);

    let deleteColumn = document.createElement('div');
    deleteColumn.classList.add('column');
    const deleteTxt = document.createTextNode('Action')
    deleteColumn.appendChild(deleteTxt);

    //append everything to header
    header.appendChild(nameColumn);
    header.appendChild(categoryColumn);
    header.appendChild(deleteColumn);
    packinglistTable.appendChild(header);

    try {
        const allItems = await getItems(); // Get items
        console.log(allItems);

        allItems.forEach((item) => {
            const row = document.createElement('div');
            row.classList.add('row');

            //name
            let nameColumn = document.createElement('div');
            nameColumn.classList.add('column');
            nameColumn.innerHTML = item.name;

            //type
            let typeColumn = document.createElement('div');
            typeColumn.classList.add('column');
            typeColumn.innerHTML = item.category;

            //action column for delete
            let deleteColumn = document.createElement('div');
            deleteColumn.classList.add('column');
            //append a delete button to the delete column div
            let deleteButton = document.createElement('button');
            deleteButton.innerHTML = 'Delete Item';
            //callback function, when delete is clicked call handle delete item.
            deleteButton.addEventListener('click', (event) => handleDeleteItem(event, item._id));
            deleteColumn.appendChild(deleteButton);

            //appending
            row.appendChild(nameColumn);
            row.appendChild(typeColumn);
            row.append(deleteColumn)
            packinglistTable.appendChild(row);
        });
    } catch (err) {
        console.log(err)
    }
    //only run this is there is a button event, to avoid refreshing entire page
    if(event) {
        toggleLists();
    }

};

//show list container when forecasts is present, data is successfully pulled


//hide suggestions
const toggleLists = () => {
    if(!suggestionTable.classList.contains('hidden')) {
        listHeadingTxt.innerHTML = 'Packing List';
        suggestionTable.classList.add('hidden');
        packinglistTable.classList.remove('hidden');
        addSection.classList.remove('hidden')

        //hide packing list button, show suggestion button
        packingListButton.classList.add('hidden')
        suggestionButton.classList.remove('hidden');
    } else {
        listHeadingTxt.innerHTML = 'Suggestion List';
        suggestionTable.classList.remove('hidden');
        packinglistTable.classList.add('hidden');
        addSection.classList.add('hidden');
        
        //hide suggestion button, show packing-list button
        suggestionButton.classList.add('hidden');
        packingListButton.classList.remove('hidden');
    }
};

