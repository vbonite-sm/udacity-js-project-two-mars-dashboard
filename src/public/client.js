let store = Immutable.Map({
    user: Immutable.Map({ name: 'Student' }),
    apod: '',
    rovers: Immutable.List(['curiosity', 'opportunity', 'spirit', 'perseverance']),
    currentRover: 'none'
})

const root = document.getElementById('root')

const updateStore = (state, newState) => {
    store = state.merge(newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}

const App = (state) => {
    
    if (state.get('currentRover') === 'none')  {
        return (`
            <header>
                <div class="navbar-flex">
                    <div class="logo-flex" onclick="homeButton(event)">
                        <a href="#"><img src="./assets/images/icons/rover.png" alt="Rover icon"></a>
                        <p>Mars Dashboard</p>
                    </div>
                </div>
            </header>
            
            <div class="container"">
                <div class="wrapper-buttons">
                    <h1 class="main-title">Explore the Mars Rovers</h1>		
                    <div class="button-container">${renderList(state)}</div>
                </div>
            </div>
            <footer>
            <footer>
        `)
    } else {
        return (`
        <header>
            <div class="navbar-flex">
                <div class="logo-flex" onclick="homeButton(event)">
                   <a href="#"><img src="./assets/images/icons/rover.png" alt="Rover icon"></a>
                    <p>Mars Dashboard</p>
                 </div>
                 <ul class="items-navbar">${renderListItems(state)}<ul>
            </div>
        </header>
            <div class="container-info">
                <h1 class="title">The <span>${state.get('currentRover').latest_photos[0].rover.name}</span> Rover</h1>	
                <div class ="rover-data">
                <p class="title"><span>Launch date:</span> ${state.get('currentRover').latest_photos[0].rover.launch_date}</p>
                <p class="title"><span>Landing date:</span> ${state.get('currentRover').latest_photos[0].rover.landing_date}</p>
                <p class="title"><span>Mission status:</span> ${state.get('currentRover').latest_photos[0].rover.status}</p>
                </div>
                <div class="gallery">${imageGallery(state)}</div>
            </div>
            <footer>
            <footer>
        `)
    }
}

window.addEventListener('load', () => {
    render(root, store)
})

// COMPONENTS 

const renderList = (state) => {
    return `<ul class="flex">${renderButtonState(state)}</ul>`
}

const renderButtonState = (state) => {
    return  Array.from(state.get('rovers')).map( item => 
        `<li id=${item} class="flex-item btn" onclick="clickButton(event)">
            <a ref="#"  class=""  >${capitalize(`${item}`)}</a>
        </li>`
        ).join("")
}

const renderListItems = (state) => {
    return  Array.from(state.get('rovers')).map( item => 
        `<li id=${item} class="" onclick="clickButton(event)">
            <a ref="#"  class=""  >${capitalize(`${item}`)}</a>
        </li>`
        ).join("")
}

const imageGallery = (state) => {
    const img = state.get('currentRover');

    return Array.from(img.latest_photos).map( item => 
        `<div class="wrapper">
            <img src="${item.img_src}" />
            <div class="wrapper-info">
                <p><span>Image date:</span> ${item.earth_date}</p>
                
            </div>
         </div>`
        ).slice(0, 50).join("")
}

// HANDLE CLICK 

const clickButton = event => {
    const { id } = event.currentTarget; 
    if (Array.from(store.get('rovers')).includes(id)) {
        getRoverImages(id, store);
    }
    else {
        console.log(`Rover not available`) 
    } 
} 


const homeButton = event => {
    const newState = store.set('currentRover', 'none');
    updateStore(store, newState);
}

// UTILITY 

const capitalize = word => {
    return `${word[0].toUpperCase()}${word.slice(1)}`
}


// API CALLS

const getRoverImages = async (roverName, state) => {
    let { currentRover } = state
    const response = await fetch(`http://localhost:3000/rovers/${roverName}`)
    currentRover = await response.json() 
    const newState = store.set('currentRover', currentRover);
    updateStore(store, newState)
    return currentRover
}
