
/* On load, make Add Recipe section hidden. */
document.getElementById("addRecipeSection").style.display = "none";

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
	document.getElementById("searchByTime").setAttribute("href", link);
}

//When user clicks 'Add to Cart' in a recipe card, the recipe_id is pushed onto the orderArr array. 
//'Add to Cart' should not INSERT to Recipes_In_Order because order has not yet been placed
var orderArr = [];
function addRecipeToOrder(id){
	orderArr.push(id);
	console.log(orderArr);
}


document.getElementById("placeOrderButton").addEventListener("click", function(){
	orderArr.forEach(recipe => {
		
	});
});


