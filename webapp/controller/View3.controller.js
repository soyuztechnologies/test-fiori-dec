sap.ui.define([
    'ey/fin/ar/controller/BaseController',
    "sap/ui/core/routing/History"
], function(Controller, History) {
    'use strict';
    return Controller.extend("ey.fin.ar.controller.View3",{
        onInit : function(){
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("supplier").attachMatched(this.herculis, this);
        },
        //Route Matched handler function
        herculis: function(oEvent){
            var sIndex = oEvent.getParameter("arguments").supplierId;
            var sPath = '/suppliers/' + sIndex;
            this.getView().bindElement(sPath);
            //debugger;
        },
        onBack: function(){
            var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("overview", {}, true);
			}
        }
    });
});