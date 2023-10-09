/** 
 * ***********************************Copyright © 2021 Avantpro - Direitos Autorais******************************************
 *  Esse código possui Registro de Propriedade Intelectual pelo INPI conforme Processo Nº: BR512022000916-1
 *  Registro disponível para acesso em: http://ramsolution.com.br/registro-de-propriedade-intelectual.pdf
 *  Qualquer reprodução (total ou parcial) do código presente na extensão Avantpro, sem a prévia autorização, 
 *  é proibida e será penalizada conforme o código penal.
 * **************************************************************************************************************************
 */

document.addEventListener('DOMContentLoaded', function () {
    var mlb;
    var produto;
    var dadosProduto = [];
    var dadosVendedor = [];
    var dadosTaxa = [];
    var dadosFrete = [];
    var codBarras = [];
    var titulos = [];
    var dadosGrafico = [];
    var graficoFalhou = false;

    $('#preco').maskMoney({
        prefix: "R$",
        decimal: ",",
        thousands: ".",
        selectAllOnFocus: true
    })

    $('#custototal').maskMoney({
        prefix: "R$",
        decimal: ",",
        thousands: ".",
        selectAllOnFocus: true
    })

    $('#custoenvio').maskMoney({
        prefix: "R$",
        decimal: ",",
        thousands: ".",
        selectAllOnFocus: true
    })

    $('#custofinal').maskMoney({
        prefix: "R$",
        decimal: ",",
        thousands: ".",
        selectAllOnFocus: true
    })

    chrome.tabs.query({ 'active': true, 'currentWindow': true }, tabs => {
        var tab = tabs[0];
        var url = tab.url;


        if (url.includes('produto.mercadolivre.com')) {
            var res = url.split("/");
            var res2 = res[3].split("-");
            mlb = res2[0] + res2[1];
            getDetalhesProduto();
        } else {
            var res = url.split("/?");
            mlb = res[1];
            console.log('mlb');
            getDetalhesProduto();
        }

    });




    function getDetalhesProduto() {
        $.ajax({
            type: "GET",
            url: "https://api.mercadolibre.com/items/" + mlb,
            cache: false,
            success: function (data) {
                dadosProduto = data;
                $("#nomeproduto").text(dadosProduto.title);
            }
        });
    }

    

    $('#fechar').click(function () {
        parent.window.postMessage("removetheiframe", "*");
    });



});

