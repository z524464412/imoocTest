var MovieListModule = angular.module('MovieListModule',[]);
MovieListModule.controller('MovieListCtrl',function($scope,$http){
    $http({
        method:'GET',
        url:'/movie/list'
    }).success(function(data){
        console.log(data);
        $scope.categories =data;
    }).error(function(data){
        alert('获取失败')
    })
});
MovieListModule.controller('MovieDetailCtrl',function($scope,$http){
    $http({
        method:'GET',
        url:'/movie/list'
    }).success(function(data){
        console.log(data);
        $scope.categories =data;
    }).error(function(data){
        alert('获取失败')
    })
})