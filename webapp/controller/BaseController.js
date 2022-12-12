sap.ui.define([
    'sap/ui/core/mvc/Controller'
], function(Controller) {
    'use strict';
    return Controller.extend("ey.fin.ar.controller.BaseController",{
        x: 10,
        printX: function(){
            console.log(this.x);
        }
    });
});