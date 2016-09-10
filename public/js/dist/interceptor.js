define(function(require, exports, module) {
    var Interceptor = {
        config:{
            APP:[
                {'id':'10001','name':'主页','icon':'icon-cogs','leaf':[
                    {'id':'10001-2','name':'主页','icon':'icon-star-empty','href':'/admin/movie/new', isLeaf:true},
                ]},
                {'id':'10001','name':'电影管理','icon':'icon-cogs','leaf':[
                    {'id':'10001-2','name':'添加电影','icon':'icon-star-empty','href':'/admin/movie/new', isLeaf:true},
                    {'id':'10001-4','name':'电影列表','icon':'icon-star-empty','href':'/admin/movie/list', isLeaf:true},
                ]},
                {'id':'10001','name':'电影类型','icon':'icon-cogs','leaf':[
                    {'id':'10001-1','name':'添加类型','icon':'icon-star-empty','href':'/admin/category/new', isLeaf:true},
                    {'id':'10001-2','name':'类型列表','icon':'icon-star-empty','href':'/admin/category/list', isLeaf:true},
                ]}
            ]
        },
        init: function () {
            //if (this.getBrower().isIE7OrLower){
            //    $("body").html('<div class="container"><div class="page-header"><h1>对不起，您的浏览器不受支持</h1></div><p class="lead">特别注意，我们坚决支持这些浏览器的最新版本。在 Windows 平台，我们支持 Internet Explorer 9以上。请看下面列出的详细信息。</p></div><div class=table-responsive><table class="table table-bordered table-striped"><thead><tr><td></td><th>Chrome</th><th>Firefox</th><th>Internet Explorer</th><th>Opera</th><th>Safari</th></tr></thead><tbody><tr><th>Android</th><td class=text-success><span class="glyphicon glyphicon-ok">支持</span><span class=sr-only>支持</span></td><td class=text-success><span class="glyphicon glyphicon-ok">支持</span><span class=sr-only>支持</span></td><td class=text-muted rowspan=3 style="vertical-align: middle;">N/A</td><td class=text-danger><span class="glyphicon glyphicon-remove">不支持</span><span class=sr-only>不支持</span></td><td class=text-muted>N/A</td></tr><tr><th>iOS</th><td class=text-success><span class="glyphicon glyphicon-ok">支持</span><span class=sr-only>支持</span></td><td class=text-muted>N/A</td><td class=text-danger><span class="glyphicon glyphicon-remove">不支持</span><span class=sr-only>不支持</span></td><td class=text-success><span class="glyphicon glyphicon-ok">支持</span><span class=sr-only>支持</span></td></tr><tr><th>Mac OS X</th><td class=text-success><span class="glyphicon glyphicon-ok">支持</span><span class=sr-only>支持</span></td><td class=text-success><span class="glyphicon glyphicon-ok">支持</span><span class=sr-only>支持</span></td><td class=text-success><span class="glyphicon glyphicon-ok">支持</span><span class=sr-only>支持</span></td><td class=text-success><span class="glyphicon glyphicon-ok">支持</span><span class=sr-only>支持</span></td></tr><tr><th>Windows</th><td class=text-success><span class="glyphicon glyphicon-ok">支持</span><span class=sr-only>支持</span></td><td class=text-success><span class="glyphicon glyphicon-ok">支持</span><span class=sr-only>支持</span></td><td class=text-success><span class="glyphicon glyphicon-ok">支持</span><span class=sr-only>支持</span></td><td class=text-success><span class="glyphicon glyphicon-ok">支持</span><span class=sr-only>支持</span></td><td class=text-danger><span class="glyphicon glyphicon-remove">不支持</span><span class=sr-only>不支持</span></td></tr></tbody></table></div>');
            //}else{
            //    if($(".body").attr("app")){
            //        $("<div/>",{"id":"loading","class":"loaded"})
            //            .append('<div class=loading><div class="loader-inner pacman"><div></div><div></div><div></div><div></div><div></div></div>')
            //            .appendTo("body");
            //        this.bar();
                    this.control();
                    this.layout();
                    $(window).resize(function(){
                        Interceptor.layout();
                    });
                    this.tools();
                    //this.recentUsedFunc.init();
                    //this.recentUsedFunc.addRecentUsedFunc();
                    setTimeout(function(){$("#loading").hide();},1000);
            //    }
            //}

        },
        layout:function(){
            var _w=$(window).innerWidth(),
                _h=$(window).innerHeight();
            if(_w>992){
                Interceptor.controlMax();
            }else{
                Interceptor.controlMin();
            }
            $(".layout-left,.layout-right,.layout-center").each(function(){
                var _t=165,
                    title=$(this).find(".layout-title").size();
                var content=$(this).find(".layout-content:visible").size()+$(this).find(".layout-content-nopadding:visible").size();
                if($(this).find(".layout-heading").size()>0){_t+=40;}
                if($(this).find(".layout-footer").size()>0){_t+=40;}
                if(title>0){_t+=60*title;}
                $(this).find(".layout-content").height((_h-_t)/content);
                console.log((_h-_t)/content);
                console.log($(this).find(".layout-content").height())
                $(this).find(".layout-content-nopadding").height((_h-_t)/content+20);
            });
            if($(".layout-left").css("float")==="none" && _w>768){
                $('.layout').each(function(){
                    var len=1;
                    if($(this).find(".layout-left").size()>0 && $(this).find(".layout-right").size()>0){
                        len=2;
                    }
                    if($(this).find(".layout-left").size()>0 && $(this).find(".layout-right").size()>0 && $(this).find(".layout-center").size()>0){
                        len=2+$(this).find(".layout-center").size();
                    }
                    $(this).height((_h-145)*len);
                });

            }else{
                $('.layout').height(_h-145);
            }
        },
        tools:function(){
            //$("#loading").ajaxStart(function(){
            //    $("#loading").show();
            //}).ajaxComplete(function(){
            //    setTimeout(function(){$("#loading").hide();},500);
            //});
            $(".tip").tooltip({placement: 'top'});
            $(".tipb").tooltip({placement: 'bottom'});
            $(".tipl").tooltip({placement: 'left'});
            $(".tipr").tooltip({placement: 'right'});
            $("[data-toggle=popover]").popover();
            var $scroll=$(".scroll");
            if($scroll.length > 0){
                $(".scroll").mCustomScrollbar({axis:'yx',mouseWheel:{enable: true, axis: 'y'} ,advanced: {autoScrollOnFocus: false}});
            }
            $(".modal").on('shown.bs.modal',function(){
                $(this).find('.scroll').mCustomScrollbar('update');
            });
            $.noty.defaults = {
                layout: 'topCenter',
                theme: 'defaultTheme',
                type: 'alert',
                text: '',
                dismissQueue: true,
                template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
                animation: {
                    open: {height: 'toggle'},
                    close: {height: 'toggle'},
                    easing: 'swing',
                    speed: 200
                },
                timeout: 2000,
                force: false,
                modal: true,
                maxVisible: 5,
                killer: true,
                closeWith: ['hover'], // ['click', 'button', 'hover', 'backdrop']
                callback: {
                    onShow: function() {},
                    afterShow: function() {},
                    onClose: function() {},
                    afterClose: function() {},
                    onCloseClick: function() {}
                },
                buttons: false
            };

        },
        bar: function (){

            var tmp='<nav class="topbar">';
            tmp+='<span class="pull-left">';
            tmp+='<a href="" class="logo"></a>';
            tmp+='</span>';
            tmp+='<span class="pull-right">';
            tmp+='<div class="dropdown pull-right"><a href="" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="true"><span class="icon-cog"></span></a>';
            tmp+='<div class="dropdown-menu theme-pane">';
            tmp+='</div></div>';
            tmp+='<a href="'+seajs.baseHTTP+'/logout.action"><title>退出</title><span class="icon-off"></span></a>';
            tmp+='</span></nav>';
            tmp+='<div class="clearfix"></div>';
            $(".body").append(tmp);
            $("a.theme").click(function(){
                var bg=$(this).attr("data-bg");
                $("body").css("background-image","url("+seajs.baseHTTP+"/css/images/bg/wall_num"+bg+".jpg)");
                $(".theme-pane a.active").removeClass("active");
                $(this).addClass("active");
                return false;
            });
            $(window).scroll(function(){
                var st=$(window).scrollTop();
                if(st>50){
                    $(".topbar").addClass("topbar-bg");
                }else{
                    $(".topbar").removeClass("topbar-bg");
                }
            });
            var footer="<p class='clear'></p><div class='footer'>";
            // footer+="<span class='pull-left'>Copyright © 上海仪电鑫森科技有限公司 2015. All rights reserved</span>";
            footer+="<span class='pull-right'><a class='padding-right15px'>Copyright © 上海仪电鑫森科技有限公司 2015. All rights reserved</a><a href='#'>联系我们</a></span>";
            footer+="</div";
            $(".wrapper").append(footer);


        },
        controlMin:function(){
            var $con_min=$("#control-min");
            var $sidebar =$("#sidebar");
            $con_min.find("span").removeClass("icon-arrow-left").addClass('icon-arrow-right');
            $sidebar.hide();
            $sidebar.fadeIn(500);
            $("#control").addClass("control-min");
            $(".topbar,.footer").css("padding-left",55);
            $(".stage").css("padding-left",55);
            $con_min.attr("data-original-title","最大化");
        },
        controlMax:function(){
            var $con_min=$("#control-min");
            $con_min.find("span").removeClass("icon-arrow-right").addClass('icon-arrow-left');
            $("#sidebar").hide();
            $("#sidebar").fadeIn(500);
            $("#control").removeClass("control-min");
            $(".topbar,.footer").css("padding-left",15);
            $(".stage").css("padding-left",225);
            $con_min.attr("data-original-title","最小化");
        },
        control: function () {
            $(".wrapper").prepend("<div class=\"control panel panel-default\" id=\"control\"><div id='sidebar'><div class=\"userinfo\">" +
                "<button id='control-min' class='btn btn-xs btn-link tipr' title='最小化'><span class='icon-arrow-left'>" +
                "</span></button><img onerror='' src='../../css/images/logo.jpg'/><h4>管理员</h4></div></div></div>");
            $("#control-min").click(function(){
                if(parseInt($("#control").css("left"))===0){
                    Interceptor.controlMax();
                }else{
                    Interceptor.controlMin();
                }
                return false;
            });
            var $con=$("#sidebar");
            if ($con.length>0) {
                //$con.append('<div class="control-search"><div class="input-group"><span class="input-group-addon"><span class="icon-search"></span></span><input id="controlSearch" type="text" class="form-control" placeholder="功能搜索"></div></div>');
                _.each(this.config.APP,function(item,i){
                    var controlPane = $('<div/>',{"class":"dropdown"});
                    var controlHandler = $('<a/>',{
                        "type":"button",
                        "id":"dropdownMenu"+i,
                        "data-toggle":"dropdown",
                        "aria-expanded":"true",
                        "href":"###",
                        "class":"dropdown-toggle tabhandler"
                    }).append('<span class="'+item.icon+'"></span> '+item.name);
                    if(i!=0) controlHandler.append('<i class="icon-angle-right pull-right"></i>');
                    else controlHandler.append('<i class="icon-angle-right pull-right"></i>');
                    /*$("#user_favmenu").click(function(){

                     // console.log(${pageId?if_exists})
                     // location.href=seajs.baseHTTP+'/user/userFavmenu-index.action?';
                     console.log(VIEW_PARAM)
                     });*/
                    if (item.leaf) {
                        var ulWrapper = $("<ul/>",{
                            "class":"dropdown-menu",
                            "role":"menu",
                            "aria-labelledby":"dropdownMenu"+i
                        });
                        _.each(item.leaf,function(leaf){
                            if(typeof leaf=='undefined' ){
                                return true;
                            }
                            if((!leaf.leaf || leaf.leaf.length < 1) && leaf.isLeaf){
                                var aWrapper = $('<a/>',{
                                    "href": "###",
                                    "url": leaf.href,
                                    "role":"menuitem",
                                    "tabindex":"-1",
                                    "class": "funcItems breadcrumbDef"
                                }).append('<span class="'+leaf.icon+'"></span> '+leaf.name);
                                $('<li/>').attr("role","presentation").append(aWrapper)
                                    .appendTo(ulWrapper);
                            }else{
                                ulWrapper.addClass("dropdown-big");
                                var liWrapper=$("<li/>").attr("role","presentation");
                                var pWrapper = $("<p/>").append("<span class='"+leaf.icon+"'></span> "+leaf.name+"<div class='clearfix'></div>");
                                if (leaf.name == "最近使用") {
                                    liWrapper.attr('id', 'resentUsed');
                                }
                                if (leaf.name == "我的收藏") {
                                    liWrapper.attr('id', 'mineCollection');
                                }
                                // console.log(leaf, leaf.name);
                                _.each(leaf.leaf,function(leafs){
                                    if(!leafs)return;
                                    var aWrapper = $("<a/>",{"href":"###", "url": leafs.href, "class": "funcItems"}).append("· "+leafs.name)
                                        .appendTo(pWrapper);

                                });
                                liWrapper.append(pWrapper).appendTo(ulWrapper);
                            }
                        });
                    }
                    controlPane.append(controlHandler).append(ulWrapper).appendTo($con);
                    $('#control .dropdown').on('show.bs.dropdown', function () {
                        var h=$(this).find(".dropdown-menu").height();
                        //$(this).find(".dropdown-menu").css("top",(h>40)?(-h/2):0);
                        $(this).find(".dropdown-menu").css("top",0)
                    })
                });
            };
            //$("#control a.dropdown-toggle").on("mouseover,mouseout", function() {
            //    if ($(this).parent().is(".open")) {
            //        return ;
            //    }
            //    $(this).dropdown("toggle")
            //});
            $(".control .dropdown").hover(function(){
                $(this).addClass('open');
            },function(){
                $(this).removeClass('open');
            })
            $(document).on('keyup','#controlSearch',function(){
                var v=this.value;
                _.filter($('#control .dropdown'), function(el){
                    if($(el).text().indexOf(v)==-1){
                        $(el).hide();
                    }else{
                        $(el).show();
                    }
                })
            });
        },
        recentUsedFunc: {
            init: function(){
                //var cookies_funcs = $.cookie('recentUsedFuncs') == null ? {funcList:[]} : eval('(' + $.cookie('recentUsedFuncs') + ')');
                var cookies_funcs = null;
                if ($.cookie('recentUsedFuncs') == null) {
                    $.cookie('recentUsedFuncs', JSON.stringify({funcList:[]}), {"path": "/", "expires": 30});
                }
                cookies_funcs = eval('(' + $.cookie('recentUsedFuncs') + ')');
                _.each(cookies_funcs.funcList, function(item, index){
                    $('#resentUsed').find('p:first').append('<a class="usedAleard" href="' + item.url + '">' + item.name + '</a>');
                });
            },
            addRecentUsedFunc: function(){
                var funcMax = 8;
                $('.funcItems').bind('click', function(event) {
                    var $this = $(this);
                    //var cookies_funcs = $.cookie('recentUsedFuncs') == null ? {funcList:[]} : eval('(' + $.cookie('recentUsedFuncs') + ')');
                    var cookies_funcs = eval('(' + $.cookie('recentUsedFuncs') + ')');
                    var cookie_length = 0;
                    if (_.find(cookies_funcs.funcList, function(item){
                            if (item.url == $this.attr('url')) {
                                return true;
                            }
                        })) {
                        window.location.href = $this.attr('url');
                        return false;
                    }
                    if ($this.hasClass('breadcrumbDef')) {
                        cookie_length = cookies_funcs.funcList.unshift({'url': $(this).attr('url'), name: '· ' + $(this).text()});
                    } else {
                        cookie_length = cookies_funcs.funcList.unshift({'url': $(this).attr('url'), name: $(this).text()});
                    }
                    if (cookie_length > funcMax) {
                        cookies_funcs.funcList.pop();
                        //$('#resentUsed').find('.usedAleard:last').remove();
                    }
                    $.cookie('recentUsedFuncs', JSON.stringify(cookies_funcs), {"path": "/", "expires": 30});
                    // if ($('#resentUsed').find('.usedAleard').length == 0) {
                    // 	$('#resentUsed').find('p:first').append('<a class="usedAleard" href="' + $(this).attr('href') + '">' + $(this).text() + '</a>');
                    // }else{
                    // 	$('#resentUsed').find('.usedAleard:first').before('<a class="usedAleard" href="' + $(this).attr('href') + '">' + $(this).text() + '</a>');
                    // }
                    window.location.href = $this.attr('url');
                });
            }
        },
        getBrower:function(userAgent,language){
            var version,webkitVersion,browser={};
            userAgent=(userAgent||navigator.userAgent).toLowerCase();
            language=language||navigator.language||navigator.browserLanguage;
            version=browser.version=(userAgent.match(/.*(?:rv|chrome|webkit|opera|ie)[\/: ](.+?)([ \);]|$)/)||[])[1];
            webkitVersion=(userAgent.match(/webkit\/(.+?) /)||[])[1];
            browser.windows=browser.isWindows=!!/windows/.test(userAgent);
            browser.mac=browser.isMac=!!/macintosh/.test(userAgent)||(/mac os x/.test(userAgent)&&!/like mac os x/.test(userAgent));
            browser.lion=browser.isLion=!!(/mac os x 10_7/.test(userAgent)&&!/like mac os x 10_7/.test(userAgent));
            browser.iPhone=browser.isiPhone=!!/iphone/.test(userAgent);
            browser.iPod=browser.isiPod=!!/ipod/.test(userAgent);
            browser.iPad=browser.isiPad=!!/ipad/.test(userAgent);
            browser.iOS=browser.isiOS=browser.iPhone||browser.iPod||browser.iPad;
            browser.android=browser.isAndroid=!!/android/.test(userAgent);
            browser.opera=/opera/.test(userAgent)?version:0;
            browser.isOpera=!!browser.opera;
            browser.msie=/msie/.test(userAgent)&&!browser.opera?version:0;
            browser.isIE=!!browser.msie;
            browser.isIE8OrLower=!!(browser.msie&&parseInt(browser.msie,10)<=8);
            browser.mozilla=/mozilla/.test(userAgent)&&!/(compatible|webkit|msie)/.test(userAgent)?version:0;
            browser.isMozilla=!!browser.mozilla;
            browser.webkit=/webkit/.test(userAgent)?webkitVersion:0;
            browser.isWebkit=!!browser.webkit;
            browser.chrome=/chrome/.test(userAgent)?version:0;
            browser.isChrome=!!browser.chrome;
            browser.mobileSafari=/apple.*mobile/.test(userAgent)&&browser.iOS?webkitVersion:0;
            browser.isMobileSafari=!!browser.mobileSafari;
            browser.iPadSafari=browser.iPad&&browser.isMobileSafari?webkitVersion:0;
            browser.isiPadSafari=!!browser.iPadSafari;
            browser.iPhoneSafari=browser.iPhone&&browser.isMobileSafari?webkitVersion:0;
            browser.isiPhoneSafari=!!browser.iphoneSafari;
            browser.iPodSafari=browser.iPod&&browser.isMobileSafari?webkitVersion:0;
            browser.isiPodSafari=!!browser.iPodSafari;
            browser.isiOSHomeScreen=browser.isMobileSafari&&!/apple.*mobile.*safari/.test(userAgent);
            browser.safari=browser.webkit&&!browser.chrome&&!browser.iOS&&!browser.android?webkitVersion:0;
            browser.isSafari=!!browser.safari;browser.language=language.split("-",1)[0];
            browser.current=browser.msie?"msie":browser.mozilla?"mozilla":browser.chrome?"chrome":browser.safari?"safari":browser.opera?"opera":browser.mobileSafari?"mobile-safari":browser.android?"android":"unknown";
            return browser;
        }

    };
    $(function(){
        Interceptor.init();
    })

});
var enums={
}
var msg_enum = {
    '0': {s: 'error', m: '操作失败'},
    'err_ajax':{s:'error',m:'AJAX报错'},
    'err_login': {s: 'error', m: '登录失败'},
    'suc_login': {s: 'success', m: '登录成功'},
};
/**
 * 弹窗消息
 * @param type  success 成功 error 失败 information 消息 warning
 * @param text
 */
var nAlert=function(type,text){
    noty({text: text, type: type});
};
var nConfirm=function(text,callback){
    noty({text:text, buttons: [{addClass: 'btn btn-success', text: '确定', onClick: function($noty){$noty.close();if(typeof(callback)==='function'){callback(true);}} },{addClass: 'btn btn-danger', text: '取消', onClick: function($noty){$noty.close();}}]})
};

var pConfirm=function(text,callback){
    noty({text:text, buttons: [{addClass: 'btn btn-success', text: '确定', onClick: function($noty){$noty.close();if(typeof(callback)==='function'){callback(true);}} },{addClass: 'btn btn-danger', text: '放弃', onClick: function($noty){$noty.close();if(typeof(callback)==='function'){callback(false);}}}]})
};

/**
 * 根据枚举代码获取消息
 * @param enumStr
 */
var msgManage=function(enumStr){
    enumStr=msg_enum[enumStr];
    if(typeof enumStr !='object')enumStr={s:'error',m:'后端返回状态码不存在，请联系管理员'};
    nAlert(enumStr.s,enumStr.m);
};

String.prototype.dateToDate=function(format){
    var date= new Date(this.replace(/([0-9]{4})([0-9]{2})([0-9]{2})/,"$1/$2/$3"));
    if(!format)return date;
    return date.format(format);
};

/**
 * 格式化时间
 * @param format yyyy-MM-dd hh:mm:ss D   年-月-日 时:分:秒 星期
 * @returns {*}
 */
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "D+": this.getDay(), //Week
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            var tmp = o[k], f = RegExp.$1.length == 1 ? tmp : ("00" + tmp).substr(("" + tmp).length);
            if (k === 'D+') {
                var week = ["日", "一", "二", "三", "四", "五", "六"];
                f = "星期" + week[tmp];
            }
            format = format.replace(RegExp.$1, f);

        }
    }
    return format;
};
/**
 * 字符串去除首尾空格
 * @returns {string|*}
 */
String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
};