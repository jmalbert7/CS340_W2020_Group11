/* Insert code here for orders page. */

var jsId = document.cookie.match(/JSESSIONID=[^;]+/);
console.log(jsId);

function removeRecipeFromCart(recipe_id){
    var req = new XMLHttpRequest();
    console.log('REMOVE');
	console.log("sent data" + recipe_id);
	var sdata = {"hiddenRecipeId" : recipe_id, "method":"remove"};
	console.log("sdata" + sdata);
	console.log(JSON.stringify(sdata));
	req.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
            console.log('success?');
            location.reload();
        }
	};
	req.open('POST', '/orders/remove', true);
	req.setRequestHeader('Content-Type', 'application/json');
	
	req.send(JSON.stringify(sdata));
	event.preventDefault();
}