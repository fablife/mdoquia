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

  $('#aprueba').on('click',function(e) {
        var img=$('#visible_img')[0].alt;
        $.ajax({
             type: "POST",
             url: "/approve_image",
             data: { id : img }
        }).done(function(e) {
           window.location.reload();
  });
    });

  $('#previa').on('click',function(e) {
    current_image--;
    $('#visible_img')[0].src=$(".image_list img")[current_image].src;
    $('#visible_img')[0].alt=$(".image_list img")[current_image].alt;

  });


  $('#proxima').on('click',function(e) {
    current_image++;
    $('#visible_img')[0].src=$(".image_list img")[current_image].src;
    $('#visible_img')[0].alt=$(".image_list img")[current_image].alt;
      
  });

    var b_texto = false;
    var viz_data = {};
    setInterval(function(){
	b_texto = !b_texto;
	console.log(b_texto);
	$.ajax( {
	    type:'Get',
	    url:'http://localhost:6789/random_data/',
	    data: { texto: b_texto },
	    success:function(rdata) {
		viz_data = rdata;
 		//console.log(rdata);
	    }
	});
	if(b_texto){
	    //console.log(viz_data.path);
	    $("p#ver_data").hide();
	    $("img#ver_data").show().attr('src',viz_data.path);
	}else{
	    //console.log(viz_data.texto);
	    $("img#ver_data").hide();
	    $("p#ver_data").show().text('\" '+viz_data.texto+' \"');
	}
    }, 10000);


});
