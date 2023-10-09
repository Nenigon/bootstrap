/** 
 * ***********************************Copyright © 2021 Avantpro - Direitos Autorais******************************************
 *  Esse código possui Registro de Propriedade Intelectual pelo INPI conforme Processo Nº: BR512022000916-1
 *  Registro disponível para acesso em: http://ramsolution.com.br/registro-de-propriedade-intelectual.pdf
 *  Qualquer reprodução (total ou parcial) do código presente na extensão Avantpro, sem a prévia autorização, 
 *  é proibida e será penalizada conforme o código penal.
 * **************************************************************************************************************************
 */

document.addEventListener('Tendencias', function () {
    var mlb;
    var dadosProduto = [];
    var dadosTendencias = [];

    var url_atual = document.URL;

    if (url_atual.includes('produto.mercadolivre.com')) {
        var url_atual = document.URL;
        var res = url_atual.split("/");
        var res2 = res[3].split("-");
        mlb = res2[0] + res2[1];
    }

    if (url_atual.includes('mercadolivre.com') & url_atual.includes('/p/MLB')) {
        var href = document.getElementsByClassName('ui-pdp-syi__link')[0].getAttribute("href");

        mlb = href.substring(63, href.indexOf('&'));
    }

    getDetalhesProdutoTendencia();


    function getDetalhesProdutoTendencia() {
        $.ajax({
            type: "GET",
            url: "https://api.mercadolibre.com/items/" + mlb,
            cache: false,
            success: function (data) {
                dadosProduto = data;
                getDetalhesTendencias(dadosProduto.category_id)
            }
        });
    }

    function getDetalhesTendencias(idCategoria) {
        $.ajax({
            type: "GET",
            url: "https://ramcloud.com.br:9001/mlpro/trends?id=" + idCategoria,
            cache: false,
            success: function (data) {
                dadosTendencias = data;
                renderizaDadosTendencias(dadosTendencias);
            },
            error: function (xhr) {
                switch (xhr.status) {
                    case 400:
                        break;
                    case 404:
                        renderizaDadosTendencias(0);
                        break;
                }
            },
        });
    }

    function renderizaDadosTendencias(dadosTendencias) {
        var iframe = document.createElement('iframe');

        iframe.srcdoc = `
        <!DOCTYPE html>
        <html style="min-width: 500px;">
    
        <head>
        <title>Avantpro</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <!-- jQuery -->
        <script src="https://code.jquery.com/jquery-3.1.1.min.js"
            integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
        <!-- CSS only -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6" crossorigin="anonymous">
        <!-- Latest compiled and minified JavaScript -->
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-JEW9xMcG8R+pH31jmWH6WWP0WintQrMb4s7ZOdauHnUtxwoG2vI5DkLtS3qm9Ekf"
            crossorigin="anonymous"></script>


        <style>
            html,
            body {
                margin: 0;
                border: 0;
                padding: 0;
                display: block;
                width: 500px;
                overflow-x: hidden;
                background-color: #ededed;
            }
    
            .inputcard {
                width: 20px !important;
            }
    
            .default-table-height {
                height: 23px;
            }

            .default-table-height-botao {
                height: 22px;
                margin-bottom: 15px;
                margin-top: 15px;
                width: 100%;
            }
    
            .defaultsmall-table-height {
                height: 15px;
            }
    
            .low-line {
                height: 1.8rem;
            }
    
            .text-small {
                font-size: 14px;
            }
    
            .ml-green {
                background-color: #39b54a !important
            }
    
            .ml-lowgreen {
                background-color: #cfee6f !important
            }
    
            .ml-yellow {
                background-color: #fdf880 !important
            }
    
            .ml-organge {
                background-color: #f5c827 !important
            }
    
            .ml-highorgange {
                background-color: #ef9b76 !important
            }
    
            .ml-green-font {
                color: #709979
            }
    
            .ml-blue-font {
                color: #1E90FF;
            }
    
            .pgbar {
                height: 10px;
                width: 80%;
                margin-bottom: 10px;
            }
    
            .unselected {
                opacity: 0.5;
            }
    
            .card-title {
                font-size: 16px;
            }
    
            .card-content {
                font-size: 14px;
            }
    
            .form-control {
                height: 35px;
            }

            #tendencia {
                margin-botton: -10px;
            }
    
            .obs {
                font-size: 12px;
                color: #84a2bc;
                margin-left: -45px;
            }
    
            .footer-ext {
                position: fixed;
                bottom: 0px;
                width: 100%;
                background-color: #ededed;
            }
    
            .header-ext {
                top: 0px;
                width: 100%;
                padding-bottom: 5px;
                background-color: #ededed;
            }
    
            .card-content-vermelho {
                font-size: 17px;
                color: red;
            }
    
    
            .card-content-verde {
                font-size: 17px;
                color: #32CD32;
            }
    
            #custofinal {
                color: red;
                font-weight: bold;
            }
    
            #lucro {
                color: #32CD32;
                font-weight: bold;
            }

            .fechar{
                background: #0dc143;
                color: #fff;
                border: 0;
                border-radius: 4px;
                font-weight: bold; 
                font-size: 11.5px;
                width: 100%;
                height: 30px;
                text-transform: uppercase;
                cursor:pointer;
            }

            .containerTendencias {
                margin-left: -5px;
            }
        </style>
     </head>
    
     <body>
        <div class="p-1 mb-2 text-white" style="background: linear-gradient(90deg, rgba(95,183,245,1) 14%, rgba(7,135,218,1) 42%, rgba(255,209,112,1) 66%, rgba(244,179,44,1) 97%);">
            <svg width="25" height="25" viewBox="0 0 503 529" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M180.575 64.866C201.361 14.5657 271.467 -49.4621 324.916 64.866C381.649 186.219 459.31 360.028 488.922 433.756C509.304 484.501 511.748 528.948 454.537 528.948C432.087 528.948 416.149 519.997 397.254 509.12C396.915 508.925 396.576 508.73 396.235 508.534C367.148 491.784 330.737 470.816 253.054 470.816C178.262 470.816 143.113 490.252 113.463 506.647C91.8362 518.607 73.135 528.948 44.1088 528.948C-4.81039 528.948 -8.95649 479.003 12.2642 433.756L45.9517 359.922L46.0485 359.71L180.575 64.866ZM236.782 173.436C244.125 158.597 257.196 154.494 266.12 173.436C275.628 193.618 293.166 232.834 299.125 247.672C302.589 256.624 299.125 273.884 282.816 268.092C275.35 265.441 272.03 260.377 268.917 255.629C265.156 249.893 261.698 244.619 251.601 244.619C240.729 244.619 236.121 250.77 231.602 256.802C227.742 261.955 223.946 267.021 216.365 268.092C202.824 270.006 199.696 255.989 203.202 247.672L236.782 173.436Z" fill="url(#paint0_linear_35_21)"/>
            <path d="M396.235 508.533C367.148 491.783 330.737 470.816 253.054 470.816C178.262 470.816 143.113 490.252 113.463 506.647L113.463 506.647C91.8362 518.606 73.135 528.948 44.1088 528.948C-4.81039 528.948 -8.95649 479.003 12.2642 433.756L45.9973 359.822C135.44 313.658 297.194 451.5 396.235 508.533Z" fill="url(#paint1_linear_35_21)"/>
            <defs>
            <linearGradient id="paint0_linear_35_21" x1="251.109" y1="-132.003" x2="251.109" y2="737.323" gradientUnits="userSpaceOnUse">
            <stop offset="0.380208" stop-color="#F2A008"/>
            <stop offset="0.792994" stop-color="#F9D043"/>
            </linearGradient>
            <linearGradient id="paint1_linear_35_21" x1="302.803" y1="439.737" x2="10.1936" y2="454.391" gradientUnits="userSpaceOnUse">
            <stop stop-color="#1B22B8"/>
            <stop offset="1" stop-color="#4D43FA"/>
            </linearGradient>
            </defs>
            </svg>
            <span style="font-weight: 600;color: white;">&nbsp; Avantpro</span>
        </div>
        <div class="container" style="background-color: #eeeeee;">
            <div class="container header">
                <div class="row justify-content-md-center">
                    <div class="col-8">
                    </div>
                </div>
            </div>
            
            <div class="container" style="background-color: #ededed;">
                <div class="row">
                    <div class="card" style="width: 465px;">
                        <div class="card-body" style="width: 465px">
                            <h5 class="card-title ml-blue-font">Tendências - Top 20 Mais Buscados da Categoria</h5>
                            <div class="containerTendencias">
                               `
        if (dadosTendencias == null || dadosTendencias == 0 || dadosTendencias.length == undefined) {
            iframe.srcdoc = iframe.srcdoc + `
                                <div class="row default-table-height" style="height: 100px !important">
                                    <center>
                                    <div class="col col-sm-6">
                                        <p>Nenhuma tendência encontrada para essa categoria. Por favor tente acessar outro produto.</p>
                                    </div>
                                    </center>
                                </div>`
        } else {
            for (let index = 0; index < dadosTendencias.length; index++) {
                if (index < 20) {
                    iframe.srcdoc = iframe.srcdoc + `
                                <div class="row default-table-height">
                                    <div class="col col-sm-6">
                                        <p style={{marginBottom: '-10px'}}>${index + 1}. ${dadosTendencias[index].keyword.replace(/'/g, ' ').replace(/"/g, ' ')}</p>
                                    </div>
                                </div>`
                }
            }
        }
        iframe.srcdoc = iframe.srcdoc + `
                                <div class="row default-table-height-botao">
                                    <div class="col col-sm-6">
                                        <input class="fechar" type="button" value="Fechar" onclick="sendMessage()">
                                    </div>
                                </div>

                                <div class="row default-table-height-botao">
                                    <div class="col col-sm-12">
                                        <center><p style="margin-top: 5px; margin-bottom: 5px; font-size: 12px">powered by: <strong>Avantpro</strong></p></center>
                                    </div>
                                 </div>

                            <script>

                            function sendMessage(){
                                parent.window.postMessage("removetheiframe", "*");
                            }

                            </script>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
     </body>
    
     </html>`;
        iframe.style.position = "fixed";
        iframe.style.top = "0";
        iframe.style.right = "0";
        iframe.style.display = "block";
        iframe.style.width = "500px";
        iframe.style.height = "100%";
        iframe.style.zIndex = "1000";
        iframe.id = "customFrame";
        document.body.appendChild(iframe);


    }

});

var PalavraChave;

function receiveMessage(event) {
    if (event.data == "removetheiframe") {
        var element = document.getElementById('customFrame');
        element.parentNode.removeChild(element);
    }
    if (event.data == "BaixarPalavrasChaves") {
        var element = document.getElementById('customFrame');
        element.parentNode.removeChild(element);

        var tendencia = '';
        for (let index = 0; index < PalavraChave.length; index++) {
            tendencia = tendencia + `${index + 1}. ${PalavraChave[index].key} \n`
        }

        var blob = new Blob([tendencia],{ type: "text/plain;charset=utf-8" });
  

        const link= window.document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = "PalavrasChaves.txt";
        link.click();
        window.URL.revokeObjectURL(link.href);  

    }

    if (event.data == "Reload") {
        window.location.reload();
        window.location.reload();
        window.location.reload();
    }
}

window.addEventListener("message", receiveMessage, false);


function forceDownload(url, fileName) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = function () {
        var urlCreator = window.URL || window.webkitURL;
        var imageUrl = urlCreator.createObjectURL(this.response);
        var tag = document.createElement('a');
        tag.href = imageUrl;
        tag.download = fileName;
        document.body.appendChild(tag);
        tag.click();
        document.body.removeChild(tag);
    }
    xhr.send();
}

function saveFile(name, type, data) {
    if (data !== null && navigator.msSaveBlob)
        return navigator.msSaveBlob(new Blob([data], { type: type }), name);
    var a = $("<a style='display: none;'/>");
    var url = window.URL.createObjectURL(new Blob([data], { type: type }));
    a.attr("href", url);
    a.attr("download", name);
    $("body").append(a);
    a[0].click();
    window.URL.revokeObjectURL(url);
    a.remove();
}



document.addEventListener('PalavrasChaves', function (e) {
    let concatTitulos = e.detail.teste.trim();
    let arrayConcatTitulos = concatTitulos.split(" ");
    arrayConcatTitulos = arrayConcatTitulos.filter(x => x.trim());

    var count = {};
    arrayConcatTitulos.forEach(function (i) { count[i] = (count[i] || 0) + 1; });

    var SortArr2 = function (j) {
        var arr = [];
        for (var key in j) {
            arr.push({ key: key, val: j[key] });
        }
        arr.sort(function (a, b) {
            var intA = parseInt(a.val),
                intB = parseInt(b.val);
            if (intA > intB)
                return -1;
            if (intA < intB)
                return 1;
            return 0;
        });
        return arr;
    };

    var arrJson = SortArr2(count);

    PalavraChave = arrJson;

    renderizaDadosPalavrasChaves(arrJson);
    //end


    function renderizaDadosPalavrasChaves(dadosTendencias) {
        var iframe = document.createElement('iframe');

        iframe.srcdoc = `
    <!DOCTYPE html>
    <html style="min-width: 500px;">

    <head>
    <title>Avantpro</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.1.1.min.js"
        integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
    <!-- CSS only -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6" crossorigin="anonymous">
    <!-- Latest compiled and minified JavaScript -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-JEW9xMcG8R+pH31jmWH6WWP0WintQrMb4s7ZOdauHnUtxwoG2vI5DkLtS3qm9Ekf"
        crossorigin="anonymous"></script>


    <style>
        html,
        body {
            margin: 0;
            border: 0;
            padding: 0;
            display: block;
            width: 500px;
            overflow-x: hidden;
            background-color: #ededed;
        }

        .inputcard {
            width: 20px !important;
        }

        .default-table-height {
            height: 23px;
        }

        .default-table-height-botao {
            height: 22px;
            margin-bottom: 15px;
            margin-top: 15px;
            width: 100%;
        }

        .defaultsmall-table-height {
            height: 15px;
        }

        .low-line {
            height: 1.8rem;
        }

        .text-small {
            font-size: 14px;
        }

        .ml-green {
            background-color: #39b54a !important
        }

        .ml-lowgreen {
            background-color: #cfee6f !important
        }

        .ml-yellow {
            background-color: #fdf880 !important
        }

        .ml-organge {
            background-color: #f5c827 !important
        }

        .ml-highorgange {
            background-color: #ef9b76 !important
        }

        .ml-green-font {
            color: #709979
        }

        .ml-blue-font {
            color: #1E90FF;
        }

        .pgbar {
            height: 10px;
            width: 80%;
            margin-bottom: 10px;
        }

        .unselected {
            opacity: 0.5;
        }

        .card-title {
            font-size: 16px;
        }

        .card-content {
            font-size: 14px;
        }

        .form-control {
            height: 35px;
        }

        #tendencia {
            margin-botton: -10px;
        }

        .obs {
            font-size: 12px;
            color: #84a2bc;
            margin-left: -45px;
        }

        .footer-ext {
            position: fixed;
            bottom: 0px;
            width: 100%;
            background-color: #ededed;
        }

        .header-ext {
            top: 0px;
            width: 100%;
            padding-bottom: 5px;
            background-color: #ededed;
        }

        .card-content-vermelho {
            font-size: 17px;
            color: red;
        }


        .card-content-verde {
            font-size: 17px;
            color: #32CD32;
        }

        #custofinal {
            color: red;
            font-weight: bold;
        }

        #lucro {
            color: #32CD32;
            font-weight: bold;
        }

        .fechar{
            background: #0dc143;
            color: #fff;
            border: 0;
            border-radius: 4px;
            font-weight: bold; 
            font-size: 11.5px;
            width: 100%;
            height: 30px;
            text-transform: uppercase;
            cursor:pointer;
        }

        .containerTendencias {
            margin-left: -5px;
        }
    </style>
 </head>

 <body>
    <div class="p-1 mb-2 text-white" style="background: linear-gradient(90deg, rgba(95,183,245,1) 14%, rgba(7,135,218,1) 42%, rgba(255,209,112,1) 66%, rgba(244,179,44,1) 97%);">
        <svg width="25" height="25" viewBox="0 0 503 529" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M180.575 64.866C201.361 14.5657 271.467 -49.4621 324.916 64.866C381.649 186.219 459.31 360.028 488.922 433.756C509.304 484.501 511.748 528.948 454.537 528.948C432.087 528.948 416.149 519.997 397.254 509.12C396.915 508.925 396.576 508.73 396.235 508.534C367.148 491.784 330.737 470.816 253.054 470.816C178.262 470.816 143.113 490.252 113.463 506.647C91.8362 518.607 73.135 528.948 44.1088 528.948C-4.81039 528.948 -8.95649 479.003 12.2642 433.756L45.9517 359.922L46.0485 359.71L180.575 64.866ZM236.782 173.436C244.125 158.597 257.196 154.494 266.12 173.436C275.628 193.618 293.166 232.834 299.125 247.672C302.589 256.624 299.125 273.884 282.816 268.092C275.35 265.441 272.03 260.377 268.917 255.629C265.156 249.893 261.698 244.619 251.601 244.619C240.729 244.619 236.121 250.77 231.602 256.802C227.742 261.955 223.946 267.021 216.365 268.092C202.824 270.006 199.696 255.989 203.202 247.672L236.782 173.436Z" fill="url(#paint0_linear_35_21)"/>
        <path d="M396.235 508.533C367.148 491.783 330.737 470.816 253.054 470.816C178.262 470.816 143.113 490.252 113.463 506.647L113.463 506.647C91.8362 518.606 73.135 528.948 44.1088 528.948C-4.81039 528.948 -8.95649 479.003 12.2642 433.756L45.9973 359.822C135.44 313.658 297.194 451.5 396.235 508.533Z" fill="url(#paint1_linear_35_21)"/>
        <defs>
        <linearGradient id="paint0_linear_35_21" x1="251.109" y1="-132.003" x2="251.109" y2="737.323" gradientUnits="userSpaceOnUse">
        <stop offset="0.380208" stop-color="#F2A008"/>
        <stop offset="0.792994" stop-color="#F9D043"/>
        </linearGradient>
        <linearGradient id="paint1_linear_35_21" x1="302.803" y1="439.737" x2="10.1936" y2="454.391" gradientUnits="userSpaceOnUse">
        <stop stop-color="#1B22B8"/>
        <stop offset="1" stop-color="#4D43FA"/>
        </linearGradient>
        </defs>
        </svg>
        <span style="font-weight: 600;color: white;">&nbsp; Avantpro</span>
    </div>
    <div class="container" style="background-color: #eeeeee;">
        <div class="container header">
            <div class="row justify-content-md-center">
                <div class="col-8">
                </div>
            </div>
        </div>
        
        <div class="container" style="background-color: #ededed;">
            <div class="row">
                <div class="card" style="width: 465px;">
                    <div class="card-body" style="width: 465px">
                        <h5 class="card-title ml-blue-font">Top 20 Palavras Chaves Mais Usadas Nos Anúncios</h5>
                        <div class="containerTendencias">

                           `
        if (dadosTendencias == null) {
            iframe.srcdoc = iframe.srcdoc + `
                            <div class="row default-table-height">
                                <div class="col col-sm-6">
                                    <p style={{marginBottom: '-10px'}}>Nenhuma tendência encontrada para essa categoria.</p>
                                </div>
                            </div>`
        } else {
            for (let index = 0; index < dadosTendencias.length; index++) {
                if (index < 20) {
                    iframe.srcdoc = iframe.srcdoc + `
                            <div class="row default-table-height">
                                <div class="col col-sm-6">
                                    <p style={{marginBottom: '-10px'}}>${index + 1}. ${dadosTendencias[index].key} <small style="font-size:11px; color: gray">(Usada ${dadosTendencias[index].val} vezes)</small></p>
                                </div>
                            </div>`
                }
            }
        }
        iframe.srcdoc = iframe.srcdoc + `
                        <div class="row default-table-height-botao">
                            <div class="col col-sm-6">
                                <input class="fechar" type="button" value="Baixar Arquivo Com Todas As ${dadosTendencias.length} Palavras Chaves" onclick="sendMessageBaixar()">
                            </div>
                            <div class="col col-sm-6">
                                <input class="fechar" type="button" value="Fechar" onclick="sendMessage()">
                            </div>
                            <div class="col col-sm-12">
                                <center><p style="margin-top: 5px; margin-bottom: 5px; font-size: 12px">powered by: <strong>Avantpro</strong></p></center>
                            </div>
                        </div>

                        <script>

                        function sendMessage(){
                            parent.window.postMessage("removetheiframe", "*");
                        }

                        function sendMessageBaixar(){
                            parent.window.postMessage("BaixarPalavrasChaves", "*");
                        }

                        </script>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
 </body>

 </html>`;
        iframe.style.position = "fixed";
        iframe.style.top = "0";
        iframe.style.right = "0";
        iframe.style.display = "block";
        iframe.style.width = "500px";
        iframe.style.height = "100%";
        iframe.style.zIndex = "1000";
        iframe.id = "customFrame";
        document.body.appendChild(iframe);


    }
});


document.addEventListener('AnunciosMaisVendidos', function (e) {

    let dadosMaisVendidos = e.detail.teste.replace(/'/g, '\"');

    dadosMaisVendidos = JSON.parse(dadosMaisVendidos);

    renderizaDadosPalavrasChaves(dadosMaisVendidos.RESULT);


    function renderizaDadosPalavrasChaves(dadosMaisVendidos) {

        var iframe = document.createElement('iframe');

        iframe.srcdoc = `
    <!DOCTYPE html>
    <html style="min-width: 500px;">

    <head>
    <title>Avantpro</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.1.1.min.js"
        integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
    <!-- CSS only -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6" crossorigin="anonymous">
    <!-- Latest compiled and minified JavaScript -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-JEW9xMcG8R+pH31jmWH6WWP0WintQrMb4s7ZOdauHnUtxwoG2vI5DkLtS3qm9Ekf"
        crossorigin="anonymous"></script>


    <style>
        html,
        body {
            margin: 0;
            border: 0;
            padding: 0;
            display: block;
            width: 500px;
            overflow-x: hidden;
            background-color: #ededed;
        }

        .inputcard {
            width: 20px !important;
        }

        .default-table-height {
            height: 23px;
        }

        .default-table-height-botao {
            height: 22px;
            margin-bottom: 15px;
            margin-top: 15px;
            width: 100%;
        }

        .defaultsmall-table-height {
            height: 15px;
        }

        .low-line {
            height: 1.8rem;
        }

        .text-small {
            font-size: 14px;
        }

        .ml-green {
            background-color: #39b54a !important
        }

        .ml-lowgreen {
            background-color: #cfee6f !important
        }

        .ml-yellow {
            background-color: #fdf880 !important
        }

        .ml-organge {
            background-color: #f5c827 !important
        }

        .ml-highorgange {
            background-color: #ef9b76 !important
        }

        .ml-green-font {
            color: #709979
        }

        .ml-blue-font {
            color: #1E90FF;
        }

        .pgbar {
            height: 10px;
            width: 80%;
            margin-bottom: 10px;
        }

        .unselected {
            opacity: 0.5;
        }

        .card-title {
            font-size: 16px;
        }

        .card-content {
            font-size: 14px;
        }

        .form-control {
            height: 35px;
        }

        #tendencia {
            margin-botton: -10px;
        }

        .obs {
            font-size: 12px;
            color: #84a2bc;
            margin-left: -45px;
        }

        .footer-ext {
            position: fixed;
            bottom: 0px;
            width: 100%;
            background-color: #ededed;
        }

        .header-ext {
            top: 0px;
            width: 100%;
            padding-bottom: 5px;
            background-color: #ededed;
        }

        .card-content-vermelho {
            font-size: 17px;
            color: red;
        }


        .card-content-verde {
            font-size: 17px;
            color: #32CD32;
        }

        #custofinal {
            color: red;
            font-weight: bold;
        }

        #lucro {
            color: #32CD32;
            font-weight: bold;
        }

        .fechar{
            background: #0dc143;
            color: #fff;
            border: 0;
            border-radius: 4px;
            font-weight: bold; 
            font-size: 11.5px;
            width: 100%;
            height: 30px;
            text-transform: uppercase;
            cursor:pointer;
        }

        .containerTendencias {
            margin-left: -5px;
        }
    </style>
 </head>

 <body>
    <div class="p-1 mb-2 text-white" style="background: linear-gradient(90deg, rgba(95,183,245,1) 14%, rgba(7,135,218,1) 42%, rgba(255,209,112,1) 66%, rgba(244,179,44,1) 97%);">
        <svg width="25" height="25" viewBox="0 0 503 529" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M180.575 64.866C201.361 14.5657 271.467 -49.4621 324.916 64.866C381.649 186.219 459.31 360.028 488.922 433.756C509.304 484.501 511.748 528.948 454.537 528.948C432.087 528.948 416.149 519.997 397.254 509.12C396.915 508.925 396.576 508.73 396.235 508.534C367.148 491.784 330.737 470.816 253.054 470.816C178.262 470.816 143.113 490.252 113.463 506.647C91.8362 518.607 73.135 528.948 44.1088 528.948C-4.81039 528.948 -8.95649 479.003 12.2642 433.756L45.9517 359.922L46.0485 359.71L180.575 64.866ZM236.782 173.436C244.125 158.597 257.196 154.494 266.12 173.436C275.628 193.618 293.166 232.834 299.125 247.672C302.589 256.624 299.125 273.884 282.816 268.092C275.35 265.441 272.03 260.377 268.917 255.629C265.156 249.893 261.698 244.619 251.601 244.619C240.729 244.619 236.121 250.77 231.602 256.802C227.742 261.955 223.946 267.021 216.365 268.092C202.824 270.006 199.696 255.989 203.202 247.672L236.782 173.436Z" fill="url(#paint0_linear_35_21)"/>
        <path d="M396.235 508.533C367.148 491.783 330.737 470.816 253.054 470.816C178.262 470.816 143.113 490.252 113.463 506.647L113.463 506.647C91.8362 518.606 73.135 528.948 44.1088 528.948C-4.81039 528.948 -8.95649 479.003 12.2642 433.756L45.9973 359.822C135.44 313.658 297.194 451.5 396.235 508.533Z" fill="url(#paint1_linear_35_21)"/>
        <defs>
        <linearGradient id="paint0_linear_35_21" x1="251.109" y1="-132.003" x2="251.109" y2="737.323" gradientUnits="userSpaceOnUse">
        <stop offset="0.380208" stop-color="#F2A008"/>
        <stop offset="0.792994" stop-color="#F9D043"/>
        </linearGradient>
        <linearGradient id="paint1_linear_35_21" x1="302.803" y1="439.737" x2="10.1936" y2="454.391" gradientUnits="userSpaceOnUse">
        <stop stop-color="#1B22B8"/>
        <stop offset="1" stop-color="#4D43FA"/>
        </linearGradient>
        </defs>
        </svg>
        <span style="font-weight: 600;color: white;">&nbsp; Avantpro</span>
    </div>
    </div>
    <div class="container" style="background-color: #eeeeee;">
        <div class="container header">
            <div class="row justify-content-md-center">
                <div class="col-8">
                </div>
            </div>
        </div>
        
        <div class="container" style="background-color: #ededed;">
            <div class="row">
                <div class="card" style="width: 465px;">
                    <div class="card-body" style="width: 465px">
                        <h5 class="card-title ml-blue-font">Top 20 Anúncios Mais Vendidos Dessa Categoria</h5>
                        <div class="containerTendencias">

                           `
        if (dadosMaisVendidos == null) {
            iframe.srcdoc = iframe.srcdoc + `
                            <div class="row default-table-height">
                                <div class="col col-sm-6">
                                    <p style={{marginBottom: '-10px'}}>Nenhum anúncio encontrado para essa categoria.</p>
                                </div>
                            </div>`
        } else {
            for (let index = 0; index < dadosMaisVendidos.length; index++) {
                if (index < 20) {
                    iframe.srcdoc = iframe.srcdoc + `
                            <div class="row default-table-height"> 
                                <div class="col col-sm-6">
                                    <p style="font-size: 12px" >${index + 1}. <a href="${dadosMaisVendidos[index].permalink}" target="_blank"> ${dadosMaisVendidos[index].title.substring(0, 61)}</a></p>
                                </div>
                            </div>`
                }
            }
        }
        iframe.srcdoc = iframe.srcdoc + `
                        <div class="row default-table-height-botao">
                            <div class="col-lg-12 col-md-12 col-sm-12">
                                <input class="fechar" type="button" value="Fechar" onclick="sendMessage()">
                            </div>
                            <div class="col-lg-12 col-sm-12">
                                <center><p style="margin-top: 5px; margin-bottom: 5px; font-size: 12px">powered by: <strong>Avantpro</strong></p></center>
                            </div>
                        </div>

                        <script>

                        function sendMessage(){
                            parent.window.postMessage("removetheiframe", "*");
                        }

                        </script>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
 </body>

 </html>`;
        iframe.style.position = "fixed";
        iframe.style.top = "0";
        iframe.style.right = "0";
        iframe.style.display = "block";
        iframe.style.width = "500px";
        iframe.style.height = "100%";
        iframe.style.zIndex = "1000";
        iframe.id = "customFrame";
        document.body.appendChild(iframe);


    }
});