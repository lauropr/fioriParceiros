sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, Sorter) {
        "use strict";

        return Controller.extend("fiori.parceiros.controller.Parceiros", {
            onInit: function () {

                //declara uma variável global no nosso controller
                this.bModoOrdenacao;

            },

            aoPesquisarParceiro: function(oEvent){
                //resgata a pesquisa atual
                let sPesquisa = oEvent.getParameters().newValue;

                //configura o objeto de filtro com o valor da pesquisa
                let oFilter = new Filter({
                    path: "PartnerName1",
                    operator: FilterOperator.Contains,
                    value1: sPesquisa
                });

                //cria um array de filtro
                let aFiltros = []; 

                //inclui o objeto de filtro no array
                aFiltros.push(oFilter);

                //efetua o filtro usando o objeto de filtro
                let oBinding = this.getView().byId("listaParceiros").getBinding("items");
                oBinding.filter(aFiltros);
            },

            aoPesquisarParceiroPorId: function(oEvent){
                //resgata a pesquisa atual
                let sPesquisa = oEvent.getParameters().newValue;

                //configura o objeto de filtro com o valor da pesquisa
                let oFilter = new Filter({
                    path: "PartnerId",
                    operator: FilterOperator.Contains,
                    value1: sPesquisa
                });

                //cria um array de filtro
                let aFiltros = []; 

                //inclui o objeto de filtro no array
                aFiltros.push(oFilter);

                //efetua o filtro usando o objeto de filtro
                let oBinding = this.getView().byId("listaParceiros").getBinding("items");
                oBinding.filter(aFiltros);
            },

            aoOrdenar: function(oEvent){

                //alterna entre true e false
                this.bModoOrdenacao = !this.bModoOrdenacao;

                //criar um objeto de ordenação
                let oSorter = new Sorter({
                    path: "PartnerId",
                    descending: this.bModoOrdenacao
                });

                //cria o array de ordenação
                let aOrdenacoes = [];

                //inclui o objeto de ordenação no array
                aOrdenacoes.push(oSorter);

                //resgatar o binding da nossa lista
                let oBinding = this.getView().byId("listaParceiros").getBinding("items");

                //efetuar a ordenação
                oBinding.sort(aOrdenacoes);

            },

            aoCriarParceiro: function(oEvent){
                //resgata o Roteador
                let oRoteador = this.getOwnerComponent().getRouter();

                //navega para a rota de criação
                oRoteador.navTo("RouteNovoParceiro");

            }

 

        });
    });
