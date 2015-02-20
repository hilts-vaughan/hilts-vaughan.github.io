angular.module('starter.controllers', ['starter.services'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
    // Form data for the login modal
    $scope.loginData = {};




})


.controller('AvailabilityController', function($scope, $http, $timeout, DateService, LaurierService, RoomService, ServerService, $ionicScrollDelegate) {


    // Pull in a list of rooms from our laurier service
    $scope.rooms = [];
    _.each(LaurierService.getRooms(), function(item) {
        $scope.rooms.push({
            name: item
        });
    })

    $scope.inputs = {};
    $scope.inputs.searchText = "";
    $scope.inputs.selectedRoom = $scope.rooms[0];

    $scope.getResults = function() {
        $scope.pending = true;

        ServerService.getRoomsIn($scope.inputs.selectedRoom.name + " " + $scope.inputs.searchText,
            function(data) {
                $scope.results = data;

                // Wait a few seconds until it can re-appear

                $timeout(function() {
                    $scope.pending = false;
                }, 500);

                // Attempt to process the results in some sort of reasonable manner
                $scope.processResults();
                $ionicScrollDelegate.scrollTop();

            });

    };

    $scope.getDifference = function(start, end) {

        if (!end) {
            return "until closing";
        }

        var delta = new Date(new Date(end) - new Date(start));
        console.log(delta);
        var seconds = delta.getTime() / 1000;
        hours = Math.floor(seconds / 3600);
        seconds %= 3600;
        minutes = Math.floor(seconds / 60);

        return "for " + hours + " hours, " + minutes + " minutes";

    }

    $scope.clearText = function() {
        $scope.inputs.searchText = "";
    }

    $scope.processResults = function() {

        if ($scope.results.length == 0) {
            $scope.timetable = [];
            $scope.error = "That room does not seem to be valid.";
            return;
        }


        // Remove all mondays
        $scope.results = _.reject($scope.results, function(course) {
            return course.days.indexOf(DateService.getDateCode()) == -1;
        });


        if ($scope.results.length == 0) {
            $scope.timetable = [];
            $scope.error = "It seems there's no classes in this room today. Free all day!";
            return;
        }

        $scope.timetable = RoomService.getRoomsWithFreeTime($scope.results, 30);


    };


})

.controller('SettingsController', function($scope, SettingsService) {

    $scope.inputs = {};
    $scope.inputs.settingsList = SettingsService.getSettings();
    $scope.x = true;

    _.each($scope.inputs.settingsList, function(setting) {
        setting.checked = true;
    });


    $scope.save = function() {
        console.log($scope.settingsList);
    }

})

.controller("AboutController", function() {

})

.controller('SearchController', function($scope, LaurierService, ServerService, RoomService, DateService, $ionicScrollDelegate) {


    $scope.getDifference = function(start, end) {

        if (!end) {
            return "until closing";
        }

        var delta = new Date(new Date(end) - new Date(start));
        console.log(delta);
        var seconds = delta.getTime() / 1000;
        hours = Math.floor(seconds / 3600);
        seconds %= 3600;
        minutes = Math.floor(seconds / 60);

        return "for " + hours + " hours, " + minutes + " minutes";

    }

    // Pull in a list of rooms from our laurier service
    $scope.rooms = [];
    _.each(LaurierService.getRooms(), function(item) {
        $scope.rooms.push({
            name: item
        });
    })

    $scope.inputs = {};
    $scope.inputs.selectedRoom = $scope.rooms[0];
    $scope.inputs.date = DateService.getLocalDateString().slice(0, 10);
    $scope.inputs.minutes = 60;

    console.log($scope.inputs.date);

    $scope.runSearch = function() {

        ServerService.getRoomsInAndFilterByDay($scope.inputs.selectedRoom.name, DateService.getDateCodeWithDate($scope.inputs.date), function(data) {

            // Got the data
            var filteredRooms = RoomService.getRoomsWithFreeTime(data, $scope.inputs.minutes);
            $scope.timetable = filteredRooms;
            $ionicScrollDelegate.scrollTop();

            if(filteredRooms.length == 0)
            {
              $scope.error = "The date you selected has no classes running."
            }

        });

    };


});

