let midiFile, sf2File, player, sf2Soundfont;
let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let analyser = audioContext.createAnalyser();
let canvas = document.getElementById('waveform');
let canvasCtx = canvas.getContext('2d');

// Upload MIDI file
document.getElementById("midi-upload").addEventListener("change", (event) => {
    midiFile = event.target.files[0];
    loadMidi();
});

// Upload SF2 SoundFont file
document.getElementById("sf2-upload").addEventListener("change", (event) => {
    sf2File = event.target.files[0];
    loadSoundFont();
});

// Play button event
document.getElementById("play").addEventListener("click", () => {
    if (player) player.start();
});

// Pause button event
document.getElementById("pause").addEventListener("click", () => {
    if (player) player.stop();
});

// Stop button event
document.getElementById("stop").addEventListener("click", () => {
    if (player) player.stop();
});

// Volume control
document.getElementById("volume").addEventListener("input", (event) => {
    if (player) player.volume.value = event.target.value;
});

// Load MIDI
function loadMidi() {
    if (midiFile) {
        player = new Tone.Player(midiFile).toDestination();
        console.log("MIDI file loaded!");
    }
}

// Load SF2 SoundFont using sf2.js
function loadSoundFont() {
    if (sf2File) {
        const reader = new FileReader();
        reader.onload = function() {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const soundfontData = reader.result;

            sf2Soundfont = new FluidSynth();
            sf2Soundfont.loadSoundFont(soundfontData, () => {
                console.log("SoundFont loaded!");
            });
        };
        reader.readAsArrayBuffer(sf2File);
    }
}

// Waveform visualization
function drawWaveform() {
    analyser.fftSize = 2048;
    let bufferLength = analyser.frequencyBinCount;
    let dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    let barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
        canvasCtx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight);
        x += barWidth + 1;
    }
    requestAnimationFrame(drawWaveform);
}

function startVisualizer() {
    if (player) {
        player.connect(analyser);
        drawWaveform();
    }
}
