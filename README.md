angularjs-service-azuremobileservices
=====================================

A service for AngularJS to interact with the [Microsoft Azure Mobile Services Javascript client](http://msdn.microsoft.com/en-us/library/windowsazure/jj554207.aspx).

Usage
-----

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

	AzureMobileClient.login(function(isLoggedIn) {
		if (isLoggedIn)
		{
			[Code you want to execute on successful login]
		}
	}, socialService);

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

Gets all data from the specified Azure table. Takes the name of the table as an argument and performs a callback once the data has been retrieved.

Controller Example:

```javascript
AzureMobileClient.getAllData(function(stuff) {

	if (stuff.length == 0)
	{
		[Perform action when no records are found]
	}
	else
	{
		[Perform action when records have been returned from Azure]
	}	

}, "stuff");
```

###addData

Adds a record to the specified Azure table. Takes the name of the table and the row of data as arguments and returns a callback, passing back the new record if successful or the textual error if unsuccessful.

Controller Example:

```javascript
var data = { name: $scope.name, sku: $scope.sku };

AzureMobileClient.addData(function(response) {

	if (typeof response == "object") {		
		[Success - do whatever needs to be done after the insert]
	} else {						
		$scope.$apply($scope.errorMessage = "An error has occurred: " + AzureMobileClient.azureError);
	}

}, "stuff", data);
```

###updateData

Updates a record in the specified Azure table. Takes the name of the table and the row of data as arguments and returns a callback, passing back the updated record if successful or the textual error if unsuccessful. I noticed that sometimes on an update, the Azure id for the record can change, so I pass the updated record back.

Controller Example:

```javascript
AzureMobileClient.updateData(function(response) {

	if (typeof response == "object") {
		[Success - do whatever needs to be done after the update]
	} else {						
		$scope.$apply($scope.errorMessage = "An error has occurred: " + response);
	}

}, "stuff", data);
```

###deleteData

Deletes a record in the specified Azure table. Takes the name of the table and the row of data as arguments and returns a callback, passing back _true_ if successful or _false_ if unsuccessful.

Controller Example:

```javascript
// Using underscore.js to find an element in an array to delete from Azure
var data = _.findWhere(items, {id: dataid});

AzureMobileClient.deleteData(function(success) {

	if (success)
	{
		[Record successfully deleted]
	}
	else
	{
		alert("There was a problem deleting the record.");
	}

}, "stuff", data);
```

###getUser

This function is really only used internally to the service. I found that there were times that the _currentUser_ object in the Mobile Services client to be null. When a successful _login_ is performed, AngularJS cookie are used to persist the _currentUser_ object to the Cookie Store. This function grabs the object from the Cookie Store and rehydrates the currentUser object in the Mobile Services client.