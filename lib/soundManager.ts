/**
 * Sound Manager for CareerGame
 * Handles all game sound effects and background music
 */

type SoundType = 
  | 'click'       // Menu button clicks
  | 'correct'     // Correct answer/action
  | 'success'     // Level complete
  | 'victory'     // Game complete/high score
  | 'timer'       // Timer ticking
  | 'cooking'     // Cooking/sizzling sounds
  | 'chopping'    // Chopping sounds
  | 'wrong';      // Wrong answer (we'll use a different pitch of correct)

class SoundManager {
  private sounds: Map<SoundType, HTMLAudioElement> = new Map();
  private isMuted: boolean = false;
  private volume: number = 0.5; // Default volume (50%)

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeSounds();
    }
  }

  /**
   * Initialize all sound files
   */
  private initializeSounds() {
    const soundFiles: Record<SoundType, string> = {
      click: '/sounds/click.wav',
      correct: '/sounds/correct.wav',
      success: '/sounds/success.wav',
      victory: '/sounds/victory.wav',
      timer: '/sounds/timer.mp3',
      cooking: '/sounds/cooking.m4a',
      chopping: '/sounds/chopping.wav',
      wrong: '/sounds/correct.wav', // We'll play it at lower pitch for wrong answers
    };

    Object.entries(soundFiles).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.volume = this.volume;
      this.sounds.set(key as SoundType, audio);
    });
  }

  /**
   * Play a sound effect
   */
  play(soundType: SoundType, options?: { volume?: number; loop?: boolean; pitch?: number }) {
    if (this.isMuted) return;

    const sound = this.sounds.get(soundType);
    if (!sound) {
      console.warn(`Sound "${soundType}" not found`);
      return;
    }

    // Clone the audio to allow overlapping sounds
    const audioClone = sound.cloneNode() as HTMLAudioElement;
    
    // Set custom volume if provided
    if (options?.volume !== undefined) {
      audioClone.volume = Math.min(1, Math.max(0, options.volume));
    } else {
      audioClone.volume = this.volume;
    }

    // Set loop if specified
    if (options?.loop) {
      audioClone.loop = true;
    }

    // Adjust pitch for wrong answers (make it sound different)
    if (soundType === 'wrong' && options?.pitch) {
      audioClone.playbackRate = options.pitch;
    }

    // Play the sound
    audioClone.play().catch((error) => {
      console.error(`Error playing sound "${soundType}":`, error);
    });

    // Return the audio element so caller can stop it if needed
    return audioClone;
  }

  /**
   * Play click sound
   */
  playClick() {
    this.play('click', { volume: 0.3 });
  }

  /**
   * Play correct answer sound
   */
  playCorrect() {
    this.play('correct', { volume: 0.6 });
  }

  /**
   * Play wrong answer sound (different pitch)
   */
  playWrong() {
    this.play('wrong', { volume: 0.4, pitch: 0.7 });
  }

  /**
   * Play success sound (level complete)
   */
  playSuccess() {
    this.play('success', { volume: 0.7 });
  }

  /**
   * Play victory sound (game complete)
   */
  playVictory() {
    this.play('victory', { volume: 0.8 });
  }

  /**
   * Play timer sound (looping)
   */
  playTimer() {
    return this.play('timer', { volume: 0.3, loop: true });
  }

  /**
   * Play cooking sound
   */
  playCooking() {
    return this.play('cooking', { volume: 0.5, loop: true });
  }

  /**
   * Play chopping sound
   */
  playChopping() {
    this.play('chopping', { volume: 0.4 });
  }

  /**
   * Stop a specific sound
   */
  stop(audio: HTMLAudioElement | undefined) {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  /**
   * Stop all sounds
   */
  stopAll() {
    this.sounds.forEach((sound) => {
      sound.pause();
      sound.currentTime = 0;
    });
  }

  /**
   * Mute/unmute all sounds
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  /**
   * Set master volume
   */
  setVolume(volume: number) {
    this.volume = Math.min(1, Math.max(0, volume));
    this.sounds.forEach((sound) => {
      sound.volume = this.volume;
    });
  }

  /**
   * Get current mute state
   */
  get muted() {
    return this.isMuted;
  }
}

// Export a singleton instance
export const soundManager = new SoundManager();
export default soundManager;
