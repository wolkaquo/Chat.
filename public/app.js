/*
===============================================
APLICACIÓN DE CHAT - CLIENTE  Archivo(app.js)
===============================================
Funcionalidades principales:
Conexión en tiempo real con el servidor
Envío de mensajes instantáneos  
Indicador de escritura en vivo
Historial persistente de mensajes
Scroll automático a nuevos mensajes

Tecnologías: Socket.IO, JavaScript ES6, DOM
*/
        
        
        const socket = io()/*<= Establece una conexión con el servidor utilizando Socket.IO.*/
        const messages = document.getElementById('messages')/*<= Obtiene el elemento donde se mostrarán los mensajes del chat.*/
        const inputMessage = document.getElementById('m')/*<= Obtiene el campo de entrada para el mensaje que el usuario desea enviar.*/
        const inputUsername = document.getElementById('username')/*<= Obtiene el campo de entrada para el nombre de usuario del remitente.*/
        const typingIndicator = document.getElementById('typing')/*<= Obtiene el elemento que mostrará el indicador de escritura (cuando un usuario está escribiendo).*/
        /*===============================================*/
        document.getElementById('send').onclick = function() {
            const msg = inputMessage.value/*<= Captura el mensaje del campo de entrada.*/
            const username = inputUsername.value/*<= Captura el nombre de usuario del campo de entrada.*/
            socket.emit('chat message', msg, username)/*<= Envía el mensaje y el nombre de usuario al servidor a través del socket.*/
            inputMessage.value = ''/*<= Limpia el campo de entrada del mensaje después de enviarlo.*/
        }
        /*===============================================*/
        inputMessage.onkeypress = function() {
            const username = inputUsername.value/*<= Captura el nombre de usuario del campo de entrada.*/
            socket.emit('typing', username)/*<= Envía un evento 'typing' al servidor, indicando que el usuario está escribiendo.*/

            /*Limpia el indicador de escritura después de 3 segundos.*/
            setTimeout(() => {
                typingIndicator.innerHTML = ''
            }, 3000)
        };
        /*===============================================*/
        socket.on('chat message', function(data) {
            const item = document.createElement('li')/*<= Crea un nuevo elemento de lista (li) para mostrar el mensaje del chat.*/
            item.textContent = `${data.username}: ${data.msg}`/*<= Establece el contenido del elemento con el nombre de usuario y el mensaje recibido.*/
            messages.appendChild(item)/*<= Agrega el nuevo elemento de mensaje a la lista de mensajes en la interfaz de usuario.*/
            window.scrollTo(0, document.body.scrollHeight)/*<= Desplaza la ventana hacia abajo para mostrar el último mensaje en la parte inferior.*/ 
        });
        /*===============================================*/
        let typingTimeout

            socket.on('typing', function(username) {
            typingIndicator.innerHTML = `${username} está escribiendo...`/*Este código escucha el evento 'typing' del socket y muestra un indicador de que un usuario está escribiendo.
            Al recibir el nombre de usuario, actualiza el contenido del elemento 'typingIndicator'.
            Se puede agregar lógica adicional para ocultar el indicador después de un tiempo de inactividad.*/
            clearTimeout(typingTimeout)/*<= Limpia el temporizador anterior si existe*/

            /*Establece un nuevo temporizador para limpiar el indicador después de 3 segundos*/
            typingTimeout = setTimeout(() => {
            typingIndicator.innerHTML = ''
            }, 1000) /*<= Un segundo*/
        });
        /*===============================================*/
        socket.on('load messages', function(messages) {/*<= Escucha el evento 'load messages' enviado por el servidor.*/
             messages.forEach(function(message) {/*<= Itera sobre cada mensaje recibido del servidor.*/
             const item = document.createElement('li')/*<= Crea un nuevo elemento de lista (li) para cada mensaje.*/
             item.textContent = `${message.username}: ${message.msg}`/*<= Establece el contenido del elemento como el nombre de usuario y el mensaje.*/
             document.getElementById('messages').appendChild(item)/*<= Agrega el nuevo elemento de lista al elemento de mensajes en el DOM.*/
        })
             window.scrollTo(0, document.body.scrollHeight)/*<=  Desplaza la ventana hacia abajo para mostrar el último mensaje.*/
        })
        /*===============================================*/