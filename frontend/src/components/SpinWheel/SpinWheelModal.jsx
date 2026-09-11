import React, { useState, useRef, useEffect } from 'react';
import { WHEEL_REWARDS, playSpinTickSound, playWinFanfare } from '../../utils/spinWheel';
import { Sparkles, Copy, Check, X } from 'lucide-react';
import './SpinWheelModal.css';

const SpinWheelModal = ({ isOpen, onClose, onApplyCoupon }) => {
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [wonReward, setWonReward] = useState(null);
    const [copied, setCopied] = useState(false);
    const soundIntervalRef = useRef(null);

    if (!isOpen) return null;

    const sliceAngle = 360 / WHEEL_REWARDS.length;

    const handleSpin = () => {
        if (isSpinning) return;
        setIsSpinning(true);
        setWonReward(null);
        setCopied(false);

        // Sound ticker during spin
        soundIntervalRef.current = setInterval(() => {
            playSpinTickSound();
        }, 120);

        // Random pick
        const winningIndex = Math.floor(Math.random() * WHEEL_REWARDS.length);
        const reward = WHEEL_REWARDS[winningIndex];

        // Calculate rotation: 5 full turns (1800 deg) + offset to land under top pointer
        // Top pointer points to 270 deg (or 0 deg depending on orientation)
        const targetDeg = 1800 + (360 - (winningIndex * sliceAngle) - (sliceAngle / 2));
        const finalRotation = rotation + targetDeg;

        setRotation(finalRotation);

        setTimeout(() => {
            clearInterval(soundIntervalRef.current);
            setIsSpinning(false);
            setWonReward(reward);
            playWinFanfare();
        }, 4000);
    };

    const handleCopy = () => {
        if (!wonReward) return;
        navigator.clipboard.writeText(wonReward.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const handleApply = () => {
        if (!wonReward) return;
        if (onApplyCoupon) {
            onApplyCoupon(wonReward.code);
        }
        onClose();
    };

    return (
        <div className="spin-modal-backdrop" onClick={onClose}>
            <div className="spin-modal-container animate-scale-up" onClick={(e) => e.stopPropagation()}>
                <button className="spin-close-btn" onClick={onClose} aria-label="Close modal">
                    <X size={20} />
                </button>

                <div className="spin-header">
                    <div className="spin-tag">
                        <Sparkles size={14} />
                        <span>Desi Dhamaka Offer</span>
                    </div>
                    <h2 className="spin-title">🎡 Chakkar of Luck!</h2>
                    <p className="spin-subtitle">Spin the wheel to win exciting discounts on your NaanStop feast!</p>
                </div>

                {/* The Wheel Container */}
                <div className="wheel-wrapper">
                    <div className="wheel-pointer">▼</div>

                    <div 
                        className="wheel-disc"
                        style={{ 
                            transform: `rotate(${rotation}deg)`,
                            transition: isSpinning ? 'transform 4s cubic-bezier(0.15, 0.9, 0.2, 1)' : 'none'
                        }}
                    >
                        <svg viewBox="0 0 300 300" className="wheel-svg">
                            {WHEEL_REWARDS.map((item, idx) => {
                                const startAngle = idx * sliceAngle;
                                const endAngle = startAngle + sliceAngle;
                                const rad1 = (startAngle - 90) * (Math.PI / 180);
                                const rad2 = (endAngle - 90) * (Math.PI / 180);
                                const x1 = 150 + 145 * Math.cos(rad1);
                                const y1 = 150 + 145 * Math.sin(rad1);
                                const x2 = 150 + 145 * Math.cos(rad2);
                                const y2 = 150 + 145 * Math.sin(rad2);

                                const pathData = `M 150 150 L ${x1} ${y1} A 145 145 0 0 1 ${x2} ${y2} Z`;

                                // Text angle
                                const midAngle = startAngle + sliceAngle / 2;
                                const textRad = (midAngle - 90) * (Math.PI / 180);
                                const tx = 150 + 95 * Math.cos(textRad);
                                const ty = 150 + 95 * Math.sin(textRad);

                                return (
                                    <g key={item.id}>
                                        <path d={pathData} fill={item.color} stroke="#ffffff" strokeWidth="2" />
                                        <text
                                            x={tx}
                                            y={ty}
                                            fill="#ffffff"
                                            fontSize="13"
                                            fontWeight="bold"
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            transform={`rotate(${midAngle}, ${tx}, ${ty})`}
                                            className="wheel-text"
                                        >
                                            {item.label}
                                        </text>
                                    </g>
                                );
                            })}
                        </svg>

                        <div className="wheel-center-peg" onClick={handleSpin}>
                            <span>{isSpinning ? '...' : 'SPIN'}</span>
                        </div>
                    </div>
                </div>

                {/* Spin Button or Winner Announcement */}
                {!wonReward ? (
                    <div className="spin-actions">
                        <button 
                            type="button" 
                            className="btn-spin-now"
                            onClick={handleSpin}
                            disabled={isSpinning}
                        >
                            {isSpinning ? 'Spinning the Chakkar... 🌶️' : 'Spin Karo! (Win Discount) 🎡'}
                        </button>
                    </div>
                ) : (
                    <div className="win-card animate-bounce">
                        <div className="win-badge">🎉 Badhaai Ho! You Won!</div>
                        <h3 className="win-title">{wonReward.label} ({wonReward.sub})</h3>
                        
                        <div className="coupon-code-box">
                            <span className="code-text">{wonReward.code}</span>
                            <button className="copy-btn" onClick={handleCopy}>
                                {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                                <span>{copied ? 'Copied!' : 'Copy'}</span>
                            </button>
                        </div>

                        <button className="apply-coupon-cta" onClick={handleApply}>
                            Apply Code to Feast & Order Now 🍛
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SpinWheelModal;
