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

`$scope.signOut = function() {		
	AzureMobileClient.logout();
}`

