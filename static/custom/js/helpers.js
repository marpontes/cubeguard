/* 
 * Creates generic alert on the page
 * Possible color classes are warning/danger/success/info
 */
function createAlert( afterElmSelector , colorClass , message){
  var template = '<div class="alert alert-'+colorClass+' alert-dismissible" role="alert">'
      +'<button type="button" class="close" data-dismiss="alert">'
      +'<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>'
      +'</button>'
      +message
      +'</div>';
  $( template ).insertAfter( afterElmSelector );
}

/* 
 * Gets the current parameters for a given analysisID
 */
function getAnalysisParams(analysisId){
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

/* 
 * Processes the parameters string 
 * to include or exclude the DSP attribude from the string
 */
function getToggleDSPParms(params){

	var arrParams = params.split(";");
    var objResult = {};
    var strResult = "";
    
    arrParams.map(function(val, idx, arr){
        var current = val.split("=");
        objResult[[current[0]]] = current[1];
    })
    
    objResult["overwrite"] = 'true'
    if(undefined===objResult.DynamicSchemaProcessor){
        objResult["DynamicSchemaProcessor"] =
            'com.oncase.olap.security.DynamicMappedRolesSchemaProcessor';
        objResult["UseContentChecksum"] = 'true';
    }else{
        delete objResult['DynamicSchemaProcessor'];
        delete objResult["UseContentChecksum"];
    }
    
    for (var property in objResult) {
        strResult += property+"="+objResult[property]+";";
    }
    strResult = strResult.slice(0,-1);
    return strResult;
	
}

/* 
 * Changes the analysis parameters on Pentaho to toggle the DSP Param
 */
function patchAnalysis(btn,analysisId) {
	if(!confirm("Are you sure you want to enable dynamic security for the "
	+"Analysis Schema:\n\t- "+analysisId+"?"))
		return;

	var url = "/pentaho/plugin/data-access/api/mondrian/postAnalysis";	
	var params = getAnalysisParams(analysisId);

	btn.attr("disabled","disabled");
	
	if(params === null){
		createAlert("#DSConfigPanel","danger","<strong>Error:</strong> Couldnd't get"
				+"analysis parameters for" 
				+"  <strong>"+analysisId+"</strong>");
		btn.removeAttr("disabled");
		return;
	}
	
	var newParams = getToggleDSPParms(params);
	
	var data = new FormData();
	    data.append("uploadAnalysis","");
	    data.append("catalogName",analysisId);
	    data.append("origCatalogName",analysisId);
	    data.append("parameters",newParams);
	
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
			createAlert("#DSConfigPanel","success","<strong>Done:</strong> Successfully"
					+ " changed the datasource parameters for <strong>"+analysisId
					+"</strong>");
			console.log("Result:" + result);
		}else{
			createAlert("#DSConfigPanel","danger","<strong>Error:</strong> Something went"
					+" wrong, when trying to change the datasource parameters for" 
					+"  <strong>"+analysisId+"</strong>");
		}
	})
	.fail(function() {
		createAlert("#DSConfigPanel","danger","<strong>Error:</strong> Something went"
				+" wrong, when trying to change the datasource parameters for" 
				+"  <strong>"+analysisId+"</strong>");
	})
	.always(function() {
		btn.removeAttr("disabled");
		Dashboards.fireChange("analysisInfoTrigger",true);
	});

}
