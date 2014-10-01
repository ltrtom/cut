
var KEEP_URL = '/services/keeps/';



function KeepsCtrl($scope, $http, $modal){

    $scope.seeArchived = false;

    $scope.findAll = function(params){
        var conf = {
          method: 'GET',
          url: KEEP_URL,
          params: params || { 'archived': $scope.seeArchived}
        };
        
        $http(conf).success(function(data){
            $scope.keeps = data;
        });
    }
    
    $scope.showOne = function(keepId){    
        $http.get(KEEP_URL+keepId).success(function(data){
           $scope.current = data; 
        });
    }


   $scope.$watch('query', function(newVal, oldVal){
       if(newVal && newVal.trim().length >= 2){
        $scope.findAll({
            title: newVal,
            content: newVal,
            'items.content': newVal
        });
       }
       else
           $scope.findAll();
   });


   $scope.showForm = function(keep){

       var modalInstance = $modal.open({
           templateUrl: '/tpl/form_keep.html',
           controller: KeepFormCtrl,
           resolve: {
               keep: function() {
                   return keep;
               }
           }
       });
       modalInstance.result.then(function(toReload){
           if (toReload){
               $scope.findAll();
           }
       });
   };


   $scope.doSeeArchived = function(){

       $scope.findAll({
          'archived': !$scope.seeArchived
       });

   }

}

function KeepFormCtrl($scope, $modalInstance, $http, keep){

    if (!keep){
        keep = {
          type: 'note'
        };
    }

    $scope.keep = keep;

    $scope.addNewItem = function(index){
        // only the last item can trigger an new input
        if ($scope.keep.items.length == (index + 1)){

            $scope.keep.items.push({
                done: false,
                content: ''
            });
        }

    };

    $scope.initItems = function(){
        var empty = {done: false, content: ''};

        if (!$scope.keep.items || $scope.keep.items.length === 0){
            $scope.keep.items = [empty];
        }
    };


    $scope.submit = function(){


        if(!$scope.keep.title && $scope.keep.title.trim().length < 3){
            return;
        }


        if ($scope.keep.type === 'note'){
            if($scope.keep.content.length < 3 )
                return;
            $scope.keep.items = [];
        }
        else{

            // strip empty items
            var valids = [];
            $scope.keep.items.forEach(function(item){
                if (item && item.content){
                    valids.push(item);
                }
            });
            $scope.keep.items = valids;
            $scope.keep.content = null;
        }

        if($scope.keep._id){
            $http.put(KEEP_URL + $scope.keep._id, $scope.keep)
                .success(function(){
                    $modalInstance.close(true);
                });
        }
        else{
            $http.post(KEEP_URL, $scope.keep)
                .success(function(){
                    $modalInstance.close(true);
                });
        }
    }

    $scope.delete = function(){
        $http.delete(KEEP_URL + $scope.keep._id)
            .success(function(){
                $modalInstance.close(true);
                $scope.keep = {};
            });
    }

    $scope.archive = function(toBeArchived){
        if ($scope.keep){
            $scope.keep.archived = toBeArchived;
            $scope.submit();
        }

    }

    $scope.deleteItem = function(item){
        var index = $scope.keep.items.indexOf(item);

        $scope.keep.items.splice(index, 1);
    };


    $scope.cancel = function(){
        $modalInstance.dismiss('cancel');
    };

}
