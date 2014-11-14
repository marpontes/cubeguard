var DatasourceView = function ( model ) {
    
    var _this = this;
	this.model = model;
	this.DSPEnabledClicked = new DatasourceEvent(this);
	this.endpointClicked = new DatasourceEvent(this);
	this.endpointTypeClicked = new DatasourceEvent(this);
    
    this.modalId = "endpointsModal";    
    this.modalSel = "#"+this.modalId;
    
    this.model.endpointUpdated.attach(function(obj,message){
		_this.endpointUpdated(this,message);
	});
    
    this.model.errorUpdatingEndpointHandler.attach(function(obj,message){
        _this.errorUpdatingEndpoint(this,message);
    });
    
    this.model.lockClicksHandler.attach(function(obj,buttonId){
        _this.disableButton(buttonId);
    });
    
    this.model.unlockClicksHandler.attach(function(obj,buttonId){
        _this.enableButton(buttonId);
    });
    
    this.model.DSPToggledHandler.attach(function(){
        _this.DSPToggled();
    });
    
    this.model.errorTogglingDSPHandler.attach(function(){
        _this.errorTogglingDSP();
    });
    
	return this;
};

DatasourceView.prototype.output = function () {

	var template = '<div class="datasources-pane panel panel-default">'
		+'    <div class="panel-heading arrow-toggle cursor-pointer" '
		+'data-toggle="collapse" aria-expanded="true" data-parent="#nn" href="#collapse<%= analysisId %>">'
		+'        	<%= analysisId %>'
		+'			<div class="icon-arrow-down glyphicon glyphicon-chevron-down"></div>'
		+'			<div class="icon-arrow-up glyphicon glyphicon-chevron-up"></div>'    
		+'    </div>'
		+'    <div id="collapse<%= analysisId %>" class="panel-collapse collapse in">'
		+'            <div class="row cg-btn-row-space cg-btn-row-border ">'
		+'                <div class="col-xs-9 cg-btn-row ">Enabled to use dynamic security?</div>'
		+'                <div class="col-xs-3 ">'
		+'                    <button id="'+this.model.buttons.DSPEnabledId+'<%= analysisId %>" class="btn pull-right  btn-'
		+                             (this.model.dynamicEnabled==true ? "success" : "warning")+'">'
		+'                        <span><%= dynamicEnabledLabel %></span>'
		+'                        <div class="label glyphicon glyphicon-'
		+                             (this.model.dynamicEnabled==true ? "ok" : "remove")+'"></div>'
		+'                    </button>'
		+'                </div>'
		+'            </div>'
		+'            <div class="row cg-btn-row-space cg-btn-row-border ">'
		+'                <div class="col-xs-9 cg-btn-row ">Source endpoint</div>'
		+'                <div class="col-xs-3 ">'
		+'                    <button id="'+this.model.buttons.endpointId+'<%= analysisId %>" class="btn pull-right  btn-'
        +                           (this.model.endpoint ? "success" : "active")+'">'
		+'                        <span><%= endpointLabel %></span>'
		+'                        <div class="text-'
        +                           (this.model.endpointType ? "white" : "active")+' glyphicon glyphicon-ok"></div>'
		+'                    </button>'
		+'                </div>'
		+'            </div>'
		+'            <div class="row cg-btn-row-space cg-btn-row-border ">'
		+'                <div class="col-xs-9 cg-btn-row ">Type of endpoint output</div>'
		+'                <div class="col-xs-3 ">'
		+'                    <button id="'+this.model.buttons.endpointTypeId+'<%= analysisId %>" class="btn pull-right  btn-'
        +                           (this.model.endpointType ? "success" : "active")+'">'
		+'                        <span><%= endpointTypeLabel %></span>'
		+'                        <div class="text-'
        +                           (this.model.endpointType ? "white" : "active")+' glyphicon  glyphicon-ok"></div>'
		+'                    </button>'
		+'                </div>'
		+'            </div>'
		+'    </div>'
		+'</div>';

	var instance = this;
	for(property in instance.model){
		template = template.replace(new RegExp("<%=\\s+"+property+"\\s+%>","g")
		    ,instance.model[property]);
	}
	return template;
};

DatasourceView.prototype.render = function () {

	var _this = this;
	var container = $(LayoutView.getAnalysisListingContainer());
	container.append(this.output());

	this.getButton(this.model.buttons.DSPEnabledId)
		.click(function(){
			_this.DSPEnabledClicked.notify();
	});
	
	this.getButton(this.model.buttons.endpointId)
		.click(function(){
			_this.endpointClicked.notify();
	});
	
	this.getButton(this.model.buttons.endpointTypeId)
		.click(function(){
			_this.endpointTypeClicked.notify();
	});
	
};

DatasourceView.prototype.disableButton = function(buttonSelector){
	this.getButton(buttonSelector).attr("disabled","disabled");
}

DatasourceView.prototype.enableButton = function(buttonSelector){
	this.getButton(buttonSelector).removeAttr("disabled");
}

DatasourceView.prototype.enableDSPEnabledButton = function(){
	this.enableButton(this.model.buttons.DSPEnabledId);
}

DatasourceView.prototype.enableEndpointButton = function(){
	this.enableButton(this.model.buttons.endpointId);
}

DatasourceView.prototype.enableEndpointTypeButton = function(){
	this.enableButton(this.model.buttons.endpointTypeId);
}

DatasourceView.prototype.disableDSPEnabledButton = function(){
	this.disableButton(this.model.buttons.DSPEnabledId);
}

DatasourceView.prototype.disableEndpointButton = function(){
	this.disableButton(this.model.buttons.endpointId);
}

DatasourceView.prototype.disableEndpointTypeButton = function(){
	this.disableButton(this.model.buttons.endpointTypeId);
}

DatasourceView.prototype.getButton = function(buttonSelector){
    console.log(buttonSelector);
	return $(".datasources-pane #"+buttonSelector+this.model.analysisId)
}

DatasourceView.prototype.createAlert = function( colorClass , message){

  var afterElmSelector = "#EnvConfigPanel";
  var template = '<div class="alert alert-'+colorClass+' alert-dismissible" role="alert">'
      +'<button type="button" class="close" data-dismiss="alert">'
      +'<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>'
      +'</button>'
      +message
      +'</div>';
  $( template ).insertAfter( afterElmSelector );
  
};

DatasourceView.prototype.createErrorAlert = function(message){
	this.createAlert("danger","<strong>Error:</strong> "+message);
};

DatasourceView.prototype.createSuccessAlert = function(message){
	this.createAlert("success","<strong>Done:</strong> "+message);
};

DatasourceView.prototype.showConfirm = function(message){
	return confirm(message);
}

DatasourceView.prototype.showEndpointList = function(){
    
    var _this = this;
    var analysisId = this.model.analysisId;
    var modalId = this.modalId;
    var modalSel = this.modalSel;
    var endpoints = this.model.getEndpointsList();
    
    var confirmBtnId = 'confirmEndpoint'+analysisId;
    var confirmBtnSel = "#"+confirmBtnId;
    
    var modalTemplate = '<div class="modal fade" id="'+modalId+'" tabindex="-1" '
    +'role="dialog" aria-labelledby="'+modalId+'Label" aria-hidden="true">'
    +'  <div class="modal-dialog">'
    +'    <div class="modal-content">'
    +'      <div class="modal-header">'
    +'        <button type="button" class="close" data-dismiss="modal">'
    +'          <span aria-hidden="true">&times;</span><span class="sr-only">Close</span>'
    +'        </button>'
    +'        <h4 class="modal-title" id="myModalLabel">Choose the endpoint for '
    +           analysisId + '</h4>'
    +'      </div>'
    +'      <div class="modal-body">';
    
    modalTemplate += '<div class="btn-group btn-datasource-wrapper" data-toggle="buttons">';
    
    for( var x = 0 ; x < endpoints.length ; x++ ){
        var isActive = (this.model.defaultEndpointName === endpoints[x] &&
                         !this.model.endpoint) || (this.model.endpoint === endpoints[x]);
        modalTemplate += '  <label class="btn btn-datasource-choice btn-success '+(isActive ? "active" : "")+'">'
        + '<input type="radio" name="options" id="'+endpoints[x]+'" autocomplete="off"'
        + ( isActive ? "checked" : "")
        + ' / ><div class="pull-left">'+endpoints[x]+'</div><div class="pull-right glyphicon glyphicon-ok"></div></label>';
    }
    
    modalTemplate += '</div>';
    
    modalTemplate+=''
    +'      </div>'
    +'      <div class="modal-footer">'
    +'        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>'
    +'        <button id="'+confirmBtnId+'" type="button" class="btn btn-success">'
    +'          Save changes</button>'
    +'      </div>'
    +'    </div>'
    +'  </div>'
    +'</div>';
    
    $( modalSel ).remove();
    $( "body" ).append(modalTemplate);
    $( modalSel )
        .modal({
            keyboard : true,
            backdrop : "static"
        })
        .on("shown.bs.modal", function(e){
            $( confirmBtnSel ).unbind();
            $( confirmBtnSel ).click(function(){
                var endpointId = $(".btn-datasource-choice input:checked").attr("id");
                _this.model.endpointChosen.notify(endpointId);
            });
        }).on("hidden.bs.modal",function(){
            $( modalSel ).remove();
        });
};

DatasourceView.prototype.showEndpointTypeList = function(){
    
    var _this = this;
    var analysisId = this.model.analysisId;
    var modalId = this.modalId;
    var modalSel = this.modalSel;
    var endpointTypes = ["resultset","xml"];
    
    var confirmBtnId = 'confirmEndpoint'+analysisId;
    var confirmBtnSel = "#"+confirmBtnId;
    
    var modalTemplate = '<div class="modal fade" id="'+modalId+'" tabindex="-1" '
    +'role="dialog" aria-labelledby="'+modalId+'Label" aria-hidden="true">'
    +'  <div class="modal-dialog">'
    +'    <div class="modal-content">'
    +'      <div class="modal-header">'
    +'        <button type="button" class="close" data-dismiss="modal">'
    +'          <span aria-hidden="true">&times;</span><span class="sr-only">Close</span>'
    +'        </button>'
    +'        <h4 class="modal-title" id="myModalLabel">Choose the endpoint type for '
    +           analysisId + '</h4>'
    +'      </div>'
    +'      <div class="modal-body">';
    
    modalTemplate += '<div class="btn-group btn-datasource-wrapper" data-toggle="buttons">';
    
    for( var x = 0 ; x < endpointTypes.length ; x++ ){
        var isActive = (this.model.defaultEndpointType === endpointTypes[x] &&
                         !this.model.endpointType) || (this.model.endpointType === endpointTypes[x]);
        modalTemplate += '  <label class="btn btn-datasource-choice btn-success '+(isActive ? "active" : "")+'">'
        + '<input type="radio" name="options" id="'+endpointTypes[x]+'" autocomplete="off"'
        + ( isActive ? "checked" : "")
        + ' / ><div class="pull-left">'+endpointTypes[x]+'</div><div class="pull-right glyphicon glyphicon-ok"></div></label>';
    }
    
    modalTemplate += '</div>';
    
    modalTemplate+=''
    +'      </div>'
    +'      <div class="modal-footer">'
    +'        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>'
    +'        <button id="'+confirmBtnId+'" type="button" class="btn btn-success">'
    +'          Save changes</button>'
    +'      </div>'
    +'    </div>'
    +'  </div>'
    +'</div>';
    
    $( modalSel ).remove();
    $( "body" ).append(modalTemplate);
    $( modalSel )
        .modal({
            keyboard : true,
            backdrop : "static"
        })
        .on("shown.bs.modal", function(e){
            $( confirmBtnSel ).unbind();
            $( confirmBtnSel ).click(function(){
                var endpointId = $(".btn-datasource-choice input:checked").attr("id");
                _this.model.endpointTypeChosen.notify(endpointId);
            });
        }).on("hidden.bs.modal",function(){
            $( modalSel ).remove();
        });
};

DatasourceView.prototype.hideModal = function(){

    var modalSel = this.modalSel;
    var analysisId = this.model.analysisId;
    $( modalSel ).modal('hide');
    
};

DatasourceView.prototype.triggerAnalysisUpdate = function(){
	Dashboards.fireChange("analysisInfoTrigger",true);	
};


DatasourceView.prototype.DSPToggled = function(){
    
    var analysisId = this.model.analysisId;

	this.createSuccessAlert("Successfully toggled the DSP usage for <strong>"
                            +analysisId+"</strong>");
	
	this.triggerAnalysisUpdate();

}

DatasourceView.prototype.errorTogglingDSP = function(){
	
    var analysisId = this.model.analysisId;
    
	this.createErrorAlert("Something went wrong, when trying to "
	   +"change the datasource parameters for <strong>"+analysisId
	   +"</strong>");
	
    this.triggerAnalysisUpdate();

};

DatasourceView.prototype.endpointUpdated = function(obj,message){
    var analysisId = this.model.analysisId;
    this.hideModal();
    this.createSuccessAlert(message);
    this.triggerAnalysisUpdate();
};

DatasourceView.prototype.errorUpdatingEndpoint = function(obj,message){
    this.hideModal();
    this.createErrorAlert(message);
    this.triggerAnalysisUpdate();
};

