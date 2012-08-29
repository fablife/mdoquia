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

    $('button').click(function(e){
	e.preventDefault();
	$(this).blur();
	aprueba();
    })

    $('.check').change(function(e) {
	var img = $(this).attr('id');
	var checked = $(this).parent().find(':checked');
	var check = false;
	if(checked.length) {
	    check = true;
	}

	$.post('/approve_image', { id: img, checked: check }, function() {
	    window.location.reload();
	})
    });

    function aprueba(){
	var img_approve = $(':checkbox:checked');
	img_approve.each(function(){
	    var img = $(this).attr('id');
	    $.post('/approve_image', { id : img }, function() {
		window.location.reload();
	    })
	});
    };
});
