abcApp.controller('IndexController', function($scope) {});

abcApp.controller('ChallengeController', function($scope, $routeParams) {
    $scope.resultID = $routeParams.result_id;
})

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
        $location.path('/');
        return;
    }
    $scope.result = quizFactory.getResult();
    $scope.id = "";

    quizFactory.saveResult().then(function(id) {
        $scope.id = id;
    });

    $scope.submitResult = function() {
        // Login: See https://developers.facebook.com/docs/facebook-login/login-flow-for-web/v2.0

    }
});

abcApp.controller('QuizController', function($scope, $routeParams, $location, $timeout, quizFactory) {
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
                    $('body').unbind("keydown keypress");

                    $location.path('/done');
                }
            }
        }

        $scope.previousStep = function() {
            if ($scope.step > 1) {
                $location.path('/' + (parseInt($scope.step - 1)));
            }
        }

        // jQuery to setup listeners for the keyboard.
        $('body').unbind("keydown keypress");
        $('body').bind("keydown keypress", function (event) {
            if (event.which >= 49 && event.which <= 51 ) {
                // Handles the 1,2,3 keys
                $scope.chosen.answer = parseInt(event.which) - 49;
                $scope.$apply();
                $timeout($scope.nextStep, 500);
                event.preventDefault();
            }
            else if (event.which == 37) {
                // Handles the left arrow.
                $timeout($scope.previousStep, 100);
                event.preventDefault();
            }
            else if (event.which == 39) {
                // Handles the right arrow.
                $timeout($scope.nextStep, 100);
                event.preventDefault();
            }
        });
    });
});
