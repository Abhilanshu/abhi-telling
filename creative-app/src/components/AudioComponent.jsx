import React, { useEffect, useRef, useState } from 'react';

// Shared instance reference for other files to trigger sound effects
export const audioController = {
  playHover: () => {},
  playSpirit: () => {},
  toggleMusic: () => {},
  setVolume: () => {},
};

export default function AudioComponent({ soundEnabled, setSoundEnabled, firstClick }) {
  const audioContextRef = useRef(null);
  const bgSourceRef = useRef(null);
  const gainNodeRef = useRef(null);
  const bgBufferRef = useRef(null);
  
  // HTML5 audio elements for hover and click SFX
  const hoverAudioRefs = useRef([
    new Audio('/audio/hover1.mp3'),
    new Audio('/audio/hover2.mp3'),
    new Audio('/audio/hover3.mp3'),
    new Audio('/audio/hover4.mp3'),
    new Audio('/audio/hover5.mp3')
  ]);
  const spiritAudioRef = useRef(new Audio('/audio/ReleaseSpirit.mp3'));

  useEffect(() => {
    // Set up hover/click triggers on the global object
    audioController.playHover = () => {
      if (!soundEnabled || !audioContextRef.current) return;
      const index = Math.floor(Math.random() * hoverAudioRefs.current.length);
      const audio = hoverAudioRefs.current[index];
      audio.currentTime = 0;
      audio.volume = 0.3;
      audio.play().catch(() => {});
    };

    audioController.playSpirit = () => {
      if (!soundEnabled || !audioContextRef.current) return;
      const audio = spiritAudioRef.current;
      audio.currentTime = 0;
      audio.volume = 0.5;
      audio.play().catch(() => {});
    };
  }, [soundEnabled]);

  // Handle music toggle
  useEffect(() => {
    if (soundEnabled && firstClick) {
      initAndPlayBg();
    } else {
      stopBg();
    }
  }, [soundEnabled, firstClick]);

  const initAndPlayBg = async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        gainNodeRef.current = audioContextRef.current.createGain();
        gainNodeRef.current.gain.value = 0.4;
        gainNodeRef.current.connect(audioContextRef.current.destination);
      }

      // Resume context if suspended (browser security)
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      if (bgSourceRef.current) return;

      if (!bgBufferRef.current) {
        // Fetch and decode loop music
        const response = await fetch('/audio/BG_music_ST.mp3');
        const arrayBuffer = await response.arrayBuffer();
        bgBufferRef.current = await audioContextRef.current.decodeAudioData(arrayBuffer);
      }

      const source = audioContextRef.current.createBufferSource();
      source.buffer = bgBufferRef.current;
      source.loop = true;
      source.connect(gainNodeRef.current);
      source.start(0);
      bgSourceRef.current = source;
    } catch (e) {
      console.warn("AudioContext setup failed:", e);
    }
  };

  const stopBg = () => {
    if (bgSourceRef.current) {
      try {
        bgSourceRef.current.stop();
        bgSourceRef.current.disconnect();
      } catch (e) {}
      bgSourceRef.current = null;
    }
  };

  // Mute logic when page is hidden
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        if (gainNodeRef.current) gainNodeRef.current.gain.value = 0;
      } else {
        if (gainNodeRef.current && soundEnabled) gainNodeRef.current.gain.value = 0.4;
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      stopBg();
    };
  }, [soundEnabled]);

  return null;
}
