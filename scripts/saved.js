var currentUser;
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        currentUser = db.collection("users").doc(user.uid);   //global
        console.log(currentUser);

        // the following functions are always called when someone is logged in
        getBookmarks(user);
    } else {
        // No user is signed in.
        console.log("No user is signed in");
        window.location.href = "login.html";
    }
});

function getBookmarks(user) {
    db.collection("users").doc(user.uid).get()
        .then(userDoc => {
            var bookmarks = userDoc.data().bookmarks;
            console.log(bookmarks);
            let CardTemplate = document.getElementById("CardTemplate");
            bookmarks.forEach(thisHikeID => {
                console.log(thisHikeID);
                db.collection("Hikes").where("id", "==", thisHikeID).get().then(snap => {
                    size = snap.size;
                    queryData = snap.docs;
                    if (size == 1) {
                        var doc = queryData[0].data();
                        var hikeName = doc.name; //gets the name field
                        var hikeID = doc.id; //gets the unique ID field
                        var hikeLength = doc.length; //gets the length field
                        let newCard = CardTemplate.content.cloneNode(true);
                        newCard.querySelector('.card-title').innerHTML = hikeName;
                        newCard.querySelector('.card-length').innerHTML = hikeLength;
                        newCard.querySelector('a').onclick = () => setHikeData(hikeID);
                        newCard.querySelector('img').src = `./images/${hikeID}.jpg`;
                        hikeCardGroup.appendChild(newCard);
                    } else {
                        console.log(`Query has ${size} data`)
                    }
                })
            });
        })
}