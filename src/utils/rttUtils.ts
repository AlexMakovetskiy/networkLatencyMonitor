export function getCurrentTime() {
    return new Date().toLocaleTimeString().slice(0, 5);
}