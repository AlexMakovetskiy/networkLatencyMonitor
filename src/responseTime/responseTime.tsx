import { useEffect, useState } from 'react';
import Ping from "ping.js";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";

import { getCurrentTime } from '../utils/rttUtils';

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

    const [cctldResponseData, setCctldResponseData] = useState<ResponseData>({
        responseTime: [0],
        timestamps: [getCurrentTime()]
    });

    ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

    useEffect(() => {
        const interval = setInterval( () => {
            ping.ping('https://www.google.com', (error: Error, data: number) => {
                if (error) {
                    console.log("error loading resource", error);
                }

                setGoogleResponseData((prevState) => {
                    const newData = {
                        responseTime: [...prevState.responseTime, data],
                        timestamps: [...prevState.timestamps, getCurrentTime()],
                    }

                    if(newData.responseTime.length > 15) {
                        return {
                            responseTime: newData.responseTime.filter((_, index) => index !== 0),
                            timestamps: newData.timestamps.filter((_, index) => index !== 0)
                        }
                    }
                    return newData;
                }
                );
            }
            )
        }, 5000);
    
        return () => {
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        const interval = setInterval( () => {
            ping.ping('https://cctld.by', (error: Error, data: number) => {
                if (error) {
                    console.log("error loading resource", error);
                }

                setCctldResponseData((prevState) => {
                    const newData = {
                        responseTime: [...prevState.responseTime, data],
                        timestamps: [...prevState.timestamps, getCurrentTime()],
                    }

                    if(newData.responseTime.length > 15) {
                        return {
                            responseTime: newData.responseTime.filter((_, index) => index !== 0),
                            timestamps: newData.timestamps.filter((_, index) => index !== 0)
                        }
                    }
                    return newData;
                }
                );
            }
            )
        }, 5000);
    
        return () => {
            clearInterval(interval);
        };
    }, []);

    

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

    const cctldChartData = {
        labels: cctldResponseData.timestamps,
        datasets: [
            {
                label: 'RTT',
                data: cctldResponseData.responseTime,
                fill: false,
                borderColor: 'rgba(100, 190, 150, 1)',
                tension: 0
            }
        ]
    };

    const chartOptions = {
        scales: {
            y: {
                max: 500
            }
        }
    };

    return (
        <div>
            <p>google.com (Washington - USA)</p>
            <Line data={googleChartData} options={chartOptions} style={{width: "700px"}}/> <br /> <br />
            <p>cctld.by (Minsk - Belarus)</p>
            <Line data={cctldChartData} options={chartOptions} style={{width: "700px"}}/> <br /> <br />
        </div>
    );
};

export default ResponseTime;