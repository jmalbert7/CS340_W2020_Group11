
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

//When user clicks 'Add to Cart' in a recipe card, the recipe_id is pushed onto the orderArr array. 
//'Add to Cart' should not INSERT to Recipes_In_Order because order has not yet been placed
var orderArr = [];
function addRecipeToOrder(id){
	orderArr.push(id);
	console.log(orderArr);
}