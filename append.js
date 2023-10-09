
/** 
 * ***********************************Copyright © 2021 Avantpro - Direitos Autorais******************************************
 *  Esse código possui Registro de Propriedade Intelectual pelo INPI conforme Processo Nº: BR512022000916-1
 *  Registro disponível para acesso em: http://ramsolution.com.br/registro-de-propriedade-intelectual.pdf
 *  Qualquer reprodução (total ou parcial) do código presente na extensão Avantpro, sem a prévia autorização, 
 *  é proibida e será penalizada conforme o código penal.
 * **************************************************************************************************************************
 */


chrome.runtime.sendMessage({ method: "getEmail" }, function (response) {
    let emailRetornado = response.email;
    let tokenRetornado = response.token;

    MeliAPI.getValidaAssinante(emailRetornado, tokenRetornado).then(response => {
        if (response.ASSINANTE) {
            var iframe = document.createElement('iframe');

            if (response.ULTRA) {
                iframe.src = chrome.runtime.getURL('frameUltra.html');
            } else {
                iframe.src = chrome.runtime.getURL('frame.html');
            }

            iframe.style.position = "fixed";
            iframe.style.top = "0";
            iframe.style.right = "0";
            iframe.style.display = "block";
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            iframe.style.zIndex = "1000";
            iframe.id = "customFrame";
            document.body.appendChild(iframe);

        } else {
            //GRATIS
            var iframe = document.createElement('iframe');
            iframe.src = chrome.runtime.getURL('frameGratis.html');
            iframe.style.position = "fixed";
            iframe.style.top = "0";
            iframe.style.right = "0";
            iframe.style.display = "block";
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            iframe.style.zIndex = "1000";
            iframe.id = "customFrame";
            document.body.appendChild(iframe);
        }

    })
})




window.addEventListener('click', function (e) {
    if (!document.getElementById('customFrame').contains(e.target)) {
        window.removeEventListener('click', Listener);
        document.getElementById('customFrame').remove(); 
    }
});