// Chakkar of Luck - Desi Gamified Spin-the-Wheel Rewards Engine

export const WHEEL_REWARDS = [
    {
        id: "tadka20",
        code: "TADKA20",
        label: "20% OFF",
        sub: "Mega Desi Feast",
        color: "#ff4c24",
        discountType: "percent",
        value: 20
    },
    {
        id: "freelassi",
        code: "FREELASSI",
        label: "Free Lassi",
        sub: "Orders over $20",
        color: "#f59e0b",
        discountType: "fixed",
        value: 6.5
    },
    {
        id: "chai5",
        code: "CHAI5",
        label: "$5 OFF",
        sub: "Instant Chai Discount",
        color: "#10b981",
        discountType: "fixed",
        value: 5
    },
    {
        id: "desifree",
        code: "DESIFREE",
        label: "Free Delivery",
        sub: "$0 Delivery Fee",
        color: "#3b82f6",
        discountType: "delivery",
        value: 2
    },
    {
        id: "makhan10",
        code: "MAKHAN10",
        label: "10% OFF",
        sub: "Extra Makhan Love",
        color: "#ec4899",
        discountType: "percent",
        value: 10
    },
    {
        id: "gulabjamun",
        code: "GULABJAMUN",
        label: "Free Sweet",
        sub: "2x Shahi Gulab Jamun",
        color: "#8b5cf6",
        discountType: "fixed",
        value: 8
    }
];

export const playSpinTickSound = () => {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
        // AudioContext silent fallback
    }
};

export const playWinFanfare = () => {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const time = ctx.currentTime + (idx * 0.1);
            osc.frequency.setValueAtTime(freq, time);
            gain.gain.setValueAtTime(0.12, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(time);
            osc.stop(time + 0.36);
        });
    } catch (e) {}
};
