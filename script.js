//Variables
const locationTxt = document.getElementById('location-txt');
const listSection = document.getElementById('list-section');
let destination = {
    country: '',
    state: '',
    city: ''
};


//toggle classes hidden and block for visibility

//to display items in the packing list it will be getItems()
//suggested list will be conditionally rendered based on forecast.
//If name to lowercase includes america, string will be united states of america, default to united states of America.

const handleDestinationInputChange = (e) => {
    //spread operator, copy objects contents  and dynamically set properties
    destination = {
        ...destination,
        [e.target.name]: e.target.value,

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
        const forecasts = await response.json();
        console.log(forecasts)
    } catch (err){
        console.log(err)
    }
 };


const getItems = async () => {
    try {
        const response  = await fetch('https://weekend-packer-backend-b1bfbc58a5f2.herokuapp.com/items')
        let allItems = await response.json() //parse JSON body
        return allItems
    } catch (err) {
        console.log(err)
    }
}

getItems();

