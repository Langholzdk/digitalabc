abcApp.controller('IndexController', function($scope) {});

abcApp.controller('StartController', function($scope, $timeout) {
    $scope.text = "dine venner";

    var texts = ["raske penge", "dine venner", "din mor", "Helle Thorning-Scmidt"];
    var timeoutMilliseconds = 1000;
    var lastIndex = 1;
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

abcApp.controller('ShareController', function($scope, $location, quizFactory) {
  if (!quizFactory.getQuizFinished()) {
    $location.path('/')
  }
  $scope.result = quizFactory.getResult();
});

abcApp.controller('QuizController', function($scope, $routeParams, $location, quizFactory) {
  quizFactory.init().then(function() {
    if (quizFactory.getQuizFinished()) {
      $location.path('/done');
    }

    $scope.step = $routeParams.step;
    $scope.numberOfQuestions = quizFactory.getNumberOfQuestions();
    $scope.highestQuestionAnswered = quizFactory.getHighestAnsweredQuestion();

    if ($scope.step < 1 || $scope.step > $scope.highestQuestionAnswered) {
      $location.path('/' + parseInt($scope.highestQuestionAnswered + 1));
    }

    $scope.question = quizFactory.getQuestion($scope.step);
    $scope.chosen = quizFactory.getAnswer($scope.step);

    $scope.nextStep = function() {
      if ($scope.chosen.answer !== null) {
        if ($scope.step < $scope.numberOfQuestions) {
          $location.path('/' + (parseInt($scope.step) + 1));
        }
        else if ($scope.step == $scope.numberOfQuestions) {
          quizFactory.finishQuiz();
          $location.path('/done');
        }
      }
    }

    $scope.previousStep = function() {
      if ($scope.step > 1) {
        $location.path('/' + (parseInt($scope.step - 1)));
      }
    }
  });
});
