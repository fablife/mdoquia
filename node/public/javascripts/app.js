jQuery(document).ready(function($) {
    /* Apply fancybox to multiple items */
    $("a.grouped_elements").fancybox({
        'transitionIn': 'elastic',
        'transitionOut': 'elastic',
        'speedIn': 600,
        'speedOut': 200,
        'overlayShow': true
    });

    // Aprobar Imágenes
    $('.check_img').change(function(e) {
        var img = $(this).attr('id');
        var checked = $(this).parent().find(':checked');
        var check = false;
        if (checked.length) {
            check = true;
        }

        $.post('/approve_image', {
            id: img,
            checked: check
        }, function() {
            window.location.reload();
        })
    })

    // Aprobar Textos
    $('.check_txt').change(function(e) {
        var txt = $(this).attr('id');
        var checked = $(this).parent().find(':checked');
        var check = false;
        if (checked.length) {
            check = true;
        }

        $.post('/approve_text', {
            id: txt,
            checked: check
        }, function() {
            window.location.reload();
        })
    });
    
    $('a.borrar').click(function(e) {
        e.preventDefault();
        $(this).blur();
        var id = $(this).closest('.imagen-item').attr('id');
        
        $.ajax({ url: '/imagenes/'+id, type: 'DELETE', success: function() {
            window.location.reload()
        } });
    });

});