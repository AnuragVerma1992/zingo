'use strict';

/**
 * @ngdoc function
 * @name anurajProjectsApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the anurajProjectsApp
 */
angular.module('anurajProjectsApp')
  .controller('AdminCtrl', function ($scope, $location, $firebaseObject, $firebaseArray, $timeout) {



    var ref = firebase.database().ref();
    var obj = $firebaseObject(ref);
    var eventList = $firebaseArray(ref);

    $scope.data = obj;

    $scope.eventList = eventList;
    console.log("Eventlist", $scope.eventList);
    //    obj.$bindTo($scope, "eventList");

    var syncTimer;
    var timeDelay = 10;
    $scope.$watch('eventList', function (newVal) {
      $timeout.cancel(syncTimer);
      syncTimer = $timeout(function () {
        //Save to Firebase
        console.log('saved')
        eventList.$save(0).then(function (ref) {
          ref.key === eventList[0].$id; // true
        });

      }, timeDelay);
    }, true);


    var currentEvent = firebase.database().ref().child("currentEvent");
    var currentEventObj = $firebaseObject(currentEvent);

    if (currentEventObj.$id == "currentEvent") {

      ref.on('value', function (snapshot) {
        var val = snapshot.val();

        $scope.currentEvent = val.currentEvent;
      });
    }

    $scope.notification = "";



    //   Start Event by Admin
    $scope.AllDisable = false;
    $scope.StartEvent = true;
    $scope.StopEvent = false;
    $scope.Event = function () {
      $scope.StopEvent = true;
      $scope.StartEvent = false;
      $scope.AllDisable = true;
      var hopperRef = ref.child("0/event/0/");
      hopperRef.update({
        eventStart: true,
      });
    }

    $scope.closeEvent = function () {
      $scope.StopEvent = false;
      $scope.StartEvent = true;
      $scope.AllDisable = false;
      var hopperRef = ref.child("0/event/0/");
      hopperRef.update({
        eventStart: false,
      });

    }
    $scope.setQuestion = function (itemQuestion, itemIndex) {
      $scope.disable = true;
      $scope.duration = itemQuestion.duration;
      $scope.questionNo = itemQuestion.qno;
      console.log($scope.questionNo);
      var hopperRef = ref.child("0/event/0/gameQuestions");
      hopperRef.push().set({
        0: $scope.questionNo,
        duration: $scope.duration
      });
      // $scope.eventList[0].event[$scope.currentEvent].questions[itemIndex].isDisabled = true;
      var nameQuestion = ref.child('0/event/0/questions/' + itemIndex);
      nameQuestion.update({
          isDisabled: true,
      });
    };

    $scope.ResetQuestions = function () {
      var resteGameQuestion = ref.child("0/event/0/");
      resteGameQuestion.update({
        employees: [],
        gameQuestions: [],
        winners: [],
        gameCheck: false,
        eventStart: false,

      });

      var quesAsked = [];
      var questionAskedObj = localStorage.setItem("QuesObj", JSON.stringify({ quesAsked: quesAsked }));

      for (var i = 0; i <= 29; i++) {
        $scope.eventList[0].event[$scope.currentEvent].questions[i].isDisabled = false;
      }
    };

    // Send Notification 
    $scope.SendNotes = function () {
      var hopperRef = ref.child("0/event/0/notification");
      hopperRef.update({
        note: $scope.notification
      });
    };
    // Emoloyee Data Login details
    $scope.loginDetails = true;
    var EmpData = firebase.database().ref('0/event/0/employees');
    EmpData.on('value', employeeData);
    function employeeData(data) {                  // to get the Question Asked by Admin 
      $scope.EmployeeDetails = [];
      angular.forEach(data.val(), function (v, k) {
        $scope.EmployeeDetails.push(v);
        $scope.loginDetails = false;
        $scope.NoOfEmployee = $scope.EmployeeDetails.length;
        console.log($scope.NoOfEmployee);
      })

    };


    // Winner List Display Function   
    $scope.WinnerDetails = true;
    // Row One Winner 
    var rowOneData = firebase.database().ref('0/event/0/winners/rowOne');
    rowOneData.on('value', FirstRow);
    function FirstRow(data) {                  // to get the Question Asked by Admin 
      $scope.RowOneData = [];
      angular.forEach(data.val(), function (v, k) {
        $scope.RowOneData.push(v);
        $scope.WinnerDetails = false;
      })

    };
    // Row Two Winner 

    var rowTwo = firebase.database().ref('0/event/0/winners/rowTwo');
    rowTwo.on('value', SecoundRow);
    function SecoundRow(data) {                  // to get the Question Asked by Admin 
      $scope.RowTwoData = [];
      angular.forEach(data.val(), function (v, k) {
        $scope.RowTwoData.push(v);
        $scope.WinnerDetails = false;
      })

    };
    // Row Three Winner 

    var rowThree = firebase.database().ref('0/event/0/winners/rowThree');
    rowThree.on('value', ThirdRow);
    function ThirdRow(data) {                  // to get the Question Asked by Admin 
      $scope.RowThreeData = [];
      angular.forEach(data.val(), function (v, k) {
        console.log(v)
        $scope.RowThreeData.push(v);
        $scope.WinnerDetails = false;

      })

    };
    //Colum one Winner

    var columOne = firebase.database().ref('0/event/0/winners/columOne');
    columOne.on('value', FirstColumOne);
    function FirstColumOne(data) {                  // to get the Question Asked by Admin 
      $scope.ColumOneData = [];
      angular.forEach(data.val(), function (v, k) {
        $scope.ColumOneData.push(v);
        $scope.WinnerDetails = false;
      })

    };
    //Colum two Winner

    var columtwo = firebase.database().ref('0/event/0/winners/columTwo');
    columtwo.on('value', SecoundColum);
    function SecoundColum(data) {                  // to get the Question Asked by Admin 
      $scope.ColumTwoData = [];
      angular.forEach(data.val(), function (v, k) {
        $scope.ColumTwoData.push(v);
        $scope.WinnerDetails = false;
      })

    };

    //Colum three Winner

    var columThree = firebase.database().ref('0/event/0/winners/columThree');
    columThree.on('value', ThirdColum);
    function ThirdColum(data) {                  // to get the Question Asked by Admin 
      $scope.ColumThreeData = [];
      angular.forEach(data.val(), function (v, k) {
        $scope.ColumThreeData.push(v);
        $scope.WinnerDetails = false;
      })

    };

    //FullBoard Winners

    var full = firebase.database().ref('0/event/0/winners/FullHouse');
    full.on('value', Full);
    function Full(data) {                  // to get the Question Asked by Admin 
      $scope.FullHouseData = [];
      angular.forEach(data.val(), function (v, k) {
        $scope.FullHouseData.push(v);
        $scope.WinnerDetails = false;
        console.log("56", $scope.FullHouseData[0])
      })

    };

    ///////////////////
    $scope.adminTime = true;
    var timerdata = firebase.database().ref('0/event/0/gameQuestions');
    timerdata.on('value', timeData);
    function timeData(data) {
      $scope.adminTime = false;                // to get the Question Asked by Admin 
      $scope.quesDuration = []
      angular.forEach(data.val(), function (v, k) {
        console.log(v.duration);
        var timer = v.duration;
        $scope.time = timer / 1000;
        $scope.quesDuration.push($scope.time);


      })
    };

    // Enter the Game number
    $scope.setUpEvent = function (eventName) {
      var Questions = [];
      //Generate 30 questions - so that no one can generate more.
      var count = 1;
      var i;
      for (i = 0; i < 30; i++) {
        var q = {
          question: "",
          qno: count,
          duration: "300000",
        }
        Questions.push(q);
        count++;
      }


      // Empolyee info

      var Employee = {
        name: "",
        email: "",
        myBoard: [0],
        myAnswers: [0]
      }

      var Bingo = [];
      //event aadded 
      eventList.$add({
        event: [{
          eventID: Math.floor(1000 + Math.random() * 9000),
          eventName: eventName,
          eventStart: false,
          questions: Questions,
          employees: [Employee],
          Winners: [],
          notification: ""
        }]

      });

    }




  });
