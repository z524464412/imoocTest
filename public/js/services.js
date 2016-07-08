angular.module('myApp.services',['ngResource'])
    .factory('Poll',function($resource){
        return $resource('/movie/list',{},{
            query:{method:'GET',params:{
                pollId:'asd'
            },isArray:true}
        })
    });
