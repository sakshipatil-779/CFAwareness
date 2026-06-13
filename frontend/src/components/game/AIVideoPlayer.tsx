/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@contexts/LanguageContext';
import { useAuth } from '@contexts/AuthContext';
import { API_BASE_URL, LANGUAGE_OPTIONS } from '@/utils/constants';
import type { Language } from '@/types';

interface AIVideoPlayerProps {
  topic?: string;
  onComplete: () => void;
}

export default function AIVideoPlayer({
  topic = 'carbon_awareness',
  onComplete,
}: AIVideoPlayerProps) {
  const { language, setLanguage } = useLanguage();
  const { user } = useAuth();

  // Media state
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [scriptText, setScriptText] = useState<string>('');

  // Loading & Fallback
  const [isLoading, setIsLoading] = useState(true);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [skipped, setSkipped] = useState(false);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fetch AI Video on mount or language change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let isMounted = true;

    async function fetchMedia() {
      if (!videoUrl) setIsLoading(true);
      else setIsAudioLoading(true);

      try {
        const response = await fetch(`${API_BASE_URL}/api/video/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic,
            language,
            userId: user?.uid || 'guest',
            sessionId: `session_${topic}`, // Agnostic to language so video hits cache
          }),
        });

        if (!isMounted) return;

        if (response.ok) {
          const data = await response.json();
          if (data.videoUrl) {
            if (!videoUrl) setVideoUrl(data.videoUrl);

            // Seamlessly update audio if video is already playing
            if (audioRef.current && videoRef.current && isPlaying) {
              setAudioUrl(data.audioUrl);
              setScriptText(data.scriptText);
              // We need to wait for the new src to load before seeking
              setTimeout(() => {
                if (audioRef.current && videoRef.current) {
                  audioRef.current.currentTime = videoRef.current.currentTime;
                  if (isPlaying) audioRef.current.play().catch(console.error);
                }
              }, 100);
            } else {
              setAudioUrl(data.audioUrl);
              setScriptText(data.scriptText);
            }
          } else {
            if (!videoUrl) setUseFallback(true);
          }
        } else {
          if (!videoUrl) setUseFallback(true);
        }
      } catch (err) {
        console.error('Media fetch error:', err);
        if (isMounted && !videoUrl) setUseFallback(true);
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsAudioLoading(false);
        }
      }
    }

    fetchMedia();
    return () => {
      isMounted = false;
    };
  }, [topic, language, user?.uid, videoUrl, isPlaying]);

  const togglePlay = () => {
    if (!videoRef.current || !audioRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(console.error);
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
      if (hasEnded) {
        setHasEnded(false);
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleAudioEnded = () => {
    setHasEnded(true);
    if (videoRef.current) videoRef.current.pause();
    setIsPlaying(false);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as Language;
    if (audioRef.current) audioRef.current.pause();
    setLanguage(newLang); // This updates context and triggers the useEffect to fetch new audio
  };

  const handleSkip = () => {
    setSkipped(true);
    if (videoRef.current) videoRef.current.pause();
    if (audioRef.current) audioRef.current.pause();
    onComplete();
  };

  // ── Render Loading State ──
  if (isLoading) {
    return (
      <div className="animation-fill-both relative flex min-h-[400px] animate-fade-in flex-col items-center justify-center px-4 py-20">
        <div className="mb-8 flex items-center justify-center space-x-2">
          <div
            className="h-4 w-4 animate-bounce rounded-full bg-eco-400"
            style={{ animationDelay: '0s' }}
          ></div>
          <div
            className="h-4 w-4 animate-bounce rounded-full bg-sky-400"
            style={{ animationDelay: '0.2s' }}
          ></div>
          <div
            className="h-4 w-4 animate-bounce rounded-full bg-teal-400"
            style={{ animationDelay: '0.4s' }}
          ></div>
        </div>
        <h2 className="gradient-text mb-3 text-center font-display text-2xl font-bold">
          Generating AI Cinematic Video
        </h2>
        <p className="mb-8 max-w-md text-center leading-relaxed text-slate-500">
          Google Veo 3.1 is crafting a photorealistic awareness video specifically for your session.
          This can take a moment...
        </p>
        <button
          onClick={() => {
            setIsLoading(false);
            setUseFallback(true);
          }}
          className="btn-secondary px-6 py-2 text-sm"
        >
          Skip to Quiz
        </button>
      </div>
    );
  }

  // Fallback if AI generation failed/skipped
  if (useFallback || skipped) {
    return (
      <div className="animate-fade-in py-20 text-center">
        <div className="mb-4 text-6xl">🌿</div>
        <h2 className="gradient-text mb-4 text-2xl font-bold">Welcome to EcoQuest!</h2>
        <p className="mx-auto mb-8 max-w-md text-slate-500">
          You are about to embark on a journey to discover how your daily choices impact the planet.
          Let's get started!
        </p>
        <button onClick={onComplete} className="btn-primary px-8 py-3">
          Start Adventure
        </button>
      </div>
    );
  }

  return (
    <div
      className="relative flex flex-col items-center px-4 py-6"
      aria-label="AI Carbon footprint awareness video"
      role="region"
    >
      <div className="eco-badge animation-fill-both mb-6 animate-fade-in">
        <span aria-hidden="true">✨</span> AI-Generated Cinematic
      </div>

      <div
        className="group relative w-full max-w-4xl overflow-hidden rounded-2xl bg-black shadow-glass-xl"
        style={{ aspectRatio: '16/9' }}
      >
        {/* Video element */}
        <video
          ref={videoRef}
          src={videoUrl || undefined}
          className="h-full w-full object-cover"
          loop // Video loops visually, audio drives completion
          muted
          playsInline
          crossOrigin="anonymous"
          onClick={togglePlay}
        />

        {/* Audio element */}
        {audioUrl && (
          <audio ref={audioRef} src={audioUrl} onEnded={handleAudioEnded} crossOrigin="anonymous" />
        )}

        {/* Initial Play Overlay */}
        {!isPlaying && !hasEnded && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <button
              onClick={togglePlay}
              className="btn-primary animate-pulse px-8 py-4 text-lg transition-transform hover:scale-105"
            >
              ▶ Play Experience
            </button>
          </div>
        )}

        {/* Script Subtitles */}
        {isPlaying && scriptText && (
          <div
            className="pointer-events-none absolute bottom-16 left-0 right-0 z-10 p-6"
            style={{
              background:
                'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
            }}
          >
            <p
              className="mx-auto max-w-3xl text-center text-lg font-medium leading-relaxed text-white drop-shadow-md"
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
            >
              {scriptText}
            </p>
          </div>
        )}

        {/* Audio Loading Spinner */}
        {isAudioLoading && isPlaying && (
          <div className="absolute right-4 top-4 z-30">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
          </div>
        )}

        {/* Video Controls overlay (hover) */}
        <div
          className={`absolute bottom-0 left-0 right-0 z-30 flex items-center justify-between gap-4 p-4 transition-opacity duration-300 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}
          style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, transparent 100%)' }}
        >
          <div className="flex items-center gap-3">
            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="rounded-full p-1 text-white transition-colors hover:text-eco-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-eco-400"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Mute/Unmute Button */}
            <button
              onClick={toggleMute}
              className="rounded-full p-1 text-white transition-colors hover:text-eco-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-eco-400"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
              ) : (
                <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              )}
            </button>
          </div>

          {/* Language Dropdown */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="audio-language"
              className="text-sm font-medium text-white drop-shadow-md"
            >
              Audio:
            </label>
            <select
              id="audio-language"
              value={language}
              onChange={handleLanguageChange}
              className="cursor-pointer rounded-lg border border-white/20 bg-black/50 px-2 py-1 text-sm text-white backdrop-blur-md transition-colors hover:bg-black/70 focus:border-eco-400 focus:outline-none"
            >
              {LANGUAGE_OPTIONS.map((opt) => (
                <option key={opt.code} value={opt.code} className="bg-slate-800 text-white">
                  {opt.nativeLabel} ({opt.code.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Footer Controls & Start Button */}
      <div className="mt-8 flex w-full max-w-md flex-col items-center gap-4">
        <button
          type="button"
          onClick={onComplete}
          disabled={!hasEnded && !skipped}
          className={`shadow-glass-md w-full rounded-xl px-8 py-4 text-lg font-bold transition-all duration-300 ${
            hasEnded || skipped
              ? 'bg-gradient-to-r from-eco-500 to-teal-500 text-white hover:-translate-y-1 hover:shadow-glass-lg'
              : 'cursor-not-allowed bg-slate-200 text-slate-400 opacity-70'
          }`}
        >
          {hasEnded ? 'Start Adventure' : 'Start Adventure (Unlocks when video ends)'}
        </button>

        {!hasEnded && (
          <button
            type="button"
            onClick={handleSkip}
            className="text-sm text-slate-500 underline underline-offset-4 transition-colors hover:text-eco-600"
          >
            Skip to Quiz
          </button>
        )}
      </div>
    </div>
  );
}
