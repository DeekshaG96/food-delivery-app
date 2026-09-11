import React, { useState, useEffect, useRef } from 'react';
import { musicEngine } from '../../utils/musicEngine';
import './MusicPlayer.css';

const MusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(musicEngine.getCurrentTrack());
    const [isExpanded, setIsExpanded] = useState(false);
    const [volume, setVolume] = useState(60);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const progressIntervalRef = useRef(null);

    // Sync state with music engine
    useEffect(() => {
        const updateTrack = () => {
            setCurrentTrack(musicEngine.getCurrentTrack());
            setIsPlaying(musicEngine.isPlaying);
        };

        const handleExternalTrigger = (e) => {
            setIsExpanded(true);
            if (e.detail?.play && !musicEngine.isPlaying) {
                musicEngine.play();
                setIsPlaying(true);
            }
            if (e.detail?.trackIndex !== undefined) {
                musicEngine.setTrack(e.detail.trackIndex);
            }
            updateTrack();
        };

        window.addEventListener('open-music-player', handleExternalTrigger);

        return () => {
            window.removeEventListener('open-music-player', handleExternalTrigger);
        };
    }, []);

    // Progress bar loop animation
    useEffect(() => {
        if (isPlaying) {
            progressIntervalRef.current = setInterval(() => {
                setProgress((prev) => (prev >= 100 ? 0 : prev + 1.2));
            }, 500);
        } else {
            clearInterval(progressIntervalRef.current);
        }
        return () => clearInterval(progressIntervalRef.current);
    }, [isPlaying]);

    const handleTogglePlay = () => {
        const playing = musicEngine.toggle();
        setIsPlaying(playing);
        setCurrentTrack(musicEngine.getCurrentTrack());
    };

    const handleNextTrack = () => {
        musicEngine.nextTrack();
        setCurrentTrack(musicEngine.getCurrentTrack());
        setIsPlaying(musicEngine.isPlaying);
        setProgress(0);
    };

    const handlePrevTrack = () => {
        musicEngine.prevTrack();
        setCurrentTrack(musicEngine.getCurrentTrack());
        setIsPlaying(musicEngine.isPlaying);
        setProgress(0);
    };

    const handleSelectTrack = (index) => {
        musicEngine.setTrack(index);
        setCurrentTrack(musicEngine.getCurrentTrack());
        if (!isPlaying) {
            musicEngine.play();
            setIsPlaying(true);
        }
        setProgress(0);
    };

    const handleVolumeChange = (e) => {
        const val = Number(e.target.value);
        setVolume(val);
        setIsMuted(val === 0);
        musicEngine.setVolume(val / 100);
    };

    const handleToggleMute = () => {
        if (isMuted) {
            setIsMuted(false);
            musicEngine.setVolume(volume / 100 || 0.6);
        } else {
            setIsMuted(true);
            musicEngine.setVolume(0);
        }
    };

    return (
        <aside className="diner-music-wrapper" aria-label="Music Player while waiting for food">
            {/* Collapsed Floating Pill Dock */}
            {!isExpanded ? (
                <div 
                    className={`diner-music-pill ${isPlaying ? 'playing' : ''}`}
                    onClick={() => setIsExpanded(true)}
                    title="Click to open Tomato Diner Radio & food waiting lounge"
                >
                    <div className="pill-icon-wrap">
                        <span className="pill-icon">🎧</span>
                        {isPlaying && (
                            <div className="pill-waves">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        )}
                    </div>
                    <div className="pill-info">
                        <span className="pill-tag">Diner Radio</span>
                        <span className="pill-track">{currentTrack.title}</span>
                    </div>
                    <button 
                        type="button" 
                        className="pill-btn-play"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleTogglePlay();
                        }}
                        aria-label={isPlaying ? 'Pause Music' : 'Play Music'}
                    >
                        {isPlaying ? '⏸' : '▶'}
                    </button>
                    <button 
                        type="button" 
                        className="pill-btn-expand" 
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(true);
                        }}
                        title="Expand Player"
                    >
                        ⤢
                    </button>
                </div>
            ) : (
                /* Expanded Glassmorphic Hi-Fi Radio Lounge */
                <div className="diner-music-card">
                    {/* Top Bar Header */}
                    <div className="diner-card-header">
                        <div className="diner-header-brand">
                            <span className="brand-badge">📻 Tomato Diner Beats</span>
                            <span className="brand-subtitle">Chill while your meal is prepared</span>
                        </div>
                        <div className="diner-header-actions">
                            <button 
                                type="button"
                                className="btn-icon-hdr" 
                                onClick={() => setIsExpanded(false)}
                                title="Minimize Player"
                            >
                                _
                            </button>
                            <button 
                                type="button"
                                className="btn-icon-hdr close" 
                                onClick={() => {
                                    musicEngine.pause();
                                    setIsPlaying(false);
                                    setIsExpanded(false);
                                }}
                                title="Turn Off"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* Vinyl Record & Track Info */}
                    <div className="diner-card-body">
                        <div className="vinyl-display">
                            <div className={`vinyl-disc ${isPlaying ? 'spinning' : ''}`}>
                                <div className="vinyl-grooves"></div>
                                <div className="vinyl-center">
                                    <span className="vinyl-tomato">🍅</span>
                                </div>
                            </div>
                            <div className={`tonearm ${isPlaying ? 'playing' : ''}`}></div>
                        </div>

                        <div className="diner-track-meta">
                            <div className="track-badges">
                                <span className="track-badge-vibe">{currentTrack.vibe}</span>
                                <span className="track-badge-bpm">{currentTrack.bpm} BPM</span>
                            </div>
                            <h4 className="track-title">{currentTrack.title}</h4>
                            <p className="track-station">Station: Tomato Chillhop Kitchen</p>

                            {/* Soundwave Equalizer */}
                            <div className={`equalizer-soundwave ${isPlaying ? 'active' : ''}`}>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="track-progress-container">
                        <div className="track-progress-bar">
                            <div 
                                className="track-progress-fill" 
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <div className="track-progress-time">
                            <span>Looping Ambient Session</span>
                            <span className="loop-indicator">🔁 Seamless</span>
                        </div>
                    </div>

                    {/* Controls Row */}
                    <div className="diner-controls-row">
                        <button 
                            type="button"
                            className="ctrl-btn secondary" 
                            onClick={handlePrevTrack}
                            title="Previous Station"
                            aria-label="Previous Track"
                        >
                            ⏮
                        </button>

                        <button 
                            type="button"
                            className={`ctrl-btn primary ${isPlaying ? 'playing' : ''}`}
                            onClick={handleTogglePlay}
                            aria-label={isPlaying ? 'Pause' : 'Play'}
                        >
                            {isPlaying ? '⏸' : '▶'}
                        </button>

                        <button 
                            type="button"
                            className="ctrl-btn secondary" 
                            onClick={handleNextTrack}
                            title="Next Station"
                            aria-label="Next Track"
                        >
                            ⏭
                        </button>
                    </div>

                    {/* Volume Bar */}
                    <div className="volume-control-wrap">
                        <button 
                            type="button" 
                            className="btn-volume-mute" 
                            onClick={handleToggleMute}
                            title={isMuted ? 'Unmute' : 'Mute'}
                        >
                            {isMuted || volume === 0 ? '🔇' : volume < 50 ? '🔉' : '🔊'}
                        </button>
                        <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={isMuted ? 0 : volume} 
                            onChange={handleVolumeChange}
                            className="volume-slider"
                            aria-label="Volume"
                        />
                        <span className="volume-label">{isMuted ? '0%' : `${volume}%`}</span>
                    </div>

                    {/* Quick Station Switcher Tabs */}
                    <div className="diner-stations-list">
                        <span className="stations-label">Vibe Stations:</span>
                        <div className="stations-chips">
                            {musicEngine.tracks.map((trk, idx) => (
                                <button
                                    key={trk.id}
                                    type="button"
                                    className={`station-chip ${currentTrack.id === trk.id ? 'active' : ''}`}
                                    onClick={() => handleSelectTrack(idx)}
                                >
                                    {trk.title.split(' ')[0]} {trk.vibe.split(' ')[0]}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
};

export default MusicPlayer;
