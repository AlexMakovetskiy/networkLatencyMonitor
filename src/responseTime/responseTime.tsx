import { useEffect, useState } from 'react';
import Ping from "ping.js";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";

import { getContinuityStatus, getCurrentTime } from '../utils/rttUtils';

import "./responseTime.css";

const ping = new Ping();

type ResponseData = {
    responseTime: number[];
    timestamps: string[];
}

const ResponseTime = () => {
    const [googleResponseData, setGoogleResponseData] = useState<ResponseData>({
        responseTime: [0],
        timestamps: [getCurrentTime()]
    });

    const [jitterData, setJitterData] = useState<ResponseData>({
        responseTime: [0],
        timestamps: [getCurrentTime()]
    });

    const [continuityStatus, setContinuityStatus] = useState<number>(0);

    const jitterToggler = googleResponseData.responseTime[0];

    ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

    useEffect(() => {
        const interval = setInterval( () => {
            ping.ping('https://www.google.com', async (error: Error, data: number) => {
                if (error) {
                    console.log("error loading resource", error);
                }

                const currentTime = getCurrentTime();

                await setGoogleResponseData((prevState) => {
                    const newData = {
                        responseTime: [...prevState.responseTime, data],
                        timestamps: [...prevState.timestamps, currentTime],
                    }

                    if(newData.responseTime.length > 15) {
                        return {
                            responseTime: newData.responseTime.filter((_, index) => index !== 0),
                            timestamps: newData.timestamps.filter((_, index) => index !== 0)
                        }
                    }
                    return newData;
                });

                setContinuityStatus(getContinuityStatus(googleResponseData.responseTime));

            }
            )
        }, 5000);
    
        return () => {
            clearInterval(interval); 
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        function getLastResponseTimeValue(): number {
            return Math.round(+googleResponseData.responseTime[googleResponseData.responseTime.length - 1]);
        }
    
        function getPreLastResponseTimeValue(): number {
            return Math.round(+googleResponseData.responseTime[googleResponseData.responseTime.length - 2]);
        }

        const interval = setInterval( () => {
            const currentTime = getCurrentTime();
            
            setJitterData((prevState) => {
                const jitterValue = Math.abs(getPreLastResponseTimeValue() - getLastResponseTimeValue());


                const newData = {
                    responseTime: [...prevState.responseTime, +jitterValue],
                    timestamps: [...prevState.timestamps, currentTime],
                }

                if(newData.responseTime.length > 15) {
                    return {
                        responseTime: newData.responseTime.filter((_, index) => index !== 0),
                        timestamps: newData.timestamps.filter((_, index) => index !== 0)
                    }
                }

                return newData;
            });
        }, 5000);

        return () => {
            clearInterval(interval);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jitterToggler]);

    // useEffect(() => {
    //     const interval = setInterval( () => {
    //         setContinuityStatus(getContinuityStatus(googleResponseData.responseTime));
    //     }, 5000);
    
    //     return () => {
    //         clearInterval(interval); 
    //     };
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [googleResponseData.responseTime[0]]);

    const googleChartData = {
        labels: googleResponseData.timestamps,
        datasets: [
            {
                label: 'RTT',
                data: googleResponseData.responseTime,
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0,
            }
        ]
    };

    const jitterChartData = {
        labels: jitterData.timestamps,
        datasets: [
            {
                label: 'RTT',
                data: jitterData.responseTime,
                fill: false,
                borderColor: 'rgba(100, 190, 150, 1)',
                tension: 0
            }
        ]
    };

    const responseChartOptions = {
        scales: {
            y: {
                max: 500
            }
        }
    };

    const jitterChartOptions = {
        scales: {
            y: {
                max: 50
            }
        }
    };

    return (
        <div className='networkStatusWrap'>
            <div>
                <p>Latency: google.com (Washington - USA)</p>
                <Line data={googleChartData} options={responseChartOptions} style={{width: "700px"}}/> <br />
                <p>jitter</p>
                <Line data={jitterChartData} options={jitterChartOptions} style={{width: "700px"}}/> 
            </div>
            <div>
                <p>Continuity: {continuityStatus}% </p>
                <p>Stability: </p>
            </div>
        </div>
    );
};

export default ResponseTime;