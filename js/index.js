/* Inicializando WOW */
new WOW().init();

/* FECHA DINAMICA PARA EL COPYRIGHT */
document.getElementById("year").innerHTML = new Date().getFullYear();

 /* Modal video */
const video = document.getElementById('video');
const playButton = document.getElementById('playButton');

video.addEventListener('play', () => {
    console.log('play');
  playButton.style.display = 'none';
});

video.addEventListener('pause', () => {
  playButton.style.display = 'block';
});

// Para que la flecha aparezca al cargar la página si el video está pausado
if (video.paused) {
  playButton.style.display = 'block';
}
video.addEventListener('click', function() {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });