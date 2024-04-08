const oneHundredPercent = 100;
const lowerLatencyBound = 100;
const dateLastCharIndex = 5;

export function getCurrentTime() {
	return new Date().toLocaleTimeString().slice(0, dateLastCharIndex);
}

export function getContinuityStatus(latencyValueList: number[]): number {
	let continuityNumber = 0;

	const length = latencyValueList.length;

	for (let i = 0; i < length; i++) {
		if (latencyValueList[i] < lowerLatencyBound) {
			continuityNumber++;
		}
	}

	return Math.ceil((continuityNumber / length) * oneHundredPercent || 0);
}
