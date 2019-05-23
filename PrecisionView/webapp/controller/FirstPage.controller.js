sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function (Controller,History,JSONModel,MessageToast, MessageBox) {
	"use strict";

	return Controller.extend("PrecisionView.controller.FirstPage", {
		onInit: function () {
	      
	    	var URLdet1 = "/PrecisionView/service/Control_table.xsodata/CONTROL_T";
			var oModel = new sap.ui.model.json.JSONModel();
            this.rankingTableDispCount = 0;
			oModel.loadData(URLdet1, "", false);
			//testing git
			var temp;
			var temp_data = oModel.oData.d.results;
			this.controlTableData = temp_data;
			
				var a = [];
				var b = [];
				var c = [];
				
				for(var i=0; i<temp_data.length; i++) {
				  if(a.indexOf(temp_data[i].COMPANY) === -1) {
				    a.push(temp_data[i].COMPANY);
				    c.push(temp_data[i].COMPANY_DESC);   
				  }
				}
				
				for(var j=0; j<a.length; j++) {
				  var object = {};
				  object.COMPANY = a[j];
				  object.COMPANY_DESC = c[j];
				  b.push(object);
				}

				
			    var d = [];
				var e = [];
				var f = [];
				for(i=0; i<temp_data.length; i++) {
				  if(d.indexOf(temp_data[i].MATERIAL_GROUP) === -1) {
				    d.push(temp_data[i].MATERIAL_GROUP);
				    f.push(temp_data[i].MATGROUP_DESC);   
				  }
				}
				
				for(j = 0; j < d.length; j++) {
				  object = {};
				  object.MATERIAL_GROUP = d[j];
				  object.MATGROUP_DESC = f[j];
				  e.push(object);
				}

				
			    var x = [];
				var y = [];
				var z = [];
				for(i = 0; i < temp_data.length; i++) {
				  if(x.indexOf(temp_data[i].ACCOUNT_GROUP) === -1) {
				    x.push(temp_data[i].ACCOUNT_GROUP);
				    z.push(temp_data[i].ACCOUNT_DESCRIPTION);   
				  }
				}
				
				for(j = 0; j < x.length; j++) {
				  object = {};
				  object.ACCOUNT_GROUP = x[j];
				  object.ACCOUNT_DESCRIPTION = z[j];
				  y.push(object);
				}
				
				oModel.setData({
					COMPANY: b,
					MAT_GRP: e,
					ACC_GRP: y
				});
				this.byId("company").setModel(oModel, "data");
				this.byId("mat_grp").setModel(oModel, "data");
				this.byId("acc_grp").setModel(oModel, "data");
			this.checked_drivers = {};
			this.out_checked_drivers = [];  // to delete control table entries
			this.out_insert_drivers = []; // to insert checked entries back to control table
			var driver_type_dict = {};
			var mat_dict = {};
			var acc_dict = {};
			var comp_dict = {};
			var driver_dict = {};	
			
			for (i = 0; i < temp_data.length; i++) {
				driver_type_dict[temp_data[i].DRIVER_DESC] = temp_data[i].DRIVER_TYPE;
				mat_dict[temp_data[i].MATERIAL_GROUP] = temp_data[i].MATGROUP_DESC;
				acc_dict[temp_data[i].ACCOUNT_GROUP] = temp_data[i].ACCOUNT_DESCRIPTION;
				comp_dict[temp_data[i].COMPANY] = temp_data[i].COMPANY_DESC;
				driver_dict[temp_data[i].DRIVER_DESC] = temp_data[i].DRIVER_CODE;
			}
			this.driver_dict = driver_dict;
			this.driver_type_dict = driver_type_dict;
			this.mat_dict = mat_dict;
			this.acc_dict = acc_dict;
			this.comp_dict = comp_dict;

		},
		onSearch: function () {
		    var that = this;
		    var rankingTableDispCount = that.rankingTableDispCount;
		    that.getView().byId("ranking_table").setVisible(true);
			that.getView().byId("select_drivers_button").setVisible(true);
		
			var in_company = that.getView().byId("company").getSelectedItem().mProperties.text.substring(0,4);
			var in_mat_grp = that.getView().byId("mat_grp").getSelectedItem().mProperties.text.substring(0,4);
			var in_acc_grp = that.getView().byId("acc_grp").getSelectedItem().mProperties.text.substring(0,4);
			var in_inputPeriod = that.getView().byId("inputPeriod").getValue().substring(0,4);
            that.in_company = in_company;
            that.in_mat_grp = in_mat_grp;
            that.in_acc_grp = in_acc_grp;
            that.in_inputPeriod = in_inputPeriod;
            that.out_insert_drivers = [];
            that.fetchDrivers(in_company,in_mat_grp,in_acc_grp);
            
            this.in_company = in_company;
            this.in_mat_grp = in_mat_grp;
            this.in_acc_grp = in_acc_grp;
				
// 		    var sServiceurldet = "/PrecisionView/service/SELECT_DRIVERS.xsodata/";
// 			var sEntity = "/SELECT_DRIVERS_OPParameters(IP_COMPANY='" + in_company + "',IP_MATERIAL_GROUP='" + in_mat_grp +
// 				"',IP_ACCOUNT_GROUP ='" + in_acc_grp + "')/Results?$orderby=RANK";		

// 			var URLdet = sServiceurldet + sEntity;
// 			var o_newModel = new sap.ui.model.json.JSONModel();
// 			o_newModel.loadData(URLdet, "", false);

// 			var test = o_newModel.oData.d.results;
// 			that.test = test;
// 			that.out_checked_drivers = test;
			

// 			var ar_Driver = [];
// 			for (var i = 0; i < test.length; i++) {
// 					ar_Driver[i] = test[i].DRIVER_DESC;

// 			}
// 			ar_Driver.sort();
// 			var unique_array = [];
// 			for (i = 0; i < ar_Driver.length; i++) {
// 				if (unique_array.indexOf(ar_Driver[i]) === -1) {
// 					unique_array.push(ar_Driver[i]);
// 				}
// 			}
    
			
//           //************* For Drivers1 table
//             var oTable_drivers = that.getView().byId("tab_drivers");
// 			var drivers_model1 = new sap.ui.model.json.JSONModel();
// 			drivers_model1.setData({
// 			    modelData : unique_array
// 			});
// 			oTable_drivers.setModel(drivers_model1, "data_drivers");
// 			oTable_drivers.getBinding("items").refresh(true);
// 			that.drivers_model1 = drivers_model1;
			
		  //************ For Driver Ranking Table
			var oTable_D_Ranking = that.getView().byId("d_ranking");
			var sServiceurl_d_Ranking = "/PrecisionView/service/ZFIN_DRIVER_COR_T.xsodata/";

	        var sFilter_Ranking = "/CORR_TAB?$format=json&$filter=(COMPANY eq '"+in_company+"' and MATERIAL_GROUP eq '"+in_mat_grp+"' and ACCOUNT_GROUP eq '"+in_acc_grp+"')&$orderby=RANK";	
			var URL_d_ranking = sServiceurl_d_Ranking + sFilter_Ranking;
			var d_ranking_model = new sap.ui.model.json.JSONModel();
				d_ranking_model.loadData(URL_d_ranking , "", false);
				
			var d_ranking_oData = d_ranking_model.oData.d.results;
			var d_ranking_model1 = new sap.ui.model.json.JSONModel();
			d_ranking_model1.setData({
			    modelData : d_ranking_oData
			});
			oTable_D_Ranking.setModel(d_ranking_model1, "data_Ranking");
			oTable_D_Ranking.getBinding("items").refresh(true);	
			
	       // to modify driver dictionary based on drivr ranking table
			var driver_dict = {};
			for (var i = 0; i < d_ranking_oData.length; i++) {
					driver_dict[d_ranking_oData[i].DRIVER_DESC] = d_ranking_oData[i].DRIVER_CODE;
			}
			that.driver_dict = driver_dict;
		    if(rankingTableDispCount === 1){
		  //  var tableLen = oTable_D_Ranking._getSelectAllCheckbox().oParent.mAggregations.items.length; 
		        var table = this.getView().byId("chkboxCol").oParent;
		        var tableLen = table.getItems().length;
		        for(i = 0; i < tableLen; i++){
		          table.getItems()[i].getCells()[table.getItems()[i].getCells().length - 1].setSelected(false);
		        } 
		    }	
        		rankingTableDispCount = 1;	
        		this.rankingTableDispCount = rankingTableDispCount;
        		oTable_D_Ranking.getBinding("items").refresh(true);	
		//************filtered control table data after passing code block	
// 		this.filtercontrolTableData(in_company,in_mat_grp, in_acc_grp);
			
		},
		fetchDrivers: function (in_company,in_mat_grp,in_acc_grp){
		     var that= this;
		     var sServiceurldet = "/PrecisionView/service/SELECT_DRIVERS.xsodata/";
			 var sEntity = "/SELECT_DRIVERS_OPParameters(IP_COMPANY='" + in_company + "',IP_MATERIAL_GROUP='" + in_mat_grp +
				"',IP_ACCOUNT_GROUP ='" + in_acc_grp + "')/Results?$orderby=RANK";		

			var URLdet = sServiceurldet + sEntity;
			var o_newModel = new sap.ui.model.json.JSONModel();
			o_newModel.loadData(URLdet, "", false);

			var test = o_newModel.oData.d.results;
			that.test = test;
			that.out_checked_drivers = test;
			

			var ar_Driver = [];
			for (var i = 0; i < test.length; i++) {
					ar_Driver[i] = test[i].DRIVER_DESC;

			}
			ar_Driver.sort();
			var unique_array = [];
			for (i = 0; i < ar_Driver.length; i++) {
				if (unique_array.indexOf(ar_Driver[i]) === -1) {
					unique_array.push(ar_Driver[i]);
				}
			}
    
			
          //************* For Drivers1 table
            var oTable_drivers = that.getView().byId("tab_drivers");
			var drivers_model1 = new sap.ui.model.json.JSONModel();
			drivers_model1.setData({
			    modelData : unique_array
			});
			oTable_drivers.setModel(drivers_model1, "data_drivers");
			oTable_drivers.getBinding("items").refresh(true);
			that.drivers_model1 = drivers_model1;
		},
// 		filtercontrolTableData :function(comp_code, mat_group, acct_group){
// 		    var that = this;
// 		    var controlTableData = that.controlTableData;
// 		    var filteredControlTableData = [];
// 		    for(var i = 0; i< controlTableData.length; i++){
// 		        if((controlTableData[i].COMPANY === comp_code)&&(controlTableData[i].MATERIAL_GROUP === mat_group)&&(controlTableData[i].ACCOUNT_GROUP === acct_group)){
// 		            filteredControlTableData.push(controlTableData[i]); 
		            
// 		        }
		        
// 		    }
// 		    this.filteredControlTableData = filteredControlTableData;
// 		},
		onNavBack: function() {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("LaunchPage", true);
			}
		},
		handleDetailsPress: function(oEvent) {
		    
			var bSelected = oEvent.getParameter("selected");
			//var in_model = this.getView().getModel().getProperty("MODEL", oEvent.getSource().getBindingContext());
			//<d:COMPANY m:type="Edm.String">FT01</d:COMPANY>
			var in_company = this.getView().byId("company").getSelectedItem().mProperties.text.substring(0, 4);
			var in_mat_grp = this.getView().byId("mat_grp").getSelectedItem().mProperties.text.substring(0, 4);
			var in_acc_grp = this.getView().byId("acc_grp").getSelectedItem().mProperties.text.substring(0, 4);
			var in_driver_desc = oEvent.getSource().mAggregations.customData[0].oParent.oParent.mAggregations.cells[0].mProperties.text;
			var in_driver_code = this.driver_dict[in_driver_desc];
			var in_driver_type = "";
			var in_company_desc = this.comp_dict[in_company];
			var in_mat_desc = this.mat_dict[in_mat_grp];
			var in_acc_desc = this.acc_dict[in_acc_grp];
		

			//var bSelected = oEvent.getParameter("selected");
			//var in_driver = this.getView().getModel().getProperty("data_Ranking>DRIVER_DESC", oEvent.getSource().getBindingContext());
			//var in_driver = this.getView().byId("d_ranking").getModel().getProperty("MODEL", oEvent.getSource().getBindingContext());
			//var in_driver = this.getView().byId("d_ranking").getModel().getProperty("DRIVER_DESC", oEvent.getSource().getBindingContext());
			//var selectedDrivers;
			//selectedDrivers = this.byId("d_ranking").getSelectedItems();
			//console.log(in_driver_code);
			//console.log(this.oTable_D_Ranking[1].RANK);
			var driver_info = {
				"COMPANY": in_company,
				"COMPANY_DESC": in_company_desc,
				"MATERIAL_GROUP": in_mat_grp,
				"MATGROUP_DESC": in_mat_desc,
				"ACCOUNT_GROUP": in_acc_grp,
				"ACCOUNT_DESCRIPTION": in_acc_desc,
				"DRIVER_DESC": in_driver_desc,
				"DRIVER_CODE": in_driver_code,
				"DRIVER_TYPE": in_driver_type
			};

			if (bSelected === true) {
			    this.out_insert_drivers.push(driver_info);
				this.checked_drivers[in_driver_desc] = driver_info;
			} else {
				delete this.checked_drivers[in_driver_desc];
			}
			//this.pushSelectedDriver(this.checked_drivers);
		},
// 		handleDetailsPress: function(oEvent) {
// 		    var bSelected = oEvent.getSource().getBindingContext();
// 		    //var in_model = this.getView().getModel().getProperty("MODEL", oEvent.getSource().getBindingContext());
// 		//<d:COMPANY m:type="Edm.String">FT01</d:COMPANY>
// 		    var in_company = this.getView().byId("company").getSelectedItem().mProperties.text.substring(0, 4);
//             var in_mat_grp = this.getView().byId("mat_grp").getSelectedItem().mProperties.text.substring(0, 4);
//             var in_acc_grp = this.getView().byId("acc_grp").getSelectedItem().mProperties.text.substring(0, 4);
//             var in_driver_desc = oEvent.getSource().mAggregations.customData[0].oParent.oParent.mAggregations.cells[0].mProperties.text; 
//             var in_driver_code = this.driver_dict[in_driver_desc];

// 		    //var bSelected = oEvent.getParameter("selected");
// 			//var in_driver = this.getView().getModel().getProperty("data_Ranking>DRIVER_DESC", oEvent.getSource().getBindingContext());
// 			//var in_driver = this.getView().byId("d_ranking").getModel().getProperty("MODEL", oEvent.getSource().getBindingContext());
// 			//var in_driver = this.getView().byId("d_ranking").getModel().getProperty("DRIVER_DESC", oEvent.getSource().getBindingContext());
// 			//var selectedDrivers;
// 			//selectedDrivers = this.byId("d_ranking").getSelectedItems();
// 			//console.log(in_driver_code);
// 			//console.log(this.oTable_D_Ranking[1].RANK);
// 			var driver_info = {
// 			    "COMPANY" : in_company,
// 			    "MATERIAL_GROUP" : in_mat_grp,
// 			    "ACCOUNT_GROUP" : in_acc_grp,
// 			    "DRIVER_CODE" : in_driver_code
// 			};
// 			this.checked_drivers.push(driver_info);
// 			//console.log(this.checked_drivers);
// 			//this.pushSelectedDriver(this.checked_drivers);
// 		},
		pushSelectedDriver: function() {
		    
		    
			var c_driver_dict, 
			    outCheckedDrivers, 
			    aDrivers,
			    vcheckbox,
			    that = this;
			c_driver_dict = that.checked_drivers;
			aDrivers = that.out_checked_drivers;
			vcheckbox = that.out_insert_drivers;
			
// 			outCheckedDrivers = this.filteredControlTableData;
		if(vcheckbox.length > 0){	
			
			var urlString;
			var batchModel = new sap.ui.model.odata.ODataModel("/PrecisionView/service/ZDELETE_CONTROL.xsodata/", true);
		
		
			var batchChanges = [];
            var oDrivers = {};
            var outDrivers = [];
            var	outCheckedDrivers = that.removeDuplicateEntries(aDrivers);
            // to create an an array for delete batch operation
            for(var k = 0; k < outCheckedDrivers.length; k++){
                oDrivers.COMPANY = outCheckedDrivers[k].COMPANY;
                oDrivers.MATERIAL_GROUP = outCheckedDrivers[k].MATERIAL_GROUP;
                oDrivers.ACCOUNT_GROUP = outCheckedDrivers[k].ACCOUNT_GROUP;
                oDrivers.DRIVER_CODE = outCheckedDrivers[k].DRIVER_CODE;
                
                outDrivers.push(oDrivers);
                oDrivers = {};
            }
            
             for(var l = 0; l < outDrivers.length; l++){
    			urlString = "/DELETE_CONTROL(COMPANY='" + outDrivers[l].COMPANY + "',MATERIAL_GROUP='" + outDrivers[l].MATERIAL_GROUP +
    					"',ACCOUNT_GROUP='" + outDrivers[l].ACCOUNT_GROUP + "',DRIVER_CODE='" + outDrivers[l].DRIVER_CODE + "')";
    			
    			batchChanges.push(batchModel.createBatchOperation(urlString, "DELETE", outDrivers[l]));
             }

             
         	batchModel.addBatchChangeOperations(batchChanges);
			batchModel.submitBatch(function() {
				batchModel.refresh();
				// MessageBox.success("Drivers are deleted successfully");
				that.createControltableEntries();
				that.onRefreshDriverUpdate();
			}, function(err) {
				MessageBox.error(err);
			});
// 			that.onRefreshDriverUpdate();
		}
		else{
		    	MessageToast.show("Please select checkboxes to update drivers", {	width: "350px"	});
		   } 

		},createControltableEntries: function(){
		   var that = this;
		   var  out_insert_drivers = that.out_insert_drivers;
		   var batchChanges1 = [];
		  // var urlString;
		    var updatebatchModel = new sap.ui.model.odata.ODataModel("/PrecisionView/service/ZUPDATE_CONTROL.xsodata/", true);
		    for(var l = 0; l < out_insert_drivers.length; l++){
    // 			urlString = "/UPDATE_CONTROL(COMPANY='" + out_insert_drivers[l].COMPANY + "',MATERIAL_GROUP='" + out_insert_drivers[l].MATERIAL_GROUP +
    // 					"',ACCOUNT_GROUP='" + out_insert_drivers[l].ACCOUNT_GROUP + "',DRIVER_CODE='" + out_insert_drivers[l].DRIVER_CODE + "')";
    			
    			batchChanges1.push(updatebatchModel.createBatchOperation("/UPDATE_CONTROL", "POST", out_insert_drivers[l]));
             } 
             
        	updatebatchModel.addBatchChangeOperations(batchChanges1);
			updatebatchModel.submitBatch(function(out) {
				updatebatchModel.refresh();
				// that.onRefreshDriverUpdate();
				that.onRefreshDriverUpdate();
				
				// MessageBox.success(out);
					MessageToast.show("Selected drivers are generated", {	width: "350px"	});
			}, function(err) {
				MessageBox.error(err);
			});
			that.onRefreshDriverUpdate();
			that.out_insert_drivers = [];
		},
		onRefreshDriverUpdate: function() {
		    var that = this, 
		        in_company = that.in_company, 
		        in_mat_grp = that.in_mat_grp, 
		        in_acc_grp = that.in_acc_grp;
			that.fetchDrivers(in_company, in_mat_grp, in_acc_grp);
		},
		onRunForecast:function(){
		  var company = this.in_company;
    	  var mat_group = this.in_mat_grp;
		  var acct_group = this.in_acc_grp;
		  var query = 'COMPANY='+company+'&MATERIAL_GROUP='+mat_group+'&ACCOUNT_GROUP='+acct_group;
          jQuery.ajax({
                    url : "/PrecisionView/ZXSJS_FORECAST_ALL_PROCEDURES.xsjs?" + query,
                    success : function(response) {
            		      //MessageBox.success("Forecast model executed successfully");
            		      	MessageToast.show("Forecast generated", {	width: "350px"	});
                    },
                    error : function(e) {
                        //  MessageBox.error(e);
                        	MessageToast.show("Forecast generated", {	width: "350px"	});
                        
                    }
                });
		},
		removeDuplicateEntries: function(aDriversData){
		     var aUniqueDrivers = aDriversData.reduce((unique, o) => {
		        	    if(!unique.some(obj => obj.DRIVER_CODE === o.DRIVER_CODE)) {
					      unique.push(o);
					    }
					    return unique;
					},[]);
		    
            return aUniqueDrivers;
		}
// 		onForecastRefresh1: function() {
//             this.vRefreshFlag = true;
// 			this.fetchForecastData1(this.in_inputPeriod, this.in_company, this.in_mat_grp, this.in_acc_grp);
// 			this.vRefreshFlag = false;
// 		},
// 		onEntitySel: function() {
// 			this.getView().byId("mat_grp").setEnabled(true);
// 		},
// 		onProductSel: function() {
// 			this.getView().byId("acc_grp").setEnabled(true);
// 		},
// 		onGroupSel: function() {
// 			this.getView().byId("mat_grp").setEnabled(false);
// 			this.getView().byId("acc_grp").setEnabled(false);
// 			this.onSearch();
// 		}
	});
});