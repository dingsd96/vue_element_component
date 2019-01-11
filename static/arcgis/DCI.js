define([],function(){
    var DCI={};
    DCI.map = {};
    DCI.esri = {};
    DCI.eventObj = [];
    DCI.toolbar = undefined;
    DCI.route = {};
    DCI.baseUrl = getServerPath() +'/';
    DCI.MapService = 'http://192.168.2.178:6080/arcgis/rest/services//gzMap18/MapServer';
    DCI.GeometryService = 'http://192.168.2.178:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer';
    DCI.RouteTaskService = 'http://192.168.2.36:6080/arcgis/rest/services/vecMapRoad/NAServer/%E8%B7%AF%E5%BE%84';
    DCI.FindTaskService = 'http://192.168.2.178:6080/arcgis/rest/services/gzRouteName/MapServer';
    DCI.position = {x:0, y:0}
    return DCI
});