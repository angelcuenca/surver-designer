var SurveyEngine = SurveyEngine || {};

SurveyEngine.login = {

    login: function(){
        hello("google").login(function(e){
            log("login",e);
        });
    },
    logout: function(){
        hello("google").logout(function(){
            window.location = "/index";
        });
    },
    verifySession: function () {
        var logout = SurveyEngine.commons.userInterface.getUrlParam("logout");
        if(logout){
            var session = SurveyEngine.login;
            session.logout();
        }
    },
    init: function() {
        hello.init( {
            google 	: "899492792673-0sialmc44afuvlasa71htcifd6bcvg9e.apps.googleusercontent.com"
        },{
            redirect_uri:'callback',
            display: 'popup',
            scope: 'email'
        });

        hello.on('auth.login', function(auth){
            // call user information, for the given network
            hello( auth.network ).api( '/me' ).then( function(r){
                // Inject it into the container
                window.location = "/signup?token=" + auth.authResponse.access_token + "&service=" + auth.network;
            });
        });

        $('#btn-login').on("click", function (e) {
            e.preventDefault();
            $(this).addClass('state-loading');
            var scope = $(this);
            setTimeout(function () {
                scope.removeClass('state-loading');
                scope.addClass('state-success');
                setTimeout(function () {
                    scope.removeClass('state-success');
                }, 1000);
            }, 3000);
        });

        SurveyEngine.login.login();
    }
}




