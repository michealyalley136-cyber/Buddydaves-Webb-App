"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LogoMark } from "@/components/logo-mark";

const STORAGE_KEY = "buddy-daves-welcome-intro-v1";
const WELCOME_AUDIO_SRC = "/media/buddy-daves-welcome-loop.mp3";
const MIN_LISTEN_SECONDS = 10;

export function WelcomeIntroModal() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const playStartedAtRef = useRef<number | null>(null);
  const [open, setOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [listenedSeconds, setListenedSeconds] = useState(0);
  const [playError, setPlayError] = useState<string | null>(null);

  const canClose = listenedSeconds >= MIN_LISTEN_SECONDS;
  const secondsRemaining = Math.max(0, MIN_LISTEN_SECONDS - Math.ceil(listenedSeconds));

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      return;
    }
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const closeModal = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    audioRef.current?.pause();
    setOpen(false);
  }, []);

  const startPlayback = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    setPlayError(null);
    audio.currentTime = 0;
    setListenedSeconds(0);
    playStartedAtRef.current = Date.now();
    setStarted(true);
    try {
      await audio.play();
    } catch {
      setPlayError("Sound blocked — wait 10 seconds, then you can close. Or allow audio in browser settings.");
    }
  }, []);

  /** Reliable 10s gate: wall clock from play + audio position (whichever is ahead). */
  useEffect(() => {
    if (!open || !started) return;

    const tick = () => {
      const audio = audioRef.current;
      const audioSec = audio?.currentTime ?? 0;
      const wallSec = playStartedAtRef.current
        ? (Date.now() - playStartedAtRef.current) / 1000
        : 0;
      setListenedSeconds(Math.max(audioSec, wallSec));
    };

    tick();
    const id = window.setInterval(tick, 200);
    const audio = audioRef.current;
    audio?.addEventListener("timeupdate", tick);

    return () => {
      window.clearInterval(id);
      audio?.removeEventListener("timeupdate", tick);
    };
  }, [open, started]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--brand-brown)]/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-intro-title"
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-[var(--line-subtle)] bg-white shadow-[var(--shadow-card-hover)]">
        <button
          type="button"
          onClick={closeModal}
          disabled={!canClose}
          aria-label={canClose ? "Close welcome message" : `Close available in ${secondsRemaining} seconds`}
          title={canClose ? "Close" : `Wait ${secondsRemaining}s`}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--line-subtle)] bg-white text-[var(--brand-brown)] shadow-sm transition hover:bg-[var(--bg-cream)] disabled:cursor-not-allowed disabled:opacity-35"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="border-b border-[var(--line-subtle)] bg-[color-mix(in_oklab,var(--brand-teal)_8%,white)] px-6 pb-8 pt-10 text-center">
          <LogoMark size="hero" linked={false} className="mx-auto" />
          <h2 id="welcome-intro-title" className="mt-4 font-display text-2xl text-[var(--brand-brown)]">
            Welcome to Buddy Dave&apos;s
          </h2>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Tap play, then wait {MIN_LISTEN_SECONDS} seconds — the X and Continue buttons will unlock.
          </p>
        </div>

        <div className="px-6 py-6">
          <audio ref={audioRef} src={WELCOME_AUDIO_SRC} preload="auto" playsInline className="sr-only" />

          {!started ? (
            <button type="button" onClick={startPlayback} className="btn-primary w-full py-3.5 text-base">
              Play welcome message
            </button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-[var(--brand-brown)]">
                  {playError ? "Playing (or waiting)…" : "Now playing"}
                </span>
                <span className="tabular-nums text-[var(--text-muted)]">
                  {Math.min(Math.ceil(listenedSeconds), MIN_LISTEN_SECONDS)}s / {MIN_LISTEN_SECONDS}s
                </span>
              </div>
              <div
                className="h-2 overflow-hidden rounded-full bg-[var(--bg-cream)]"
                role="progressbar"
                aria-valuenow={Math.min(listenedSeconds, MIN_LISTEN_SECONDS)}
                aria-valuemin={0}
                aria-valuemax={MIN_LISTEN_SECONDS}
              >
                <div
                  className="h-full rounded-full bg-[var(--brand-teal)] transition-[width] duration-200"
                  style={{
                    width: `${Math.min(100, (listenedSeconds / MIN_LISTEN_SECONDS) * 100)}%`,
                  }}
                />
              </div>
              <button
                type="button"
                onClick={startPlayback}
                className="text-xs font-medium text-teal hover:underline"
              >
                Replay from start
              </button>
            </div>
          )}

          {playError && <p className="mt-3 text-center text-sm text-[var(--accent-red)]">{playError}</p>}

          <button
            type="button"
            disabled={!canClose}
            onClick={closeModal}
            className="btn-gold mt-6 w-full disabled:cursor-not-allowed disabled:opacity-45"
          >
            {canClose
              ? "Continue to site"
              : started
                ? `Continue in ${secondsRemaining}s…`
                : `Play message — then wait ${MIN_LISTEN_SECONDS}s`}
          </button>
        </div>
      </div>
    </div>
  );
}
