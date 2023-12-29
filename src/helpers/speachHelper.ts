export function speak(text: string){
    let utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
};