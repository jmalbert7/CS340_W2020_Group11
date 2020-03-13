/* Insert code here for profile.html page. */

var jsId = document.cookie.match(/JSESSIONID=[^;]+/);
console.log(jsId);

/* On load, make Edit Customer Information hidden. */
document.getElementById("editCustomerForm").style.display = "none";

/* Make Edit Customer Form appear after "Edit My Information" button is clicked. */
document.getElementById("editCustomerButton").addEventListener("click", function(appear)
{
	
	//TODO: Scroll to bottom of page on click
	document.getElementById('editId').setAttribute('value', document.getElementById('id').value);
    document.getElementById('editFirstName').setAttribute('value', document.getElementById('fname').value);
    document.getElementById('editLastName').setAttribute('value', document.getElementById('lname').value);
    document.getElementById('editEmail').setAttribute('value', document.getElementById('email').value);
    document.getElementById('editPhoneNumber').setAttribute('value', document.getElementById('phone').value);
    document.getElementById('editPassword').setAttribute('value', document.getElementById('pword').value);
    document.getElementById('editAdmin').setAttribute('value', document.getElementById('admin').value);
	
	document.getElementById("editCustomerForm").style.display = "block";
	appear.preventDefault();
});



/* Make Edit Customer Form hidden after "Update My Information" button is clicked
and scroll to top. 
document.getElementById("updateCustomerButton").addEventListener("click", function(appear)
{	
	//hide the edit form
	document.getElementById("editCustomerForm").style.display = "none";
	window.scrollTo(0,0);
	appear.preventDefault();
	
	//populate edit customer form with customer info pulled from customer table 	
	
});*/

function editData(fname, lname, email, phone, password, admin){
	var req = new XMLHttpRequest();

	var customerData = {customer_id:null, first_name:null, last_name:null, email:null, password:null, phone:null, admin:null};
	customerData.customer_id = document.getElementById('id').value;
	customerData.first_name = fname;
	customerData.last_name = lname;
	customerData.email = email;
	customerData.password = password;
	customerData.phone = phone;
	customerData.admin = admin;
	console.log("edit customer" + customerData.customer_id);

	req.open("POST", "/profile/edit", true);
	req.setRequestHeader('Content-Type', 'application/json');
    req.onload = function(){
        if(req.status >= 200 && req.status < 400){
            var response = req.responseText;
			console.log("editData");
			location.reload();
        }
    }
    req.send(JSON.stringify(customerData));
    event.preventDefault();
}