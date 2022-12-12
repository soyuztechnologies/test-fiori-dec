sap.ui.define([
    'sap/ui/core/UIComponent',
    "sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(UIComponent,JSONModel,Device) {
    'use strict';
    //sampel code change
    return UIComponent.extend("ey.fin.ar.Component",{
        metadata: {
            manifest: "json"
        },
        init: function(){
            //initialize parent class constructor
            UIComponent.prototype.init.apply(this);
            
            //Step 1: Get the router object form the UIComponent class
            var oRouter = this.getRouter();
            //Step 2: Call initialize method using the object
            //       The initialize method will SCAN manifest.json to find the routing configuration (mandatory).
            oRouter.initialize();


            // set device model
			var oDeviceModel = new JSONModel(Device);
			oDeviceModel.setDefaultBindingMode("OneWay");
			this.setModel(oDeviceModel, "device");
        },
        // createContent: function(){
        //     var oAppView = new sap.ui.view("idApp",{
        //         viewName: "ey.fin.ar.view.App",
        //         type: "XML"
        //     });

        //     //Create object of our views
        //     var oView1 = new sap.ui.view("idView1",{
        //         viewName: "ey.fin.ar.view.View1",
        //         type: "XML"
        //     });
        //     var oView2 = new sap.ui.view("idView2",{
        //         viewName: "ey.fin.ar.view.View2",
        //         type: "XML"
        //     });
        //     var oEmpty = new sap.ui.view("idEmpty",{
        //         viewName: "ey.fin.ar.view.Empty",
        //         type: "XML"
        //     });

        //     //Get the App Container object
        //     var oAppCon = oAppView.byId("appCon");
        //     //We will add our views inside
        //     oAppCon.addMasterPage(oView1).addDetailPage(oEmpty).addDetailPage(oView2);

        //     return oAppView;
        // },
        destroy: function(){

        }
    });
});