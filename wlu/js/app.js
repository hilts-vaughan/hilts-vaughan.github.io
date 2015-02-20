// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])


.config(function($httpProvider) {
  $httpProvider.interceptors.push(function($rootScope) {
    return {
      request: function(config) {
        $rootScope.$broadcast('loading:show')
        return config
      },
      response: function(response) {
        $rootScope.$broadcast('loading:hide')
        return response
      }
    }
  })
})

.run(function($rootScope, $ionicLoading, $timeout) {
  $rootScope.$on('loading:show', function() {
    $ionicLoading.show({template: 'Loading...'})
  })

  $rootScope.$on('loading:hide', function() {
    $timeout(function() {
      $ionicLoading.hide()
    }, 100);
    
  })
})


.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
 
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: "/search",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html",
        controller: "SearchController"
      }
    }
  })


  .state('app.about', {
    url: "/about",
    views: {
      'menuContent': {
        templateUrl: "templates/about.html",
        controller: "AboutController"
      }
    }
  })

  .state('app.availability', {
    url: "/availability",
    views: {
      'menuContent': {
        templateUrl: "templates/browse.html",
        controller: "AvailabilityController"
      }
    }
  })

    .state('app.settings', {
      url: "/settings",
      views: {
        'menuContent': {
          templateUrl: "templates/settings.html",
          controller: 'SettingsController'
        }
      }
    })


;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/availability');
});
