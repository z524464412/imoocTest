var imoocApp  = angular.module('imoocApp',['ui.router','MovieListModule','UserListModule']);
imoocApp.run(function($rootScope,$state,$stateParams,AUTH_EVENTS,AuthService){
    $rootScope.$state =$state;
    $rootScope.$stateParams =$stateParams;
    //$rootScope.$on('$stateChangeStart',function(event,next){
    //    console.log(event,next);
    //    var authorizedRoles = next.data.authorizedRoles;
    //    if (!AuthService.isAuthorized(authorizedRoles)) {
    //        event.preventDefault();
    //        if (AuthService.isAuthenticated()) {
    //            // user is not allowed
    //            $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
    //        } else {
    //            // user is not logged in
    //            $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
    //        }
    //    }
    //});

});
imoocApp.constant('AUTH_EVENTS',{
    loginSuccess:'auth-login-success',
    loginFailed:'auth-login-failed',
    logoutSuccess:'auth-logout-success',
    sessionTimeout:'auth-not-authenticated',
    notAuthenticated:'auth-not-authenticated',
    notAuthorized:'auth-not-authorized'
});
imoocApp.constant('USER_ROLES',{
    all:'*',
    admin:'admin',
    editor:'editor',
    guest:'guest'
});
imoocApp.service('Session', function () {
    this.create = function (sessionId, userId, userRole) {
        this.id = sessionId;
        this.userId = userId;
        this.userRole = userRole;
    };
    this.destroy = function () {
        this.id = null;
        this.userId = null;
        this.userRole = null;
    };
    return this;
})
imoocApp.factory('AuthService',function($http,Session){
    var authService = {};
    authService.login = function(credentials){
        console.log(credentials);
        return $http({
                    method:'post',
                    url:'/user/signin',
                    data:credentials
                })
            .then(function(res){
                console.log(res)
                    Session.create(0,res.data.result.id,res.data.result.role);
                return res.data.result;
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
imoocApp.controller('ApplicationController',function($scope,USER_ROLES,AuthService){
    $scope.currentUser =null;
    $scope.userRoles = USER_ROLES;
    $scope.isAuthenticated = AuthService.isAuthorized;
    $scope.setCurrentUser = function(user){
        $scope.currentUser = user;
    }
});
/**
 * 配置路由
 */
imoocApp.config(function($stateProvider,$urlRouterProvider,USER_ROLES){
    $urlRouterProvider.otherwise('/index');
    $stateProvider
        .state('index',{
            url:'/index',
            templateUrl:'templates/index.html',
        })
        .state('user/singin',{
            url:'/user/singin',
            templateUrl:'views/includes/header.html'
        })
        .state('movie/detail',{
            url:'/movie/detail/:id',
            templateurl:'views/pages/detail.html'
        })
});
