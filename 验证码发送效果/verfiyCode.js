$(document).ready(function() {
    $('input:button').css({
        'width': '300px',
        'border': '1px solid #fff',
        'height': '50px',
        'margin': '100px auto',
        'margin-left': '500px'
    })

    var timer = null;
    var total = 0;

    $('input:button').on('click', function() {
        total = 3;
        $('input:button').attr('value', total + "秒后重试");
        $('input:button').attr('disabled', 'disabled');
        timer = setInterval(function() {
            total -= 1;
            $('input:button').attr('value', total + "秒后重试");
            if (total == 0) {
                clearInterval(timer);
                $('input:button').attr('value', "发送验证码");
                $('input:button').removeAttr('disabled');
                console.log($('input:button').attr('disabled'));
            }
        }, 1000);
    });


});