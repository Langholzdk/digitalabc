// Header controller.
abcApp.controller('HeaderController', function($scope, $document, $animate, $location, $rootScope, $timeout) {
  // Initialise variables.
  $scope.menuOpen = null;
  $scope.layoutClassSuffix = 'layout';

  // Disable animation for nav element.
  $animate.enabled(false, angular.element(document.getElementsByClassName('js-disable-animations')));

  // Added helper function for the menu.
  $scope.$on('changeLayoutClassSuffix', function(event, data) {
    $scope.layoutClassSuffix = data;
  });

  // Function for open/close menu.
  $scope.toggleMenu = function() {
    if ($scope.menuOpen === null) {
      $scope.menuOpen = false;
    }

    $scope.menuOpen = !$scope.menuOpen;

    // Add toggle to html tag to avoid scrolling when the menu is open.
    // We add the class this way because the <html> is not in $scope.
    $('html').toggleClass('is-locked');
  };

  // Handle active menu item
  $scope.setActiveMenuItem = function(path) {
    if ($location.path() === path) {
      return "is-active";
    } else {
      return "";
    }
  }

  // Function to scroll to the position of the different elements on the frontpage.
  var scrollToPosition = function() {
    // Handle video URLs
    if ($location.path() === '/video') {
      $timeout(function() {
        $document.scrollToElement(angular.element(document.getElementById('video')), 0, 500);
      }, 1000);
    }
    else if ($location.path() === '/video/troll-painter') {
      $timeout(function() {
        $scope.playVideo('troll-painter');
      }, 1000);
    }
    else if ($location.path() === '/video/slave') {
      $timeout(function() {
        $scope.playVideo('slave');
      }, 1000);
    }
    else if ($location.path() === '/video/broke-teenager') {
      $timeout(function() {
        $scope.playVideo('broke-teenager');
      }, 1000);
    }
    else if ($location.path() === '/video/pain-in-the-butt') {
      $timeout(function() {
        $scope.playVideo('pain-in-the-butt');
      }, 1000);
    }
    else if ($location.path() === '/video/moving-out') {
      $timeout(function() {
        $scope.playVideo('moving-out');
      }, 1000);
    }
    else if ($location.path() == '/music-video') {
      $timeout(function() {
        $document.scrollToElement(angular.element(document.getElementById('rap')), 0, 500);
      }, 1000);
    }
  }
  scrollToPosition();

  // Change route.
  $rootScope.$on('$routeChangeSuccess', function() {
    // Make sure menu is closed.
    if ($scope.menuOpen !== null) {
      $scope.menuOpen = false;
    }

    // Scroll to the correct position.
    scrollToPosition();

    // Add toggle to html tag to avoid scrolling when the menu is open.
    // We add the class this way because the <html> is not in $scope.
    $('html').removeClass('is-locked');

    // Add class to animation overlay and remove it when the CSS animation ends.
    $('.js-animation-overlay')
      .addClass('is-animating')
      .one('webkitAnimationEnd oAnimationend animationend',
      function() {
        $(this).removeClass('is-animating');
      });

    // Change title dependant on current url.
    if ($location.path().indexOf("/quiz") === 0) {
      window.document.title = 'Digital ABC - Quiz';
    }
    else if ($location.path().indexOf("/undervisningsmateriale") === 0) {
      window.document.title = 'Digital ABC - Undervisningsmateriale';
    }
    else if ($location.path().indexOf("/om-projektet") === 0) {
      window.document.title = 'Digital ABC - Om projektet';
    }
    else if ($location.path().indexOf("/music-video") === 0) {
      window.document.title = 'Digital ABC - Musikvideo';
    }
    else if ($location.path().indexOf("/video") === 0) {
      window.document.title = 'Digital ABC - Videoer';
    }
    else {
      window.document.title = 'Digital ABC';
    }
  });

  // Video controls.
  $scope.showVideo = false;

  $scope.videos = [];

  // Play video.
  $scope.playVideo = function(video) {
    if (!$scope.videos[video]) {
      videojs($('.' + video)[0], {"width": 'auto', "height": '100%'}, function() {
        $scope.videos[video] = this;
        $scope.video = this;
        this.play();
      });
    } else {
      $scope.videos[video].play();
      $scope.video = $scope.videos[video];
    }

    // Show video container.
    $scope.showVideo = video;
  };

  // Stop video.
  $scope.stopVideo = function() {
    $scope.video.pause();

    $document.scrollToElement(angular.element(document.getElementById('video')), 0, 500);

    $scope.showVideo = '';
  }


  // Slideshow
  var slidesInSlideshow = 2;
  var slidesTimeIntervalInMs = 5000;

  $scope.slideshow = 1;

  var slideTimer =
    $timeout(function interval() {
      $scope.slideshow = ($scope.slideshow % slidesInSlideshow) + 1;
      slideTimer = $timeout(interval, slidesTimeIntervalInMs);
    }, slidesTimeIntervalInMs);
});

// Frontpage controller.
abcApp.controller('FrontpageController', function($scope, $location) {
  // Change layout class.
  $scope.$emit('changeLayoutClassSuffix', 'layout');
});


// Static page controller.
abcApp.controller('StaticPageController', function($scope, $location, $document) {
  // Change layout class.
  $scope.$emit('changeLayoutClassSuffix', 'static-page');
});

// Error 404 controller.
abcApp.controller('Error404Controller', function($scope, $location, $document) {
  // Change layout class.
  $scope.$emit('changeLayoutClassSuffix', 'error-404');
});
