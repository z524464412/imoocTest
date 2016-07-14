var UserService = angular.module('UserService',[]);
UserService.service('Session',function(){
    this.create = function(sessionId,userId,userRole){
        this.id = sessionId;
        this.userId = userId;
        this.userRole = userRole;
    };
    this.destroy = function(){
        this.id = null;
        this.userId =null;
        this.userRole = null;
    }
    return this;
});
UserService.factory('AuthService',function($http,Session){
    console.log(Session);
    var authService = {};
    authService.login = function(credentials){
        return $http
            .post('/user/signin',credentials)
            .then(function(res){
                Session.create(res.data.id,res.data.user.id,res.data.user.role);
                return res.data.user;
            })
    }
    authService.isAuthenticated = function(){
        return !!Session.userId;

    };
    authService.isAuthorized = function(authorizedRoles){
        if(!angular.isArray(authorizedRoles)){
            authorizedRoles = [authorizedRoles];
        }
        return (authService.isAuthenticated() && authorizedRoles.indexOf(Session.userRole)!== -1);
    }
    return authService;
});