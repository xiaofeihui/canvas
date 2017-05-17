var WritingPad = function (options) {
    var win_h = options[0],
         doc_h = options[1],
         scr_t = options[2],
         off_top = options[3],
         num = options[4],
         w = options[5],
         h = options[6],
         off_left= options[7],
         win_w = options[8];
    var chazhi =  2*h+off_top - win_h - scr_t;
    var bottom_chazhi = off_top - scr_t;
    var Itop=0,Ileft=0,Iright=0,Ibottom=0;
    var current = null;
    var cw = w,ch = h;
    var max_w;
    if(num==1||num==3){
        max_w = win_w - off_left;
    }else if(num==2||num==4){
        max_w = off_left +w;
    }
    if(max_w<2*w){
        cw = max_w/2 - 32;
        ch = cw*h / w;
    }
    $(function () {
        initHtml();
        initSignature();
        initDrawimg();

        $(document).on("click", "#mySave", null, function(){
            var myImg = $('#myImg').empty();
            var dataUrl = $('.js-signature').jqSignature('getDataURL');
            var img = $('<img>').attr('src', dataUrl);
            if(dataUrl!='[object Object]'){
                img.css({'width':w,'height':h,'display':'block'});
                $('.now_td').find('img').remove();
                $('.now_td').append(img);
            }
            $("#mymodal").remove();
            $('.modal-backdrop').remove();
            $('body').removeAttr('style');
        });
        //关掉bootstrap的点击空白处时关掉弹窗的功能
        //$('.modal-backdrop').modal({backdrop: 'static', keyboard: false});
        //点击遮罩层时触发保存按钮的点击事件
        $(document).on('click','.modal-backdrop,.close',function(){
            $("#mySave").click();
        });
        $(document).on("click", "#myEmpty", null, function () {
            $('.js-signature').jqSignature('clearCanvas');
        });
        $("#mymodal").on('hide.bs.modal', function () {
            $("#mymodal").remove();
            $('body').removeAttr('style');
        });
        //点击xClose时关闭弹窗和遮罩层
        $('.sr-only,.close').on('click',function(){
            $("#mySave").click();
            $("#mymodal").remove();
            $('.modal-backdrop').remove();
        })
    });
    function initHtml() {

        var html = '<div class="modal_one" id="mymodal">' +
            '<div class="can_head">' +
            '<button type="button" class="close btn btn-default sr-only" style="float:right;" data-dismiss="modal">关闭</button>' +
            '<button type="button" class="btn btn-default" style="float:right;margin-right:10px;" id="myEmpty">清空面板</button>' +
            '<h4 class="modal-title">手写面板</h4>' +
            '</div>' +
            '<div class="can_body">' +
            '<div  class="js-signature" id="mySignature"></div>' +
            '</div>' +
            '<div class="can_foot" style="display: none">' +
            '<button type="button" class="btn btn-primary" id="mySave">保存</button>' +
            '<div id="myImg">' +
            '<div>' +
            '</div>' +
            '</div>' +
            '</div></div><div class="modal-backdrop"></div>';

        if(2*h>h+off_top){
            Ibottom = h-off_top+6;
        }
        if(off_top+2*h+82>doc_h){
            Itop = off_top+2*h+82 - doc_h;
        }
        if(chazhi>-57&&(num==1||num==2)){
            $(document).scrollTop(chazhi+scr_t+60);
        }
        if(chazhi>134&&(num==3||num==4)){
            $(document).scrollTop(chazhi+scr_t-119);
        }
        if(bottom_chazhi<h&&(num==3||num==4)){
            $(document).scrollTop(off_top-h-6);
        }
        if(scr_t>off_top&&(num==1||num==2)) {
            console.log('scr_t:'+scr_t+'off_top:'+off_top);
            $(document).scrollTop(off_top+40);
        }
        //加载元素方式
        if(num==1||num==2){
            $('.now_td').prepend(html);
        }else if(num==3||num==4){
            $('.now_td').append(html);
        }
        /*1:选左上角为基准点，2：选右上角为基准点，3：选左下角为基准点，4：选右下角为基准点*/

        var Bigimg = $('.modal_one');
        switch (num){
            case '1': Bigimg.animate({'height':2*ch+57+'px','width':2*cw,'top':-Itop,'left':Ileft,'display':'block'},500);
                break;
            case '2': Bigimg.animate({'height':2*ch+57+'px','width':2*cw,'top':-Itop,'right':Iright,'display':'block'},500);
                break;
            case '3': Bigimg.animate({'height':2*ch+57+'px','width':2*cw,'bottom':-Ibottom,'left':Ileft,'display':'block'},500);
                break;
            case '4': Bigimg.animate({'height':2*ch+57+'px','width':2*cw,'bottom':-Ibottom,'right':Iright,'display':'block'},500);
                break;
            default:;
        }
        $('body').css({'overflow':'hidden'});
    }

    function initSignature() {
        if (window.requestAnimFrame) {
            var signature = $("#mySignature");

            $('.modal').css({'width':2*cw+32+'px'});
            signature.jqSignature({ width: 2*cw, height: 2*ch, border: '1px solid red', background: '#fff', lineColor: '#000', lineWidth: 2, autoFit: false });
        } else {
            alert("请加载jq-signature.js");
            return;
        }

        $('.modal-footer').css('display','none');
    }
    function initDrawimg(){
        var now_img = $('.now_td').find('img');
        var beauty = new Image();
        beauty.src  = now_img.attr('src');
        if(now_img){
            var drawimg = $('.js-signature').jqSignature('drawCanvas',beauty);
        }
    }
    function init() {
    }
    return {
        init: function () {
            init();
        }
    };

}
var click_num = 0;
function table_click(mtd){
    var w = $(mtd).width(),h = $(mtd).height();
    $(mtd).click(function(e){
        if($(".modal_one").length!=0){return;}
        var num = $(this).attr('data-animate-type');
        if($(".block-bor").find('.bigimg')){
            $(".block-bor").find('.bigimg').remove();
            click_num=0;
        }
        $(mtd).removeClass('now_td');
        $(this).addClass('now_td');
        var win_h = $(window).height();
        var doc_h = $(document).height();
        var scr_t = $(document).scrollTop();
        var off_top = $(this).offset().top;
        var off_left = $(this).offset().left;
        var win_w = $(window).width();
        var options = new Array(win_h,doc_h,scr_t,off_top,num,w,h,off_left,win_w);
        var wp = new WritingPad(options);

    });
}
function table_bigimg(mtd){

    $(mtd).click(function(){
        var _img =  $(this).find('img');
        var html  = '<div class="bigimg"><img src="" alt="" /></div><div class="modal-backdrop"></div>';
        var w = _img.width(),h = _img.height();
        var imgurl = _img.attr('src');
        var num = $(this).attr('data-animate-type');
        var off_top = $(this).offset().top;
        var Itop=0,Ileft=0,Iright=0,Ibottom=0;
        var win_h = $(window).height();
        var doc_h = $(document).height();
        var scr_t = $(document).scrollTop();
        var chazhi =  2*h+off_top -win_h - scr_t;
        var bottom_chazhi = off_top - scr_t;
        var cw = w,ch = h;
        var off_left = $(this).offset().left;
        var win_w = $(window).width();
        var max_w;

        if(num==1||num==3){
            max_w = win_w - off_left;
        }else if(num==2||num==4){
            max_w = off_left +w;
        }
        if(max_w<2*w){
            cw = max_w/2 - 32;
            ch = cw*h / w;
        }
        if(click_num==0){
            if($(".modal_one").length!=0){
                $(".modal_one").remove();
            }
            if(2*h>h+off_top){
                Ibottom = h-off_top+6;
            }
            if(off_top+2*h>doc_h){
                Itop = h +6;
            }
            if(chazhi>-13&&(num==1||num==2)){
                console.log(chazhi);
                $(document).scrollTop(chazhi+scr_t+15);
            }
            if(chazhi>134&&(num==3||num==4)){
                $(document).scrollTop(chazhi+scr_t-119);
            }
            if(bottom_chazhi<h&&(num==3||num==4)){
                $(document).scrollTop(off_top-h-6);
            }
            if(scr_t>off_top&&(num==1||num==2)) {
                $(document).scrollTop(off_top);
            }
            //加载元素方式
            if(num==1||num==2){
                $(this).prepend(html);
            }else if(num==3||num==4){
                $(this).append(html);
            }
            var Bigimg =  $('.bigimg');
            $('.bigimg img').attr('src',imgurl);
            /*1:选左上角为基准点，2：选右上角为基准点，3：选左下角为基准点，4：选右下角为基准点*/
            switch (num){
                case '1': Bigimg.animate({'height':2*ch,'width':2*cw,'top':-Itop,'left':Ileft,'display':'block'},500);
                    break;
                case '2': Bigimg.animate({'height':2*ch,'width':2*cw,'top':-Itop,'right':Iright,'display':'block'},500);
                    break;
                case '3': Bigimg.animate({'height':2*ch,'width':2*cw,'bottom':-Ibottom,'left':Ileft,'display':'block'},500);
                    break;
                case '4': Bigimg.animate({'height':2*ch,'width':2*cw,'bottom':-Ibottom,'right':Iright,'display':'block'},500);
                    break;
                default:;
            }
            $(".bigimg img").animate({'height':2*ch,'width':2*cw});
            click_num = 1 ;
        }else{
            if(num==3||num==4){
                $('.bigimg').animate({'width':'0px','height':'0px','bottom':0},500,function(){
                    $(this).remove();
                    $('.modal-backdrop').remove();
                });
            }else{
                $('.bigimg').animate({'width':'0px','height':'0px','top':0},500,function(){
                    $(this).remove();
                    $('.modal-backdrop').remove();
                });
            }
            click_num = 0;
        }
    });
}