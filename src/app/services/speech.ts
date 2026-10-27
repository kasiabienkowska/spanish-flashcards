/** Czyta tekst na głos po hiszpańsku (Web Speech API, działa w większości przeglądarek) */
export function speakSpanish(text: string): void {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-ES';
  utterance.rate = 0.9;
  speechSynthesis.speak(utterance);
}
