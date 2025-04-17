document.addEventListener('DOMContentLoaded', () => {
    const timerDisplay = document.getElementById('timer');
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');
    
    let countdown;
    let isAlarmActive = false;
    let audioContext;
    let oscillator;
    let gainNode;

    // Función para generar un tiempo aleatorio entre 30 minutos y 1 hora
    function getRandomTime() {
        const minMinutes = 30;
        const maxMinutes = 60;
        const randomMinutes = Math.floor(Math.random() * (maxMinutes - minMinutes + 1)) + minMinutes;
        return randomMinutes * 60; // Convertir a segundos
    }

    // Función para formatear el tiempo
    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // Función para crear y configurar el audio
    function setupAudio() {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        oscillator = audioContext.createOscillator();
        gainNode = audioContext.createGain();
        
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
    }

    // Función para reproducir la alarma
    function playAlarm() {
        if (!audioContext) {
            setupAudio();
        }
        oscillator.start();
    }

    // Función para detener la alarma
    function stopAlarm() {
        if (oscillator) {
            oscillator.stop();
            oscillator = null;
            audioContext = null;
        }
        clearInterval(countdown);
        isAlarmActive = false;
        startButton.classList.remove('hidden');
        stopButton.classList.add('hidden');
        timerDisplay.textContent = '00:00:00';
    }

    // Función para iniciar la alarma
    function startAlarm() {
        if (isAlarmActive) return;
        
        isAlarmActive = true;
        startButton.classList.add('hidden');
        stopButton.classList.remove('hidden');
        
        // Reproducir alarma al inicio por 10 segundos
        playAlarm();
        setTimeout(() => {
            if (oscillator) {
                oscillator.stop();
                oscillator = null;
                audioContext = null;
            }
            
            // Iniciar el temporizador después de los 10 segundos
            let timeLeft = getRandomTime();
            
            countdown = setInterval(() => {
                timeLeft--;
                timerDisplay.textContent = formatTime(timeLeft);
                
                if (timeLeft <= 0) {
                    clearInterval(countdown);
                    playAlarm(); // La alarma seguirá sonando hasta que se presione detener
                }
            }, 1000);
        }, 10000);
    }

    // Event listeners
    startButton.addEventListener('click', startAlarm);
    stopButton.addEventListener('click', stopAlarm);
}); 