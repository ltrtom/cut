

function KeepsCtrl($scope, $http){
    $scope.view = {
        mode: 'table'
    };
    
    
    $scope.findAll = function(params){
        var conf = {
          method: 'GET',
          url: '/api/keeps',
          params: params || {}
        };
        
        $http(conf).success(function(data){
            $scope.keeps = data;
        });
    }
    
    $scope.showOne = function(keepId){    
        $http.get('/api/keeps/'+keepId).success(function(data){
           $scope.current = data; 
        });
    }
    
   $scope.submitKeep = function(){
       if($scope.current.title.length < 3 || $scope.current.content.length < 3 )
           return;
       
       if($scope.current._id){
            $http.put('/api/keeps/' + $scope.current._id, $scope.current)
            .success(function(){
              $scope.findAll();
            }); 
       }
       else{
            $http.post('/api/keeps', $scope.current)
            .success(function(){
                 $scope.findAll();
            });
       }
   }
   
   $scope.removeKeep = function(){
        $http.delete('/api/keeps/' + $scope.current._id)
        .success(function(){
            $scope.findAll();
            $scope.current = {};
        });
   }
   
   
   $scope.$watch('view', function(newVal, oldVal){
       console.log(newVal, oldVal);
   }, true);
   
   
   $scope.$watch('query', function(newVal, oldVal){
       if(newVal && newVal.trim().length >= 2){
        $scope.findAll({
            title: newVal,
            content: newVal
        });
       }
       else
           $scope.findAll();
   });
   
   
   
   $scope.findAll();          
    
}
