angular.module('myApp.service',[])
    .factory('HitService',function($q,$http){
        var service = {
            count:function(){
                var d = $q.defer();
                $http.get('/hits')
                    .success(function(data,status){
                        d.resolve(data.hits);
                    }).error(function(data,status){
                        d.reject(data)
                    })
                return d.promise;
            },
            resisterHit :function(){
                var d = $q.defer();
                $http.post('/hit',{})
                    .success(function(data,status){
                        d.resolve(data)
                    })
                    .error(function(data,status){
                        d.reject(data);
                    })
                return d.promise;
            }
        }
        return service;
    })