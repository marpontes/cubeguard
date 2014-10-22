function createAlert( afterElmSelector , colorClass , message){
  var template = '<div class="alert alert-'+colorClass+' alert-dismissible" role="alert">'
      +'<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'
      +message
      +'</div>';
  $( template ).insertAfter( afterElmSelector );
}