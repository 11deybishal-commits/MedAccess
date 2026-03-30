// Organ visualization images (SVG-based)
export const organImages = {
  brain: `
    <svg viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="brainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#a78bfa;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#6366f1;stop-opacity:1" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="90" rx="70" ry="75" fill="url(#brainGrad)" stroke="#6d28d9" stroke-width="2"/>
      <path d="M 100 30 Q 85 50 80 70 Q 75 85 75 100" fill="none" stroke="#e9d5ff" stroke-width="2" opacity="0.6"/>
      <path d="M 100 30 Q 115 50 120 70 Q 125 85 125 100" fill="none" stroke="#e9d5ff" stroke-width="2" opacity="0.6"/>
      <path d="M 100 40 Q 90 60 88 80" fill="none" stroke="#ddd6fe" stroke-width="1.5" opacity="0.5"/>
      <path d="M 100 40 Q 110 60 112 80" fill="none" stroke="#ddd6fe" stroke-width="1.5" opacity="0.5"/>
    </svg>
  `,
  
  heart: `
    <svg viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ef4444;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#dc2626;stop-opacity:1" />
        </linearGradient>
      </defs>
      <path d="M100 160 C30 120 20 80 20 60 C20 35 35 20 50 20 C65 20 80 35 100 50 C120 35 135 20 150 20 C165 20 180 35 180 60 C180 80 170 120 100 160 Z" fill="url(#heartGrad)" stroke="#7f1d1d" stroke-width="2"/>
      <path d="M70 70 Q60 75 65 85" fill="none" stroke="#fca5a5" stroke-width="1.5" opacity="0.7"/>
      <path d="M130 70 Q140 75 135 85" fill="none" stroke="#fca5a5" stroke-width="1.5" opacity="0.7"/>
    </svg>
  `,
  
  lungs: `
    <svg viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lungsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#60a5fa;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
        </linearGradient>
      </defs>
      <ellipse cx="65" cy="100" rx="40" ry="55" fill="url(#lungsGrad)" stroke="#1e3a8a" stroke-width="2"/>
      <ellipse cx="135" cy="100" rx="40" ry="55" fill="url(#lungsGrad)" stroke="#1e3a8a" stroke-width="2"/>
      <circle cx="60" cy="70" r="8" fill="#93c5fd" opacity="0.6"/>
      <circle cx="70" cy="85" r="7" fill="#93c5fd" opacity="0.6"/>
      <circle cx="60" cy="105" r="7" fill="#93c5fd" opacity="0.6"/>
      <circle cx="140" cy="70" r="8" fill="#93c5fd" opacity="0.6"/>
      <circle cx="130" cy="85" r="7" fill="#93c5fd" opacity="0.6"/>
      <circle cx="140" cy="105" r="7" fill="#93c5fd" opacity="0.6"/>
    </svg>
  `,
  
  stomach: `
    <svg viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="stomachGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f97316;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#ea580c;stop-opacity:1" />
        </linearGradient>
      </defs>
      <path d="M100 40 L75 60 Q60 70 65 100 Q70 130 100 140 Q130 130 135 100 Q140 70 125 60 Z" fill="url(#stomachGrad)" stroke="#92400e" stroke-width="2"/>
      <path d="M80 80 Q75 90 85 100" fill="none" stroke="#fed7aa" stroke-width="1.5" opacity="0.6"/>
      <path d="M100 65 Q95 85 105 105" fill="none" stroke="#fed7aa" stroke-width="1.5" opacity="0.6"/>
      <path d="M120 80 Q125 90 115 100" fill="none" stroke="#fed7aa" stroke-width="1.5" opacity="0.6"/>
    </svg>
  `,
  
  kidneys: `
    <svg viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="kidneysGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#d97706;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#b45309;stop-opacity:1" />
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="90" rx="35" ry="50" fill="url(#kidneysGrad)" stroke="#78350f" stroke-width="2" transform="rotate(-25 60 90)"/>
      <ellipse cx="140" cy="90" rx="35" ry="50" fill="url(#kidneysGrad)" stroke="#78350f" stroke-width="2" transform="rotate(25 140 90)"/>
      <circle cx="50" cy="85" r="6" fill="#fbbf24" opacity="0.7"/>
      <circle cx="150" cy="85" r="6" fill="#fbbf24" opacity="0.7"/>
    </svg>
  `,
  
  eyes: `
    <svg viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="eyesGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#06b6d4;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0369a1;stop-opacity:1" />
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="90" rx="30" ry="35" fill="#e0f2fe" stroke="url(#eyesGrad)" stroke-width="2"/>
      <ellipse cx="140" cy="90" rx="30" ry="35" fill="#e0f2fe" stroke="url(#eyesGrad)" stroke-width="2"/>
      <circle cx="60" cy="90" r="18" fill="#0c4a6e"/>
      <circle cx="140" cy="90" r="18" fill="#0c4a6e"/>
      <circle cx="63" cy="85" r="8" fill="#06b6d4" opacity="0.8"/>
      <circle cx="143" cy="85" r="8" fill="#06b6d4" opacity="0.8"/>
      <circle cx="66" cy="82" r="4" fill="white"/>
      <circle cx="146" cy="82" r="4" fill="white"/>
    </svg>
  `,
  
  skeleton: `
    <svg viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="skeletonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#d1d5db;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#9ca3af;stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="50" r="25" fill="url(#skeletonGrad)" stroke="#6b7280" stroke-width="2"/>
      <polygon points="100,70 70,120 80,150 120,150 130,120" fill="url(#skeletonGrad)" stroke="#6b7280" stroke-width="2"/>
      <line x1="70" y1="120" x2="50" y2="155" stroke="#9ca3af" stroke-width="3"/>
      <line x1="130" y1="120" x2="150" y2="155" stroke="#9ca3af" stroke-width="3"/>
      <circle cx="100" cy="55" r="4" fill="#1f2937"/>
      <circle cx="93" cy="55" r="4" fill="#1f2937"/>
    </svg>
  `
};

export const getOrganImage = (organId) => {
  return organImages[organId] || organImages.brain;
};
