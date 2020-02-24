/* Redirect user to Orders page after "Place Your Order" button is clicked. */
document.getElementById("placeOrderButton").addEventListener("click", function(appear)
{
	location.href="order.html";
	appear.preventDefault();
});