abcApp.controller('IndexController', function($scope) {});

/**
 * Controller for the start page of the quiz.
 */
abcApp.controller('StartController', function($scope, $timeout) {
  // Set variables.
  $scope.menuOpen = null;
  $scope.layoutClassSuffix = 'layout';

  // Added helper function for the menu.
  $scope.$on('changeLayoutClassSuffix', function(event, data) {
    $scope.layoutClassSuffix = data;
  });

  // Make sure menu is closed.
  $scope.$emit('closeMenu');

  // Initial choice.
  $scope.text = "dine venner";

  var texts = ["raske penge", "dine venner", "din mor", "Helle Thorning-Scmidt"];
  var timeoutMilliseconds = 1000;
  var lastIndex = 1;

  // Timeout function to update the text.
  var setNewText = function() {
    do {
      var index = parseInt(Math.random() * texts.length);
    } while (texts.length > 1 && index === lastIndex);

    $scope.text = texts[index];
    $scope.$apply();

    lastIndex = index;

    $timeout(setNewText, timeoutMilliseconds);
  }

  $timeout(setNewText, timeoutMilliseconds);
});

/**
 * Controller for the finish page.
 */
abcApp.controller('ShareController', function($scope, $location, $routeParams, quizFactory, settingsFactory) {
  // Change layout class.
  $scope.$emit('changeLayoutClassSuffix', 'layout');


  // Redirect if the quiz has not been completed.
  if (!quizFactory.getQuizFinished()) {
    $location.path('/quiz');
    return;
  }

  $scope.link = "";
  $scope.challengeid = $routeParams.challengeid;
  $scope.facebookStatusText = "";
  $scope.challengerResult = null;
  $scope.result = quizFactory.getResult();
  $scope.id = "";

  // Test whether this is the result of a challenge and set value of challenger result.
  if ($scope.challengeid !== undefined) {
    quizFactory.getChallenge($scope.challengeid).then(function(challenger) {
      console.log(challenger);
      if (challenger !== null) {
        $scope.challengerResult = challenger.result;
      }
    });
  }

  // Initialise Facebook.
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '672101806188225',
      cookie     : true,  // enable cookies to allow the server to access
      // the session
      xfbml      : true,  // parse social plugins on this page
      version    : 'v2.0' // use version 2.0
    });
  };

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/da_DK/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  // Get the ID of the result.
  quizFactory.saveResult().then(function(id) {
    $scope.id = id;
    $scope.link = settingsFactory.getServerPath() + 'quiz/challenge/' + $scope.id;
  });

  // Function for sharing on facebook.
  $scope.shareOnFacebook = function() {
    FB.login(function(response) {
      if (response.status === 'connected') {
        FB.api(
          'me/tujmytestapp:complete',
          'post',
          {
            quiz: settingsFactory.getServerPath() + "quiz/challenge/" + $scope.id
          },
          function(response) {
            if (response.error) {
              $scope.facebookStatusText = "Der skete en fejl. Prøv igen.";
            }
          }
        );
      } else {
        $scope.facebookStatusText = "Du er ikke logget ind i facebook. Login for at dele dit resultat.";
      }
    }, {scope: 'publish_actions'});
  }
});

/**
 * Controller for the quiz.
 */
abcApp.controller('QuizController', function($scope, $routeParams, $location, $timeout, quizFactory) {
  // Change layout class.
  $scope.$emit('changeLayoutClassSuffix', 'layout');

  // Make sure the quiz has been initialised.
  quizFactory.init().then(function() {
    $quizPath = 'quiz';

    if (quizFactory.getQuizFinished()) {
      $location.path($quizPath + '/done');
    }

    $scope.challengeid = $routeParams.challengeid;
    $scope.step = $routeParams.step;
    $scope.numberOfQuestions = quizFactory.getNumberOfQuestions();
    $scope.highestQuestionAnswered = quizFactory.getHighestAnsweredQuestion();

    // Make sure we are at the right step in the quiz.
    if ($scope.step < 1 || $scope.step > $scope.highestQuestionAnswered) {
      if ($scope.challengeid !== undefined) {
        $location.path($quizPath + '/' + parseInt($scope.highestQuestionAnswered + 1) + '/' + $scope.challengeid);
      }
      else {
        $location.path($quizPath + '/' + parseInt($scope.highestQuestionAnswered + 1));
      }
    }

    $scope.challengeResult = "";
    $scope.challengerAnswerCorrect = false;
    $scope.question = quizFactory.getQuestion($scope.step);
    $scope.chosen = quizFactory.getAnswer($scope.step);

    // Setup the challenge.
    if ($scope.challengeid !== undefined) {
      quizFactory.getChallenge($scope.challengeid).then(function(challenger) {
        if (challenger === null) {
          $scope.challengeid = undefined;
        }
        else {
          if (challenger.answers[$scope.step - 1] == $scope.question.correctAnswer) {
            $scope.challengerAnswerCorrect = true;
            $scope.challengeResult = "rigtigt";
          } else {
            $scope.challengerAnswerCorrect = false;
            $scope.challengeResult = "forkert";
          }
        }
      });
    }

    // Function for moving to the next step in the quiz.
    $scope.nextStep = function() {
      if ($scope.chosen.answer !== null) {
        if ($scope.step < $scope.numberOfQuestions) {
          if ($scope.challengeid !== undefined) {
            $location.path($quizPath + '/' + (parseInt($scope.step) + 1) + '/' + $scope.challengeid);
          }
          else {
            $location.path($quizPath + '/' + (parseInt($scope.step) + 1));
          }
        }
        else if ($scope.step == $scope.numberOfQuestions) {
          quizFactory.finishQuiz();
          $('body').unbind("keydown keypress");

          if ($scope.challengeid !== undefined) {
            $location.path($quizPath + '/done' + '/' + $scope.challengeid);
          }
          else {
            $location.path($quizPath + '/done');
          }
        }
      }
    }

    // Funciton to move one step back in the quiz.
    $scope.previousStep = function() {
      if ($scope.step > 1) {
        if ($scope.challengeid !== undefined) {
          $location.path($quizPath + '/' + (parseInt($scope.step - 1)) + '/' + $scope.challengeid);
        }
        else {
          $location.path($quizPath + '/' + (parseInt($scope.step - 1)));
        }
      }
    }

    // jQuery to setup listeners for the keyboard.
    $('body').unbind("keydown keypress");
    $('body').bind("keydown keypress", function (event) {
      if (event.which >= 49 && event.which <= 57 ) {
        var answer = parseInt(event.which) - 49;
        if (answer < $scope.question.answers.length) {
          $scope.chosen.answer = parseInt(event.which) - 49;
          $scope.$apply();
        }
        event.preventDefault();
      }
      else if (event.which == 37) {
        // Handles the left arrow.
        $timeout($scope.previousStep, 100);
        event.preventDefault();
      }
      else if (event.which == 39 || event.which == 13) {
        // Handles the right arrow.
        $timeout($scope.nextStep, 100);
        event.preventDefault();
      }
    });
  });
});
