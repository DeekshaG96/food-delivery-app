// Web Audio API Polyphonic Lo-Fi & Ambient Music Engine
// Generates warm, procedural diner & kitchen background beats with zero external network dependencies.

class MusicEngine {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.analyser = null;
        this.isPlaying = false;
        this.currentTrackIndex = 0;
        this.volume = 0.6;
        this.timer = null;
        this.step = 0;
        this.noiseNode = null;

        this.tracks = [
            {
                id: "bollywood-acoustic",
                title: "Bollywood Acoustic Chill",
                vibe: "🪕 Sitar & Acoustic Nylon Fusion",
                bpm: 82,
                chords: [
                    [146.83, 220.00, 261.63, 349.23],         // Dm
                    [196.00, 246.94, 293.66, 392.00],         // G
                    [174.61, 220.00, 261.63, 349.23],         // Fmaj7
                    [220.00, 277.18, 329.63, 440.00]          // A
                ],
                bass: [73.42, 98.00, 87.31, 110.00],
                waveform: "triangle",
                filterFreq: 1600,
                vinyl: false
            },
            {
                id: "tapri-chai",
                title: "Tapri Chai & Monsoon Rain",
                vibe: "☕ Warm Tabla Lofi & Raindrops",
                bpm: 72,
                chords: [
                    [164.81, 196.00, 246.94, 329.63],         // Em
                    [130.81, 164.81, 196.00, 246.94],         // Cmaj7
                    [146.83, 220.00, 293.66, 369.99],         // D9
                    [164.81, 196.00, 246.94, 392.00]          // Em7
                ],
                bass: [82.41, 65.41, 73.42, 82.41],
                waveform: "sine",
                filterFreq: 850,
                vinyl: true
            },
            {
                id: "dhaba-sunset",
                title: "Highway Dhaba Sunset",
                vibe: "🥘 Punjabi Acoustic Strums & Dusk",
                bpm: 90,
                chords: [
                    [196.00, 246.94, 293.66, 392.00],         // G
                    [146.83, 220.00, 293.66, 369.99],         // D
                    [164.81, 196.00, 246.94, 329.63],         // Em
                    [130.81, 164.81, 196.00, 261.63]          // C
                ],
                bass: [98.00, 73.42, 82.41, 65.41],
                waveform: "triangle",
                filterFreq: 1500,
                vinyl: false
            },
            {
                id: "cozy-lofi",
                title: "Cozy Kitchen Lofi",
                vibe: "☕ Mellow Rhodes & Chillhop Groove",
                bpm: 76,
                baseFreq: 293.66, // D4
                chords: [
                    [293.66, 369.99, 440.00, 554.37, 659.25], // Dmaj9
                    [246.94, 293.66, 369.99, 440.00],         // Bm7
                    [196.00, 246.94, 293.66, 369.99, 440.00], // Gmaj9
                    [220.00, 277.18, 329.63, 392.00, 493.88]  // A9
                ],
                bass: [146.83, 123.47, 98.00, 110.00],
                waveform: "triangle",
                filterFreq: 1100,
                vinyl: true
            },
            {
                id: "trattoria-guitar",
                title: "Trattoria Acoustic Serenade",
                vibe: "🍕 Mediterranean Warm Nylon Fingerpicking",
                bpm: 88,
                chords: [
                    [220.00, 261.63, 329.63, 392.00],         // Am7
                    [146.83, 220.00, 261.63, 349.23],         // Dm7
                    [196.00, 246.94, 293.66, 349.23],         // G7
                    [261.63, 329.63, 392.00, 493.88]          // Cmaj7
                ],
                bass: [110.00, 146.83, 98.00, 130.81],
                waveform: "sine",
                filterFreq: 1800,
                vinyl: false
            }
        ];
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();

            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

            this.analyser = this.ctx.createAnalyser();
            this.analyser.fftSize = 64;
            this.analyser.smoothingTimeConstant = 0.8;

            this.masterGain.connect(this.analyser);
            this.analyser.connect(this.ctx.destination);
        }
        if (this.ctx.state === "suspended") {
            this.ctx.resume();
        }
    }

    startRainNoise() {
        if (!this.ctx || this.noiseNode) return;
        try {
            const bufferSize = this.ctx.sampleRate * 2;
            const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            let b0 = 0, b1 = 0, b2 = 0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                output[i] = (b0 + b1 + b2) * 0.05;
            }

            const whiteNoise = this.ctx.createBufferSource();
            whiteNoise.buffer = noiseBuffer;
            whiteNoise.loop = true;

            const filter = this.ctx.createBiquadFilter();
            filter.type = "lowpass";
            filter.frequency.setValueAtTime(700, this.ctx.currentTime);

            const noiseGain = this.ctx.createGain();
            noiseGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

            whiteNoise.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(this.masterGain);

            whiteNoise.start();
            this.noiseNode = whiteNoise;
        } catch (e) {
            console.error("Noise generation error:", e);
        }
    }

    stopRainNoise() {
        if (this.noiseNode) {
            try {
                this.noiseNode.stop();
                this.noiseNode.disconnect();
            } catch (e) { }
            this.noiseNode = null;
        }
    }

    playChord(notes, duration, time, waveform = "triangle", filterFreq = 1200) {
        if (!this.ctx) return;

        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const noteGain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc.type = waveform;
            // Slight detuning for organic chorus warmth
            const detune = (i - notes.length / 2) * 4;
            osc.frequency.setValueAtTime(freq, time);
            osc.detune.setValueAtTime(detune, time);

            filter.type = "lowpass";
            filter.frequency.setValueAtTime(filterFreq, time);
            filter.Q.setValueAtTime(2, time);

            // Gentle ADSR Envelope
            const attack = 0.12 + (i * 0.02);
            const decay = 0.4;
            const sustain = 0.22;
            const release = 0.5;

            noteGain.gain.setValueAtTime(0.0001, time);
            noteGain.gain.linearRampToValueAtTime(0.12, time + attack);
            noteGain.gain.exponentialRampToValueAtTime(sustain * 0.12, time + attack + decay);
            noteGain.gain.setValueAtTime(sustain * 0.12, time + duration - release);
            noteGain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

            osc.connect(filter);
            filter.connect(noteGain);
            noteGain.connect(this.masterGain);

            osc.start(time);
            osc.stop(time + duration + 0.1);
        });
    }

    playBassNote(freq, duration, time) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, time);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(240, time);

        gain.gain.setValueAtTime(0.001, time);
        gain.gain.linearRampToValueAtTime(0.2, time + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(time);
        osc.stop(time + duration + 0.1);
    }

    playSubtleBeat(time) {
        if (!this.ctx) return;
        // Soft kick
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(90, time);
        osc.frequency.exponentialRampToValueAtTime(30, time + 0.12);
        gain.gain.setValueAtTime(0.15, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(time);
        osc.stop(time + 0.16);
    }

    tick() {
        if (!this.isPlaying || !this.ctx) return;

        const track = this.tracks[this.currentTrackIndex];
        const chordDuration = (60 / track.bpm) * 4; // 4 beats per measure
        const chords = track.chords;
        const currentChordIndex = this.step % chords.length;
        const now = this.ctx.currentTime;

        const chordNotes = chords[currentChordIndex];
        const bassNote = track.bass[currentChordIndex];

        // Play lush chord voicing
        this.playChord(chordNotes, chordDuration * 0.95, now, track.waveform, track.filterFreq);

        // Play deep sub bass
        this.playBassNote(bassNote, chordDuration * 0.85, now);

        // Subtle rhythm beat
        this.playSubtleBeat(now);
        this.playSubtleBeat(now + (chordDuration / 2));

        this.step++;

        const nextTickDelay = chordDuration * 1000;
        this.timer = setTimeout(() => this.tick(), nextTickDelay);
    }

    play() {
        this.init();
        if (this.isPlaying) return;
        this.isPlaying = true;

        const track = this.tracks[this.currentTrackIndex];
        if (track.vinyl) {
            this.startRainNoise();
        } else {
            this.stopRainNoise();
        }

        this.step = 0;
        this.tick();
    }

    pause() {
        this.isPlaying = false;
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.stopRainNoise();
    }

    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
        return this.isPlaying;
    }

    setVolume(val) {
        this.volume = Math.max(0, Math.min(1, val));
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        }
    }

    setTrack(index) {
        const wasPlaying = this.isPlaying;
        if (wasPlaying) {
            this.pause();
        }
        this.currentTrackIndex = (index + this.tracks.length) % this.tracks.length;
        if (wasPlaying) {
            this.play();
        }
    }

    nextTrack() {
        this.setTrack(this.currentTrackIndex + 1);
    }

    prevTrack() {
        this.setTrack(this.currentTrackIndex - 1);
    }

    getCurrentTrack() {
        return this.tracks[this.currentTrackIndex];
    }

    getFrequencyData() {
        if (!this.analyser) return new Uint8Array(4);
        const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(dataArray);
        return dataArray;
    }
}

export const musicEngine = new MusicEngine();
