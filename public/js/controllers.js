var bookListModule  = angular.module('BookListModule',[]);
bookListModule.controller('BookListCtrl',function($scope,$http,$state,$stateParams){
    $scope.filterOptions = {
        filterText:'',
        useExternalFilter:true
    };
    $scope.totalServerItems  = 0;
    $scope.pagingOptions = {
        pageSizes :[5,10,20],
        pageSize:5,
        currentPage:1
    };
    $scope.setPagingData =function(data,page,pageSize){
        var pageData = data.slice((page-1)-pageSize,page * pageSize);
        $scope.books = pageData;
        $scope.totalServerItems =data.length;
        if(!$scope.$$phase){
            $scope.$apply();
        }
    };
    $scope.getPageDataAsync = function(pageSize,page,searchText){
        setTimeout(function(){
            var data;
            console.log(searchText);
            if(searchText){
                var ft = searchText.toLowerCase();
                $http.get('data/books'+$stateParams.bookType+'.json')
                    .success(function(largeLoad){
                        data = largeLoad.filter(function(item){
                            return JSON.stringify(item).toLowerCase().indexOf(ft) != -1
                        });
                        $scope.setPagingData(data,page,pageSize);
                    })

            }else{
                $http.get('data/books'+$stateParams.bookType+'.json')
                    .success(function(largeLoad){
                        $scope.setPagingData(largeLoad,page,pageSize);

                    });

            }
        },100);
    }
    $scope.getPageDataAsync($scope.pagingOptions.pageSize,$scope.pagingOptions.currentPage);
    $scope.$watch('pageingoptions',function(newVal,oldVal){
        if(newVal !== oldVal && newVal.currentPage !== oldVal.currentPage ){
            $scope.getPageDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    },true);
    $scope.$watch('filterOptions', function(newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.getPageDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
    $scope.gridOptions = {
        data: 'books',
        rowTemplate: '<div style="height: 100%"><div ng-style="{ \'cursor\': row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell ">' +
        '<div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }"> </div>' +
        '<div ng-cell></div>' +
        '</div></div>',
        multiSelect: false,
        enableCellSelection: true,
        enableRowSelection: false,
        enableCellEdit: true,
        enablePinning: true,
        columnDefs: [{
            field: 'index',
            displayName: '序号',
            width: 60,
            pinnable: false,
            sortable: false
        }, {
            field: 'name',
            displayName: '书名',
            enableCellEdit: true
        }, {
            field: 'author',
            displayName: '作者',
            enableCellEdit: true,
            width: 220
        }, {
            field: 'pubTime',
            displayName: '出版日期',
            enableCellEdit: true,
            width: 120
        }, {
            field: 'price',
            displayName: '定价',
            enableCellEdit: true,
            width: 120,
            cellFilter: 'currency:"￥"'
        }, {
            field: 'bookId',
            displayName: '操作',
            enableCellEdit: false,
            sortable: false,
            pinnable: false,
            cellTemplate: '<div><a ui-sref="bookDetail({bookId:row.getProperty(col.field)})" id="{{row.getProperty(col.field)}}">详情</a></div>'
        }],
        enablePaging: true,
        showFooter: true,
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions
    };
});
/**
 * 这里是书籍详情模块
 */
var bookDetailModule = angular.module("BookDetailModule", ['myApp.services']);
bookDetailModule.controller('BookDetailCtrl', function($scope, $http, $state, $stateParams,Poll) {
    //console.log($stateParams)
    //$scope.polls = Poll.query()
    //console.log( $scope.polls);
    $http({
        method:'GET',
        url:'/movie/list',
    }).success(function(data){
        console.log(data)
        $scope.bookDetail ={
            name:data[0].movies[0].title,
            img:data[0].movies[0].poster,
            type:'',
            time:data[0].movies[0].meta.updateAt,
            writer:data[0].movies[0].doctor,
            price:data[0].movies[0].year,
            Ebook:'1'
        }

    }).error(function(data){
       alert('获取失败')
    })
});