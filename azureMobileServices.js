'use strict';

angular.module('App')
.factory('AzureMobileClient', ['$cookieStore', '$rootScope', function ($cookieStore, $rootScope) {

  var azureMobileClient = {};
  azureMobileClient.isLoggedIn = false;
  azureMobileClient.azureError = "";
  azureMobileClient.azureMSC = new WindowsAzure.MobileServiceClient($rootScope.azureURL, $rootScope.azureAppKey);

  // Login to Azure method. Takes a string (socialMediaService) with the social media service being used (Facebook, Twitter, etc.)
  // Returns a boolean value indicating success or failure
  azureMobileClient.login = function(callback, socialMediaService) {

    azureMobileClient.azureMSC.login(socialMediaService).then(function(user) {
      azureMobileClient.isLoggedIn = user != null;
      $cookieStore.put("azureUser", user);
      callback(azureMobileClient.isLoggedIn);
    }
    , function(error){
      azureMobileClient.azureError = error;
      callback(false);
    });
  };

  // Logs out from the Azure service
  azureMobileClient.logout = function() {
    azureMobileClient.getUser();
    azureMobileClient.azureMSC.logout();
    $cookieStore.remove("azureUser");
  };

  // Get all data using the read method of the Azure service. Take a string (tableName) indicating the table to get data from
  azureMobileClient.getAllData = function(callback, tableName) {

    azureMobileClient.getUser();

    var dataTable = azureMobileClient.azureMSC.getTable(tableName);

    dataTable.read().then(function(data) {
      callback(data);
    });
  };

  // Adds a data row (data) to the specified table (tableName). 
  // If success, returns the new object that was created.
  // If failure, returns the error text on failure.
  azureMobileClient.addData = function(callback, tableName, data) {
    azureMobileClient.getUser();
    var dataTable = azureMobileClient.azureMSC.getTable(tableName);
    dataTable.insert(data).then(function(success) {
      callback(success);
    }
    , function(error) {
      azureMobileClient.azureError = error.request.responseText;
      callback(error.request.responseText);
    });
  };

  azureMobileClient.updateData = function(callback, tableName, data) {
    azureMobileClient.getUser();
    var dataTable = azureMobileClient.azureMSC.getTable(tableName);
    dataTable.update(data).then(function(success) {
      callback(success);
    }
    , function(error) {
      azureMobileClient.azureError = error.request.responseText;
      callback(error.request.responseText);
    });
  };

  azureMobileClient.deleteData = function(callback, tableName, data) {
    azureMobileClient.getUser();
    var dataTable = azureMobileClient.azureMSC.getTable(tableName);
    dataTable.del(data).then(function(success) {
      callback(true);
    }
    , function(error) {
      azureMobileClient.azureError = error.request.responseText;
      callback(false);
    });
  };

  // Gets the currentUser back from the cookieStore if the currentUser object is null
  azureMobileClient.getUser = function() {
    if (azureMobileClient.azureMSC.currentUser === null)
    {
      azureMobileClient.azureMSC.currentUser = $cookieStore.get("azureUser");
    }
  };

  return azureMobileClient;
}]);