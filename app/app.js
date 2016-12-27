var app = angular.module('myApp', [
    'ngRoute',
    'myApp.view1',
    'myApp.view2',

]);



app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.otherwise({ redirectTo: '/view1' });
}]);


app.value('allEmployees', {
    'Peter': { id: 1, password: 'eins', name: "Peter" },
    'Robert': { id: 2, password: 'zwei', name: "Robert" },
    'Andreas': { id: 3, password: 'drei', name: "Andreas" },
    'Admin': { id: 3, password: 'admin', name: "Admin" }
});

app.value('userTimetable', {
    'Peter': [
        { "name": "Peter", startTime: new Date(2016, 11, 15, 08, 02, 35), endTime: new Date(2016, 11, 15, 17, 53, 23), },
        { "name": "Peter", startTime: new Date(2016, 11, 16, 07, 55, 26), endTime: new Date(2016, 11, 16, 17, 46, 18), }
    ],
    'Robert': [
        { "name": "Robert", startTime: new Date(2016, 11, 15, 10, 05, 38), endTime: new Date(2016, 11, 15, 18, 26, 10), },
        { "name": "Robert", startTime: new Date(2016, 11, 18, 09, 15, 31), endTime: new Date(2016, 11, 18, 19, 45, 13), }
    ],
    'Andreas': [
        { "name": "Andreas", startTime: new Date(2016, 11, 16, 07, 02, 39), endTime: new Date(2016, 11, 16, 18, 13, 25), },
        { "name": "Andreas", startTime: new Date(2016, 11, 17, 08, 09, 13), endTime: new Date(2016, 11, 17, 18, 26, 36), }
    ]
});


app.controller('mainCtrl', function($scope, allEmployees, userTimetable) {
    var employees = allEmployees;
    $scope.timetable = null;
    $scope.loginUser = {
        name: null,
        password: null
    };
    $scope.login = login;
    $scope.logout = logout;
    $scope.checkIn = checkIn;
    $scope.checkOut = checkOut;
    $scope.currentUser = null;
    $scope.calcHours = calcHours;
    $scope.loginMessage = null;
    // $scope.isAdmin = false;

    // Login
    function login() {
        if (authenticate($scope.loginUser.name, $scope.loginUser.password)) {

            $scope.currentUser = $scope.loginUser.name;

            var test;
            if ($scope.currentUser === 'Admin') {
                for (i = 0; i < 4; i++) {
                    test.push(userTimetable[employees[i].name])
                }
                $scope.timetable = test;
                $scope.isAdmin = true;
            } else {
                $scope.timetable = userTimetable[$scope.currentUser];
                $scope.isAdmin = false;
            }
            $scope.loginMessage = $scope.loginUser.name + 'Sie sind angemeldet.';
        } else {
            $scope.loginMessage = 'Oppps. Ungültige Username oder Password.';
        }
        $scope.loginUser = {
            name: null,
            password: null
        };

        var timeEntries = $scope.timetable;
        if (timeEntries) {
            $scope.hasCheckedIn = timeEntries.length > 0 && !timeEntries[timeEntries.length - 1].endTime;
        }
    }

    function authenticate(name, password) {
        if (employees[name].password === password) {
            return employees[name];
        }
    }

    function logout() {
        $scope.currentUser = null;
        $scope.loginMessage = '';
    }

    // CheckIn
    function checkIn() {
        var timeEntries = $scope.timetable,
            userCheckIn = {
                name: $scope.currentUser,
                startTime: new Date(),
                endTime: null
            };

        if (timeEntries.length === 0 || timeEntries[timeEntries.length - 1].endTime) {
            timeEntries.push(userCheckIn);
            $scope.hasCheckedIn = true;
        }
    }
    // CheckOut
    function checkOut() {
        var currentUserName = $scope.currentUser,
            timeEntries = $scope.timetable;
        if (timeEntries.length > 0 && !timeEntries[timeEntries.length - 1].endTime) {
            timeEntries[timeEntries.length - 1].endTime = new Date();
            $scope.hasCheckedIn = false;
        }
    }

    //Sumary Hours Calculation
    function calcHours(start, end) {

        if (end === null) {
            return '';
        }

        var milliseconds = end - start;
        var days, hours, minutes, seconds;

        seconds = Math.floor(milliseconds / 1000);
        minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        hours = Math.floor(minutes / 60);
        minutes = minutes % 60;
        days = Math.floor(hours / 24);
        hours = hours % 24;


        return hours.toString() + ' : ' + minutes.toString() + ' : ' + seconds.toString();
    }
});