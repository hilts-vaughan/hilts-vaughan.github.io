var services = angular.module('starter.services', []);

/*
	This is a basic service that contains some misc utilities for dealing with dates
	in the Eucllian system that powers their system with odd date codes
 */
services.service('DateService', function() {

    /*
		Takes todays date and returns a Eucllian Date code that can be used.

		@returns A date code that represents the current day of the week
	 */
    this.getDateCode = function(date) {
        var currentDate = date || new Date();
        var codes = ['X', 'M', 'T', 'W', 'R', 'F', 'X'];
        var day = currentDate.getDay();
        return codes[day];
    };

    this.getDateCodeWithDate = function(date) {
        var currentDate = new Date(Date.parse(date.replace("-", "/")));
        var codes = ['X', 'M', 'T', 'W', 'R', 'F', 'X'];
        return codes[currentDate.getUTCDay()];
    };

    this.getLocalDateString = function() {

        var now = new Date(),
            tzo = -now.getTimezoneOffset(),
            dif = tzo >= 0 ? '+' : '-',
            pad = function(num) {
                var norm = Math.abs(Math.floor(num));
                return (norm < 10 ? '0' : '') + norm;
            };
        return now.getFullYear()
            + '-' + pad(now.getMonth()+1)
            + '-' + pad(now.getDate())
            + 'T' + pad(now.getHours())
            + ':' + pad(now.getMinutes())
            + ':' + pad(now.getSeconds())
            + dif + pad(tzo / 60)
            + ':' + pad(tzo % 60);

    };

});


services.service('LaurierService', function() {

    /*
		Returns an array of classrooms that are available throughout Laurier.

		@Returns 	An array of strings of the name of the buildings
	 */
    this.getRooms = function() {
        return [
            'Bricker Academic Building',
            'Dr. Alvin Woods Building',
            'Science Building',
            'Arts Building',
            'Schlegel Centre',
            '202 Regina Street',
            'Peters Building',
            'Seminary'
        ];
    }


});


services.service('SettingsService', function() {

    this.getSettings = function() {

        var settings =
        [
            {text: "Show availability length", key: "ShowLength"},
            {text: "Allow caching", key: "UseCaching"},
            {text: "Send diagnostic information", key: "UseDiagnostics"}
        ];

        return settings;
    };

    this.setKey = function(key, value) {
        localStorage[key] = value;
    };

    this.getKey = function(key) {
        return localStorage[key];
    };


});



services.service('ServerService', function($http) {

	// TODO
	//
	// We should try to cache this; the data is unlikely to change.
	// We could probably even download the whole thing at startup
	// and then muck with it later

    var HOST = "safe-thicket-1409.herokuapp.com";

	this.getRoomsIn = function(building, callback) {

		// Make the GET request out and grab the data
	    $http.get('https://' + HOST + '/courses?building=' + building).
	      success(function(data, status, headers, config) {
	      	callback(data);
	      });

	}

	this.getRoomsInAndFilterByDay = function(building, dayCode, callback) {

		this.getRoomsIn(building, function(data) {

            console.log(data);
            console.log(dayCode);

            var set = _.reject(data, function(course) {
	          return course.days.indexOf(dayCode) == -1;
            });

            callback(set);

		});
	}



})

services.service('RoomService', function() {

    /*
		Given a list of rooms passed in and a minimum free time block,
		filters a list down to the results that meet the criteria.

	 */
    this.getRoomsWithFreeTime = function(rooms, minMinutes) {

        var grouped = _.groupBy(rooms, 'building');
        var tables = [];

        _.each(_.pairs(grouped), function(value, key) {

            value = value[1];

            value.sort(function(a, b) {
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return new Date(a.times[0]) - new Date(b.times[0]);
            });

            console.log(value);

            var timetable = {};
            timetable.name = value[0].building;
            timetable.times = [];

            var firstDate = new Date(value[0].times[0]);
            var morningDate = new Date(firstDate.getTime());

            morningDate.setSeconds(0);
            morningDate.setHours(8);
            morningDate.setMinutes(30);

            var firstDelta = (firstDate - morningDate);

            if (firstDelta > 1000 * 60 * minMinutes) {
                var entry = {
                    start: morningDate.toISOString(),
                    end: firstDate
                }

                timetable.times.push(entry);
            }

            for (var i = 0; i < value.length - 1; i++) {

                var course = value[i];
                var nextCourse = value[i + 1];

                // We get the amount of time that has ended since
                var endDelta = (new Date(nextCourse.times[0]) - new Date(course.times[1]));

                // Next up, check if the gap is large enough
                if (endDelta > 1000 * 60 * minMinutes) {

                    var entry = {
                        start: course.times[1],
                        end: nextCourse.times[0]
                    }

                    timetable.times.push(entry);
                }
            }

            // Of course, there's also a section from the last course to the end of the day
            var entry = {
                start: value[value.length - 1].times[1],
                end: null
            }

            timetable.times.push(entry);

            console.log(timetable);
            tables.push(timetable);

        });

		return tables;
    }


});
