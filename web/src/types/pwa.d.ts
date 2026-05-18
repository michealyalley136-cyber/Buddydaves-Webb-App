declare global {
  interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
  }
}

export {};
