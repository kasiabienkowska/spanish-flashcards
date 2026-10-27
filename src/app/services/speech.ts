/** Reads text aloud in Spanish (Web Speech API, supported by most browsers) */
export function speakSpanish(text: string): void {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-ES';
  utterance.rate = 0.9;
  speechSynthesis.speak(utterance);
}
