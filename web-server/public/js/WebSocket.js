/**
 * Created with JetBrains WebStorm.
 * User: Linan
 * Date: 13-4-22
 * Time: 上午10:18
 * To change this template use File | Settings | File Templates.
 */
var flag = 1;
var divArray = [1];
$(document).ready(function() {
    //
    $('#connectorHost').change(function(){
        checkHost();
    });
    //
    $('#connectorPort').change(function(){
        checkPort();
    });
    //
    $('#connectorUser').change(function(){
        checkUserid();
    });
    //
    $("div#link a").attr("target","_blank");
    //
    $('#paramName1').focus(function(){
        flag ++;
        var addDiv = "<div id='paramDiv"+flag+"'><input class='span3' type='text' placeholder='参数名' id='paramName"+flag+"'><input class='span3' type='text' placeholder='参数值' id='paramValue"+flag+"'><select id='paramType"+flag+"' class='span1'><option value='str'>字符串</option><option value='int'>数  字</option></select><a href='#' onclick='delDiv("+flag+")'><i class='icon-remove'></i></a></div>";
        $('#paramDiv').before(addDiv);
        divArray.push(flag);
        var focusDiv= '#paramName'+flag;
        $(focusDiv).focus();
    });
    //
    $("#connectorButton").click(function(){
        var host = $('#connectorHost').val().trim();
        var port = $('#connectorPort').val().trim();
        var userid = $('#connectorUser').val().trim();
        connect(userid,host,port,function(data4second){
            showConnRes(data4second,host,port,userid);
        });
    });
    //
    $('#myTab a:home').tab('show');
    //
    $("#testAPIButton").click(function(){
        var resJSON = {} ;
        for(var key=0;key<divArray.length;key++){
            var num = divArray[key];
            var paramName = $('#paramName'+num).val();
            var paramValue = $('#paramValue'+num).val();
            var paramType = $('#paramType'+num).val();
            if(!!paramName && !!paramValue){
                if(paramType == 'str'){
                    resJSON[paramName]=paramValue;
                }else if(paramType == 'int'){
                    resJSON[paramName]=parseInt(paramValue);
                }
            }
        }
        var api = $('#api').val().trim();
        serverTest(api,resJSON,function(data){
            showApiRes(data);
        });
    });
});

function connect(userid,host,port,cb){
    var route = "sio-connector.entryHandler.testToolConnector";

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
                    cb("fail conntect to Server");
                }
            });
    });
}

function showConnRes(res,host,port,userid){
    var hostPortString =userid+"--conntector-->"+host+":"+port+"\r\n";
    var conn = $('#json_text').val();
//    $('#connText').val(conn+hostPortString);
    $('#json_text').val(JSON.stringify(res));
    $('#json_text').format({method: 'json'});
}

function showApiRes(res){
    $('#json_text2').val(JSON.stringify(res));
    $('#json_text2').format({method: 'json'});
}

function checkHost(){
    var host = $('#connectorHost').val().trim();
    var pattern = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;
    var res = new RegExp(pattern).test(host);
    if(res){
        $('#connectorHostDiv').addClass('control-group success');
    }else{
        $('#connectorHostDiv').addClass('control-group error');
    }
}

function checkPort(){
    var host = $('#connectorPort').val().trim();
    var pattern = /^[0-9]*$/;
    var res = new RegExp(pattern).test(host);
    if(res){
        $('#connectorPortDiv').addClass('control-group success');
    }else{
        $('#connectorPortDiv').addClass('control-group error');
    }
}

function checkUserid(){
    var host = $('#connectorUser').val().trim();
    var pattern = /^[0-9]*$/;
    var res = new RegExp(pattern).test(host);
    if(res){
        $('#connectorUserDiv').addClass('control-group success');
    }else{
        $('#connectorUserDiv').addClass('control-group error');
    }
}

function serverTest(api,params,cb){
    pomelo.request(api, params,
        function(data) {
            cb(data);
        });
}

function delDiv(divNum){
    var paramDiv = '#paramDiv'+divNum;
    $(paramDiv).remove();
    divArray.remove(divNum);
}

function copyCode(){
    var txt = $('#json_text2').val();
    //引入 Zero Clipboard flash文件
    ZeroClipboard.setMoviePath( "js/lib/ZeroClipboard.swf" );
    //新建对象
    clip = new ZeroClipboard.Client();
    //设置指向光标为手型
    clip.setHandCursor( true );
    //通过传入的参数设置剪贴板内容
    clip.setText(txt);

    clip.addEventListener( "load", function(client) {
        client.movie.title="复制本文链接";
    });

    //鼠标移上时改变按钮的样式
    clip.addEventListener( "mouseOver", function(client) {
        document.getElementById("b_clip_button").style.cssText="color:#FF6600;";
    });
    //鼠标移除时改变按钮的样式
    clip.addEventListener( "mouseOut", function(client) {
        document.getElementById("b_clip_button").style.cssText="";
    });

    //添加监听器，完成点击复制后弹出警告
    clip.addEventListener("complete", function (client, text) {
        alert("您复制成功" );
    });
    //绑定触发对象按钮ID
    clip.glue("b_clip_button");
}

<!-- array添加功能 -->
Array.prototype.contain = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
Array.prototype.remove = function(val) {
    var index = this.contain(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};



