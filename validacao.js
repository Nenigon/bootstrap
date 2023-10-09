/** 
 * ***********************************Copyright © 2021 Avantpro - Direitos Autorais******************************************
 *  Esse código possui Registro de Propriedade Intelectual pelo INPI conforme Processo Nº: BR512022000916-1
 *  Registro disponível para acesso em: http://ramsolution.com.br/registro-de-propriedade-intelectual.pdf
 *  Qualquer reprodução (total ou parcial) do código presente na extensão Avantpro, sem a prévia autorização, 
 *  é proibida e será penalizada conforme o código penal.
 * **************************************************************************************************************************
 */


var iframe = document.createElement('iframe');
iframe.src = chrome.runtime.getURL('frameValidacao.html');
iframe.style.position = "fixed";
iframe.style.top = "0";
iframe.style.right = "0";
iframe.style.display = "block";
iframe.style.width = "640px";
iframe.style.height = "450px";
iframe.style.zIndex = "1000";
iframe.id = "customFrameValidacao";
document.body.appendChild(iframe);


window.addEventListener('click', function(e){
    try {
        if(!document.getElementById('customFrameValidacao').contains(e.target)){
            document.getElementById('customFrameValidacao').remove();
        }
    } catch (error) {
        
    }
});

function receiveMessage(event) {
    if (event.data.event_id == "emailmlpro") { 
        // setItem('emailmlpro', event.data.data.email);    
        window.location.reload();
        window.location.reload();
        window.location.reload();
    }

    if (event.data.event_id == "removerValidacao") { 
        try {
            document.getElementById('customFrameValidacao').remove();
        } catch (error) {
            
        }
    }
} 

window.addEventListener("message", receiveMessage, false);
