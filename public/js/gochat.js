$(document).ready(function() {
        var settings = {
            url: 'ws://localhost:8000'
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
        });
});


var GoChat = {
    username: null,
    ws: null,
    CONNECTED: 'Connected',
    DISCONNECTED: 'Disconnected',

    connect: function connect(url) {
        var username, ws, me = this;
        this.setStatus('Connecting');
        username = $('#username').val();
        if (username.length < 1) {
            alert('Name is mandatory!');
            return;
        }
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
        this.ws = ws;
    },

    onOpen: function onOpen(e) {
        console.info('connection is open');
        this.setStatus(this.CONNECTED);
        $("#send-btn").removeAttr('disabled');
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

