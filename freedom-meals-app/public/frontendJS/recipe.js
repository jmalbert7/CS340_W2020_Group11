/* On load, make Add Recipe section hidden. */
document.getElementById("addRecipeSection").style.display = "none";
var jsId = document.cookie.match(/JSESSIONID=[^;]+/);
console.log(jsId);

/* Make Add Recipe section appear after "Add Recipe" button is clicked. */
document.getElementById("adminAddRecipeButton").addEventListener("click", function(appear)
{	
	document.getElementById("addRecipeSection").style.display = "block";
	appear.preventDefault();
});

//This function handles creating the request string for the Search recipes feature by getting 
//the user-entered time variable from the form, creating the link string, and finally
//setting the href of the Search button anchor equal to the link created.
document.getElementById("searchByTime").addEventListener("click", searchLinks);
function searchLinks(){
	var timeSelected = document.getElementById("time").value;
	var link = "/recipes/" + timeSelected;
	console.log('link' + link);
	document.getElementById("searchByTime").setAttribute("href", link);
}


//Function to call correct route to add a recipe into a user's cart. To avoid SQL duplication errors
//the user cannot add 2 of the same recipe to their cart, so after the request returns successfully
//the recipe tile is updated to that the user cannot add that same recipe to their cart
function addRecipeToCartFunc(data, form){
	console.log(form);
	alert("Recipe has been added to cart!");
	var req = new XMLHttpRequest();
	console.log("sent data" + data);
	var sdata = {"hiddenRecipeId" : data};
	console.log("sdata" + sdata);
	console.log(JSON.stringify(sdata));
	req.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			console.log('success?');
			var formId = 'form' + data;
			console.log('formID = ' + formId);
			var cartId = 'addRecipeToCart' + data;
			console.log('cartID = ' + cartId);
			document.getElementById(formId).setAttribute('onsubmit', null);
			document.getElementById(formId).setAttribute('method', null);
			document.getElementById(formId).setAttribute('action', null);
			document.getElementById(cartId).setAttribute('value', 'In Cart!');
			document.getElementById(cartId).setAttribute('type', null);
		}
	};
	req.open('POST', '/recipes', true);
	//req.body.hiddenRecipeId = JSON.parse(data);
	req.setRequestHeader('Content-Type', 'application/json');
	
	req.send(JSON.stringify(sdata));
	event.preventDefault();
}





