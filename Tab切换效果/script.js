function $(id){
    return typeof id === 'string' ? document.getElementById(id) : id;
}

window.onload=function(){
    //获取鼠标划过或点击的标签和要切换内容的元素
    var titles = $('notice-tit').getElementsByTagName('li');
    var divs = $('notice-con').getElementsByTagName('div');
    if(titles.length != divs.length){
        alert("错误" + divs.length,titles.length);
        return;
    }

    //遍历titles下所有li
    for (var index = 0; index < titles.length; index++) {
        var element = titles[index];
        element.id=index;
        element.onclick=function(){
            for (var j = 0; j < titles.length; j++) {
                var element = titles[j];
                element.className='';
                divs[j].style.display='none';
            }
            this.className='select';
            var ddd = divs[this.id];
            divs[this.id].style.display='block';
        }
    }
}