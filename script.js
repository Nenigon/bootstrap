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
    var emailRetornado = '';
    var tokenRetornado = '';
    var baseURL = 'https://ramcloud.com.br:12998/ram/xdados';
    var tipoAnuncio = '';
    var categoria = '';

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

        chrome.runtime.sendMessage({ method: "getEmail" }, function (response) {
            emailRetornado = response.email;
            tokenRetornado = response.token;
        });



        if (url.includes('produto.mercadolivre.com')) {
            var res = url.split("/");
            var res2 = res[3].split("-");
            mlb = res2[0] + res2[1];
            getDetalhesProduto();
        } else if (url.includes('/?')) {
            var res = url.split("/?");
            mlb = res[1];
            getDetalhesProduto();
        } else {
            getCodBarrasSemMLB();
        }

    });

    function getCodBarrasSemMLB() {
        let sellerTitulo = $(`#sellerTitulo`)[0];

        let ultra = false;
        let dadosUltra = document.getElementsByClassName('ultra');
        if (dadosUltra.length >= 1) {
            ultra = true;
        }

        $.ajax({
            type: "GET",
            url: "https://ramcloud.com.br:9001/EanGenerator/MLB/6",
            cache: false,
            success: function (data) {
                codBarras = data;
                RenderAcompanhamento();
                RenderConcorrent();

                sellerTitulo.innerHTML = `Esse recurso te permite monitorar até ${ultra ? '50' : '10'} concorrentes durante 7 dias. Os dados são atualizados todo dia de madrugada.`


                document.getElementById('loadingframe').remove();
                document.getElementById("custototal").setAttribute("disabled", true);
                document.getElementById("imposto").setAttribute("disabled", true);
                document.getElementById("custoenvio").setAttribute("disabled", true);
                document.getElementById("preco").setAttribute("disabled", true);

                document.getElementById("btnAcompanharConcorrente").setAttribute("style", 'display: none');
                document.getElementById("btnAcompanhar").setAttribute("style", 'display: none');

                document.getElementById("txtAcompanhar").setAttribute("style", "display: true; color: red; font-size: 20px;");
                $("#txtAcompanhar").text('Para usar o recurso de acompanhar anúncio, acesse a página de um anúncio.');

                document.getElementById("txtAcompanharConcorrente").setAttribute("style", "display: true; color: red; font-size: 20px;  margin-top: 20px;");
                $("#txtAcompanharConcorrente").text('Para usar o recurso de acompanhar concorrente, acesse a página de um anúncio.');


                /*              
                document.getElementById("nome").setAttribute("disabled", true);
                document.getElementById("subnome").setAttribute("disabled", true);
                document.getElementById("vantagem").setAttribute("disabled", true);
                document.getElementById("objecao").setAttribute("disabled", true); 
                */


                document.getElementById("semanuncio").setAttribute("style", "display: true; color: red; font-size: 20px; margin-top: 30px; margin-bottom: -80px ");
                $("#semanuncio").text('Para usar os recursos dessa aba por favor acesse a página de um anúncio.');

            }
        });
    }



    function getDetalhesProduto() {
        $.ajax({
            type: "GET",
            url: "https://api.mercadolibre.com/items/" + mlb,
            cache: false,
            success: function (data) {
                dadosProduto = data;
                tipoAnuncio = data.listing_type_id;
                categoria = data.category_id;
                getDetalhesVendedor(data.seller_id, data.category_id, data.price, data.listing_type_id, mlb)
            }
        });
    }

    function getDetalhesVendedor(idVendedor, categoria, preco, tipoAnuncio, anuncio) {
        let sellerTitulo = $(`#sellerTitulo`)[0];

        let ultra = false;
        let dadosUltra = document.getElementsByClassName('ultra');
        if (dadosUltra.length >= 1) {
            ultra = true;
        }


        $.ajax({
            type: "GET",
            url: "https://api.mercadolibre.com/sites/MLB/search?seller_id=" + idVendedor,
            cache: false,
            success: function (data) {
                dadosVendedor = data;
                sellerTitulo.innerHTML = `Esse recurso te permite monitorar até ${ultra ? '50' : '10'} concorrentes durante um
                período de 7 dias. Os dados são atualizados todo dia de madrugada.`

                getDetalhesTaxa(idVendedor, categoria, preco, tipoAnuncio, anuncio);
            }
        });
    }

    function getDetalhesTaxa(idVendedor, categoria, preco, tipoAnuncio, anuncio) {
        $.ajax({
            type: "GET",
            url: "https://api.mercadolibre.com/sites/MLB/listing_prices?" + `price=${preco}&category_id=${categoria}`,
            cache: false,
            success: function (data) {
                dadosTaxa = data;
                getDetalheFrete(idVendedor, categoria, preco, tipoAnuncio, anuncio);
            }
        });
    }

    function getDetalheFrete(idVendedor, categoria, preco, tipoAnuncio, anuncio) {
        $.ajax({
            type: "GET",
            url: "https://api.mercadolibre.com/users" + `/${idVendedor}/shipping_options/free?item_id=${anuncio}`,
            cache: false,
            success: function (data) {
                dadosFrete = data;
                getCodBarras();
            }
        });
    }

    function getMargem(dadosProduto) {
        var precoFinal = parseFloat(dadosProduto.price);
        var custoFinal = 0;
        var comissao = (precoFinal / 100) * parseFloat(dadosProduto.PorcentagemComissao);
        var imposto = (precoFinal / 100) * parseFloat(String(dadosProduto.imposto).replace(/,/, '.'));

        precoFinal -= comissao == undefined ? 0 : parseFloat(comissao);
        precoFinal -= parseFloat(dadosProduto.custoEnvio);
        precoFinal -= imposto == undefined ? 0 : parseFloat(imposto);
        precoFinal -= parseFloat(dadosProduto.custo) == undefined ? 0 : parseFloat(dadosProduto.custo);

        custoFinal += comissao == undefined ? 0 : parseFloat(comissao);
        custoFinal += parseFloat(dadosProduto.custoEnvio);
        custoFinal += imposto == undefined ? 0 : parseFloat(imposto);
        custoFinal += parseFloat(dadosProduto.custo) == undefined ? 0 : parseFloat(dadosProduto.custo);



        //$("#comissaovlr").text(dadosProduto.PorcentagemComissao + "%" + " (R$ " + comissao.toLocaleString('pt-BR', { mimnimumFractionalDigits: 3 }) + ")");

        $("#margem").text((precoFinal / (dadosProduto.price / 100)).toFixed(2) + '%');
        $("#lucro").text("R$ " + precoFinal.toFixed(2));
        $("#custofinal").text("R$ " + custoFinal.toFixed(2));


    }

    function renderizaDados(produto, vendedor, taxa, frete) {
        try {
            if (tipoAnuncio == 'gold_special') {
                document.getElementById('comissao').value = 'classico';
                taxa = taxa.filter(f => f.listing_type_id == 'gold_special');
            } else {
                document.getElementById('comissao').value = 'premium';
                taxa = taxa.filter(f => f.listing_type_id == 'gold_pro');
            }
        } catch (error) {
            if (tipoAnuncio == 'gold_special') {
                taxa = taxa.filter(f => f.listing_type_id == 'gold_special');
            } else {
                taxa = taxa.filter(f => f.listing_type_id == 'gold_pro');
            }
            document.getElementById('comissaovlr').style.fontSize = '16px';
        }

        taxa = taxa[0];

        var supermercado = produto.tags.includes('supermarket_eligible');
        produto.supermercado = supermercado;
        var taxaCalculada = supermercado ? ((taxa.sale_fee_amount > 5 && parseFloat(produto.price) < 79) ? taxa.sale_fee_amount - 5 : taxa.sale_fee_amount) : taxa.sale_fee_amount;
        var custoEnvio = 0;

        if (supermercado) {
            custoEnvio = parseFloat(produto.price) >= 199 ? (produto.shipping.free_shipping ? frete.coverage.all_country.list_cost.toLocaleString('pt-BR', { mimnimumFractionalDigits: 2 }) : parseFloat(0)) : parseFloat(0);
        } else {
            custoEnvio = parseFloat(produto.price) >= 79 ? (produto.shipping.free_shipping ? frete.coverage.all_country.list_cost.toLocaleString('pt-BR', { mimnimumFractionalDigits: 2 }) : parseFloat(0)) : parseFloat(5);

        }

        var PorcentagemComissao = parseFloat(produto.price) >= 79 ? ((taxaCalculada / produto.price) * 100) : supermercado ? (((taxaCalculada) / produto.price) * 100) : (((taxaCalculada - 5) / produto.price) * 100);
        var ValorComissao = parseFloat(produto.price) >= 79 ? (taxaCalculada) : supermercado ? (taxaCalculada) : (taxaCalculada - 5);


        dadosProduto.custoEnvio = parseFloat(String(custoEnvio).replace(/,/, '.'));
        dadosProduto.PorcentagemComissao = PorcentagemComissao.toFixed(1);
        dadosProduto.imposto = 0;
        dadosProduto.custo = 0;



        var custoFinal = parseFloat(String(custoEnvio).replace(/,/, '.')) + parseFloat(ValorComissao);

        $("#preco").val(produto.price.toLocaleString('pt-BR', { mimnimumFractionalDigits: 3 }));
        $("#lojaNome").text(vendedor.seller.nickname);
        $("#endereco").text(produto.seller_address.city.name + " - " + produto.seller_address.state.id.replace('BR-', ''));
        $("#ultimasVendas").text(vendedor.seller.seller_reputation.metrics.sales.completed + " vendas nos últimos 60 dias. ");
        $("#mediaVendas").text("Média de " + (vendedor.seller.seller_reputation.metrics.sales.completed / 60).toFixed(0) + " vendas por dia. ");
        $("#custoenvio").val(custoEnvio);
        $("#imposto").val(0);
        $("#custototal").val(0);
        $("#custofinal").text('R$ ' + custoFinal.toFixed(2));
        $("#margem").text(0);
        $("#lucro").text(0);
        $("#nomeproduto").text(produto.title + ' | ' + vendedor.seller.nickname);
        $("#status").text(vendedor.seller.seller_reputation.power_seller_status);
        // $("#level_" + vendedor.seller.seller_reputation.level_id.substring(0, 1)).removeClass("unselected");
        // $("#anos").text(calculaData(vendedor.seller.registration_date).toFixed(0));

        $("#comissaovlr").text((PorcentagemComissao).toFixed(1) + "%" + " (R$" + ValorComissao.toLocaleString('pt-BR', { mimnimumFractionalDigits: 3 }) + ")");

        $('#preco').maskMoney('mask', {
            prefix: "R$",
            decimal: ",",
            thousands: ".",
            selectAllOnFocus: true
        })

        $('#custototal').maskMoney('mask', {
            prefix: "R$",
            decimal: ",",
            thousands: ".",
            selectAllOnFocus: true
        })

        $('#custoenvio').maskMoney('mask', {
            prefix: "R$",
            decimal: ",",
            thousands: ".",
            selectAllOnFocus: true
        })

        document.getElementById('loadingframe').remove();

        if (graficoFalhou) {
            $("#errografico").text("O Mercado Livre esta com instabilidade para nos informar as visitas, tente novamente mais tarde.");
        }

        var ctx = document.getElementById('myChart').getContext('2d');


        if (dadosGrafico[0]) {
            var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [
                        dadosGrafico[11].mes + '/' + dadosGrafico[11].ano,
                        dadosGrafico[10].mes + '/' + dadosGrafico[10].ano,
                        dadosGrafico[9].mes + '/' + dadosGrafico[9].ano,
                        dadosGrafico[8].mes + '/' + dadosGrafico[8].ano,
                        dadosGrafico[7].mes + '/' + dadosGrafico[7].ano,
                        dadosGrafico[6].mes + '/' + dadosGrafico[6].ano,
                        dadosGrafico[5].mes + '/' + dadosGrafico[5].ano,
                        dadosGrafico[4].mes + '/' + dadosGrafico[4].ano,
                        dadosGrafico[3].mes + '/' + dadosGrafico[3].ano,
                        dadosGrafico[2].mes + '/' + dadosGrafico[2].ano,
                        dadosGrafico[1].mes + '/' + dadosGrafico[1].ano,
                        dadosGrafico[0].mes + '/' + dadosGrafico[0].ano,
                    ],
                    datasets: [{
                        data: [
                            dadosGrafico[11].total,
                            dadosGrafico[10].total,
                            dadosGrafico[9].total,
                            dadosGrafico[8].total,
                            dadosGrafico[7].total,
                            dadosGrafico[6].total,
                            dadosGrafico[5].total,
                            dadosGrafico[4].total,
                            dadosGrafico[3].total,
                            dadosGrafico[2].total,
                            dadosGrafico[1].total,
                            dadosGrafico[0].total,
                        ],
                        label: "Visitas",
                        borderColor: "rgb(60,186,159)",
                        backgroundColor: "rgb(60,186,159,0.3)",
                    }
                    ]
                },
            });
        }


        getMargem(dadosProduto);
    }


    function calculaData(dataRegistro) {
        const now = moment(new Date());
        const past = moment(dataRegistro);

        return moment.duration(now.diff(past)).asYears();
    }

    $('#preco').change(function () {
        dadosProduto.price = $("#preco").maskMoney('unmasked')[0];
        let custoEnvio = 0;

        if (dadosProduto.supermercado) {
            custoEnvio =  parseFloat(dadosProduto.price) < 79 ? (dadosProduto.free_shipping ? dadosFrete.coverage.all_country.list_cost.toLocaleString('pt-BR', { mimnimumFractionalDigits: 2 }) : parseFloat(0)) : dadosFrete.coverage.all_country.list_cost.toLocaleString('pt-BR', { mimnimumFractionalDigits: 2 });
          } else {
            custoEnvio =  parseFloat(dadosProduto.price) < 79 ? parseFloat(5) :  dadosFrete.coverage.all_country.list_cost.toLocaleString('pt-BR', { mimnimumFractionalDigits: 2 });
          }

        var taxa = ((dadosProduto.price / 100 ) * dadosProduto.PorcentagemComissao).toFixed(2);
        taxa = parseFloat(taxa);
        var taxaNova = dadosProduto.supermercado ? ((taxa > 5 && parseFloat(dadosProduto.price) < 79) ? taxa - 5 : taxa) : taxa;
        var ValorComissao = parseFloat(dadosProduto.price) >= 79 ? (taxaNova) : dadosProduto.supermercado ? (taxaNova) : (taxaNova - 5);
        $("#comissaovlr").text(parseFloat(dadosProduto.PorcentagemComissao).toFixed(1) + "%" + " (R$" + ValorComissao.toLocaleString('pt-BR', { mimnimumFractionalDigits: 3 }) + ")");

        dadosProduto.custoEnvio = parseFloat(String(custoEnvio).replace(/,/, '.'));
        $("#custoenvio").val(custoEnvio);

        if ($("#preco").maskMoney('unmasked')[0] == '') {
            $('#preco').maskMoney('mask', {
                prefix: "R$",
                decimal: ",",
                thousands: ".",
                selectAllOnFocus: true
            })
        }
        getMargem(dadosProduto);

    })


    $('#custoenvio').change(function () {
        dadosProduto.custoEnvio = $("#custoenvio").maskMoney('unmasked')[0];
        if ($("#custoenvio").maskMoney('unmasked')[0] == '') {
            $('#custoenvio').maskMoney('mask', {
                prefix: "R$",
                decimal: ",",
                thousands: ".",
                selectAllOnFocus: true
            })
        }
        getMargem(dadosProduto);
    })



    $('#imposto').change(function () {
        dadosProduto.imposto = $("#imposto").val() == '' ? 0 : $("#imposto").val();
        $("#imposto").val() == 0 && $("#imposto").val(0);
        getMargem(dadosProduto);
    })

    $('#custototal').change(function () {
        dadosProduto.custo = $("#custototal").maskMoney('unmasked')[0];

        if ($("#custototal").maskMoney('unmasked')[0] == '') {
            $('#custototal').maskMoney('mask', {
                prefix: "R$",
                decimal: ",",
                thousands: ".",
                selectAllOnFocus: true
            })
        }

        getMargem(dadosProduto);
    })

    $('#comissao').change(function () {
        let tipo = document.getElementById('comissao').value;
        let taxa = '';

        
        $.ajax({
            type: "GET",
            url: "https://api.mercadolibre.com/sites/MLB/listing_prices?" + `price=${dadosProduto.price}&category_id=${categoria}`,
            cache: false,
            success: function (data) {
             taxa = data;

             if (tipo == 'classico') {
                document.getElementById('comissao').value = 'classico';
                taxa = taxa.filter(f => f.listing_type_id == 'gold_special');
            } else {
                document.getElementById('comissao').value = 'premium';
                taxa = taxa.filter(f => f.listing_type_id == 'gold_pro');
            }
            taxa = taxa[0];
    
            var supermercado = dadosProduto.tags.includes('supermarket_eligible');
            dadosProduto.supermercado = supermercado;
    
            var taxaNova = supermercado ? ((taxa.sale_fee_amount > 5 && parseFloat(dadosProduto.price) < 79) ? taxa.sale_fee_amount - 5 : taxa.sale_fee_amount) : taxa.sale_fee_amount;
    
            var PorcentagemComissao = parseFloat(dadosProduto.price) >= 79 ? ((taxaNova / dadosProduto.price) * 100) : supermercado ? (((taxaNova) / dadosProduto.price) * 100) : (((taxaNova - 5) / dadosProduto.price) * 100);
            var ValorComissao = parseFloat(dadosProduto.price) >= 79 ? (taxaNova) : supermercado ? (taxaNova) : (taxaNova - 5);
    
            dadosProduto.PorcentagemComissao = PorcentagemComissao.toFixed(1);
            $("#comissaovlr").text((PorcentagemComissao).toFixed(1) + "%" + " (R$" + ValorComissao.toLocaleString('pt-BR', { mimnimumFractionalDigits: 3 }) + ")");
    
    
            getMargem(dadosProduto);

            }
        });

    })

    $("[tabindex]").addClass("TabOnEnter");
    $(document).on("keypress", ".TabOnEnter", function (e) {
        if (e.keyCode == 13) {
            var nextElement = $('[tabindex="' + (this.tabIndex + 1) + '"]');
            if (nextElement.length) {
                nextElement.focus()
            } else {
                $('[tabindex="1"]').focus();
            }
        }
    });

    function getCodBarras() {
        $.ajax({
            type: "GET",
            url: "https://ramcloud.com.br:9001/EanGenerator/MLB/6",
            cache: false,
            success: function (data) {
                codBarras = data;
                getGrafico();
            }
        });
    }

    function getGrafico() {
        $.ajax({
            type: "GET",
            url: `https://ramcloud.com.br:12000/ram/xdados/MLANALYTICS/GETVISITASPORMES?ITEM=${mlb}`,
            cache: false,
            success: function (data) {
                dadosGrafico = data;
                renderizaDados(dadosProduto, dadosVendedor, dadosTaxa, dadosFrete);
                RenderAcompanhamento();
                RenderConcorrent();
            },
            error: function (xhr) {
                renderizaDados(dadosProduto, dadosVendedor, dadosTaxa, dadosFrete);
                RenderAcompanhamento();
                RenderConcorrent();
                graficoFalhou = true;
                switch (xhr.status) {
                    case 400:
                        console.log("Erro: " + xhr.status + " - Visitas não encontrada.");
                        renderizaDados(dadosProduto, dadosVendedor, dadosTaxa, dadosFrete);
                        RenderAcompanhamento();
                        RenderConcorrent();
                        break;
                    case 404:
                        console.log("Erro: " + xhr.status + " - Visitas não encontrada");
                        renderizaDados(dadosProduto, dadosVendedor, dadosTaxa, dadosFrete);
                        RenderAcompanhamento();
                        RenderConcorrent();
                        break;
                }
            }
        });
    }



    $('#criar').click(function () {

        let titulos = [];
        let nome = $("#nome").val().substring(0, 56).split(',');
        let subnome = $("#subnome").val().substring(0, 56).split(',');
        let vantagem = $("#vantagem").val().substring(0, 56).split(',');
        let objecao = $("#objecao").val().substring(0, 56).split(',');
        let tentativas = 0;

        while (titulos.length < 6 && tentativas < 20) {
            console.log('tentativas ' + tentativas + ' | ' + titulos.length);
            let titulo =
                nome[Math.floor(Math.random() * nome.length)].trim() + ' ' +
                subnome[Math.floor(Math.random() * subnome.length)].trim() + ' ' +
                vantagem[Math.floor(Math.random() * vantagem.length)].trim() + ' ' +
                objecao[Math.floor(Math.random() * objecao.length)].trim();

            titulo = titulo.replace("  ", " ");

            if (titulo.length < 60) {
                titulos.push({
                    titulo: titulo
                });
            } else {
                tentativas += 1;
            }
        }


        document.getElementById('dados2').style.display = "none";
        var teste = document.createElement('div');
        teste.id = 'dados3';
        teste.style.height = "190px";

        teste.innerHTML =
            `<span>${titulos[0] != undefined ? titulos[0].titulo : ''} - Cód Barras: ${codBarras[0]}</span> <br>` +
            `<span>${titulos[1] != undefined ? titulos[1].titulo : ''} - Cód Barras: ${codBarras[1]}</span> <br>` +
            `<span>${titulos[2] != undefined ? titulos[2].titulo : ''} - Cód Barras: ${codBarras[2]}</span> <br>` +
            `<span>${titulos[3] != undefined ? titulos[3].titulo : ''} - Cód Barras: ${codBarras[3]}</span> <br>` +
            `<span>${titulos[4] != undefined ? titulos[4].titulo : ''} - Cód Barras: ${codBarras[4]}</span> <br>` +
            `<span>${titulos[5] != undefined ? titulos[5].titulo : ''} - Cód Barras: ${codBarras[5]}</span> <br>`;


        var nomes = document.getElementById('nomes');

        console.log(nomes);

        nomes.appendChild(teste);


    })

    function RenderAcompanhamento() {
        LimpaBloco();

        $.ajax({
            url: baseURL + '/MLPRO/GETINFO?EMAIL=' + emailRetornado,
            dataType: 'json',
            type: 'get',
            contentType: 'application/json',
            success: function (data, textStatus, jQxhr) {
                for (let index = 0; index < data.result.length; index++) {
                    const element = data.result[index];
                    RenderBloco(index + 1, element);
                }
            },
            error: function (jqXhr, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        });
    }

    function RenderBloco(index, data) {
        let ultra = false;
        let dadosUltra = document.getElementsByClassName('ultra');

        if (dadosUltra.length >= 1) {
            ultra = true;
        }


        let bloco = document.createElement('div');
        bloco.id = `blocoAnuncio${index}`;
        bloco.style = `margin-top: 10px; border-top: 2px solid #3498d8; width: 100%; display: flex; height: 120px; justify-content: space-between; background-color: #fff; padding: 3px 5px 0px 5px; border-radius: 4px; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 12%);`;


        //Titulo====== 
        bloco.innerHTML = `
            <div style="width: 1%; padding: 5px; font-size: 14px; align-self: center;">
                <center>
                    <span style="color: gray; font-size: 14px;">${index}</span>
                </center>
            </div>


            <div style="width: 8%; padding: 5px; font-size: 14px; align-self: center;">
                <center>
                    <img style="width: 72px; height: 72px;  border: 2px solid gray; border-radius: 50%;"
                        src="${data.FOTO != '' && data.FOTO != undefined ? data.FOTO.replace('-F.','-W.') : 'https://i.ibb.co/WtJkhCY/PO011098-007-1-PRODUTOSEMFOTO-MOBILE.jpg'}"></img>
                        <span ${data.FULL != 1 ? 'style="display: none"' : ''} class="full">FULL</span>
                </center>
            </div>

            <div style="width: 15%; padding: 5px; font-size: 14px; align-self: center;">
                <center>
                    <p class="p2-${data.dados[data.dados.length - 1].MEDALHA != '' && data.dados[data.dados.length - 1].MEDALHA != undefined ? data.dados[data.dados.length - 1].MEDALHA : 'null'}">
                        <span style="color: gray">
                            ${data.VENDEDOR != '' && data.VENDEDOR != undefined ? data.VENDEDOR.substring(0, 20) : ''}
                        </span>
                    </p>
                    <a href="${data.LINK}"  target="_blank" >
                        <span>${data.NAME.substring(0, 44)}</span>
                    </a>
                    ${ultra ? `<p style="font-size: 12px; margin-top: 5px; margin-bottom: 3px">Marca: ${data.MARCA ? data.MARCA.substring(0, 20) : 'Não Informado'}</p>` : `<span></span>`}
                </center>
            </div>
        `
        //=============



        //Tabela=======
        var tabela = '';

        var novasVendas = data.dados[data.dados.length - 1].VENDAS - data.dados[0].VENDAS;
        var novasVisitas = 0;
        novasVisitas = data.dados[data.dados.length - 1].VISITA != 0 ? data.dados[data.dados.length - 1].VISITA - data.dados[0].VISITA : 0;

        var dataTabela = new Date(data.dados[0].DATA);

        var infoTabela = [];

        for (let index = 0; index < 7; index++) {
            infoTabela.push({
                DATA: `${dataTabela.getFullYear()}-${dataTabela.getMonth() + 1}-${dataTabela.getDate()}`,
                DATAFORMATADA: `${dataTabela.getDate() <= 9 ? '0' + dataTabela.getDate() : dataTabela.getDate()}/${(dataTabela.getMonth() + 1) <= 9 ? '0' + (dataTabela.getMonth() + 1) : dataTabela.getMonth() + 1}/${dataTabela.getFullYear()}`
            });
            dataTabela.setDate(dataTabela.getDate() + 1);
        }

        for (let index = 0; index < infoTabela.length; index++) {
            const element = infoTabela[index];

            for (let index2 = 0; index2 < data.dados.length; index2++) {
                const element2 = data.dados[index2];

                var myData = new Date(element2.DATA);

                if (element.DATA == `${myData.getFullYear()}-${myData.getMonth() + 1}-${myData.getDate()}`) {
                    element.VENDAS = element2.VENDAS
                    element.VENDASREAL = element2.VENDASREAL
                    element.ESTOQUE = element2.ESTOQUE
                    element.PRECO = element2.PRECO.toFixed(2)
                    element.VISITA = element2.VISITA
                    element.STATUS = element2.STATUS
                    element.NAME = element2.NAME
                }
            }

        }
    

        dataTabela = '';
        var vendasDiaTabela = '';
        var estoqueTabela = '';
        var precoTabela = '';
        var visitasTabela = '';
        var conversaoTabela = '';

        var vendaAtual = 0;
        var visitaAnterior = 0;

        for (let index = 0; index < infoTabela.length; index++) {
            const element = infoTabela[index];
            if (index == 0) { visitaAnterior = element.VISITA != undefined ? element.VISITA : 0;  };

            if (element.VENDAS == 0 && element.NAME == 'PAUSADO') {

                dataTabela = dataTabela + `<th>${element.DATAFORMATADA != undefined ? element.DATAFORMATADA : ''}</th>`;

                vendasDiaTabela = vendasDiaTabela + `<th rowspan="5"> PAUSADO </th>`;

            } else {
                dataTabela = dataTabela + `<th>${element.DATAFORMATADA != undefined ? element.DATAFORMATADA : ''}</th>`;

                vendasDiaTabela = vendasDiaTabela + `<th>${element.VENDAS != undefined && index != 0 ? element.VENDAS - vendaAtual : ''}</th>`;

                estoqueTabela = estoqueTabela + `<th>${element.ESTOQUE != undefined ? element.ESTOQUE : ''}</th>`;

                precoTabela = precoTabela + `<th>${element.PRECO != undefined ? element.PRECO : ''}</th>`;

                // visitasTabela = visitasTabela + `<th>${element.VISITA != undefined && index != 0 ? element.VISITA : ''}</th>`;

                visitasTabela = visitasTabela + `<th>${element.VISITA != undefined && index != 0 ? element.VISITA - visitaAnterior : (index == 0 ? '0' : '')}</th>`;

                conversaoTabela = conversaoTabela +`<th>${element.VISITA != undefined && index != 0 ? `${ (element.VISITA - visitaAnterior) != 0 ? ((1 / ((element.VISITA - visitaAnterior) / (element.VENDAS - vendaAtual) )) * 100).toFixed(2) : '0.00'}%` : (index == 0 ? '0.00%' : '')}</th>`; 


                vendaAtual = element.VENDAS;
                visitaAnterior = element.VISITA != undefined && index != 0 ? element.VISITA : visitaAnterior; 
            }

        }


        tabela = `
        <div style="width: 43%; padding: 5px">

            <table id="tabAnuncio${index}" class="TabelaRastreio">
                <tr style="display: none">
                    <th colspan="8"><a href="${data.LINK}"> ${data.NAME}  </a></th>
                </tr>
                <tr>
                    <th>Data</th>
                    ${dataTabela}
                </tr>

                <tr style="color: #3498d8; font-weight: bold;">
                    <td>Vendas Dia</td>
                    ${vendasDiaTabela}
                </tr>

                <tr>
                    <td>Estoque</td>
                    ${estoqueTabela}
                </tr>

                <tr>
                    <td>Preço</td>
                    ${precoTabela}
                </tr>

                <tr>
                    <td>Visitas</td>
                    ${visitasTabela}
                </tr>

                <tr>
                    <td>Conversão</td>
                    ${conversaoTabela}
                </tr>

            </table>
        </div>
        `;

        bloco.innerHTML = bloco.innerHTML + tabela;
        //=============

        //Analise
        novasVisitas < 0 ?
        bloco.innerHTML = bloco.innerHTML + `
        <div style="width: 27%; padding: 5px; font-size: 13px; align-self: center;">
            <center>
                <p><strong>Análise:</strong> Nos últimos ${data.dados.length} dias, esse anúncio teve ${novasVendas} novas vendas. Falha ao buscar visitas, a api do Mercado Livre esta com problemas para passar essa informação.
            </center>
        </div>
        `
        :
        bloco.innerHTML = bloco.innerHTML + `
        <div style="width: 27%; padding: 5px; font-size: 13px; align-self: center;">
            <center>
                <p><strong>Análise:</strong> Nos últimos ${data.dados.length} dias, esse anúncio teve ${novasVendas} novas vendas e ${novasVisitas} visitas. ${Math.trunc(novasVisitas / novasVendas) === Infinity ? ' ' : `Sendo 1 venda a cada ${isNaN(Math.trunc(novasVisitas / novasVendas)) ? 0 : Math.trunc(novasVisitas / novasVendas)} visitas.`} </p>
                ${data.dados.length >= 7 ? '<p style="color: red">Esse anúncio atingiu o limite de 7 dias de rastreio.</p>' : ''}
            </center>
        </div>
        `;


        //Botão========
        bloco.innerHTML = bloco.innerHTML + `
        <div style="width: 4%;">
            <div style="width: 100%; height: 33.3%; cursor: pointer;">
                <center>
                    <button id="excelAnuncios${index}" value="tabAnuncio${index}"
                        style="background: none; border: none;">
                        <img src="https://img.icons8.com/color/28/000000/ms-excel.png" />
                    </button>
                </center>
            </div>
            <div id="btnRefazerAcompanhar${index}" style="width: 100%; height: 33.3%; cursor: pointer;">
                <center><img src="https://img.icons8.com/glyph-neue/28/4a90e2/restart.png" />
                </center>
            </div>
            <div id="btnPararAcompanhar${index}" style="width: 100%; height: 33.3%; cursor: pointer;">
                <center><img src="https://img.icons8.com/glyph-neue/28/fa314a/delete-trash.png" />
                </center>
            </div>
        </div>
        `
        //============= 

        document.getElementById('AnuncioContent').insertAdjacentElement('beforeend', bloco);

        /** BAIXAR TODOS */

        let blocoOculto = `  <tr style="display: none">
        <th colspan="8"><a href="${data.LINK}"> ${data.NAME}  </a></th>
        </tr>
        <tr>
            <th>Data</th>
            ${dataTabela}
        </tr>

        <tr style="color: #3498d8; font-weight: bold;">
            <td>Vendas Dia</td>
            ${vendasDiaTabela}
        </tr>

        <tr>
            <td>Estoque</td>
            ${estoqueTabela}
        </tr>

        <tr>
            <td>Preço</td>
            ${precoTabela}
        </tr>

        <tr>
            <td>Visitas</td>
            ${visitasTabela}
        </tr>`;

        document.getElementById('TabelaOcultaAnuncios').innerHTML += blocoOculto;

        /** BAIXAR TODOS */

        $(`#btnPararAcompanhar${index}`).click(function () {
            document.getElementById('AnuncioContent').innerHTML = `
            <center>
                <iframe style="margin-top: 30px"
                    src="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif" width="200"
                    height="200" frameBorder="0" class="giphy-embed"></iframe>
                <p><strong>Aguarde, removendo rastreio...</strong></p>
            </center> `;
            $.ajax({
                url: baseURL + '/MLPRO/PARAR',
                dataType: 'json',
                type: 'post',
                contentType: 'application/json',
                data: JSON.stringify({ MLB: data.MLB, EMAIL: data.EMAIL }),
                success: function (data, textStatus, jQxhr) {
                    RenderAcompanhamento();
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    console.log(errorThrown);
                }
            });
        });

        $(`#btnRefazerAcompanhar${index}`).click(function () {
            document.getElementById('AnuncioContent').innerHTML = `
            <center>
                <iframe style="margin-top: 30px"
                    src="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif" width="200"
                    height="200" frameBorder="0" class="giphy-embed"></iframe>
                <p><strong>Aguarde, refazendo rastreio...</strong></p>
            </center> `;
            $.ajax({
                url: baseURL + '/MLPRO/RECOMECAR',
                dataType: 'json',
                type: 'post',
                contentType: 'application/json',
                data: JSON.stringify({ MLB: data.MLB, EMAIL: data.EMAIL }),
                success: function (data, textStatus, jQxhr) {
                    RenderAcompanhamento();
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    console.log(errorThrown);
                }
            });
        });

        $(`#excelAnuncios${index}`).click(function (data) {
            var id = $(this).attr('value');

            var tab_text = "<table><tr>";
            var textRange = '';
            var j = 0;
            var tab = document.getElementById(id); // id of table

            for (j = 0; j < tab.rows.length; j++) {
                tab_text += tab.rows[j].innerHTML + "</tr>";
            }

            tab_text += "</table>";



            var a = document.createElement('a');
            var data_type = 'data:application/vnd.ms-excel';
            a.href = data_type + ', ' + encodeURIComponent(tab_text);
            //setting the file name
            a.download = 'Rastreio Anúncios.xls';
            //triggering the function
            a.click();
            //just in case, prevent default behaviour
            e.preventDefault();

        });
    }

    function LimpaBloco() {
        document.getElementById('AnuncioContent').innerHTML = ` `;
    }

    function RenderConcorrent() {
        LimpaBlocoConcorrent();

        $.ajax({
            url: baseURL + '/MLPRO/VENDEDOR/GETINFO?EMAIL=' + emailRetornado,
            dataType: 'json',
            type: 'get',
            contentType: 'application/json',
            success: function (data, textStatus, jQxhr) {
                for (let index = 0; index < data.result.length; index++) {
                    const element = data.result[index];
                    RenderBlocoConcorrent(index + 1, element);
                }
            },
            error: function (jqXhr, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        });
    }

    function RenderBlocoConcorrent(index, data) {
        let bloco = document.createElement('div');
        bloco.id = `blocoAnuncioConcorrent${index}`;

        bloco.style = 'margin-top: 10px; border-top: 2px solid #3498d8; width: 100%; display: flex; height: 116px; justify-content: space-between; background-color: #fff; padding: 3px 5px 0px 5px; border-radius: 4px; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 12%);';

        //Titulo
        bloco.innerHTML = bloco.innerHTML + `

            <div style="width: 2.5%; padding: 5px; font-size: 14px; align-self: center;">
                <center>
                    <span style="color: gray; font-size: 14px;">${index}</span>
                </center>
            </div>



            <div style="width: 16%; padding: 5px; font-size: 14px; align-self: center;">
                <center>
                    <strong>
                        <center>
                            <p class="p2-${data.dados[data.dados.length - 1].MEDALHA != '' && data.dados[data.dados.length - 1].MEDALHA != undefined ? data.dados[data.dados.length - 1].MEDALHA.toLowerCase() : 'null'}">
                                <a href="https://www.mercadolivre.com.br/perfil/${data.VENDEDOR}" target="_blank">
                                    ${data.VENDEDOR}
                                </a>
                            </p>
                        </center>
                        <small>Vende Desde: ${data.DATACRIACAO != '' && data.DATACRIACAO != undefined ? data.DATACRIACAO : ''}</small>
                    </strong>
                </center>
            </div>
        `;


        //Tabela
        var tabela = '';

        var novasVendas = 0;
        var novasVisitas = 0;
        novasVisitas = data.dados[data.dados.length - 1].VISITA != 0 ? data.dados[data.dados.length - 1].VISITA - data.dados[0].VISITA : 0;

        var dataTabela = new Date(data.dados[0].DATA);

        var infoTabela = [];

        for (let index = 0; index < 7; index++) {
            infoTabela.push({
                DATA: `${dataTabela.getFullYear()}-${dataTabela.getMonth() + 1}-${dataTabela.getDate()}`,
                DATAFORMATADA: `${dataTabela.getDate() <= 9 ? '0' + dataTabela.getDate() : dataTabela.getDate()}/${(dataTabela.getMonth() + 1) <= 9 ? '0' + (dataTabela.getMonth() + 1) : dataTabela.getMonth() + 1}/${dataTabela.getFullYear()}`
            });
            dataTabela.setDate(dataTabela.getDate() + 1);
        }

        for (let index = 0; index < infoTabela.length; index++) {
            const element = infoTabela[index];

            for (let index2 = 0; index2 < data.dados.length; index2++) {
                const element2 = data.dados[index2];

                var myData = new Date(element2.DATA);

                if (element.DATA == `${myData.getFullYear()}-${myData.getMonth() + 1}-${myData.getDate()}`) {
                    element.VENDAS = element2.VENDAS
                    element.ANUNCIOS = element2.ANUNCIOS
                    element.MEDALHA = element2.MEDALHA
                    element.PREMIUM = element2.PREMIUM
                    element.CLASSICO = element2.CLASSICO
                    element.NUMFULL = element2.NUMFULL
                    element.VENDASREAL = element2.VENDASREAL
                }
            }

        }

        dataTabela = '';
        var vendasTabela = '';
        var anunciosTabela = '';
        var PremiumTabela = '';
        var classicoTabela = '';
        var fullTabela = '';

        for (let index = 0; index < infoTabela.length; index++) {
            const element = infoTabela[index];
            novasVendas = novasVendas + (element.VENDASREAL != undefined ? element.VENDASREAL : 0);

            dataTabela = dataTabela + `<th>${element.DATAFORMATADA != undefined ? element.DATAFORMATADA : ''}</th>`;

            vendasTabela = vendasTabela + `<td>${index != 0 && element.VENDASREAL != undefined ? element.VENDASREAL : ''}</td>`;

            anunciosTabela = anunciosTabela + `<td>${element.ANUNCIOS != undefined ? element.ANUNCIOS : ''}</td>`;

            PremiumTabela = PremiumTabela + `<td>${element.PREMIUM != undefined ? element.PREMIUM : ''}</td>`;

            classicoTabela = classicoTabela + `<td>${element.CLASSICO != undefined ? element.CLASSICO : ''}</td>`;

            fullTabela = fullTabela + `<td>${element.NUMFULL != undefined ? element.NUMFULL : ''}</td>`;
        }

        tabela = `
        <div style="width: 49%; padding: 5px">

            <table id="tabVendedor${index}" class="TabelaRastreio">
                <tr style="display: none">
                    <th colspan="8"><a href="https://www.mercadolivre.com.br/perfil/${data.VENDEDOR}">${data.VENDEDOR}</a></th>
                </tr>
                <tr>
                    <th>Data</th>
                    ${dataTabela}
                </tr>

                <tr style="color: #3498d8; font-weight: bold;">
                    <td>Vendas Dia</td>
                    ${vendasTabela}
                </tr>

                <tr>
                    <td>Anúncios</td>
                    ${anunciosTabela}
                </tr>

                <tr>
                    <td>Premium</td>
                    ${PremiumTabela}
                </tr>

                <tr>
                    <td>Clássico</td>
                    ${classicoTabela}
                </tr>

                <tr>
                    <td>Full</td>
                    ${fullTabela}
                </tr>

            </table>
        </div>
        `;

        bloco.innerHTML = bloco.innerHTML + tabela;


        //rodapé
        bloco.innerHTML = bloco.innerHTML + `
        <div style="width: 27%; padding: 5px; font-size: 13px; align-self: center;">
            <center>
                <p><strong>Análise: </strong> 
                Nos últimos ${data.dados.length} dias, esse vendedor fez ${novasVendas} vendas. Uma média de ${isNaN(Math.trunc(novasVendas / data.dados.length)) ? 0 : Math.trunc(novasVendas / data.dados.length)} vendas por dia.
                </p>
                ${data.dados.length >= 7 ? `<p style="color: red; margin-bottom: -3px"><small>Esse concorrente atingiu o limite de 7 dias de rastreio.</small></p>` : ''}
            </center>
        </div>


        <div style="width: 4%;">
            <div style="width: 100%; height: 33.3%; cursor: pointer;">
                <center>
                    <button id="excelVendedor${index}" value="tabVendedor${index}"
                        style="background: none; border: none;">
                        <img src="https://img.icons8.com/color/28/000000/ms-excel.png" />
                    </button>
                </center>
            </div>
            <div id="btnRefazerAcompanharConcorrent${index}" style="width: 100%; height: 33.3%; cursor: pointer;">
                <center><img src="https://img.icons8.com/glyph-neue/28/4a90e2/restart.png" />
                </center>
            </div>
            <div id="btnPararAcompanharConcorrent${index}" style="width: 100%; height: 33.3%; cursor: pointer;">
                <center><img src="https://img.icons8.com/glyph-neue/28/fa314a/delete-trash.png" />
                </center>
            </div>
        </div>
        `;

        document.getElementById('AnuncioContentConcorente').insertAdjacentElement('beforeend', bloco);

        /** BAIXAR TODOS */

        let blocoOculto = ` 
        <tr style="display: none">
            <th colspan="8"><a href="https://www.mercadolivre.com.br/perfil/${data.VENDEDOR}">${data.VENDEDOR}</a></th>
        </tr>
        <tr>
            <th>Data</th>
            ${dataTabela}
        </tr>

        <tr style="color: #3498d8; font-weight: bold;">
            <td>Vendas Dia</td>
            ${vendasTabela}
        </tr>

        <tr>
            <td>Anúncios</td>
            ${anunciosTabela}
        </tr>

        <tr>
            <td>Premium</td>
            ${PremiumTabela}
        </tr>

        <tr>
            <td>Clássico</td>
            ${classicoTabela}
        </tr>

        <tr>
            <td>Full</td>
            ${fullTabela}
        </tr>
    `;

        document.getElementById('TabelaOcultaConcorrentes').innerHTML += blocoOculto;

        /** BAIXAR TODOS */



        $(`#btnPararAcompanharConcorrent${index}`).click(function () {
            document.getElementById('AnuncioContentConcorente').innerHTML = `
            <center>
                <iframe style="margin-top: 30px"
                    src="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif" width="200"
                    height="200" frameBorder="0" class="giphy-embed"></iframe>
                <p><strong>Aguarde, removendo rastreio...</strong></p>
            </center> `;
            $.ajax({
                url: baseURL + '/MLPRO/VENDEDOR/PARAR',
                dataType: 'json',
                type: 'post',
                contentType: 'application/json',
                data: JSON.stringify({ VENDEDOR: data.VENDEDOR, EMAIL: data.EMAIL }),
                success: function (data, textStatus, jQxhr) {
                    RenderConcorrent();
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    console.log(errorThrown);
                }
            });
        });

        $(`#btnRefazerAcompanharConcorrent${index}`).click(function () {
            document.getElementById('AnuncioContentConcorente').innerHTML = `
            <center>
                <iframe style="margin-top: 30px"
                    src="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif" width="200"
                    height="200" frameBorder="0" class="giphy-embed"></iframe>
                <p><strong>Aguarde, refazendo rastreio...</strong></p>
            </center> `;
            $.ajax({
                url: baseURL + '/MLPRO/VENDEDOR/RECOMECAR',
                dataType: 'json',
                type: 'post',
                contentType: 'application/json',
                data: JSON.stringify({ VENDEDOR: data.VENDEDOR, EMAIL: data.EMAIL }),
                success: function (data, textStatus, jQxhr) {
                    RenderConcorrent();
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    console.log(errorThrown);
                }
            });
        });

        $(`#excelVendedor${index}`).click(function (data) {
            var id = $(this).attr('value');

            var tab_text = "<table><tr>";
            var textRange = '';
            var j = 0;
            var tab = document.getElementById(id); // id of table

            for (j = 0; j < tab.rows.length; j++) {
                tab_text += tab.rows[j].innerHTML + "</tr>";
            }

            tab_text += "</table>";



            var a = document.createElement('a');
            var data_type = 'data:application/vnd.ms-excel';
            a.href = data_type + ', ' + encodeURIComponent(tab_text);
            //setting the file name
            a.download = 'Rastreio Anúncios.xls';
            //triggering the function
            a.click();
            //just in case, prevent default behaviour
            e.preventDefault();

        });

    }


    function LimpaBlocoConcorrent() {
        document.getElementById('AnuncioContentConcorente').innerHTML = ``;
    }



    $('#btnAcompanhar').click(function () {
        document.getElementById("btnAcompanhar").setAttribute("style", 'display: none');
        document.getElementById("btnAcompanharLoading").setAttribute("style", "display: true;");

        $.ajax({
            url: baseURL + '/MLPRO/INICIAR',
            dataType: 'json',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify({ MLB: mlb, EMAIL: emailRetornado }),
            success: function (data, textStatus, jQxhr) {
                alert('\n' + data.MSG);
                RenderAcompanhamento();
                document.getElementById("btnAcompanhar").setAttribute("style", 'display: true');
                document.getElementById("btnAcompanharLoading").setAttribute("style", "display: none;");
            },
            error: function (jqXhr, textStatus, errorThrown) {
                console.log(errorThrown);
                document.getElementById("btnAcompanhar").setAttribute("style", 'display: true');
                document.getElementById("btnAcompanharLoading").setAttribute("style", "display: none;");
            }
        });
    });

    $('#btnAcompanharConcorrente').click(function () {
        document.getElementById("btnAcompanharConcorrente").setAttribute("style", 'display: none');
        document.getElementById("btnAcompanharConcorrenteLoading").setAttribute("style", "display: true;");

        $.ajax({
            url: baseURL + '/MLPRO/VENDEDOR/INICIAR',
            dataType: 'json',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify({ MLB: mlb, EMAIL: emailRetornado }),
            success: function (data, textStatus, jQxhr) {
                alert('\n' + data.MSG);
                RenderConcorrent();
                document.getElementById("btnAcompanharConcorrente").setAttribute("style", 'display: true');
                document.getElementById("btnAcompanharConcorrenteLoading").setAttribute("style", "display: none;");
            },
            error: function (jqXhr, textStatus, errorThrown) {
                console.log(errorThrown);
                document.getElementById("btnAcompanharConcorrente").setAttribute("style", 'display: true');
                document.getElementById("btnAcompanharConcorrenteLoading").setAttribute("style", "display: none;");
            }
        });


    });

    $('#fechar').click(function () {
        parent.window.postMessage("removetheiframe", "*");
    });


    $(document).ready(function () {
        $("#excelAnuncios").click(function (data) {
            var id = $(this).attr('value');

            var tab_text = "<table><tr>";
            var textRange = '';
            var j = 0;
            var tab = document.getElementById(id); // id of table

            for (j = 0; j < tab.rows.length; j++) {
                tab_text += tab.rows[j].innerHTML + "</tr>";
            }

            tab_text += "</table>";



            var a = document.createElement('a');
            var data_type = 'data:application/vnd.ms-excel';
            a.href = data_type + ', ' + encodeURIComponent(tab_text);
            //setting the file name
            a.download = 'Rastreio Anúncios.xls';
            //triggering the function
            a.click();
            //just in case, prevent default behaviour
            e.preventDefault();

        });
    });




    $('#refazertodosanuncios').click(async function () {

        var listaAnucncio = [];

        document.getElementById('AnuncioContent').innerHTML = `
            <center>
                <iframe style="margin-top: 30px"
                    src="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif" width="200"
                    height="200" frameBorder="0" class="giphy-embed"></iframe>
                <p><strong>Aguarde, refazendo rastreio...</strong></p>
            </center> `;

        var listaAnucncio = await new Promise((resolve, reject) => {
            $.ajax({
                url: baseURL + '/MLPRO/GETINFO?EMAIL=' + emailRetornado,
                dataType: 'json',
                type: 'get',
                contentType: 'application/json',
                success: function (data, textStatus, jQxhr) {
                    // listaAnucncio  = data.result; 
                    resolve(data.result);
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    console.log(errorThrown);
                }
            });
        });

        for (let index = 0; index < listaAnucncio.length; index++) {
            const element = listaAnucncio[index];

            var restorno = await new Promise((resolve, reject) => {
                $.ajax({
                    url: baseURL + '/MLPRO/RECOMECAR',
                    dataType: 'json',
                    type: 'post',
                    contentType: 'application/json',
                    data: JSON.stringify({ MLB: element.MLB, EMAIL: element.EMAIL }),
                    success: function (data, textStatus, jQxhr) {
                        resolve(data);
                    },
                    error: function (jqXhr, textStatus, errorThrown) {
                        console.log(errorThrown);
                    }
                });
            });

            document.getElementById('AnuncioContent').innerHTML = `
            <center>
                <iframe style="margin-top: 30px"
                    src="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif" width="200"
                    height="200" frameBorder="0" class="giphy-embed"></iframe>
                <p><strong>Aguarde, refazendo rastreio  ${index + 1}/${listaAnucncio.length} </strong></p>
            </center> `;
        }

        RenderAcompanhamento();

    });

    $('#removertodosanuncios').click(async function () {

        var listaAnucncio = [];

        document.getElementById('AnuncioContent').innerHTML = `
            <center>
                <iframe style="margin-top: 30px"
                    src="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif" width="200"
                    height="200" frameBorder="0" class="giphy-embed"></iframe>
                <p><strong>Aguarde, removendo rastreio...</strong></p>
            </center>`;

        var listaAnucncio = await new Promise((resolve, reject) => {
            $.ajax({
                url: baseURL + '/MLPRO/GETINFO?EMAIL=' + emailRetornado,
                dataType: 'json',
                type: 'get',
                contentType: 'application/json',
                success: function (data, textStatus, jQxhr) {
                    // listaAnucncio  = data.result; 
                    resolve(data.result);
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    console.log(errorThrown);
                }
            });
        });

        for (let index = 0; index < listaAnucncio.length; index++) {
            const element = listaAnucncio[index];

            var restorno = await new Promise((resolve, reject) => {
                $.ajax({
                    url: baseURL + '/MLPRO/PARAR',
                    dataType: 'json',
                    type: 'post',
                    contentType: 'application/json',
                    data: JSON.stringify({ MLB: element.MLB, EMAIL: element.EMAIL }),
                    success: function (data, textStatus, jQxhr) {
                        resolve(data);
                    },
                    error: function (jqXhr, textStatus, errorThrown) {
                        console.log(errorThrown);
                    }
                });
            });

            document.getElementById('AnuncioContent').innerHTML = `
            <center>
                <iframe style="margin-top: 30px"
                    src="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif" width="200"
                    height="200" frameBorder="0" class="giphy-embed"></iframe>
                <p><strong>Aguarde, removendo rastreio  ${index + 1}/${listaAnucncio.length} </strong></p>
            </center>`;
        }

        RenderAcompanhamento();

    });

    $('#refazertodosconcorrentes').click(async function () {
        var listaAnucncio = [];

        document.getElementById('AnuncioContentConcorente').innerHTML = `
            <center>
                <iframe style="margin-top: 30px"
                    src="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif" width="200"
                    height="200" frameBorder="0" class="giphy-embed"></iframe>
                <p><strong>Aguarde, refazendo rastreio...</strong></p>
            </center>`;

        var listaAnucncio = await new Promise((resolve, reject) => {
            $.ajax({
                url: baseURL + '/MLPRO/VENDEDOR/GETINFO?EMAIL=' + emailRetornado,
                dataType: 'json',
                type: 'get',
                contentType: 'application/json',
                success: function (data, textStatus, jQxhr) {
                    resolve(data.result)
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    console.log(errorThrown);
                    resolve([]);
                }
            });
        });

        for (let index = 0; index < listaAnucncio.length; index++) {
            const element = listaAnucncio[index];

            var restorno = await new Promise((resolve, reject) => {

                $.ajax({
                    url: baseURL + '/MLPRO/VENDEDOR/RECOMECAR',
                    dataType: 'json',
                    type: 'post',
                    contentType: 'application/json',
                    data: JSON.stringify({ VENDEDOR: element.VENDEDOR, EMAIL: element.EMAIL }),
                    success: function (data, textStatus, jQxhr) {
                        resolve(data);
                    },
                    error: function (jqXhr, textStatus, errorThrown) {
                        console.log(errorThrown);
                    }
                });

            });

            document.getElementById('AnuncioContentConcorente').innerHTML = `
            <center>
                <iframe style="margin-top: 30px"
                    src="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif" width="200"
                    height="200" frameBorder="0" class="giphy-embed"></iframe>
                <p><strong>Aguarde, refazendo rastreio ${index + 1}/${listaAnucncio.length} </strong></p>
            </center>`;

        };

        RenderConcorrent();

    });

    $('#removertodosconcorrentes').click(async function () {
        var listaAnucncio = [];

        document.getElementById('AnuncioContentConcorente').innerHTML = `
            <center>
                <iframe style="margin-top: 30px"
                    src="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif" width="200"
                    height="200" frameBorder="0" class="giphy-embed"></iframe>
                <p><strong>Aguarde, removendo rastreio...</strong></p>
            </center>`;

        var listaAnucncio = await new Promise((resolve, reject) => {
            $.ajax({
                url: baseURL + '/MLPRO/VENDEDOR/GETINFO?EMAIL=' + emailRetornado,
                dataType: 'json',
                type: 'get',
                contentType: 'application/json',
                success: function (data, textStatus, jQxhr) {
                    resolve(data.result)
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    console.log(errorThrown);
                    resolve([]);
                }
            });
        });

        for (let index = 0; index < listaAnucncio.length; index++) {
            const element = listaAnucncio[index];

            var restorno = await new Promise((resolve, reject) => {
                $.ajax({
                    url: baseURL + '/MLPRO/VENDEDOR/PARAR',
                    dataType: 'json',
                    type: 'post',
                    contentType: 'application/json',
                    data: JSON.stringify({ VENDEDOR: element.VENDEDOR, EMAIL: element.EMAIL }),
                    success: function (data, textStatus, jQxhr) {
                        resolve(data);
                    },
                    error: function (jqXhr, textStatus, errorThrown) {
                        console.log(errorThrown);
                    }
                });
            });

            document.getElementById('AnuncioContentConcorente').innerHTML = `
            <center>
                <iframe style="margin-top: 30px"
                    src="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif" width="200"
                    height="200" frameBorder="0" class="giphy-embed"></iframe>
                <p><strong>Aguarde, removendo rastreio ${index + 1}/${listaAnucncio.length} </strong></p>
            </center>`;

        };

        RenderConcorrent();

    });


    $(`#excelAnunciosTodos`).click(function (data) {
        var id = 'TabelaOcultaAnuncios';

        var tab_text = "<table><tr>";
        var textRange = '';
        var j = 0;
        var tab = document.getElementById(id); // id of table

        for (j = 0; j < tab.rows.length; j++) {
            tab_text += tab.rows[j].innerHTML + "</tr>";
        }

        tab_text += "</table>";


        let bom = "\uFEFF";
        var a = document.createElement('a');
        a.setAttribute('href', 'data:application/vnd.ms-excel; charset=utf-8,' + bom + encodeURIComponent(bom + tab_text));
        a.setAttribute('download', 'Todos os Rastreios de Anuncios Avantpro para ML.xls');
        window.document.body.appendChild(a);
        a.click();

    });

    $(`#excelConcorrentesTodos`).click(function (data) {
        var id = 'TabelaOcultaConcorrentes';

        var tab_text = "<table><tr>";
        var textRange = '';
        var j = 0;
        var tab = document.getElementById(id); // id of table

        for (j = 0; j < tab.rows.length; j++) {
            tab_text += tab.rows[j].innerHTML + "</tr>";
        }

        tab_text += "</table>";


        let bom = "\uFEFF";
        var a = document.createElement('a');
        a.setAttribute('href', 'data:application/vnd.ms-excel; charset=utf-8,' + bom + encodeURIComponent(bom + tab_text));
        a.setAttribute('download', 'Todos os Rastreios de Concorrentes Avantpro para ML.xls');
        window.document.body.appendChild(a);
        a.click();

    });

});

