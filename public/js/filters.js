
app.filter('truncate', function(){
    return function(str, limit){


        if (!str){
            return '';
        }

        if(str.length > limit){
           return str.substr(0, limit);
        }
        return str;
    }
});


app.filter('linkify', function(){
    return function(str){
    	return str.replace(/^([http|https]+:\/\/.*)/g, '<a href="$1">$1</a>');
    }
});