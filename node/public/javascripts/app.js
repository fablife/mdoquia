jQuery(document).ready(function($) {
    var current_image = 0;
    $('.image_list img').on('click',function(e) {
	
    	var overlayDiv = document.createElement("div");
    	overlayDiv.id = "overlayDiv";
    	overlayDiv.style.cssText = "position:absolute; top:0; right:0; width:" + screen.width + "px; height:" + screen.height + "px; background-color: #000000; opacity:0.7";
    	document.getElementsByTagName("body")[0].appendChild(overlayDiv);

    	var id=this.alt;
    	current_image=parseInt($('#'+id)[0].value);
    	$('#visible_img')[0].src=(this.src);
    	$('#visible_img')[0].alt=(this.alt);
    	$('#image_view').show('fast', function(e) {});
    });  

    // $('#aprueba').on('click',function(e) {
    //     var img=$('#visible_img')[0].alt;
    //     $.ajax({
    //         type: "POST",
    //         url: "/approve_image",
    //         data: { id : img }
    //     }).done(function(e) {
    //         window.location.reload();
    // 	});
    // });

    // $('#previa').on('click',function(e) {
    // 	current_image--;
    // 	$('#visible_img')[0].src=$(".image_list img")[current_image].src;
    // 	$('#visible_img')[0].alt=$(".image_list img")[current_image].alt;

    // });


    // $('#proxima').on('click',function(e) {
    // 	current_image++;
    // 	$('#visible_img')[0].src=$(".image_list img")[current_image].src;
    // 	$('#visible_img')[0].alt=$(".image_list img")[current_image].alt;
	
    // });

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
