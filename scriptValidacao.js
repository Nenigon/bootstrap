/** 
 * ***********************************Copyright © 2021 Avantpro - Direitos Autorais******************************************
 *  Esse código possui Registro de Propriedade Intelectual pelo INPI conforme Processo Nº: BR512022000916-1
 *  Registro disponível para acesso em: http://ramsolution.com.br/registro-de-propriedade-intelectual.pdf
 *  Qualquer reprodução (total ou parcial) do código presente na extensão Avantpro, sem a prévia autorização, 
 *  é proibida e será penalizada conforme o código penal.
 * **************************************************************************************************************************
 */

document.addEventListener('DOMContentLoaded', function () {

    $("#remover").click(function (e) {
        e.preventDefault();
        parent.window.postMessage({
            event_id: 'removerValidacao',
        }, "*");
    })

    $("#sendEmail").click(function (e) {
        e.preventDefault();
        let dadosEmail = '';

        let email = $("#userEmail").val();

        /*  let senha = $("#userSenha").val();

       if (email == '' || senha == '') {
            $("#message").show();
            return;
        } */

        // url: `https://portalramempresa-backend.herokuapp.com/verificaemail?EMAIL=${email}`,

        $.ajax({
            type: "POST",
            url: `https://ramcloud.com.br:9001/verificaemail?EMAIL=${email}`,
            cache: false,
            success: function (data) {
                dadosEmail = data;
                if (dadosEmail.retorno) {
                    $("#message").hide();
                    $("#validatedMessage").show();
                    setTimeout(function () {
                        localStorage.setItem('emailmlpro', email.toLowerCase());
                        localStorage.setItem('tokenmlpro', dadosEmail.token.toLowerCase());
                        parent.window.postMessage({
                            event_id: 'emailmlpro',
                            data: {
                                email: email,
                            }
                        }, "*");

                    }, 2000);
                } else {
                    $("#message").show();
                }
            },
            error: function (xhr) {
                $("#message").show();
                switch (xhr.status) {
                    case 400:
                        console.log("Erro: " + xhr.status + " - verificaemail não encontrado.");
                        // renderizaDados(dadosProduto, dadosVendedor, dadosTaxa, dadosFrete);
                        break;
                    case 404:
                        console.log("Erro: " + xhr.status + " - verificaemail não encontrado");
                        //renderizaDados(dadosProduto, dadosVendedor, dadosTaxa, dadosFrete);
                        break;
                }
            }
        });
    });




});


document.addEventListener('Validar', function (e) {
    console.log('VALIDAR');
    var iframe = document.createElement('iframe');
    iframe.src = chrome.runtime.getURL('frameValidacao.html');
    iframe.style.position = "fixed";
    iframe.style.top = "0";
    iframe.style.right = "0";
    iframe.style.display = "block";
    iframe.style.width = "640px";
    iframe.style.height = "500px";
    iframe.style.zIndex = "1000";
    iframe.id = "customFrameValidacao";
    document.body.appendChild(iframe);
});




function receiveMessage(event) {
    if (event.data.event_id == "emailmlpro") {
        localStorage.setItem('emailmlpro', event.data.data.email);
        try {
            document.getElementById('customFrameValidacao').remove();
        } catch (error) {
            
        }
        window.location.reload();
        window.location.reload();
        window.location.reload();
    }

    if (event.data.event_id == "removerValidacao") { 
        try {
            document.getElementById('customFrameValidacao').remove();
            window.location.reload();
        } catch (error) {
            
        }
    }
}

window.addEventListener("message", receiveMessage, false);