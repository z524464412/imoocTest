var myNavigate = angular.module('myNavigate', []);
myNavigate.directive('myNav', ["$compile", function ($compile) {
    return {
        restrict: 'A',
        template: '<div>Hi there</div>',
        replace: true
    }
}])