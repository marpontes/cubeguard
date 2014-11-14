function bootstrapper() {

	LayoutView.emptyAnalysisListingContainer();
	
	var controller = new DatasourceController;

	for(datasource in datasources){
		controller.loadView(datasource);
	}

}