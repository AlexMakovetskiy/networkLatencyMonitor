export function getCurrentTime() {
    return new Date().toLocaleTimeString().slice(0, 5);
}

export function getContinuityStatus(latencyValueList: number[]): number {
    let continuityNumber = 0;

    const length = latencyValueList.length;

    for (let i = 0; i < length; i++) {
        if (latencyValueList[i] < 100) {
            continuityNumber++;
        }
    }

    return Math.ceil((continuityNumber / length) * 100 || 0);
}