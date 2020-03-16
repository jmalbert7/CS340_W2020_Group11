/* Front-end JavaScript code for the Recipe Ratings HTML page. */

var jsId = document.cookie.match(/JSESSIONID=[^;]+/);
// console.log(jsId);

/* On load, make Rating Form and recipe rating data attributes hidden. */
document.getElementById("ratingForm").style.display = "none";
document.getElementById("recipe_id").style.display = "none";
document.getElementById("rating_type").style.display = "none";
// console.log(document.getElementsByTagName("button"));

function appear(clickedButton, type)
{
	// Declare local variables used inside this function.
	var recipeId = clickedButton.getAttribute("id");
	// console.log(recipeId);
	console.log(clickedButton);
	var recipeName = clickedButton.parentNode.parentNode.firstElementChild.textContent;
	// console.log(recipeName);
	var ratingType;
	
	if (type == 1)
	{
		ratingType = "EXISTING";
	}
	
	if (type == 2)
	{
		ratingType = "NEW";
	}
	
	// Make rating form visible once either the "Add" or "Edit" button is clicked.
	document.getElementById("ratingForm").style.display = "block";
	
	// Direct user to the rating form once button is clicked.
	location.href = "#ratingForm";
	
	document.getElementById("ratingPrompt").textContent = "What would you like to rate " + 
		recipeName + "?";
	
	// Update rating data attributes.	
	document.getElementById("rating_type").value = ratingType;
	document.getElementById("recipe_id").value = recipeId;
};