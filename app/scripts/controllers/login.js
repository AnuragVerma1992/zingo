'use strict';

/**
 * @ngdoc function
 * @name anurajProjectsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the anurajProjectsApp
 */
angular.module('anurajProjectsApp')
  .controller('LoginCtrl', function ($rootScope, $scope, $location, $firebaseObject, $firebaseArray, $timeout, $pbService) {



    // $scope.UserObj = JSON.parse(localStorage.getItem("UserObj"));
    // if ($scope.UserObj !== null) {
    //   $scope.userName = $scope.UserObj.name;
    //   $scope.useremail = $scope.UserObj.email;
    // }
    var allKeys = "";
    var UniKeyObj = localStorage.setItem("UniKeyObj", JSON.stringify({ allKeys: allKeys }));


    var ref = firebase.database().ref();
    var obj = $firebaseObject(ref);
    var eventList = $firebaseArray(ref);
    obj.$bindTo($scope, "eventList");

    $scope.eventList = eventList;
    $scope.data = obj;
    eventList.$watch(function (event) {
      console.log('úpdated...', event);
    })

    var currentEvent = firebase.database().ref().child("currentEvent");
    var currentEventObj = $firebaseObject(currentEvent);

    if (currentEventObj.$id == "currentEvent") {

      ref.on('value', function (snapshot) {
        var val = snapshot.val();

        $scope.currentEvent = val.currentEvent;
      });

    }

    // function for random matrix
    $scope.tempInit = function () {

      var limit = 9,
        amount = 3,
        lower_bound = 1,
        upper_bound = 30,
        unique_random_numbers = [];

      if (amount > limit) limit = amount; //Infinite loop if you want more unique
      //Natural numbers than existemt in a given range
      while (unique_random_numbers.length <= limit - 1) {
        var random_number = Math.round(Math.random() * (upper_bound - lower_bound) + lower_bound);
        if (unique_random_numbers.indexOf(random_number) == -1) {
          // Yay! new random number
          unique_random_numbers.push(random_number);
        }
      }
      $scope.uniqueNos = unique_random_numbers;
      var bingopattern = $scope.uniqueNos;
       var bingopatternObj = localStorage.setItem("BingoObj", JSON.stringify({ bingopattern: bingopattern }));
      var check = ref.child('0/event/0/eventStart');
      check.on('value', function (data) {
        console.log(data.val())

        $scope.CheckStart = data.val();
        if ($scope.CheckStart === true) {
          // var bingopatternObj = localStorage.setItem("BingoObj", JSON.stringify({ bingopattern: "" }));
          var gameCheckObj = localStorage.setItem("gameCheckObj", JSON.stringify({ gameCheckObj: true }));
        

        } else {
         
          var gameCheckObj = localStorage.setItem("gameCheckObj", JSON.stringify({ gameCheckObj: false }));
        
        }
      })


    }



    $scope.getUser = function (name, email) {

      if (name === 'admin' && email === 'admin@mediaiq.com') {
        $location.path('/zingoappadmin');
      } else {
        $scope.tempInit();
        var name = name;
        var email = email;
        var ques = [];
        var questionAskedObj = localStorage.setItem("QuesObj", JSON.stringify({ quesAsked: "" }));
        var usrObj = localStorage.setItem("UserObj", JSON.stringify({ name: name, email: email }));
        $location.path('/game');
        var BingopatObj = JSON.parse(localStorage.getItem("BingoObj"));
        $scope.bingopattern = BingopatObj.bingopattern;
        console.log($scope.bingopattern)
        var post = ref.child("0/event/0/employees");
        post.push().set({                             // push the data of employess object
          name: name,
          email: email,
          myBoard: $scope.bingopattern,
          myAnswers: "",
          prizes: "",
        });
        var Answer = firebase.database().ref('0/event/0/employees');
        Answer.on('value', SendAns);
        function SendAns(data) {
          console.log(data.val());
          $scope.allKeys = [];
          angular.forEach(data.val(), function (va, ke) {
            $scope.allKeys.push(ke);
            console.log($scope.allKeys);
            var allKeys = $scope.allKeys;
            var UniKeyObj = localStorage.setItem("UniKeyObj", JSON.stringify({ allKeys: allKeys }));
          })
        };
      }
    };


    $scope.init = function () {
      $scope.UserObj = JSON.parse(localStorage.getItem("UserObj"));
      console.log($scope.UserObj)
      if ($scope.UserObj !== null && $scope.UserObj !== "") {
        console.log('I have already logged in and I am going to the game screen');
        $location.path('/game');
      } else {
        console.log('You need to login.');
      }

    };

    $scope.init();

  });
