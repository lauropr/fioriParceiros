sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "sap/m/MessageToast",
        "sap/m/MessageBox"
    ],
    function(BaseController, JSONModel, MessageToast, MessageBox) {
      "use strict";
  
      return BaseController.extend("fiori.parceiros.controller.DetalheParceiro", {
        onInit() {

          //resgata o Roteador
          let oRoteador = this.getOwnerComponent().getRouter();


          //Configurar uma função custom para a rota de detalhe, para ler os argumentos da URL (ID do parceiro)
          let oRotaDesejada = oRoteador.getRoute("RouteDetalheParceiro");
          oRotaDesejada.attachPatternMatched(this.rotaDetalhe, this);

          //instancia a classe de modo de exibição
          let oModeloModo = new JSONModel();

          //declara uma propriedade no modelo Modo que controla o tipo de exibição e começa como false, ou seja, exibição
          oModeloModo.setProperty("/editavel", false);

          //vincula o modelo na view
          this.getView().setModel(oModeloModo, "modo");

          //troca o tipo de binding pra bidirecional, para que aceite alterações tanto no backend quanto no frontend (através do user)
          this.getOwnerComponent().getModel().sDefaultBindingMode = "TwoWay";

        },

        rotaDetalhe: function(oEvent){

            //resgata o ID do parceiro da URL pelo atributo 'arguments'
            let sIdParceiro = oEvent.getParameters().arguments.PartnerId;

            //resgata o modelo OData para o Read (o modelo é principal, sem nome, então só getModel() já o traz)
            let oModel = this.getView().getModel();

            //monta o caminho para o Read
            let sCaminho = oModel.createKey("/Parceiros", {
              PartnerId: sIdParceiro
            });

            //acessa a view do controller
            let oView = this.getView();

            //vincula o item clicado na página para ter acesso a todas as propriedades
            oView.bindElement(sCaminho);
        },

        aoEditar: function(oEvent){

          //resgata o modelo modo
          let oModeloModo = this.getView().getModel("modo");

          //altera a propriedade editavel para true
          oModeloModo.setProperty("/editavel", true);

          //acessa a view para ter acesso aos botões
          let oView = this.getView();
          
          //esconde o botão Editar
          oView.byId("botaoEditar").setVisible(false);

          //habilita os botões de edição e cancelamento 
          oView.byId("botaoSalvarMod").setVisible(true);
          oView.byId("botaoCancelarMod").setVisible(true);

        },

        aoCancelar: function(oEvent){
          //resgata o modelo modo
          let oModeloModo = this.getView().getModel("modo");

          //altera a propriedade editavel para true
          oModeloModo.setProperty("/editavel", false);

          //acessa a view para ter acesso aos botões
          let oView = this.getView();
          
          //esconde o botão Editar
          oView.byId("botaoEditar").setVisible(true);

          //habilita os botões de edição e cancelamento 
          oView.byId("botaoSalvarMod").setVisible(false);
          oView.byId("botaoCancelarMod").setVisible(false);
          
          //resgata o modelo principal OData
          let oModel = this.getView().getModel();
          //reset das alterações
          oModel.resetChanges();

        },

        aoSalvar: function(oEvent){

          //resgata o caminho para o update
          let sCaminho = this.getView().getBindingContext().getPath();

          //resgata o 'payload', o objeto com os dados atualizados
          let oDados = this.getView().getBindingContext().getObject();

          //resgata o modelo OData para a requisição PUT
          let oModel = this.getOwnerComponent().getModel();

          //configuração das propriedades técnicas pro PUT
          oModel.setHeaders({ 'X-Requested-With': 'X'});
          oModel.sDefaultUpdatedMethod = "PUT";
          
          //efetua a chamada de update
          oModel.update(sCaminho, oDados, {
            success: oResult => {
              //notificação simples na tela
              MessageToast.show("Parceiro atualizado com sucesso!");

              //resgata o modelo modo
              let oModeloModo = this.getView().getModel("modo");

              //altera a propriedade editavel para true
              oModeloModo.setProperty("/editavel", false);

              //acessa a view para ter acesso aos botões
              let oView = this.getView();
              
              //esconde o botão Editar
              oView.byId("botaoEditar").setVisible(true);

              //habilita os botões de edição e cancelamento 
              oView.byId("botaoSalvarMod").setVisible(false);
              oView.byId("botaoCancelarMod").setVisible(false);              

            },
            error: oError => {
              //transforma o Erro de string para objeto JSON, para poder ler o atributo error.message.value
              let oErro = JSON.parse(oError.responseText);

              //mensagem de erro em popup
              MessageBox.error(oErro.error.message.value);

            }
          });


        }
      });
    }
  );
  