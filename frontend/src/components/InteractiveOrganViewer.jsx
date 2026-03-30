import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiVolume2, FiVolumeX, FiBookOpen, FiAlertCircle } from 'react-icons/fi';
import { playSound } from '../utils/soundEffects';

const InteractiveOrganViewer = () => {
  const [currentOrganIndex, setCurrentOrganIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);

  const organs = [
    {
      id: 'brain',
      name: 'Brain',
      emoji: '🧠',
      color: 'from-purple-600 to-purple-900',
      image: '🧠',
      description: 'The brain is the command center of the nervous system. It controls all body functions including thought, memory, and movement.',
      facts: [
        'Weight: About 1.4 kg (3 lbs)',
        'Contains approximately 86 billion neurons',
        'The brain uses about 20% of total body energy',
        'Left side controls right movements and vice versa'
      ],
      commonDiseases: ['Alzheimer\'s disease', 'Stroke', 'Parkinson\'s disease', 'Epilepsy'],
      healthTips: [
        'Get quality sleep (7-9 hours)',
        'Regular exercise improves brain health',
        'Eat omega-3 rich foods',
        'Stay mentally active with puzzles and learning'
      ],
      explanation: 'Your brain contains about 100 billion neurons that communicate through electrical signals. These neurons form networks that control everything you think, feel, and do. The brain has multiple regions, each with specialized functions: the frontal lobe for thinking and personality, temporal lobe for memory, occipital lobe for vision, and parietal lobe for sensation.'
    },
    {
      id: 'heart',
      name: 'Heart',
      emoji: '❤️',
      color: 'from-red-600 to-red-900',
      image: '❤️',
      description: 'The heart is a muscular organ that pumps blood throughout the body, delivering oxygen and nutrients to cells.',
      facts: [
        'Heart beats about 100,000 times per day',
        'Pumps approximately 7,500 liters of blood daily',
        'Heart is slightly larger than a closed fist',
        'The left ventricle is strongest chamber'
      ],
      commonDiseases: ['Heart Attack', 'Hypertension', 'Heart Failure', 'Arrhythmias'],
      healthTips: [
        'Maintain healthy blood pressure',
        'Exercise regularly (150 min/week)',
        'Reduce salt and processed foods',
        'Manage stress and get quality sleep'
      ],
      explanation: 'Your heart is composed of four chambers: two upper atria that receive blood, and two lower ventricles that pump blood out. Blood flows from the right side through the lungs to get oxygen, then returns to the left side and is pumped throughout your entire body. This continuous circulation ensures every cell gets the oxygen and nutrients needed to function.'
    },
    {
      id: 'lungs',
      name: 'Lungs',
      emoji: '💨',
      color: 'from-blue-400 to-blue-700',
      image: '💨',
      description: 'The lungs are respiratory organs that exchange oxygen from air with carbon dioxide in the blood.',
      facts: [
        'Surface area: About 70 square meters if stretched',
        'We breathe about 20,000 times per day',
        'Lungs weigh about 1.5 kg (3.3 lbs)',
        'Right lung has 3 lobes, left has 2'
      ],
      commonDiseases: ['Asthma', 'Pneumonia', 'COPD', 'Lung Cancer'],
      healthTips: [
        'Avoid smoking and secondhand smoke',
        'Get regular exercise',
        'Practice deep breathing exercises',
        'Stay away from air pollution when possible'
      ],
      explanation: 'Your lungs contain about 300 million tiny air sacs called alveoli. When you breathe in, oxygen enters these sacs and moves into the blood. At the same time, carbon dioxide leaves the blood and is expelled when you exhale. This gas exchange is essential for delivering oxygen to your body and removing waste products.'
    },
    {
      id: 'stomach',
      name: 'Stomach',
      emoji: '🍽️',
      color: 'from-orange-600 to-orange-900',
      image: '🍽️',
      description: 'The stomach is a muscular sac that stores and digests food, using acid and enzymes to break it down.',
      facts: [
        'Capacity: About 1-4 liters',
        'Produces new lining every 3-5 days',
        'Produces 1-3 liters of gastric juice daily',
        'Food stays in stomach for 2-4 hours on average'
      ],
      commonDiseases: ['Gastritis', 'Peptic Ulcer', 'GERD', 'Stomach Cancer'],
      healthTips: [
        'Eat smaller, more frequent meals',
        'Avoid spicy and fatty foods',
        'Don\'t eat late at night',
        'Manage stress and anxiety'
      ],
      explanation: 'Your stomach churns food into a paste-like substance called chyme while secreting gastric juices containing hydrochloric acid and digestive enzymes. These chemicals break down proteins and other food components. Once partially digested, food moves into the small intestine where further digestion and nutrient absorption occur.'
    },
    {
      id: 'kidneys',
      name: 'Kidneys',
      emoji: '🫘',
      color: 'from-amber-600 to-amber-900',
      description: 'The kidneys filter waste from blood and produce urine to maintain fluid and electrolyte balance.',
      facts: [
        'Two kidneys, each about 10 cm long',
        'Filter about 120-150 liters of blood daily',
        'Produce 1-2 liters of urine daily',
        'Have about 1 million nephrons each'
      ],
      commonDiseases: ['Kidney Stones', 'Chronic Kidney Disease', 'Acute Kidney Injury', 'Diabetes Nephropathy'],
      healthTips: [
        'Drink plenty of water',
        'Control blood pressure',
        'Maintain healthy weight',
        'Limit sodium and processed foods'
      ],
      explanation: 'Your kidneys work like sophisticated filtering systems, removing excess water, salts, and waste products from your blood to form urine. Each kidney contains about 1 million tiny filtering units called nephrons. Through complex processes of filtration, reabsorption, and secretion, kidneys maintain the precise balance of water and electrolytes your body needs, while eliminating harmful waste products.'
    },
    {
      id: 'eyes',
      name: 'Eyes',
      emoji: '👁️',
      color: 'from-cyan-600 to-cyan-900',
      description: 'The eyes are sensory organs that detect light and process it into vision, allowing you to see the world.',
      facts: [
        'Eyes can detect millions of colors',
        'Processing speed: About 36,000 bits/hour',
        'Your eyes are always the same size from birth',
        'Eyes contribute 30% of brain\'s cortex'
      ],
      commonDiseases: ['Myopia', 'Cataracts', 'Glaucoma', 'Age-related Macular Degeneration'],
      healthTips: [
        'Follow 20-20-20 rule: Every 20 min, look 20 ft away for 20 sec',
        'Wear UV protection sunglasses',
        'Eat antioxidant-rich foods',
        'Get comprehensive eye exams regularly'
      ],
      explanation: 'Your eyes work like cameras, focusing light rays through the cornea and lens onto the retina at the back. The retina contains millions of light-sensitive cells called photoreceptors (rods and cones) that convert light into electrical signals. These signals travel through the optic nerve to the visual cortex in your brain, which interprets them as the images you see.'
    },
    {
      id: 'bones',
      name: 'Skeletal System',
      emoji: '🦴',
      color: 'from-slate-400 to-slate-700',
      description: 'The skeletal system provides structure, protects organs, and works with muscles to enable movement.',
      facts: [
        'Adults have 206 bones in their body',
        'Bones are stronger than concrete',
        'Bone marrow produces blood cells',
        'Skeleton replaces itself every 7-10 years'
      ],
      commonDiseases: ['Osteoporosis', 'Arthritis', 'Bone Fractures', 'Osteomyelitis'],
      healthTips: [
        'Get adequate calcium and Vitamin D',
        'Exercise regularly (weight-bearing activities)',
        'Avoid smoking and excessive alcohol',
        'Maintain good posture'
      ],
      explanation: 'Your skeleton is a dynamic network of 206 bones in adults, connected by ligaments, cartilage, and tendons. Bones serve multiple functions: they provide structural support, protect vital organs like the brain and heart, enable movement by providing attachment points for muscles, and produce blood cells in the bone marrow. Bones constantly remodel themselves throughout your life, removing old bone and forming new bone.'
    }
  ];

  // Auto-rotate effect
  useEffect(() => {
    const interval = setInterval(() => {
      setRotationY((prev) => (prev + 2) % 360);
      setRotationX((prev) => (prev + 0.25) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const currentOrgan = organs[currentOrganIndex];

  // Add console log for debugging
  useEffect(() => {
    console.log('Current Organ:', currentOrgan);
  }, [currentOrganIndex, currentOrgan]);

  // Text-to-speech
  useEffect(() => {
    if (isSpeaking && !isMuted) {
      playSound('notification');
      const utterance = new SpeechSynthesisUtterance(currentOrgan.explanation);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
      return () => window.speechSynthesis.cancel();
    }
  }, [isSpeaking, currentOrgan, isMuted]);

  const handleNext = () => {
    try {
      if (!isMuted) playSound('click');
    } catch (e) {
      console.error('Sound error:', e);
    }
    setCurrentOrganIndex((prev) => (prev + 1) % organs.length);
    setIsSpeaking(false);
  };

  const handlePrev = () => {
    try {
      if (!isMuted) playSound('click');
    } catch (e) {
      console.error('Sound error:', e);
    }
    setCurrentOrganIndex((prev) => (prev - 1 + organs.length) % organs.length);
    setIsSpeaking(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Interactive Human Body Explorer
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Discover how your organs work and learn about diseases. Click rotate to see real-time 3D visualization with live explanations.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* 3D Organ Display */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className={`bg-gradient-to-br ${currentOrgan.color} rounded-3xl p-12 relative overflow-hidden group`}
          >
            {/* Background animation circles */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-700"></div>
            </div>

            {/* Rotating organ icon */}
            <div
              className="relative z-10 flex justify-center items-center min-h-[400px]"
              style={{
                perspective: '1000px',
                transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  y: [0, -10, 0],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-white text-9xl drop-shadow-2xl select-none"
              >
                {currentOrgan.emoji}
              </motion.div>
            </div>

            {/* Organ name overlay */}
            <div className="absolute bottom-6 left-6 right-6 z-20 text-white">
              <h2 className="text-4xl font-bold drop-shadow-lg">{currentOrgan.name}</h2>
            </div>

            {/* Navigation arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur transition-colors"
            >
              <FiChevronLeft className="text-2xl text-white" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur transition-colors"
            >
              <FiChevronRight className="text-2xl text-white" />
            </button>
          </motion.div>

          {/* Information Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Description */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <p className="text-slate-300 text-lg leading-relaxed">
                {currentOrgan.description}
              </p>
            </div>

            {/* Button with speakers */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                try {
                  if (!isMuted) playSound('notification');
                } catch (e) {
                  console.error('Sound error:', e);
                }
                setIsSpeaking(!isSpeaking);
              }}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl transition-all"
            >
              {isSpeaking ? (
                <>
                  <FiVolumeX /> Stop Explanation
                </>
              ) : (
                <>
                  <FiVolume2 /> Listen to Explanation
                </>
              )}
            </motion.button>

            {/* Sound control */}
            <button
              onClick={() => {
                try {
                  playSound('click');
                } catch (e) {
                  console.error('Sound error:', e);
                }
                setIsMuted(!isMuted);
              }}
              className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              {isMuted ? 'Unmute Sound' : 'Mute Sound'}
            </button>

            {/* Key Facts */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <FiBookOpen /> Key Facts
              </h3>
              <ul className="space-y-2 text-slate-300">
                {currentOrgan.facts.map((fact, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start gap-2"
                  >
                    <span className="text-blue-400 font-bold mt-1">•</span>
                    <span>{fact}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Common Diseases */}
            <div className="bg-red-900/20 border border-red-700/50 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <FiAlertCircle className="text-red-400" /> Common Conditions
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentOrgan.commonDiseases.map((disease, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="px-3 py-1 bg-red-600/50 text-red-100 rounded-full text-sm"
                  >
                    {disease}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Health Tips */}
            <div className="bg-green-900/20 border border-green-700/50 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4">💚 Health Tips</h3>
              <ul className="space-y-2 text-slate-300">
                {currentOrgan.healthTips.map((tip, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start gap-2"
                  >
                    <span className="text-green-400 font-bold mt-1">✓</span>
                    <span>{tip}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Organ selector dots */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 flex justify-center gap-3 flex-wrap"
        >
          {organs.map((organ, idx) => {
            return (
              <motion.button
                key={organ.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setCurrentOrganIndex(idx);
                  setIsSpeaking(false);
                }}
                className={`p-4 rounded-2xl transition-all text-2xl ${
                  idx === currentOrganIndex
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {organ.emoji}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Full Explanation */}
        {isSpeaking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8"
          >
            <h3 className="text-white font-bold mb-4 text-lg">📖 Full Explanation</h3>
            <p className="text-slate-300 leading-relaxed text-justify">
              {currentOrgan.explanation}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default InteractiveOrganViewer;
