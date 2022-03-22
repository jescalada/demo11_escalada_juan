function showDetails() {
    // create a URL object
    let params = new URL(window.location.href);
    let id = params.searchParams.get("id");               //parse "id"
    let hikeName = params.searchParams.get("hikeName");   //parse "collection"

    let message = "Hike Name is: " + hikeName;           //build message to display
    message += " &nbsp | Document id is:  " + id;    
    document.getElementById("HikeName").innerHTML = hikeName;  
    document.getElementById("details-go-here").innerHTML = message; 
}
showDetails();