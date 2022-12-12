sap.ui.define([
    'ey/fin/ar/controller/BaseController',
    'sap/m/MessageBox',
    'sap/m/MessageToast'
], function(Controller, MessageBox, MessageToast) {
    'use strict';
    return Controller.extend("ey.fin.ar.controller.Add",{
        onInit: function(){
            //Set a global variable for local model
            this.oLocalModel = this.getOwnerComponent().getModel("local");
            //Set a global variable for ODataModel
            this.oDataModel = this.getOwnerComponent().getModel();
        },
        mode: "Create",
        setMode: function(sMode){
            this.mode = sMode;
            if(sMode === "Create"){
                this.getView().byId("name").setEnabled(true);
                this.getView().byId("save").setText("Save");
            }else{
                this.getView().byId("name").setEnabled(false);
                this.getView().byId("save").setText("Update");
            }
        },
        onEnter: function(oEvent){
            //Step 1: what is the product id user enter
            var sProductId = oEvent.getParameter("value");
            //Step 2: fire a GET request to SAP for load product data
            var that = this;
            this.oDataModel.read("/ProductSet('" + sProductId + "')", {
                success: function(data){
                    //Step 3: If data found, we will lock the input field ID and populate data on UI
                    that.oLocalModel.setProperty("/prodData", data);
                    that.setMode("Update");
                },
                error: function(oError){
                    //Step 4: if data not found, give error and cancel
                    that.setMode("Create");
                }
            });

        },
        onDelete: function(){
            //Step 1: prepare the payload
            var payload = this.oLocalModel.getProperty("/prodData");
            var that = this;
            this.oDataModel.remove("/ProductSet('" + payload.PRODUCT_ID + "')",{
                success: function(){
                    MessageToast.show("Product is now deleted");
                    that.setMode("Create");
                }
            });

        },
        onExpensive: function(){
            //Step 1: Category value
            var category = this.getView().byId("category").getSelectedKey();
            //Step 2: Call function
            var that = this;
            this.oDataModel.callFunction("/GetMostExpensiveProduct",{
                urlParameters:{
                    "I_CATEGORY": category
                },
                success: function(data){
                    //Step 3: handle callbacks
                    that.oLocalModel.setProperty("/prodData",data);
                }
            });
            
        },
        onClear: function(){
            this.oLocalModel.setProperty("/prodData",{
                "PRODUCT_ID": "",
                "TYPE_CODE": "PR",
                "CATEGORY": "Mice",
                "NAME": "",
                "DESCRIPTION": "",
                "SUPPLIER_ID": "0100000073",
                "SUPPLIER_NAME": "Developement Para O Governo",
                "TAX_TARIF_CODE": "1 ",
                "MEASURE_UNIT": "EA",
                "PRICE": "0.00",
                "CURRENCY_CODE": "USD",
                "DIM_UNIT": "CM"
            });
            this.setMode("Create");
        },
        onSave: function(){
            //Step 1: prepare the payload
            var payload = this.oLocalModel.getProperty("/prodData");
            //Step 2: Pre-checks
            if(!payload.PRODUCT_ID){
                MessageBox.error("Please enter valid product id");
                return;
            }
            if(this.mode === "Create"){
                //Step 3: Send POST to SAP Server using OData Model
                this.oDataModel.create("/ProductSet", payload, {
                    success: function(data){
                        //Step 4: Handle the success and error callback
                        MessageToast.show("The product was successfully created in SAP");
                    },
                    error: function(oError){
                        //Step 4: Handle the success and error callback
                        //debugger;
                        MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message);
                    }
                });
            }else{
                this.oDataModel.update("/ProductSet('" + payload.PRODUCT_ID + "')", payload, {
                    success: function(data){
                        //Step 4: Handle the success and error callback
                        MessageToast.show("The product was successfully UPDATED in SAP");
                    },
                    error: function(oError){
                        //Step 4: Handle the success and error callback
                        //debugger;
                        MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message);
                    }
                });
            }
            
            

        }
    });
});