jQuery(document).ready(function($) {
    var current_image = 0;

    /* Apply fancybox to multiple items */
    $("a.grouped_elements").fancybox({
	'transitionIn':'elastic',
	'transitionOut':'elastic',
	'speedIn':600, 
	'speedOut':200, 
	'overlayShow':true
    });

    $('.check_img').change(function(e) {
	var img = $(this).attr('id');
	var checked = $(this).parent().find(':checked');
	var check = false;
	if(checked.length) {
	    check = true;
	}

	$.post('/approve_image', { id: img, checked: check }, function() {
	    window.location.reload();
	})
    })

    $('.check_txt').change(function(e) {
	var txt = $(this).attr('id');
	var checked = $(this).parent().find(':checked');
	var check = false;
	if(checked.length) {
	    check = true;
	}

	$.post('/approve_text', { id: txt, checked: check }, function() {
	    window.location.reload();
	})
    })

    function aprueba_img(){
	var img_approve = $(':checkbox:checked');
	img_approve.each(function(){
	    var img = $(this).attr('id');
	    $.post('/approve_image', { id : img }, function() {
		window.location.reload();
	    })
	});
    };

    function aprueba_txt(){
	var txt_approve = $(':checkbox:checked');
	txt_approve.each(function(){
	    var txt = $(this).attr('id');
	    $.post('/approve_text', { id : img }, function() {
		window.location.reload();
	    })
	});
    };

});
