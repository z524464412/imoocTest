var routerApp = angular.module('routerApp',['ui.router','ngGrid','BookListModule','BookDetailModule'])
routerApp.run(function($rootScope,$state,$stateParams){
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
})
/**
 * 配置路由
 */
routerApp.config(function($stateProvider,$urlRouterProvider){
    $urlRouterProvider.otherwise('/index');
    $stateProvider
        .state('index',{
            url:'/index',
            views:{
                '':{
                    templateUrl:'templates/home.html'
                },
                'main@index':{
                    templateUrl:'templates/loginForm.html'
                }
            }
        })
        .state('bookList',{
            url:'/{bookType:[0-9]{1,4}}',
            views:{
                '':{
                    templateUrl:'templates/bookList.html'
                },
                'bookType@bookList':{
                    templateUrl:'templates/bookType.html'
                },
                'bookGrid@bookList':{
                    templateUrl:'templates/bookGrid.html'
                }
            }
        })
        .state('addBook',{
            url:'/addBook',
            templateUrl:'templates/addBookForm.html'
        })
        .state('bookDetail',{
            url:'/bookDetail/:bookId',
            templateUrl:'templates/bookDetail.html'
        })

});
