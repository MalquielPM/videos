document.addEventListener("DOMContentLoaded", function() {
    var loadButton = document.getElementById("loadButton");
    var videoPlayer = document.getElementById("videoPlayer");
    var addLocalVideoButton = document.getElementById("addLocalVideo");
    var fileInput = document.getElementById("fileInput");

    loadButton.addEventListener("click", function() {
        cargarVideo();
    });

    addLocalVideoButton.addEventListener("click", function() {
        fileInput.click();
    });

    fileInput.addEventListener("change", function(event) {
        var selectedFile = event.target.files[0];
        if (selectedFile) {
            videoPlayer.src = URL.createObjectURL(selectedFile);
            videoPlayer.play();
        }
    });

    function cargarVideo() {
        var input = document.getElementById("videoInput").value;

        if (input.includes("http")) {
            if (input.includes("youtube.com") || input.includes("youtu.be")) {
                var videoId = obtenerIdDeVideo(input);
                if (videoId) {
                    videoPlayer.src = `https://www.youtube.com/embed/${videoId}`;
                } else {
                    alert("URL de video de YouTube no válida.");
                }
            } else {
                alert("Por favor, ingresa la URL completa de YouTube.");
            }
        } else {
            videoPlayer.src = input;
            videoPlayer.play();
        }
    }

    function obtenerIdDeVideo(url) {
        var regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\\&\\?]*).*/;
        var match = url.match(regExp);
        if (match && match[2].length == 11) {
            return match[2];
        } else {
            return null;
        }
    }
});

