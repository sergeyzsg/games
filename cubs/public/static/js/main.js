function startWebRTC() {
    //var v = document.getElementById('localVideo');
    //navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia;
    //navigator.getUserMedia({video: true, audio: true}, success, function() {});
    //function success(stream) {
    //  v.src = window.URL.createObjectURL(stream);
    //}

    var webrtc = new SimpleWebRTC({
        // the id/element dom element that will hold "our" video
        localVideoEl: 'localVideo',
        // the id/element dom element that will hold remote videos
        remoteVideosEl: 'remoteVideos',
        // immediately ask for camera access
        autoRequestMedia: true
    });
    webrtc.config.url = 'http://localhost:3000';

    // we have to wait until it's ready
    webrtc.on('readyToCall', function () {
        // you can name it anything
        webrtc.joinRoom('room');
    });
}

$(function() {
    //startWebRTC();
});


var game = {
    players: [],

    addPlayer: function(name) {
        this.players.push(name);

        var td = $('<td></td>');
        td.text(name);

        $('#score').find('tr').first().append(td);
    }
};

$(function() {
    $('#add_player').click(function() {
        var name = $.trim(window.prompt('Введите имя игрока'));

        if (!name) {
            alert('Введите не пустое имя');
            return;
        }

        game.addPlayer(name);
    });
});