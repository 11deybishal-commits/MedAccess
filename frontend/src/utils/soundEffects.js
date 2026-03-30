// Sound Effects Utility - Use singleton AudioContext
let audioContext = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
};

export const playSound = (soundType) => {
  try {
    const ctx = getAudioContext();
    
    // Resume context if suspended (required by some browsers)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (soundType) {
      case 'success':
        // Two ascending beeps
        oscillator.frequency.setValueAtTime(400, now);
        oscillator.frequency.linearRampToValueAtTime(600, now + 0.2);
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.4);
        oscillator.start(now);
        oscillator.stop(now + 0.4);
        break;

      case 'click':
        // Short click sound
        oscillator.frequency.setValueAtTime(800, now);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.1);
        oscillator.start(now);
        oscillator.stop(now + 0.1);
        break;

      case 'alert':
        // Alert beep
        oscillator.frequency.setValueAtTime(600, now);
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
        oscillator.start(now);
        oscillator.stop(now + 0.3);
        break;

      case 'notification':
        // Gentle notification sound
        oscillator.frequency.setValueAtTime(500, now);
        oscillator.frequency.linearRampToValueAtTime(700, now + 0.15);
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
        oscillator.start(now);
        oscillator.stop(now + 0.3);
        break;

      case 'heartbeat':
        // Heartbeat-like sound
        oscillator.frequency.setValueAtTime(150, now);
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.linearRampToValueAtTime(0.1, now + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.2);
        oscillator.start(now);
        oscillator.stop(now + 0.2);
        break;

      default:
        oscillator.frequency.setValueAtTime(400, now);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.2);
        oscillator.start(now);
        oscillator.stop(now + 0.2);
    }
  } catch (error) {
    console.warn('Sound playback error:', error);
    // Silently fail - don't break app if audio unavailable
  }
};

export const playSequence = async (sounds, delayBetween = 200) => {
  for (let sound of sounds) {
    playSound(sound);
    await new Promise(resolve => setTimeout(resolve, delayBetween));
  }
};
