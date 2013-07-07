angularjs-service-azuremobileservices
=====================================

A service for AngularJS to interact with the [Microsoft Azure Mobile Services Javascript client](http://msdn.microsoft.com/en-us/library/windowsazure/jj554207.aspx). Uses Javascript promises that the library inherently implements.

Usage
-----

Include the Azure Mobile Services javascript file in your index.html file like so:

`<script src='https://{your project id}.azure-mobile.net/client/MobileServices.Web-1.0.0.min.js'></script>`

To use the service, declare to variables in the rootScope of the app:

-	$rootScope.azureURL - the URL given by the Azure portal
-	$rootScope.azureAppKey - the Application Key given by the Azure portal

You can then use the following functions:

###login

Logs into the Azure Mobile Service using the chosen social network. oAuth token is returned.

View:

`<img src="images/facebooklogin.png" ng-click="authenticate('Facebook')" />`

Controller:

```javascript
$scope.authenticate = function (socialService) {

	AzureMobileClient.login(socialService).then(
		function(user) {
			[code to execute on successful login]
		},
		function(error) {			
			if (error != 'canceled') {
				alert('Problem ' + error);
			}				
		});	
};
```

###logout

Logs out of the Azure Mobile Service.

View:

`<button ng-click="signOut()">Sign Out</button>`

Controller:

```javascript
$scope.signOut = function() {		
	AzureMobileClient.logout();
}
```

###getAllData

Gets all data from the specified Azure table. Takes the name of the table as an argument and retrieves all the data for that table.

Controller Example:

```javascript
AzureMobileClient.getAllData("tableName").then(
	function(data) {
		[code to execute on successful data pull]
	},
	function(error) {
		alert(error);
	}
);
```

###addData

Adds a record to the specified Azure table. Takes the name of the table and the row of data as arguments and returns the new record if successful or the textual error if unsuccessful.

Controller Example:

```javascript
var data = { name: $scope.name, sku: $scope.sku };

AzureMobileClient.addData("tableName", data).then(
	function(insertedData) {
		[Code to execute after successful insert]
	},
	function(error) {
		$scope.$apply($scope.errorMessage = "An error has occurred: " + error.message);
	});
```

###updateData

Updates a record in the specified Azure table. Takes the name of the table and the row of data as arguments and passes back the updated record if successful or the textual error if unsuccessful. I noticed that sometimes on an update, the Azure id for the record can change, so I pass the updated record back.

Controller Example:

```javascript
AzureMobileClient.updateData("tableName", data).then(
	function(updatedData) {
		[Code to execute after successful update]
	},
	function(error) {
		$scope.$apply($scope.errorMessage = "An error has occurred: " + error.message);
	});
```

###deleteData

Deletes a record in the specified Azure table. Takes the name of the table and the row of data as arguments and a promise indicating successful deletion or not.

Controller Example:

```javascript
// Using SugarJS to find the record
var itemToDelete = $scope.data.find({id: Id});

if (itemToDelete && confirm("Delete " + itemToDelete.itemName + "?")) {
	AzureMobileClient.deleteData("dataTable", itemToDelete).then(
		function(success) {
			$scope.$apply($scope.data.remove(itemToDelete));
		},
		function(error) {
			alert("There was a problem deleting the record. " + error);
		});
}
```

###getUser

This function is really only used internally to the service. I found that there were times that the _currentUser_ object in the Mobile Services client to be null. When a successful _login_ is performed, AngularJS cookie are used to persist the _currentUser_ object to the Cookie Store. This function grabs the object from the Cookie Store and rehydrates the currentUser object in the Mobile Services client.