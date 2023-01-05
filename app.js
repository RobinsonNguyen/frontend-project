// setInterval(changeBackground, 3000){

// }

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
            getPhotoByID(data.data.id)
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

function getQueryPhoto(query){
    fetch(`https://api.artic.edu/api/v1/artworks/search?q=${query}`)
        .then((response) => response.json())
        .then((data) => {
            if(data.data.length > 0){
                // for(let i = 0; i < data.data.length; i++){}
                var pickOne = Math.floor(Math.random() * data.data.length)
                getPhotoByID(data.data[pickOne].id)
                console.log("successful photo query")
                // console.log(data)
            }else{
                getRandomPhoto()
            }
        })
}

function getPhotoByID(id){
    fetch(`https://api.artic.edu/api/v1/artworks/${id}`)
        .then((response) => response.json())
        .then((data) => {
            var removing = document.getElementById("photo");
            const photo = document.createElement("img");
            photo.id = "photo";
            photo.setAttribute('src', `https://www.artic.edu/iiif/2/${data.data.image_id}/full/843,/0/default.jpg`)
            removing.replaceWith(photo)

            removing = document.getElementById("art-title");
            const title = document.createElement("p");
            title.id = "art-title"
            title.textContent = `${data.data.title} by ${data.data.artist_display}`;
            removing.replaceWith(title)
            console.log(data)
        })
}
wallPaperPaths = []
// fetch("https://wallhaven.cc/api/v1/w/48629j?apikey=5cbRi11kd0vHgb2tXUBMpSOob7IK22Eh", {
    fetch("http://127.0.0.1:3000/wallpaper", {
//   body: JSON.stringify({
//     model: "default"
//   }),
//   headers: {
//     "Content-Type": "application/json"
//   },
//   method: "POST"
})
    .then((response) => response.json())
    .then((data) => {
        for(let i = 0; i < 24; i++){
            wallPaperPaths.push(data.data[i].path)
        }
        // var body = document.querySelector('body')
        // body.style.backgroundImage = `url('${data.data[0].path}')`
        // console.log(data)
    })