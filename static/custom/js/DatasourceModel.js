var DatasourceModel = function ( data ) {
    
    var _this = this;
	this.analysisId = data.analysisId;
    
    this.dynamicEnabled = data.dynamicEnabled;
	this.dynamicEnabledLabel = data.dynamicEnabled ? "DSP Enabled" : "Not enabled";
	
	this.endpoint = data.endpoint;
    this.endpointLabel = data.endpoint ? data.endpoint : "Default"
    
    this.endpointType = data.endpointType;
    this.endpointTypeLabel = data.endpointType ? data.endpointType : "Default";
    
    this.endpointUpdated = new DatasourceEvent(this);
    this.endpointChosen = new DatasourceEvent(this);
    this.errorUpdatingEndpointHandler = new DatasourceEvent(this);
    
    this.endpointTypeChosen = new DatasourceEvent(this);
    
    this.lockClicksHandler = new DatasourceEvent(this);
    this.unlockClicksHandler = new DatasourceEvent(this);
    this.DSPToggledHandler =  new DatasourceEvent(this);
    this.errorTogglingDSPHandler = new DatasourceEvent(this);
    
	
	this.buttons = {
		DSPEnabledId : "DSPenabled",
		endpointId : "endpoint",
		endpointTypeId : "endpointType"
	};
    
    // #TO-DO This needs to be dynamically loaded from properties
    this.defaultEndpointName = "getcustomaccessrules";
    this.defaultEndpointType = "resultset"

	return this;
};

DatasourceModel.find = function ( analysisId ) {
	var model = new DatasourceModel(datasources[analysisId]);
    
    model.endpointChosen.attach(function(obj,endpointName){
		model.endpointChosenHandler(this,endpointName);
	});
    model.endpointTypeChosen.attach(function(obj,endpointType){
		model.endpointTypeChosenHandler(this,endpointType);
	});
    
	return model;
};

DatasourceModel.prototype.getAnalysisParams = function(){

	var analysisId = this.analysisId;
	var url = "/pentaho/plugin/data-access/api/datasource/"+analysisId
		+"/getAnalysisDatasourceInfo";
	var params = null;
	
	$.ajax({
			url: url,
			dataType: "text",
			type : "GET"
	})
	.done(function(result) {
		params = result;
	})
	.fail(function() {
		
	})
	.always(function() {

	});
	
	return params;
}

DatasourceModel.prototype.getObjParams = function(params){
    var arrParams = params.split(";");
    var objResult = {};
    var strResult = "";
    
    arrParams.map(function(val, idx, arr){
        var current = val.split("=");
        objResult[[current[0]]] = current[1];
    })
    
    objResult["overwrite"] = 'true'
    return objResult;
};

DatasourceModel.prototype.getParamsString = function(objResult){
    
    var strResult = "";
    
    for (var property in objResult) {
        strResult += property+"="+objResult[property]+";";
    }
    
    strResult = strResult.slice(0,-1);
    
    return strResult;
};

DatasourceModel.prototype.getToggleDSPParms = function(params){

	var objResult = this.getObjParams(params);
    
    if(undefined===objResult.DynamicSchemaProcessor){
        objResult["DynamicSchemaProcessor"] =
            'com.oncase.olap.security.DynamicMappedRolesSchemaProcessor';
        objResult["UseContentChecksum"] = 'true';
    }else{
        delete objResult['DynamicSchemaProcessor'];
        delete objResult["UseContentChecksum"];
    }
    
    return this.getParamsString(objResult);
	
};



DatasourceModel.prototype.getNewEndpointParams = function(params,attrName,newValue){
    
    var objResult = this.getObjParams(params);
    objResult[attrName] = newValue;
    return this.getParamsString(objResult);

};

DatasourceModel.prototype.setNewDSPParams = function(newParams){

	var analysisId = this.analysisId;
	var url = "/pentaho/plugin/data-access/api/mondrian/postAnalysis";	
	var data = new FormData();
	    data.append("uploadAnalysis","");
	    data.append("catalogName",analysisId);
	    data.append("origCatalogName",analysisId);
	    data.append("parameters",newParams);
	var methodResult = "";
	    
	$.ajax({
			url: url,
			dataType: "text",
			type: 'POST',
			contentType: false,
			data : data,
			processData: false
	})
	.done(function(result) {
		if(result==="3"){
			methodResult = "SUCCESS";
		}else{
			methodResult = "FAIL: "+result;
		}
	})
	.fail(function() {
		methodResult = "FAIL: "+result;
	});
	
	return methodResult;
	
}

DatasourceModel.prototype.endpointChosenHandler = function(_obj,newEndpoint){
    
    var params = this.getAnalysisParams();
    
    if(params === null){
		this.errorUpdatingEndpointHandler.notify("Error updating the endpoint for "
                                    +this.analysisId 
                                    +".\nCouldn't get Analysis params");
		return;
	}
    
    var newParams = this.getNewEndpointParams(params,"EndpointName",newEndpoint);
    console.log("Changing endpoint for: ["+this.analysisId+"]. New endpoint : "
                +newEndpoint);
    console.log(newParams);
    var methodResult = this.setNewDSPParams(newParams);
    
    if("SUCCESS" === methodResult){
        this.endpointUpdated.notify("Successfully updated the endpoint for "
                                    +this.analysisId);
        return true;
    }else{
        this.errorUpdatingEndpointHandler.notify("Error updating the endpoint for "
                                    +this.analysisId);
        return false;
    }
    
};

DatasourceModel.prototype.endpointTypeChosenHandler = function(_obj,newEndpointType){
    
    var params = this.getAnalysisParams();
    
    if(params === null){
		this.errorUpdatingEndpointHandler.notify(
                                    "Error updating the endpoint type for "
                                    +this.analysisId 
                                    +".\nCouldn't get Analysis params");
		return;
	}
    
    var newParams = this.getNewEndpointParams(params,"EndpointType",newEndpointType);
    console.log("Changing endpoint type for: ["+this.analysisId+"]. New endpoint type : "
                +newEndpointType);
    console.log(newParams);
    var methodResult = this.setNewDSPParams(newParams);

    if("SUCCESS" === methodResult){
        this.endpointUpdated.notify("Successfully updated the endpoint type for "
                                    +this.analysisId);
        return true;
    }else{
        this.errorUpdatingEndpointHandler.notify(
                                    "Error updating the endpoint type for "
                                    +this.analysisId);
        return false;
    }
    
};

DatasourceModel.prototype.getEndpointsList = function(){

	var url = "/pentaho/plugin/cubeguard/api/elementsList";
	var endpoints = [];
	
	$.ajax({
			url: url,
			dataType: "json",
			type : "GET"
	})
	.done(function(elementsList) {
        
		for( var x=0 ; x < elementsList.length ; x++ ){
            var element = elementsList[x];
            if(element.type === "Kettle" && element.adminOnly===false)
                endpoints.push(element.id);
            
        }
        
	})
	.fail(function() {
		
	})
	.always(function() {

	});
	
	return endpoints;
    
};


DatasourceModel.prototype.toggleDSP = function(){

	this.lockClicksHandler.notify(this.buttons.DSPEnabledId);
	
	var params = this.getAnalysisParams();
	
	if(params === null){
		this.errorTogglingDSPHandler.notify();
		return;
	}
	
	var newParams = this.getToggleDSPParms(params);
	
	var setNewDSPParams = this.setNewDSPParams(newParams);
    
    if(setNewDSPParams === "SUCCESS"){
		this.DSPToggledHandler.notify();
	}else{
		this.errorTogglingDSPHandler.notify();
	}

    
};