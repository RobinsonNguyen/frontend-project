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
}
function getRandomPhoto(){
    var randomNum = Math.floor(Math.random() * 10000)
    findValidPicture(randomNum)
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