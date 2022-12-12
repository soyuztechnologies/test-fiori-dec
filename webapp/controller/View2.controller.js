sap.ui.define([
    'ey/fin/ar/controller/BaseController',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/core/Fragment',
    'sap/m/DisplayListItem',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function(Controller, MessageBox, MessageToast, Fragment, DisplayListItem, Filter, FilterOperator) {
    'use strict';
    return Controller.extend("ey.fin.ar.controller.View2",{
        onInit : function(){
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("detail").attachMatched(this.herculis, this);
        },
        onSupplierItem: function(oEvent){
            var oSelectItem = oEvent.getParameter("listItem");
            var sPath = oSelectItem.getBindingContextPath();
            console.log(sPath);

            //get the index of selected supplier
            var sIndex = sPath.split("/")[sPath.split("/").length - 1];
            //call the router to navigate to 3rd view
            this.oRouter.navTo("supplier",{
                supplierId: sIndex
            });

        },
        onSave: function(){
            MessageBox.confirm("Would you like to save?",{
                title:"Confirmation",
                onClose: function(status){
                    if(status === "OK"){
                        MessageToast.show("Your order has been placed");
                    }else{
                        MessageBox.error("Save has been cancelled");
                    }
                }
            });
        },
        onPopupConfirm: function(oEvent){
            var sId  = oEvent.getSource().getId();
            if(sId.indexOf("city") !== -1){
                //Step 1: Which item was selected
                var oSelectItem = oEvent.getParameter("selectedItem");
                //Step 2: Get the value select by user
                var sVal = oSelectItem.getLabel();
                //Step 3: use the field on which snap was done on F4 click, set data
                this.oField.setValue(sVal);
            }else{
                //Step 1: Get all selected items
                var aSelectItems = oEvent.getParameter("selectedItems");
                var aFilter = [];
                //Step 2: Loop over them and make a filter array
                for (let i = 0; i < aSelectItems.length; i++) {
                    const element = aSelectItems[i];
                    var sText = element.getLabel();
                    var oFilter = new Filter("name", FilterOperator.EQ, sText);
                    aFilter.push(oFilter);
                }
                var oFilterMain = new Filter({
                    filters: aFilter,
                    and: false
                });

                //Step 3: Inject the same inside the table as filter
                var oTable = this.getView().byId("suppTab");
                oTable.getBinding("items").filter(oFilterMain);

            }
            
        },
        oCityPopup: null,
        oField: null,
        onF4Help: function(oEvent){
            //We can take a snapshot of the input field on which F4 was done
            this.oField = oEvent.getSource();
            //make a local copy of controller variable this, so we can
            //access it inside the promise function
            var that = this;
            if(!this.oCityPopup){
                //Use sap standard class to load our fragment - async
                Fragment.load({
                    name: "ey.fin.ar.fragments.popup",
                    id: "city",
                    controller: this
                })
                //using a promise once its loaded
                .then(function(oFragment){
                    //here we cannot access this pointer as controller object
                    //we need controller object to access global variable
                    that.oCityPopup = oFragment;
                    that.oCityPopup.setTitle("City popup");
                    //Grant exception to fragment to allow access all what view have access to.
                    that.getView().addDependent(that.oCityPopup);
                    //Syntax 4- get the items inside popup dynamically as displaylist
                    that.oCityPopup.bindAggregation("items",{
                        path : '/cities',
                        template: new DisplayListItem({
                            label: '{name}',
                            value: '{famousFor}'
                        })
                    });
                    that.oCityPopup.open();
                });
            }else{
                this.oCityPopup.open();
            }
            //MessageBox.information("This functionality is under construction 😊");
        },
        oSupplierPopup: null,
        onFilterSupplier: function(oEvent){
            //make a local copy of controller variable this, so we can
            //access it inside the promise function
            var that = this;
            if(!this.oSupplierPopup){
                //Use sap standard class to load our fragment - async
                Fragment.load({
                    name: "ey.fin.ar.fragments.popup",
                    id: "supplier",
                    controller: this
                })
                //using a promise once its loaded
                .then(function(oFragment){
                    //here we cannot access this pointer as controller object
                    //we need controller object to access global variable
                    that.oSupplierPopup = oFragment;
                    that.oSupplierPopup.setTitle("Supplier popup");
                    //Grant exception to fragment to allow access all what view have access to.
                    that.getView().addDependent(that.oSupplierPopup);
                    //Syntax 4- get the items inside popup dynamically as displaylist
                    that.oSupplierPopup.bindAggregation("items",{
                        path : '/suppliers',
                        template: new DisplayListItem({
                            label: '{name}',
                            value: '{city}'
                        })
                    });
                    that.oSupplierPopup.open();
                });
            }else{
                this.oSupplierPopup.open();
            }
            

            //MessageBox.information("This functionality is under construction 😊");
        },

        //Route Matched handler function
        herculis: function(oEvent){
            var sIndex = oEvent.getParameter("arguments").fruitId;
            var sPath = '/' + sIndex;
            this.getView().bindElement(sPath,{
                expand: 'To_Supplier'
            });
            //debugger;
        },
        onBack: function(){
            this.printX();
            //Step 1: get the parent object - container
            var oAppCon = this.getView().getParent();
            //Step 2: navigate to the second view
            oAppCon.to("idView1");
        }
    });
});