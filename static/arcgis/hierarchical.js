function getClusteringData (arrays,distance){
    switch(distance){
        case 18 : distance = 0.0001;
            break;
        case 17 : distance = 0.0005;
            break;
        case 16 : distance = 0.001;
            break;
        case 15 : distance = 0.0015;
            break;
        case 14 : distance = 0.002;
            break;
        case 13 : distance = 0.0025;
            break;
        case 12 : distance = 0.003;
            break;
        default: distance = 1;
            break;
    }

    // 1.将所有点分成单独的组
    var newArrays = [];
    arrays.map(function(arr){
        newArrays.push([arr])
    });

    var grouping = function(){
        var flag = false;
        // 2.将后面的组与前面的相比较
        for(var i = 0; i < newArrays.length-1; i++){
            for(var j = i+1; j < newArrays.length; j++){
                // 3.判断是不是相近的两个点
                var t = merge(newArrays[i],newArrays[j]);
                // 4.如果是相近的点，将两个点合并
                if(t){
                    newArrays.splice(j,1);
                    newArrays[i] = t;
                    flag = true
                }
            }
        }
        // 5.一直合并直到没有合并的点
        if(flag){
            grouping();
        }
    };

    // 判断是不是相近的两个点
    var merge = function(arr1,arr2){
        var arr1Average = getAverageValue(arr1);
        var arr2Average = getAverageValue(arr2);

        if(getDistance(arr1Average,arr2Average) < distance){
            arr2.map(function(arr){
                arr1.push(arr)
            });
            return arr1
        }
        else{
            return false
        }
    };

    // 两个组之间的中心距离
    var getAverageValue = function(arrs){
        var lng = 0, lat = 0;
        arrs.map(function(arr){
            lng += arr.longitude;
            lat += arr.latitude;
        });
        lng /= arrs.length;
        lat /= arrs.length;

        return {longitude:lng,latitude:lat}
    };

    // 两点之间的距离
    var getDistance = function(p1,p2){
        return Math.sqrt((p1.longitude - p2.longitude) * (p1.longitude - p2.longitude) + (p1.latitude - p2.latitude)*(p1.latitude - p2.latitude))
    };

    grouping();

    return newArrays;
}
