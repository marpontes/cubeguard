var LayoutView = {
    _analysisListingContainer : "#DatasourcesListing"
}

LayoutView.createAlert = function( afterElmSelector , colorClass , message){
  var template = '<div class="alert alert-'+colorClass+' alert-dismissible" role="alert">'
      +'<button type="button" class="close" data-dismiss="alert">'
      +'<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>'
      +'</button>'
      +message
      +'</div>';
  $( template ).insertAfter( afterElmSelector );
}

LayoutView.getAnalysisListingContainer = function(){
	return this._analysisListingContainer;
}

LayoutView.emptyAnalysisListingContainer = function(){
	var selector = this.getAnalysisListingContainer();
	$(selector).empty();
}