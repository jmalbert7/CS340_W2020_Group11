/* Front-end JavaScript code for the Orders HTML page. */

var jsId = document.cookie.match(/JSESSIONID=[^;]+/);
console.log(jsId);

/* Hide button on orders that have been cancelled by the user. */
var listOfButtons = document.getElementsByTagName("button");
// console.log(listOfButtons);
for (var i = 0; i < listOfButtons.length; i++)
{
	if(listOfButtons[i].dataset.status == "CANCELED")
	{
		listOfButtons[i].style.display = "none";
	}
}

function removeRecipeFromCart(recipe_id){
    var req = new XMLHttpRequest();
    console.log('REMOVE');
	console.log("sent data" + recipe_id);
	var sdata = {"hiddenRecipeId" : recipe_id, "method":"remove"};
	console.log("sdata" + sdata);
	console.log(JSON.stringify(sdata));
	req.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
            console.log('success?');
            location.reload();
        }
	};
	req.open('POST', '/orders/remove', true);
	req.setRequestHeader('Content-Type', 'application/json');
	
	req.send(JSON.stringify(sdata));
	event.preventDefault();
}