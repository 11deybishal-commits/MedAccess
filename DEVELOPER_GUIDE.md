# Sound Effects & Organ Enhancement - Developer Guide

## Quick Start for Developers

### Using Sound Effects in Components

```javascript
import { playSound, playSequence } from '../utils/soundEffects';

// Play single sound
playSound('success');   // Multiple success 'notifications'

// Play sequence of sounds
async function playStartupSequence() {
  await playSequence(['click', 'notification', 'success'], 200);
}
```

### Sound Types Reference

```javascript
// Success sound - use for positive actions
playSound('success');        // 400→600Hz, 400ms, 0.3 gain

// Click sound - use for navigation and interactions
playSound('click');          // 800Hz, 100ms, 0.1 gain

// Alert sound - use for errors and warnings
playSound('alert');          // 600Hz, 300ms, 0.2 gain

// Notification sound - use for status changes
playSound('notification');   // 500→700Hz, 300ms, 0.15 gain

// Heartbeat sound - use for cardiac/health context
playSound('heartbeat');      // 150Hz, 200ms, 0.2 gain
```

## Component Integration Examples

### Example 1: Report Analyzer Audio Button

```jsx
import { playSound } from '../utils/soundEffects';

const handlePlayExplanation = () => {
    if (!analysis) return;
    
    playSound('notification');  // Play sound when toggling
    setIsSpeaking(!isSpeaking);
    
    if (!isSpeaking) {
        const utterance = new SpeechSynthesisUtterance(analysis.analysis);
        utterance.rate = 0.95;
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
    } else {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    }
};

return (
    <motion.button
        onClick={handlePlayExplanation}
        className={isSpeaking ? 'active' : ''}
    >
        <FaVolumeUp /> {isSpeaking ? 'Stop' : 'Listen'}
    </motion.button>
);
```

### Example 2: Navigation with Sound

```jsx
const handleNext = () => {
    playSound('click');  // Play sound before navigation
    setCurrentOrganIndex((prev) => (prev + 1) % organs.length);
    setIsSpeaking(false);
};

const handlePrev = () => {
    playSound('click');
    setCurrentOrganIndex((prev) => (prev - 1 + organs.length) % organs.length);
    setIsSpeaking(false);
};
```

### Example 3: Error Handling with Sound

```jsx
const handleUpload = async () => {
    setLoading(true);
    playSound('click');  // Start action sound
    
    try {
        const response = await axios.post(`${baseUrl}/api/ai/analyze-report`, formData);
        playSound('success');  // Success feedback
        setAnalysis(response.data.data);
    } catch (err) {
        playSound('alert');  // Error feedback
        setError(err.response?.data?.message || "Failed to process report");
    } finally {
        setLoading(false);
    }
};
```

### Example 4: Organ Data Structure

```jsx
const organs = [
    {
        id: 'brain',
        name: 'Brain',
        emoji: '🧠',
        color: 'from-purple-600 to-purple-900',
        image: '🧠',  // Future: SVG or image URL
        description: 'The brain is the command center...',
        facts: [
            'Weight: About 1.4 kg (3 lbs)',
            'Contains approximately 86 billion neurons',
            // ...
        ],
        commonDiseases: ['Alzheimer\'s disease', 'Stroke', /* ... */],
        healthTips: [
            'Get quality sleep (7-9 hours)',
            'Regular exercise improves brain health',
            // ...
        ],
        explanation: 'Your brain contains about 100 billion neurons...'
    },
    // ... more organs
];
```

## Text-to-Speech Implementation

### Basic Text-to-Speech

```jsx
const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure speech
    utterance.rate = 0.95;        // Speed: 0.5x to 2x
    utterance.pitch = 1.0;        // Pitch: 0.5 to 2
    utterance.volume = 1.0;       // Volume: 0 to 1
    
    // Handle events
    utterance.onstart = () => console.log('Started');
    utterance.onend = () => console.log('Finished');
    utterance.onerror = (e) => console.error('Error:', e.error);
    
    window.speechSynthesis.speak(utterance);
};

// Stop speech
const stopSpeech = () => {
    window.speechSynthesis.cancel();
};
```

### Advanced: Get Available Voices

```jsx
const getAvailableVoices = () => {
    const voices = window.speechSynthesis.getVoices();
    console.log('Available voices:', voices);
    return voices;
};

// Use specific voice
const speakWithVoice = (text, voiceIndex = 0) => {
    const voices = window.speechSynthesis.getVoices();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voices[voiceIndex];
    window.speechSynthesis.speak(utterance);
};
```

## Web Audio API Details

### Understanding the Sound Generation

```javascript
const playCustomSound = (frequency = 400, duration = 200) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    const now = audioContext.currentTime;
    
    // Set frequency and volume
    oscillator.frequency.setValueAtTime(frequency, now);
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.linearRampToValueAtTime(0, now + duration / 1000);
    
    // Play
    oscillator.start(now);
    oscillator.stop(now + duration / 1000);
};
```

### Frequency Reference (Hz)

```
C4:  261.63 Hz
E4:  329.63 Hz
G4:  392.00 Hz
A4:  440.00 Hz
C5:  523.25 Hz
E5:  659.25 Hz
```

## File Organization

```
frontend/src/
├── components/
│   ├── ReportAnalyzer.jsx          # Enhanced with audio
│   ├── InteractiveOrganViewer.jsx  # Enhanced with audio
│   └── [other components]/
├── utils/
│   ├── soundEffects.js             # Sound engine
│   ├── organImages.js              # SVG organs
│   └── [other utilities]/
├── App.jsx
└── main.jsx
```

## Performance Considerations

### Audio Context Initialization

```javascript
// First call creates context - may have slight delay
playSound('click');  // ~10-50ms delay on first call

// Subsequent calls are faster - reuse same context
playSound('click');  // ~1-2ms delay
```

### Memory Management

```javascript
// Current implementation: Creates new oscillator per sound
// Advantage: Simple, reliable
// Disadvantage: Uses a bit more memory per sound

// For high-frequency sounds, consider:
const soundPool = [];
const createSoundPool = (size = 5) => {
    // Pre-create oscillators for quick playback
};
```

## Browser Compatibility Checks

```javascript
// Check Web Audio API support
const hasWebAudio = () => {
    return !!(window.AudioContext || window.webkitAudioContext);
};

// Check Web Speech API support
const hasSpeechSynthesis = () => {
    return !!window.speechSynthesis;
};

// Use with graceful degradation
if (hasWebAudio()) {
    playSound('success');
} else {
    console.warn('Web Audio API not supported');
}

if (hasSpeechSynthesis()) {
    speakText('Welcome');
} else {
    console.warn('Speech Synthesis not supported');
}
```

## Accessibility Implementation

```jsx
// Mute toggle state
const [soundEnabled, setSoundEnabled] = useState(true);

// Check before playing sound
const playSoundIfEnabled = (soundType) => {
    if (soundEnabled) {
        playSound(soundType);
    }
};

// Clear audio button accessibility
<button
    onClick={handleAudio}
    aria-label={isSpeaking ? "Stop audio explanation" : "Listen to explanation"}
    aria-pressed={isSpeaking}
>
    <FaVolumeUp /> {isSpeaking ? 'Stop' : 'Listen'}
</button>
```

## Testing Sound Effects

```javascript
// Test all sounds
const testAllSounds = async () => {
    const sounds = ['click', 'success', 'alert', 'notification', 'heartbeat'];
    for (let sound of sounds) {
        console.log(`Playing: ${sound}`);
        playSound(sound);
        await new Promise(resolve => setTimeout(resolve, 500));
    }
};

// Run in console
testAllSounds();
```

## Debugging Tips

```javascript
// Check if Web Audio API is working
console.log('AudioContext:', window.AudioContext);
console.log('webkitAudioContext:', window.webkitAudioContext);

// Monitor sound playback
window.addEventListener('error', (e) => {
    if (e.message.includes('audio')) {
        console.error('Audio error:', e);
    }
});

// Check speech synthesis
console.log('Voices available:', window.speechSynthesis.getVoices().length);
```

## Future Enhancements

### 1. Sound Volume Control

```javascript
let masterVolume = 0.5;

const playWithVolume = (soundType) => {
    // Implement volume scaling
    const sound = getSound(soundType);
    sound.volume *= masterVolume;
};
```

### 2. Audio Recording

```javascript
const recordAudio = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Record and save audio
};
```

### 3. 3D Audio (Spatial Audio)

```javascript
const play3DSound = (frequency, x, y, z) => {
    const pannerNode = audioContext.createPanner();
    pannerNode.positionX.value = x;
    pannerNode.positionY.value = y;
    pannerNode.positionZ.value = z;
    // 3D surround sound
};
```

---

**Version**: 1.0
**Last Updated**: March 30, 2026
**Author**: MediAccess Development Team
