jQuery(document).ready(function($) {
    var b_texto = false;
    var viz_data = {};

    function render() {
	b_texto = !b_texto;
	console.log(b_texto);
	$.ajax( {
	    type:'Get',
	    url:'http://192.168.0.147:6789/random_data/',
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
    }

    render();
    setInterval(function(){
	render()
    }, 10000);

});
