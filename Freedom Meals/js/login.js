/* On load, make Sign Up section hidden. */
document.getElementById("signupSection").style.display = "none";

/* Make account-related sections section appear after "Log In" button is clicked,
hide the Log In and Sign Up sections, and scroll to top. */
document.getElementById("loginButton").addEventListener("click", function(appear)
{	
	// Declare and initialize exist in database variable to false.
	var exist = false;
	
	/* Verify that record exists in database. IF doesn't exist, display error message.
	ELSE, proceed to the following code. */
	
	exist = true;
	
	if (exist == false)
	{
		alert("Error! The login credentials you entered do not exist in our database. Please try again.");
	}
	
	else
	{
		// Redirect user to home page.
		location.href="index.html";
	}
	
	appear.preventDefault();
});

/* Make Sign Up form appear after "Sign Up Here" button is clicked and
hide the Log In and Sign Up sections. */
document.getElementById("signuphereButton").addEventListener("click", function(appear)
{	
	document.getElementById("signupSection").style.display = "block";
	document.getElementById("loginSection").style.display = "none";
	document.getElementById("signuphereSection").style.display = "none";
	document.getElementById("adminSection").style.display = "none";
	appear.preventDefault();
});

/* Make account-related sections appear after "Sign Up" button is clicked and
hide the Log In and Sign Up sections and scroll to top. */
document.getElementById("signupButton").addEventListener("click", function(appear)
{	
	/* INSERT record in Customers table. Once this is successfully completed,
	proceed to the following code. */
	
	// Redirect user to home page.
	location.href="index.html";
	
	appear.preventDefault();
});