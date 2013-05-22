var pomelo = window.pomelo;

$(document).ready(function() {
    $("#conntect").click(function(){
        var host = $('#host').val().trim();
        var port = $('#port').val().trim();
        var userid = $('#userid').val().trim();
        secondConnectToConnector(userid,host,port,function(data4second){
            showConnRes(data4second,host,port,userid);
        });
    });

    $("#testServer").click(function(){
        var api = $('#api').val().trim();
        var htmlParams = $('#params').val().trim();
        var params = JSON.parse(htmlParams);
        serverTest(api,params,function(testData){
            $("#finallyText").val(JSON.stringify(testData));
        });
    });

    $("#addIput").click(function(){
        var x = $('#paramsdiv').val().trim()+'dd';
         $('#paramsdiv').val(x);
    });
});

function secondConnectToConnector(userid,host,port,cb){
    var route = "connector.entryHandler.testToolConnector";

    pomelo.init({
        host: host,
        port: port,
        log: true
    }, function() {
        pomelo.request(route,
            {
                userid:userid
            },
            function(data) {
            if (data.code !== 500) {
                cb({
                    data:data
                });
            } else {
                cb("fail");
            }
        });
    });
}

function showConnRes(res,host,port,userid){
    var hostPortString =userid+"--conntector-->"+host+":"+port+"\r\n";
    var conn = $('#connText').val();
//    $('#connText').val(conn+hostPortString);
    $('#connText').val(JSON.stringify(res));

}

function serverTest(api,params,cb){
    pomelo.request(api, params,
        function(data) {
        cb(data);
    });
}
