function $(id){
    return typeof id === 'string' ? document.getElementById(id) : id;
}

// window.onload=function(){
    //获取鼠标划过或点击的标签和要切换内容的元素
    // var titles = $('notice-tit').getElementsByTagName('li');
    // var divs = $('notice-con').getElementsByTagName('div');
    // if(titles.length != divs.length){
    //     alert("错误" + divs.length,titles.length);
    //     return;
    // }

    //遍历titles下所有li
    // for (var index = 0; index < titles.length; index++) {
    //     var element = titles[index];
    //     element.id=index;
    //     element.onmousemove=function(){
        //     for (var j = 0; j < titles.length; j++) {
        //         var element = titles[j];
        //         element.className='';
        //         divs[j].style.display='none';
        //     }
        //     this.className='select';
        //     var ddd = divs[this.id];
        //     divs[this.id].style.display='block';
        // }
    // }

        // var timer = null;
        // var lis = $('notice-tit').getElementsByTagName('li');
        // var divs = $('notice-con').getElementsByTagName('div');
        // if(lis.length != divs.length){
        //     return;
        // }

        // for (var i = 0; i < lis.length; i++) {
        //     var element = lis[i];
        //     element.id=i;
        //     element.onmouseover=function () {
        //         //来引用当前划过的li
        //         var that = this;
        //         //如果存在准备执行的定时器,立即清除,只有当前时间大于500ms 时才开始执行
        //         if(timer){
        //             clearTimeout(timer);
        //         }
        //         //延迟半秒执行
        //         timer=setTimeout(function() {
        //             for (var j = 0; j < lis.length; j++) {
        //                 var element = lis[j];
        //                 element.className='';
        //                 divs[j].style.display='none';
        //             }
        //                 lis[that.id].className='select';
        //                 divs[that.id].style.display='block';
        //         }, 500);
        //     }
        // }
// }

window.onload=tab;
function tab() {
    //当前高亮显示的页签索引
    var index = 0;
    var timer = null;

    var lis = $('notice-tit').getElementsByTagName('li');
    var divs = $('notice-con').getElementsByTagName('div');

    //绑定划过事件
    for (var i = 0; i < lis.length; i++) {
        var element = lis[i];
        element.id=i;
        element.onmouseover=function () {
            clearInterval(timer);
            changeOption(this.id);
        };

        element.onmouseout=function () {
            timer = setInterval(autoPlay,2000);
            index=this.id;
        };
    }

    //添加定时器
    timer = setInterval(autoPlay,2000);
    function autoPlay() {
        index++;
        if (index >= lis.length) {
            index = 0;
        }
        changeOption(index);
    }

    function changeOption(curIndex) {
        for (var j = 0; j < lis.length; j++) {
                var element = lis[j];
                element.className='';
                divs[j].style.display='none';
        }
        lis[curIndex].className='select';
        divs[curIndex].style.display='block';
    }
}