var currentUser;
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        currentUser = db.collection("users").doc(user.uid);   //global
        console.log(currentUser);

        // the following functions are always called when someone is logged in
        read_display_Quote();
        insertName();
        populateCardsDynamically();
    } else {
        // No user is signed in.
        console.log("No user is signed in");
        window.location.href = "login.html";
    }
});

//----------------------------------------------------------
// This is a function that gets called everytime the page loads
// to display a quote of the day.  At the moment, it only displays
// the "tuesday" quote.  It can be enhanced to display a different
// one dependingon which day of the week it is!
//----------------------------------------------------------
function read_display_Quote(){
    //console.log("inside the function")

    //get into the right collection
    db.collection("quotes").doc("tuesday")
    .onSnapshot(function(tuesdayDoc) {
        //console.log(tuesdayDoc.data());
        document.getElementById("quote-goes-here").innerHTML=tuesdayDoc.data().quote;
    })
}

//---------------------------------------------------------------------------
// This is a function that gets called everytime the page loads.
// It is meant to get the name of the user who is logged in, and insert it 
// on the page for a warm welcome. 
//---------------------------------------------------------------------------
function insertName() {
    currentUser.get().then(userDoc => {
        //get the user name
        var user_Name = userDoc.data().name;
        console.log(user_Name);
        $("#name-goes-here").text(user_Name); //jquery
        // document.getElementByID("name-goes-here").innetText=user_Name;
    })
}

//--------------------------------------------------------------------------
// This is a function that we call only ONE time, to populate the database.
// It can be invoked one-time by typing "writeHikes();" at the inspector console.
// "Hikes" collection with a few hard-coded documents.
// Instead of hard-coding it, you can also read from csv, or json file.
//--------------------------------------------------------------------------
function writeHikes() {
    //define a variable for the collection you want to create in Firestore to populate data
    var hikesRef = db.collection("Hikes");

    hikesRef.add({
        id: "BBY01",
        name: "Burnaby Lake Park Trail", //replace with your own city?
        city: "Burnaby",
        province: "BC",
        level: "easy",
        length: "10 km",
        length_time: "2h 33mm"
    });
    hikesRef.add({
        id: "AM01",
        name: "Buntzen Lake Trail", //replace with your own city?
        city: "Anmore",
        province: "BC",
        level: "moderate",
        length: "10.5 km",
        length_time: "3h 17mm"
    });
    hikesRef.add({
        id: "NV01",
        name: "Mount Seymoure Trail", //replace with your own city?
        city: "North Vancouver",
        province: "BC",
        level: "hard",
        length: "8.2 km",
        length_time: "3h 20m"
    });
}

//---------------------------------------------------------------------
// This is a function that is called when everytime the page loads
// to read from the Hikes collection, go through each card,
// and dynamically creates a bootstrap card to display each hike.
// You can change the card style by using a different template. 
//---------------------------------------------------------------------
function populateCardsDynamically() {
    let hikeCardTemplate = document.getElementById("hikeCardTemplate");
    let hikeCardGroup = document.getElementById("hikeCardGroup");
    
    db.collection("Hikes").get()
        .then(allHikes => {
            allHikes.forEach(doc => {
                var hikeName = doc.data().name; //gets the name field
                var hikeID = doc.data().id; //gets the unique ID field
                var hikeLength = doc.data().length; //gets the length field
                let testHikeCard = hikeCardTemplate.content.cloneNode(true);

                testHikeCard.querySelector('.card-title').innerHTML = hikeName;
                testHikeCard.querySelector('.card-length').innerHTML = hikeLength;
                testHikeCard.querySelector('a').onclick = () => setHikeData(hikeID);
                
                testHikeCard.querySelector('i').id = 'save-' + hikeID;
                testHikeCard.querySelector('i').onclick = () => saveBookmark(hikeID);
                testHikeCard.querySelector('img').src = `./images/${hikeID}.jpg`;
                testHikeCard.querySelector('.read-more').href = "eachHike.html?hikeName="+hikeName +"&id=" + hikeID;
                
                hikeCardGroup.appendChild(testHikeCard);
            })

        })
}

//--------------------------------------------------------------
// This function saves the current hikeID into the localStorage
//--------------------------------------------------------------
function setHikeData(id){
    localStorage.setItem ('hikeID', id);
}

//-----------------------------------------------------------------------------
// This function is called whenever the user clicks on the "bookmark" icon.
// It adds the hike to the "bookmarks" array
// Then it will change the bookmark icon from the hollow to the solid version. 
//-----------------------------------------------------------------------------
function saveBookmark(hikeID) {
    currentUser.set({
            bookmarks: firebase.firestore.FieldValue.arrayUnion(hikeID)
        }, {
            merge: true
        })
        .then(function () {
            console.log("bookmark has been saved for: " + currentUser);
            var iconID = 'save-' + hikeID;
            //console.log(iconID);
            document.getElementById(iconID).innerText = 'bookmark';
        });
}