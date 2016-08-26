define(function(require,exports,module){
    module.exports = {
        /**
         * ajax方法
         * @param type 发送类型
         * @param url   地址
         * @param param 参数
         * @param callback  回调
         * @param dataType  返回类型
         * @param err_back   错误回调
         */
        ajax:function(type,url,param,callback,dataType,err_back){
            $.ajax({
                type:type,
                url:url,
                //data:{param:JSON.stringify(param)},
                data:param,
                dataType:(dataType && dataType.length > 0) ?dataType : "json",
                beforeSend:function(){
                    //前置操作
                    $("#loading").show();
                },
                success:function(data){
                    //(type === 'json') && (data =eval('('+data+')'));
                    if(data.status !== '1' ){
                        msgManage(data.status)
                        if(typeof err_back == 'function'){
                            err_back(data)
                        }
                        return false;
                    }
                    if(typeof callback == 'function'){
                        callback(data);
                    }else{
                        alert('callback is not a function');
                    }
                },
                error:function(e){
                    msgManage('err_ajax');
                },
                complete :function(){
                    setTimeout(function(){$("#loading").hide();},1000)
                }
            })
        },

        /**
         * get 方法
         * @param url
         * @param param
         * @param callback
         * @param dataType
         * @param err_back
         */
        get:function(url,param,callback,dataType,err_back){
            this.ajax('GET',url,param,callback,dataType,err_back);
        },

        /**
         * post方法
         * @param url
         * @param param
         * @param callback
         * @param dataType
         * @param err_back
         */
        post:function(url,param,callback,dataType,err_back){
            this.ajax('POST',url,param,callback,dataType,err_back);
        }
    }
});