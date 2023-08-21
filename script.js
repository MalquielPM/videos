document.addEventListener("DOMContentLoaded", function() {
    var loadButton = document.getElementById("loadButton");
    var videoPlayer = document.getElementById("videoPlayer");
    var addLocalVideoButton = document.getElementById("addLocalVideo");
    var addLocalImageButton = document.getElementById("addLocalImage");
    var fileInput = document.getElementById("fileInput");
    var volumeSlider = document.getElementById("volumeSlider");
    var imageContainer = document.getElementById("imageContainer");
    var prevButton = document.getElementById("prevButton");
    var nextButton = document.getElementById("nextButton");
    var deleteButton = document.getElementById("deleteButton");
    var socket = io();
    var images = [];
    var currentImageIndex = -1;

    loadButton.addEventListener("click", function() {
        cargarVideo();
    });

    addLocalVideoButton.addEventListener("click", function() {
        fileInput.accept = "video/*";
        fileInput.click();
    });

    addLocalImageButton.addEventListener("click", function() {
        fileInput.accept = "image/*";
        fileInput.click();
    });

  fileInput.addEventListener("change", function(event) {
        var selectedFile = event.target.files[0];
        if (selectedFile) {
            if (selectedFile.type.startsWith('video/')) {
                videoPlayer.style.display = "block";
                videoPlayer.src = URL.createObjectURL(selectedFile);
                videoPlayer.play();
                imageContainer.innerHTML = '';
                socket.emit('changeImage', -1); 
            } else if (selectedFile.type.startsWith('image/')) {
                videoPlayer.style.display = "none";
                images.push(selectedFile);
                currentImageIndex = images.length - 1;
                mostrarImagen(currentImageIndex);
                socket.emit('addImage', images[currentImageIndex]);
                socket.emit('changeImage', currentImageIndex);
            } else {
                alert("El formato de archivo no es compatible. Por favor selecciona un archivo de video o imagen.");
            }
        }
    });
    prevButton.addEventListener("click", function() {
        showImage(-1);
    });

    nextButton.addEventListener("click", function() {
        showImage(1);
    });

    deleteButton.addEventListener("click", function() {
        eliminarImagen(currentImageIndex);
    });

    document.addEventListener("keydown", function(event) {
        if (event.key === "ArrowLeft") {
            showImage(-1);
        } else if (event.key === "ArrowRight") {
            showImage(1);
        }
    });

   function eliminarImagen(index) {
        if (index >= 0 && index < images.length) {
            images.splice(index, 1);
            if (images.length === 0) {
                imageContainer.innerHTML = '';
                videoPlayer.style.display = "block";
                socket.emit('changeImage', -1); 
            } else {
                currentImageIndex = Math.min(currentImageIndex, images.length - 1);
                mostrarImagen(currentImageIndex);
                socket.emit('deleteImage', index); 
                socket.emit('changeImage', currentImageIndex);
            }
        }
    }

      function showImage(step) {
        if (images.length === 0) {
            return;
        }
        currentImageIndex = (currentImageIndex + step + images.length) % images.length;
        mostrarImagen(currentImageIndex);
        socket.emit('changeImage', currentImageIndex);
    }

    function mostrarImagen(index) {
        var image = new Image();
        image.src = URL.createObjectURL(images[index]);
        image.onload = function() {
            imageContainer.innerHTML = '';
            imageContainer.appendChild(image);
        };
    }

    function mostrarImagen(index) {
        var fullscreenImage = document.getElementById("fullscreenImage");
        fullscreenImage.src = URL.createObjectURL(images[index]);
    
        var fullscreenButton = document.getElementById("fullscreenButton");
        fullscreenButton.addEventListener("click", function() {
            if (fullscreenImage.requestFullscreen) {
                fullscreenImage.requestFullscreen();
            } else if (fullscreenImage.mozRequestFullScreen) {
                fullscreenImage.mozRequestFullScreen();
            } else if (fullscreenImage.webkitRequestFullscreen) {
                fullscreenImage.webkitRequestFullscreen();
            } else if (fullscreenImage.msRequestFullscreen) {
                fullscreenImage.msRequestFullscreen();
            }
        });
    
        if ("ontouchstart" in document.documentElement) {
            var startX;
            fullscreenImage.addEventListener("touchstart", function(event) {
                startX = event.touches[0].clientX;
            });
    
            fullscreenImage.addEventListener("touchmove", function(event) {
                var currentX = event.touches[0].clientX;
                var diffX = currentX - startX;
    
                if (diffX > 0) {
                    showImage(-1); 
                } else if (diffX < 0) {
                    showImage(1); 
                }
                
                startX = currentX;
            });
        }
    }
    
    
   function cargarVideo() {
        var input = document.getElementById("videoInput").value;

        if (input.includes("http")) {
            if (input.includes("youtube.com") || input.includes("youtu.be")) {
                var videoId = obtenerIdDeVideo(input);
                if (videoId) {
                    videoPlayer.style.display = "block";
                    videoPlayer.src = `https://www.youtube.com/embed/${videoId}`;
                    imageContainer.innerHTML = '';
                    socket.emit('changeImage', -1); 
                } else {
                    alert("URL de video de YouTube no válida.");
                }
            } else {
                alert("Por favor, ingresa la URL completa de YouTube.");
            }
        } else {
            videoPlayer.style.display = "block";
            videoPlayer.src = input;
            videoPlayer.play();
            imageContainer.innerHTML = '';
            socket.emit('changeImage', -1); 
        }
    }

 volumeSlider.addEventListener("input", function() {
        var newVolume = parseFloat(volumeSlider.value);
        videoPlayer.volume = newVolume;
        socket.emit('changeVolume', { volume: newVolume });
    });

    socket.on('updateVolume', function(data) {
        videoPlayer.volume = data.volume;
        volumeSlider.value = data.volume;
    });

      socket.on('updateImages', function(updatedImages) {
        images = updatedImages;
        if (images.length === 0) {
            imageContainer.innerHTML = '';
            videoPlayer.style.display = "block";
        } else {
            currentImageIndex = Math.min(currentImageIndex, images.length - 1);
            mostrarImagen(currentImageIndex);
        }
    });

   socket.on('updateCurrentImage', function(updatedIndex) {
        currentImageIndex = updatedIndex;
        mostrarImagen(currentImageIndex);
    });

      socket.on('deleteImage', function(deletedIndex) {
        images.splice(deletedIndex, 1);
        if (images.length === 0) {
            imageContainer.innerHTML = '';
            videoPlayer.style.display = "block";
        } else {
            currentImageIndex = Math.min(currentImageIndex, images.length - 1);
            mostrarImagen(currentImageIndex);
        }
    });

    videoPlayer.addEventListener("volumechange", function() {
        var newVolume = videoPlayer.volume;
        socket.emit('changeVolume', { volume: newVolume });
    });

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
