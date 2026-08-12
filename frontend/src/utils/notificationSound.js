/**
 * Clean 2-Tone "Ding-Dong" Bell Notification Chime for Campus_Hire.
 */
export const playNotificationAlert = () => {
    // Avoid running audio inside unit test environments
    if (typeof window === 'undefined' || (import.meta.env && import.meta.env.MODE === 'test')) {
        return;
    }

    try {
        const customAudio = new Audio('/sounds/notification.mp3');
        customAudio.volume = 0.8;

        const playPromise = customAudio.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                playDingDongChime();
            });
        }
    } catch {
        playDingDongChime();
    }
};

/**
 * Pure 2-Tone "Ding-Dong" Bell Chime (E5 -> C5)
 */
const playDingDongChime = () => {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;

        const ctx = new AudioCtx();
        const now = ctx.currentTime;

        // "Ding" - High bell tone (E5 note - 659.25 Hz)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(659.25, now);
        gain1.gain.setValueAtTime(0.28, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.32);

        // "Dong" - Warm low bell tone (C5 note - 523.25 Hz) starting 0.14s later
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(523.25, now + 0.14);
        gain2.gain.setValueAtTime(0.28, now + 0.14);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.14 + 0.55);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.14);
        osc2.stop(now + 0.14 + 0.55);
    } catch (audioErr) {
        console.warn("Ding-Dong audio error:", audioErr);
    }
};
