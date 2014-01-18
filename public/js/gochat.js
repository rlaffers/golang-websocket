$(document).ready(function() {
        var settings = {
            url: 'ws://192.168.200.112:8080'
        };

        $('#connect-btn').click(function() {
            var connection;
            GoChat.connect(settings.url);
            //GoChat.connection = connection;
        });

        $('#send-btn').click(function() {
            var msg = $('#message').val();
            if (msg.length < 1) {
                return false;
            }
            GoChat.sendMessage(msg);
            $("#message").val('');
        });

				$("#message").keypress(function (event) {
						if (event.which == 13) { // Enter key
								var message = $("#message").val();
								GoChat.sendMessage(message);
                $("#message").val('');
						}
				});
});


var GoChat = {
    username: null,
    ws: null,
    CONNECTED: 'Connected',
    DISCONNECTED: 'Disconnected',

    connect: function connect(url) {
        var username, ws, me = this;
        // close old connections
        if (me.ws) {
            me.ws.close();
            me.ws = null;
        }
        username = $('#username').val();
        if (username.length < 1) {
            alert('Name is mandatory!');
            return;
        }
        this.setStatus('Connecting');
        this.username = username;
        ws = new WebSocket(url);

        ws.onopen = function() {
            me.onOpen.apply(me, arguments);
        };
        ws.onclose = function() {
            me.onClose.apply(me, arguments);
        };
        ws.onerror = function() {
            me.onError.apply(me, arguments);
        };

        ws.onmessage = function (event) {
            me.onMessage.apply(me, arguments);
        };
        
        this.ws = ws;
    },

    onOpen: function onOpen(e) {
        console.info('connection is open');
        this.setStatus(this.CONNECTED);
        $("#send-btn").removeAttr('disabled');
        $('#console').text('');
    },

    onClose: function onClose(e) {
        console.info('connection is closed');
        $("#send-btn").attr('disabled', 'disabled');
    },

    onError: function onError(e) {
        console.info('connection error');
        this.setStatus(this.DISCONNECTED);
        $("#send-btn").attr('disabled', 'disabled');
        if (!this.ws) {
            return;
        }
        this.ws.close();
        this.ws = null;
    },

    onMessage: function onMessage(event) {
        var msg;
        msg = JSON.parse(event.data);
        console.log(msg);
        $("#console").append("<div><span class=\"username\">" + msg.username + "</span>: " + this.htmlEncode(msg.msg) + "</div>");
    },

    htmlEncode: function htmlEncode(value){
        return $('<div/>').text(value).html();
    },

    // update current status
    setStatus: function setStatus(str) {
        $("#status span").text(str);
    },

    // post to the websocket
    sendMessage: function sendMessage(msg) {
        var payload = {
            username: GoChat.username,
            msg: msg
        };
        this.ws.send(JSON.stringify(payload));
    }
};

