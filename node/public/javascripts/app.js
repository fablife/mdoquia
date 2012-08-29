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

    function aprueba(){
	var img_approve = $(':checkbox:checked');
	img_approve.each(function(){
	    var img = this.getAttribute('id');
	    $.ajax({
            type: "POST",
            url: "/approve_image",
            data: { id : img }
            }).done(function(e) {
		window.location.reload();
	    });
	});
    };
});
