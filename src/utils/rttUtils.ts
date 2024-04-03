export function getCurrentTime() {
    return new Date().toLocaleTimeString().slice(0, 5);
}

export function getContinuityStatus(latencyValueList: number[]): number {
    const continuityNumber: number = latencyValueList.reduce((acc, currLatencyValue) => {
        if(currLatencyValue < 100) {
            return acc + 1;
        }
        return acc;
    }, 0);

    // console.log(latencyValueList);
    
    // console.log(continuityNumber);

    // console.log(latencyValueList?.length);
    
    
    
    return Math.ceil(continuityNumber / latencyValueList?.length ?? 0);
}