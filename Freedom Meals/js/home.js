/* On load, make Add Recipe section hidden. */
document.getElementById("addRecipeSection").style.display = "none";

/* Make Add Recipe section appear after "Add Recipe" button is clicked. */
document.getElementById("adminAddRecipeButton").addEventListener("click", function(appear)
{	
	document.getElementById("addRecipeSection").style.display = "block";
	appear.preventDefault();
});