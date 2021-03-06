(function( $ ) {
  $.fn.cookieChecker = function(options) {
    //maintain chainability
    return this.each(function() {
    
      // Create some defaults, extending them with any options that were provided
      var settings = $.extend( {
        'cookieName': 'policyAgreed',
        'msgFile'   : '../../partials/snippets/cookie-message.html',
        'duration'   : '3'
      }, options);

      var cName = settings.cookieName;
      var msgFile = settings.msgFile;
      var duration = Number(settings.duration);

      //check for the cookie
      function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
          for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
          }
        return null;
      }

      if(readCookie(cName) != null) {
        // console.info('we have cookies');
        } else {
        $('#js-cookieterms').load(msgFile, function(){
          $(this).slideDown();
          $('#js-cookieterms--agree').on('click', function(){
            // create one year duration cookie
            var theDate = new Date();
            var oneYearLater = new Date( theDate.getTime() + (31536000000 * duration));
            var expiryDate = oneYearLater.toGMTString();
            document.cookie = cName+'=1;expires='+expiryDate;
            $('#js-cookieterms').slideUp('fast',function(){
              $('#js-cookieterms').empty().remove();
            });
          });
        });
      };
    // end chainability
    });
  // end cookieChecker
  }
// end plugin
})( jQuery );