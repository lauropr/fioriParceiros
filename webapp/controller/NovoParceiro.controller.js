sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageBox",
        "sap/m/MessageToast"
    ],
    function(BaseController, MessageBox, MessageToast) {
      "use strict";
  
      return BaseController.extend("fiori.parceiros.controller.NovoParceiro", {
        onInit() {
        },

        aoEscolherCategoria: function(oEvent){
            //resgata o item clicado
            let oItemClicado = oEvent.getParameters().selectedItem;

            //resgata o contexto de binding (o dado no modelo associado ao item na tela)
            //obs: o getBindingContext precisa do nome do modelo
            let oItemNoModelo = oItemClicado.getBindingContext("novoParceiro").getObject();


            //resgata o modelo novoParceiro e cria a propriedade PartnerType (vai precisar dela no backend)
            let oModel = this.getView().getModel("novoParceiro");
            oModel.setProperty("/PartnerType", oItemNoModelo.PartnerType);
        },

        aoCancelar: function(){

          //limpa o modelo "novoParceiro"
          let oModeloNovoParceiro = this.getView().getModel("novoParceiro");

          //recarrega o arquivo como conteúdo do modelo JSON
          oModeloNovoParceiro.loadData('./model/novoParceiro.json');

          //navega de volta
          let oRoteador = this.getOwnerComponent().getRouter();
          oRoteador.navTo("RouteParceiros");


        },

        aoSalvar: function(){

            let oPayload = {};

            //resgata os dados do modelo para usar como payload do POST
            let oDados = this.getView().getModel("novoParceiro").getProperty("/");
            oPayload.PartnerType = oDados.PartnerType;
            oPayload.PartnerName1 = oDados.PartnerName1;
            oPayload.PartnerName2 = oDados.PartnerName2;
            oPayload.SearchTerm1 = oDados.SearchTerm1;
            oPayload.SearchTerm2 = oDados.SearchTerm2;
            oPayload.Street = oDados.Street;
            oPayload.HouseNumber = oDados.HouseNumber;
            oPayload.District = oDados.District;
            oPayload.Region = oDados.Region;
            oPayload.City = oDados.City;
            oPayload.ZipCode = oDados.ZipCode;
            oPayload.Country = oDados.Country;            

            //resgata o modelo OData pro create
            let oModel = this.getView().getModel();

            //efetua a chamada Create 
            oModel.setHeaders({ 'X-Requested-With': 'X'});

            //efetua o POST
            oModel.create("/Parceiros", oPayload, {
              success: oResult => {
                //monta mensagem de sucesso
                MessageToast.show("Parceiro " + oResult.PartnerId + " criado com sucesso!");
              },
              error: oError => {
                //monta mensagem de erro
                let oErro = JSON.parse(oError.responseText);
                MessageBox.error(oErro.error.message.value);


              }

            });

        }


      });
    }
  );
  