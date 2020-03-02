/* Insert code here for profile.html page. */
/* On load, make Edit Customer Information hidden. */
document.getElementById("editCustomerForm").style.display = "none";

/* Make Edit Customer Form appear after "Edit My Information" button is clicked. */
document.getElementById("editCustomerButton").addEventListener("click", function(appear)
{
	document.getElementById("editCustomerForm").style.display = "block";
	appear.preventDefault();
});

/* Make Edit Customer Form hidden after "Update My Information" button is clicked
and scroll to top. */
document.getElementById("updateCustomerButton").addEventListener("click", function(appear)
{	
	/* UPDATE record in Customers table. Once this is successfully completed,
	proceed to the following code. */
	
	document.getElementById("editCustomerForm").style.display = "none";
	window.scrollTo(0,0);
	appear.preventDefault();
});