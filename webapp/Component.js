/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */
sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "fiori/parceiros/model/models",
        "sap/ui/model/json/JSONModel"
    ],
    function (UIComponent, Device, models, JSONModel) {
        "use strict";

        return UIComponent.extend("fiori.parceiros.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                //escuta as rotas com uma função custom
                this.getRouter().attachRouteMatched(this.aoNavegar, this);

                // set the device model
                this.setModel(models.createDeviceModel(), "device");

                //criamos o JSON Model de layout e configuramos OneColumn para a visualização inicial
                let oModel = new JSONModel();
                oModel.setProperty("/modo", "OneColumn");

                //associa o modelo ao app de forma global com o nome layout
                this.setModel(oModel, "layout");
            },

            aoNavegar: function(oEvent){
                //resgata o nome da rota
                let sNomeDaRota = oEvent.getParameters().name;

                //variavel de layout
                let sLayout;

                switch(sNomeDaRota){
                    case "RouteParceiros":
                        sLayout = "OneColumn";
                        break;
                    case "RouteNovoParceiro":
                    case "RouteDetalheParceiro":
                        sLayout = "TwoColumnsMidExpanded";
                        break;                            
                }

                //resgata o modelo e alterar a propriedade modo que está associada no FlexibleColumnLayout, na app.view.xml
                let oModel = this.getModel("layout");
                oModel.setProperty("/modo", sLayout);
            }


        });
    }
);