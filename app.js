wallPaperPaths = []
    fetch("http://127.0.0.1:3000/wallpaper")
    .then((response) => response.json())
    .then((data) => {
        for(let i = 0; i < 24; i++){
            wallPaperPaths.push(data.data[i].path)
        }
    })
var artGallery = document.getElementById("art-gallery");
// var flkty = new Flickity(artGallery)
var isFlickity = true;
function findValidPicture(randomNum){
    fetch(`https://api.artic.edu/api/v1/artworks/${randomNum}`)
        .then((response) => {
            // console.log("Checking for valid picture...")
            if(response.ok){
                console.log(response.status)
                return response.json()
            }
            throw new Error("not valid")
        })
        .then((data) => {
            console.log(data)
            // getPhotoByID(data.data.id,flkty)
            // document.getElementById("art-gallery").replaceChildren()
            // addImgElements(data)
            var artGallery = document.getElementById("art-gallery");
            var artPanel = document.createElement('div')
            artPanel.id = "art-panel";
            const photo = document.createElement("img");
            photo.id = "photo";
            photo.setAttribute('src', `https://www.artic.edu/iiif/2/${data.data.image_id}/full/843,/0/default.jpg`)
            // photo.setAttribute('width', '400px')
            artPanel.append(photo)

            // removing = document.getElementById("art-title");
            var textBackground = document.createElement('div')
            textBackground.className = "text-background";
            const title = document.createElement("p");
            title.id = "art-title"
            title.textContent = `${data.data.title} by ${data.data.artist_display}`;
            textBackground.append(title)
            artPanel.append(textBackground)
            // removing.replaceWith(title)
            // console.log(data)
            artGallery.append(artPanel)
            
        }).catch((error) =>{
            // console.log(error)
            randomNum = Math.floor(Math.random() * 10000)
            findValidPicture(randomNum)
        })
}

function getRandomAdvice(){
    fetch('https://api.adviceslip.com/advice')
    .then((response) => response.json())
    .then((data) => {
        var removing = document.getElementById("advice");
        const p = document.createElement("p");
        p.id = "advice";
        p.textContent = data.slip.advice
        removing.replaceWith(p)
        // console.log(data.slip.advice)
    })
}

function randomize(){
    var artGallery = document.getElementById("art-gallery");
    artGallery.replaceChildren()
    getRandomPhoto()
    getRandomAdvice()
    getRandomBackground()
}
function getRandomPhoto(){
    var randomNum = Math.floor(Math.random() * 10000)
    findValidPicture(randomNum)
}
function getRandomBackground(){
    var randomNum = Math.floor(Math.random() * 24)
    const body = document.querySelector('body')
    body.style.backgroundImage = `url('${wallPaperPaths[randomNum]}')`
    body.style.backgroundSize = 'cover'
}
function query(){
    const temp = document.getElementById('query')
    if(temp.value !== ""){
        getQueryAdvice(temp.value);
        getQueryPhoto(temp.value);
        getRandomBackground()
    } 
}

function getQueryAdvice(query){
    fetch(`https://api.adviceslip.com/advice/search/${query}`)
    .then((response) => response.json())
    .then((data) => {
        if(data.message){
            getRandomAdvice()
        }else{
            var pickOne = Math.floor(Math.random() * data.slips.length)
            var removing = document.getElementById("advice");
            const p = document.createElement("p");
            p.id = "advice";
            p.textContent = data.slips[pickOne].advice
            removing.replaceWith(p)
            console.log("successful advice query")
            // console.log(data)
        }
    })
}
// var flkty = new Flickity(artGallery);
function getQueryPhoto(query,flkty){
    fetch(`https://api.artic.edu/api/v1/artworks/search?q=${query}`)
        .then((response) => response.json())
        .then((data) => {
            var flkty = Flickity.data(artGallery)
            if(flkty !== undefined){
                flkty.destroy()
            }
            if(data.data.length > 0){
                artGallery.replaceChildren()
                flkty = new Flickity(artGallery)
                for(let i = 0; i < data.data.length; i++){
                    getPhotoByID(data.data[i].id,flkty)
                }
            }else{
                artGallery.replaceChildren()
                getRandomPhoto()
            }
        })
}

function getPhotoByID(id,flkty){
    fetch(`https://api.artic.edu/api/v1/artworks/${id}`)
        .then((response) => response.json())
        .then((data) => {
            addImgElements(data,flkty)
        })
}
async function addImgElements(data,flkty){
    var artGallery = document.getElementById("art-gallery");
    var artPanel = document.createElement('div')
    artPanel.id = "art-panel";
    const photo = document.createElement("img");
    photo.id = "photo";
    photo.setAttribute('src', `https://www.artic.edu/iiif/2/${data.data.image_id}/full/843,/0/default.jpg`)
    artPanel.append(photo)

    var textBackground = document.createElement('div')
    textBackground.className = "text-background";
    const title = document.createElement("p");
    title.id = "art-title"
    title.textContent = `${data.data.title} by ${data.data.artist_display}`;
    textBackground.append(title)
    artPanel.append(textBackground)

    artGallery.append(artPanel)
    // console.log(artPanel)
    flkty.append(artPanel)
}
