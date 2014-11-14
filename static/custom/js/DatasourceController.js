var DatasourceController = function () {
	var view,model;
	return this;
};

DatasourceController.prototype.loadView = function ( analysisId ) {
	this.model = DatasourceModel.find( analysisId );
	this.view = new DatasourceView(this.model);
	this.view.render();
	this.bind(this.model,this.view);
};

DatasourceController.prototype.bind = function(model,view){

 	var _this = this;

	this.view.DSPEnabledClicked.attach(function(){
		_this.DSPEnabledHandler(model,view);
	});
	this.view.endpointClicked.attach(function(){
		_this.endpointHandler(model,view);
	});
	this.view.endpointTypeClicked.attach(function(){
		_this.endpointTypeHandler(model,view);
	});

};


DatasourceController.prototype.DSPEnabledHandler = function(model,view){
    var analysisId = model.analysisId;
	console.log("arui");
	if(!view.showConfirm("Are you sure you want to change the dynamic security for the "
	+"Analysis Schema:\n\t- "+analysisId+"?"))
		return;
    
    model.toggleDSP();
};

DatasourceController.prototype.endpointHandler = function(model,view){
    view.showEndpointList();
};

DatasourceController.prototype.endpointTypeHandler = function(model,view){
	view.showEndpointTypeList();
};

