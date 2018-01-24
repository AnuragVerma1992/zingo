'use strict';

/**
 * @ngdoc function
 * @name anurajProjectsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the anurajProjectsApp
 */
angular.module('anurajProjectsApp')
  .controller('GameCtrl', function ($rootScope, $scope, $location, $firebaseObject, $firebaseArray, $timeout, $pbService) {
    var ref = firebase.database().ref();

    var obj = $firebaseObject(ref);
    var eventList = $firebaseArray(ref);
    obj.$bindTo($scope, "eventList");

    $scope.UserObj = JSON.parse(localStorage.getItem("UserObj"));
    $scope.BingopatObj = JSON.parse(localStorage.getItem("BingoObj"));
    $scope.gameCheck = JSON.parse(localStorage.getItem("gameCheckObj"));
    $scope.matObj = $scope.BingopatObj.bingopattern;
    $scope.showInProgress = false;

    console.log($scope.gameCheck.gameCheckObj)
    if ($scope.gameCheck.gameCheckObj === true) {
      $scope.showInProgress = true;
      $scope.showLockedBoard = false;
    }

    //declare
    $scope.userName = "";
    $scope.useremail = "";

    if ($scope.UserObj !== null && $scope.UserObj !== "") {
      $scope.userName = $scope.UserObj.name;
      $scope.useremail = $scope.UserObj.email;
    }
    $scope.UniKeyObj = JSON.parse(localStorage.getItem("UniKeyObj"));


    // To get the Unique Key from Local Storage 
    var key = $scope.UniKeyObj.allKeys;
    console.log(key)
    // To find the Lask Key From Key () Array for Updating the data User by User
    var last_key = key[key.length - 1];

    var patternObjects = [];
    for (var i = 0; i < $scope.matObj.length; i++) {
      var patternObj = {};
      patternObj.number = $scope.matObj[i];
      patternObj.status = "animated pulse "; //ua = unanswered, answered. correct, wrong;
      patternObjects.push(patternObj);
    }
    $scope.matObj = patternObjects;
    $scope.matrix = $scope.matObj // UI matrix draw by    $scope.matrix() object  




    var noteification = ref.child('0/event/0/notification');
    noteification.on('value', function (data) {
      console.log(data.val())
      $scope.note = data.val().note;
    })
    $scope.eventList = eventList;
    $scope.data = obj;
    eventList.$watch(function (event) {
      console.log('úpdated...', event);
    })
    var currentEvent = firebase.database().ref().child("currentEvent");   // To Get the Current Event 
    var currentEventObj = $firebaseObject(currentEvent);

    if (currentEventObj.$id == "currentEvent") {

      ref.on('value', function (snapshot) {
        var val = snapshot.val();
        $scope.currentEvent = val.currentEvent;
        console.log($scope.currentEvent)
      });

    };

    $scope.CheckGameFlagStart = false;
    $scope.checkGameStart = function () {
      var check = ref.child('0/event/0/gameCheck');
      check.on('value', function (data) {
        console.log(data.val())
        $scope.CheckStart = data.val();
        if ($scope.CheckStart === true)
          $scope.CheckGameFlagStart = true;

      })
    };
    $scope.checkGameStart();


    var quesData = firebase.database().ref('0/event/0/gameQuestions');
    quesData.on('value', gotData);
    function gotData(data) {                  // to get the Question Asked by Admin 
      $scope.showLockedBoard = false;
      $scope.defaultTimer = false;

      $scope.questionsAsked = [];
      $scope.quesDuration = []
      angular.forEach(data.val(), function (v, k) {
        $scope.questionsAsked.push(v[0]);
        console.log(v.duration);
        var timer = v.duration;
        $scope.time = timer / 1000;
        $scope.quesDuration.push($scope.time);
        var quesAsked = $scope.questionsAsked;
        var questionAskedObj = localStorage.setItem("QuesObj", JSON.stringify({ quesAsked: quesAsked }));

      })
    };

    $scope.finishCallback = function () {
      $scope.showLockedBoard = true;
    };
    // Load matrix correct answers 
    //     $scope.checkAllAnswers = function () {                                    // Function for Load Correct Answers
    //       $scope.questObj = JSON.parse(localStorage.getItem("QuesObj"));
    //       var questionAsked = $scope.questObj.quesAsked;

    //       //Row 1
    //       for (var i = 0; i < $scope.matrix.length; i++) {
    //         for (var j = 0; j < questionAsked.length; j++) {
    //           if ($scope.matrix[i].number === questionAsked[j]) {
    //             $scope.matrix[i].status = "animated pulse co";
    //           }
    //         }
    //       }

    //     }
    //  $scope.checkAllAnswers();


    // Colum Pattern form  the Matrix using patternObjects[] array  to find the matched Colum
    $scope.colum = [[patternObjects[0], patternObjects[1], patternObjects[2]], [patternObjects[3], patternObjects[4], patternObjects[5]], [patternObjects[6], patternObjects[7], patternObjects[8]]];
    console.log("$scope.colum", $scope.colum)
    // Row Pattern form  the Matrix using patternObjects[] array to find Matched Row
    $scope.row = [[patternObjects[0], patternObjects[3], patternObjects[6]], [patternObjects[1], patternObjects[4], patternObjects[7]], [patternObjects[2], patternObjects[5], patternObjects[8]]];
    console.log("$scope.row", $scope.row)
    //Get the Full board Pattern
    var FullBoard = [patternObjects[0], patternObjects[1], patternObjects[2], patternObjects[3], patternObjects[4], patternObjects[5], patternObjects[6], patternObjects[7], patternObjects[8]];

    $scope.myAnswer = [];       // User Clicked Answer 
    $scope.correctAnswer = [];   // User Correct Answers
    var col1 = [];                // Colum Array for matched Coloum in matrix
    var Row = [];                 // Row  Array For matched Row in Matrix 
    $scope.timestamp = moment().format('MMMM Do YYYY, h:mm:ss a');  // timestamp
    $scope.col1Flag = true;
    $scope.col2Flag = true;
    $scope.col3Flag = true;
    $scope.row1Flag = true;
    $scope.row2Flag = true;
    $scope.row3Flag = true;
    $scope.fullHouse = true;
    $scope.loadingmsg = true;

    $scope.SelecMatrixData = function (mat) {           // User clicked Function for to get the clicked number 
      $scope.myAnswer.push(mat.number);
      $scope.loadingmsg = false;                 // Push All clicked answer  to myAnswer[] Array 
      angular.forEach($scope.matrix, function (value, key) {       //Load Answerd Number status to the Unanswerd Satus For again Clicking 
        if (value.status == 'animated pulse an') {
          value.status = 'animated pulse ua'
        }
      });
      $scope.questObj = JSON.parse(localStorage.getItem("QuesObj"));
      var questionAsked = $scope.questObj.quesAsked;                      // to Get Asked Question
      var last_Question = questionAsked[questionAsked.length - 1];        // to Get Asked last Question far matching the Answer

      if (last_Question == mat.number) {                                  //User Clciked Answer matched with my Answer 
        mat.status = "animated pulse co";                                 // Make Clicked Answer Green
        $scope.correctAnswer.push(last_Question);                         //  Push the  Correct Answer 
        console.log($scope.correctAnswer);

        //for first Colum Match
        angular.forEach($scope.colum, function (colum) {
          if ($scope.col1Flag) {
            col1.push(colum);                                 // Get  Coloum pattern and Push to The Col1 variable 
            var firstColum = col1[0];                         // Get First Colum from 0th index of Col1 which is 0th index of $scope.colum[] Array  
            console.log("11", firstColum);
            if (firstColum[0].status == mat.status && firstColum[1].status == mat.status && firstColum[2].status == mat.status) {
              $scope.msg = "1st Colum";
              var data1 = ref.child('0/event/0/winners/columOne');          //For Upadate the Employee Details Data 
              data1.push().set({
                colOne: $scope.msg,
                name: $scope.userName,
                email: $scope.useremail,
                timestamp: moment().format('MMMM Do YYYY, h:mm:ss a')
              })
              $scope.col1Flag = false;
            }
          }   // Loop for to get the Coloum one Matched                  

        })


        //  for Second colum match
        angular.forEach($scope.colum, function (colum) {
          if ($scope.col2Flag) {
            col1.push(colum);                                   // Get  Coloum pattern and Push to The Col1 variable 
            var secondColum = col1[1];                           // Get Second Colum from 1st index of Col1 which is 1st index of $scope.colum[] Array  
            console.log("secondColum", secondColum)
            if (secondColum[0].status == mat.status && secondColum[1].status == mat.status && secondColum[2].status == mat.status) {
              $scope.msg2 = "2nd Colum";

              var data2 = ref.child('0/event/0/winners/columTwo');          //For Upadate the Employee Details Data 
              data2.push().set({
                colTwo: $scope.msg2,
                name: $scope.userName,
                email: $scope.useremail,
                timestamp: moment().format('MMMM Do YYYY, h:mm:ss a')
              })
              $scope.col2Flag = false;

            }
          }

        })


        //  for third colum match
        angular.forEach($scope.colum, function (colum) {
          if ($scope.col3Flag) {
            col1.push(colum);                                       // Get  Coloum pattern and Push to The Col1 variable 
            var thirdColum = col1[2];                               // Get third Colum from 2nd index of Col1 which is 2nd index of $scope.colum[] Array  
            console.log("thirdColum", thirdColum)
            if (thirdColum[0].status == mat.status && thirdColum[1].status == mat.status && thirdColum[2].status == mat.status) {
              $scope.msg3 = "3rd Colum";

              var data2 = ref.child('0/event/0/winners/columThree');          //For Upadate the Employee Details Data 
              data2.push().set({
                columThree: $scope.msg3,
                name: $scope.userName,
                email: $scope.useremail,
                timestamp: moment().format('MMMM Do YYYY, h:mm:ss a')
              })
              $scope.col3Flag = false;
            }
          }
        })
        // All Row MAtched Function 

        //for first Row Match
        angular.forEach($scope.row, function (row) {
          if ($scope.row1Flag) {
            Row.push(row);                                              // Get  Row pattern and Push to The Col1 variable 
            var firstRow = Row[0];                                      // Get First Row from 0th index of Row which is oth index of $scope.row[] Array  
            console.log("firstRow", firstRow)
            if (firstRow[0].status == mat.status && firstRow[1].status == mat.status && firstRow[2].status == mat.status) {
              $scope.Row1 = "1st Row";

              var data2 = ref.child('0/event/0/winners/rowOne');          //For Upadate the Employee Details Data 
              data2.push().set({
                rowOne: $scope.Row1,
                name: $scope.userName,
                email: $scope.useremail,
                timestamp: moment().format('MMMM Do YYYY, h:mm:ss a')
              })
              $scope.row1Flag = false;

            }
          }
        })
        //  for Second Row match
        angular.forEach($scope.row, function (row) {
          if ($scope.row2Flag) {
            Row.push(row);                                               // Get  Row pattern and Push to The Col1 variable 
            var secondRow = Row[1];                                       // Get Second Row from 1st index of Row which is  1st index of $scope.row[] Array  
            console.log("secondRow", secondRow)
            if (secondRow[0].status == mat.status && secondRow[1].status == mat.status && secondRow[2].status == mat.status) {
              $scope.Row2 = "2nd Row";

              var data2 = ref.child('0/event/0/winners/rowTwo');          //For Upadate the Employee Details Data 
              data2.push().set({
                rowTwo: $scope.Row2,
                name: $scope.userName,
                email: $scope.useremail,
                timestamp: moment().format('MMMM Do YYYY, h:mm:ss a')
              })
              $scope.row2Flag = false;

            }
          }
        })
        //  for Second Row match
        angular.forEach($scope.row, function (row) {
          if ($scope.row3Flag) {
            Row.push(row);                                                 // Get  Row pattern and Push to The Col1 variable 
            var thirdRow = Row[2];                                          // Get third Row from 2nd index of Row which is  2nd index of $scope.row[] Array 
            console.log("thirdRow", thirdRow)
            if (thirdRow[0].status == mat.status && thirdRow[1].status == mat.status && thirdRow[2].status == mat.status) {
              $scope.Row3 = "3rd Row";
              var data2 = ref.child('0/event/0/winners/rowThree');          //For Upadate the Employee Details Data 
              data2.push().set({
                rowThree: $scope.Row3,
                name: $scope.userName,
                email: $scope.useremail,
                timestamp: moment().format('MMMM Do YYYY, h:mm:ss a')
              })
              $scope.row3Flag = false;

            }
          }
        })
        //FullBoard  Array For matched Row in Matrix 
        if ($scope.fullHouse) {
          if (FullBoard[0].status == mat.status && FullBoard[1].status == mat.status && FullBoard[2].status == mat.status && FullBoard[3].status == mat.status && FullBoard[4].status == mat.status && FullBoard[5].status == mat.status && FullBoard[6].status == mat.status && FullBoard[7].status == mat.status && FullBoard[8].status == mat.status) {
            $scope.Full = "FullHouse";
            var data2 = ref.child('0/event/0/winners/FullHouse');          //For Upadate the Employee Details Data 
            data2.push().set({
              FullHouse: $scope.Full,
              name: $scope.userName,
              email: $scope.useremail,
              timestamp: moment().format('MMMM Do YYYY, h:mm:ss a')
            })
            $scope.fullHouse = false;
          }
        }
      } else {
        angular.forEach($scope.matrix, function (v, k) {
          if (v.number == last_Question) {                              // check If the Clicked Answer is Wrong 
            v.status = "animated pulse wr";
          }
        });
        mat.status = "animated pulse an";                               // Else Clciked unanswerd , you can again Clicked on that particular number 

      }
      var post = ref.child('0/event/0/employees/' + last_key);          //For Upadate the Employee Details Data 
      post.update({
        name: $scope.userName,
        email: $scope.useremail,
        myBoard: $scope.BingopatObj.bingopattern,
        myAnswers: $scope.myAnswer,
        prizes: "",
      });

      $scope.showLockedBoard = true;


    };

    // Row One Winner 

    var quesData = firebase.database().ref('0/event/0/winners/rowOne');
    quesData.on('value', FirstRow);
    function FirstRow(data) {                  // to get the Question Asked by Admin 
      $scope.RowOneData = [];
      angular.forEach(data.val(), function (v, k) {
        $scope.RowOneData.push(v);
      })

    };
    // Row Two Winner 

    var rowTwo = firebase.database().ref('0/event/0/winners/rowTwo');
    rowTwo.on('value', SecoundRow);
    function SecoundRow(data) {                  // to get the Question Asked by Admin 
      $scope.RowTwoData = [];
      angular.forEach(data.val(), function (v, k) {
        $scope.RowTwoData.push(v);
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
        console.log($scope.RowThreeData)

      })

    };
    //Colum one Winner

    var columOne = firebase.database().ref('0/event/0/winners/columOne');
    columOne.on('value', FirstColumOne);
    function FirstColumOne(data) {                  // to get the Question Asked by Admin 
      $scope.ColumOneData = [];
      angular.forEach(data.val(), function (v, k) {
        $scope.ColumOneData.push(v);
        console.log($scope.ColumOneData)
      })

    };
    //Colum two Winner

    var columOne = firebase.database().ref('0/event/0/winners/columTwo');
    columOne.on('value', SecoundColum);
    function SecoundColum(data) {                  // to get the Question Asked by Admin 
      $scope.ColumTwoData = [];
      angular.forEach(data.val(), function (v, k) {
        $scope.ColumTwoData.push(v);
        console.log($scope.ColumTwoData)
      })

    };

    //Colum three Winner

    var columThree = firebase.database().ref('0/event/0/winners/columThree');
    columThree.on('value', ThirdColum);
    function ThirdColum(data) {                  // to get the Question Asked by Admin 
      $scope.ColumThreeData = [];
      angular.forEach(data.val(), function (v, k) {
        $scope.ColumThreeData.push(v);
        console.log($scope.ColumThreeData)
      })

    };

    //FullBoard Winners

    var columThree = firebase.database().ref('0/event/0/winners/FullHouse');
    columThree.on('value', Full);
    function Full(data) {                  // to get the Question Asked by Admin 
      $scope.FullHouseData = [];
      angular.forEach(data.val(), function (v, k) {
        $scope.FullHouseData.push(v);
      })
      console.log($scope.FullHouseData)
      $scope.gameOver = false;
      if ($scope.FullHouseData.length >= 2) {
        $scope.gameOver = true;
        

      }
    };




    $scope.instructions = [
      "The numbers in the Zingo IQ Board are randomly allocated to each player. We wish  you a lucky board.",
      "Clues will appear in the space above the clock.",
      "The clues will always correspond to a number on the Zingo IQ Board.",
      "Look up Namely for the answer (a number).",
      "Click the correct number corresponding to the clue before the time expires",
      "You may have found the number, but it may not be on your Zingo IQ Board, too bad!",
      "You can only select your number only once and the board will be locked, so choose wisely.",
      "If your answer is correct, it will turn green immediately.",
      "A wrong answer will change to orange. ",
      "If your answer was wrong, it will reset back to default colors after the next question is called, so you can try again.",
      "Fastest fingers on the board will win.",
      "Prizes will be announced as soon as someone wins a prize.",
      "Prizes will be won if you complete columns / Rows (6 prizes - 2 per Column / Row ) or a full house (2 winners) i.e. if all numbers are green."

    ];

    $scope.options = {
      color: '#FF5722',
      duration: 50000,
      easing: 'easeInOut'
    }

    $scope.squareProgress = 1.0;

    $scope.animateSquare = function () {
      $scope.squareProgress = $scope.squareProgress;
      $pbService.animate('mySquare', $scope.squareProgress, $scope.options);
    };

    $timeout(function () {
      $scope.animateSquare();
      console.log('update progress bar')
    }, 3000);


    $scope.checkUserExists = function () {
      /* Check if local user exists in the server employee list
        If user exists continue, If user doesnt exist, clear local
        and redirec to login.
      */

      if ($scope.UserObj !== null) {
        var ref = firebase.database().ref("/0/event/0/employees");
        ref.orderByChild("email").equalTo($scope.useremail).on("value", function (snapshot) {
          if (snapshot.val() == null) {
            //Delete local storage and redirect to login

            localStorage.setItem("UserObj", null)
            $location.path('/login')
          } else {
            $scope.init();

          }
        });
      } else {
        $timeout(function () {
          localStorage.setItem("UserObj", null)
          $location.path('/login')
        })
      }

      /**************************************************************/
    }



    $scope.init = function () {
      // Function Recall on Page Load 

      $scope.showLockedBoard = true;
      $scope.defaultTimer = true;
      $scope.winnerTable = false


    };
    $scope.mediaWinnerList = true;
    $scope.listToggle = function () {
      $scope.winnerTable = !$scope.winnerTable;
      $scope.mediaWinnerList = !$scope.mediaWinnerList;
    }

    $scope.checkUserExists();


  });



