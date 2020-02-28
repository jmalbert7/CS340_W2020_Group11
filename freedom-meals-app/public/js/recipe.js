
/* On load, make Review Order Section and Order Confirmation Table disappear. */
//document.getElementById("reviewOrderSection").style.display = "none";
//document.getElementById("orderConfirmationTable").style.display = "none";

/* Make Review Order Section appear after "Checkout" button is clicked. */
/*document.getElementById("checkoutButton").addEventListener("click", function(appear)
{	
	document.getElementById("reviewOrderSection").style.display = "block";
	appear.preventDefault();
});*/

/* Make Order Confirmation Table appear after "Place Order" button is clicked. */
/*document.getElementById("placeOrderButton").addEventListener("click", function(appear)
{	
	document.getElementById("orderConfirmationTable").style.display = "block";
	appear.preventDefault();
});*/

//This function handles creating the request string for the Search recipes feature by getting 
//the user-entered time variable from the form, creating the link string, and finally
//setting the href of the Search button anchor equal to the link created.
document.getElementById("searchByTime").addEventListener("click", links);
function links(){
	var timeSelected = document.getElementById("time").value;
	var link = "/" + timeSelected;
	document.getElementById("searchByTime").setAttribute("href", link);
}

//When user clicks 'Add to Cart' in a recipe card, the recipe_id is pushed onto the orderArr array. 
//'Add to Cart' should not INSERT to Recipes_In_Order because order has not yet been placed
var orderArr = [];
function addRecipeToOrder(id){
	orderArr.push(id);
	console.log(orderArr);
}

