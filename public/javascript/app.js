var imoocApp  = angular.module('imoocApp',['ui.router','MoveListModule','UserListModule']);
imoocApp.run(function($rootScope,$state,$stateParams){
    $rootScope.$state =$state;
    $rootScope.$stateParams =$stateParams;
});

/**
 * 配置路由
 */
imoocApp.config(function($stateProvider,$urlRouterProvider){
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('/',{
            url:'/',
            templateUrl:'views/index.jade'
        })
})
