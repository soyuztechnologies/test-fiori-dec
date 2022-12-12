sap.ui.define([
    'ey/fin/ar/controller/BaseController',
    'sap/m/MessageBox',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function(Controller, MessageBox, Filter, FilterOperator) {
    'use strict';
    return Controller.extend("ey.fin.ar.controller.View1",{
        onInit : function(){
            //Step 1: We need router object
            this.oRouter = this.getOwnerComponent().getRouter();
        },
        onNext: function(){
            this.printX();
            //Step 1: get the parent object - container
            var oAppCon = this.getView().getParent().getParent();
            //Step 2: navigate to the second view
            oAppCon.toDetail("idView2");
            
            
        },
        onClick: function(){
            //alert('order has been patched');
            MessageBox.information("Your order has been placed successfully",{
                title: "Information"
            });
            this.onNext();
        },
        onSelect: function(oEvent){
            //Address of the memory where the data is taken from
            var sPath = oEvent.getParameter("listItem").getBindingContextPath();
            console.log(sPath);

            var sIndex = sPath.split("/")[sPath.split("/").length - 1];
            this.oRouter.navTo("detail",{
                fruitId: sIndex
            });
            //Step 2: i need the object of whole of the second view
            //var oView2 = this.getView().getParent().getParent().getDetailPage("idView2");
            //another way to get v2 object
            //var oView2 = this.getView().getParent().getParent().getDetailPages()[0];

            //Step 3: Perform the element Binding with view2
            //oView2.bindElement(sPath);
            
            //this.onNext();
        },
        onSearch: function(oEvent){
            //Step 1: get the value of the searched data
            var sValue = oEvent.getParameter("query");
            if(!sValue){
                sValue = oEvent.getParameter("newValue");
            }
            //Step 2: Build a filter condition
            var oFilter1 = new Filter("CATEGORY", FilterOperator.Contains, sValue);
            var oFilter2 = new Filter("type", FilterOperator.Contains, sValue);
            var oFilter = new Filter({
                filters: [oFilter1, oFilter2],
                and: false
            });
            //Step 3: Inject filter to our items binding
            var oList = this.getView().byId("idList");
            oList.getBinding("items").filter(oFilter1);
        },
        onAdd: function(){
            this.oRouter.navTo("add");
        }
    });
});


