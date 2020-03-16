/* Front-end JavaScript code for the Login/Signup HTML page. */

/* On load, make Sign Up section hidden. */
document.getElementById("signupSection").style.display = "none";

/* Make Sign Up secion appear after "Sign Up Here" button is clicked. */
document.getElementById("signuphereButton").addEventListener("click", function(appear)
{
	document.getElementById("signupSection").style.display = "block";
	location.href = "#signupSection";

	appear.preventDefault();
}); 