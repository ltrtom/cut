
app.filter('truncate', function(){
    return function(str, limit){
        if(str.length > limit){
           return str.substr(0, limit);
        }
        return str;
    }
});