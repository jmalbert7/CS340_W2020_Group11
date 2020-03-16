/* Front-end JavaScript code for the Orders HTML page. */

var jsId = document.cookie.match(/JSESSIONID=[^;]+/);

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
	var sdata = {"hiddenRecipeId" : recipe_id, "method":"remove"};
	req.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
            location.reload();
        }
	};
	req.open('POST', '/orders/remove', true);
	req.setRequestHeader('Content-Type', 'application/json');
	
	req.send(JSON.stringify(sdata));
	event.preventDefault();
}