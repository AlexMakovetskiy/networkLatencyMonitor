import { ChangeEvent, useEffect, useState } from 'react';
import Ping from "ping.js";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";

import { getContinuityStatus, getCurrentTime } from '../utils/rttUtils';
import { defaultHost, hostPattern } from '../helpers/ResponseTime1';

import styles from "./responseTime.module.css";

const ping = new Ping();

type ResponseData = {
    responseTime: number[];
    timestamps: string[];
}

const ResponseTime = () => {
    const [hostName, sethostName] = useState<string>(defaultHost);
    const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
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
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

    useEffect(() => {
        const interval = setInterval( () => {
            ping.ping(hostName, async (error: Error, data: number) => {
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
            })
        }, 5000);

        return () => {
            clearInterval(interval); 
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        function getLastResponseTimeValue(): number {
            return Math.round(googleResponseData.responseTime[googleResponseData.responseTime.length - 1] ?? 0);
        }
    
        function getPreLastResponseTimeValue(): number {
            return Math.round(googleResponseData.responseTime[googleResponseData.responseTime.length - 2] ?? 0);
        }

        const interval = setInterval( () => {
            const currentTime = getCurrentTime();

            return setJitterData((prevState) => {
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

    useEffect(() => {
            setContinuityStatus(getContinuityStatus(googleResponseData.responseTime));
    }, [googleResponseData.responseTime, jitterToggler]);


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

    function getChartWidth(): number {
        if(windowWidth <= 380) {
            return 280;
        }

        if(windowWidth <= 500) {
            return 300;
        }

        if(windowWidth <= 1150) {
            return 400;
        }

        if(windowWidth <= 1350) {
            return 500;
        }

        if(windowWidth <= 1500) {
            return 600;
        }

        return 700;
    }

    function handleHostNameChange(event: ChangeEvent<HTMLInputElement>) {
        const hostInputValue = event.target.value;

        return sethostName(hostPattern.test(hostInputValue) ? hostInputValue : "");
    }

    return (
        <div className={styles.networkStatusWrap}>
            <header className={styles.networkStatusHeader}>
                <h1 className={styles.networkStatusHeader__title}>Network status monitor</h1>
            </header>
            <div className={styles.networkStatusContainer}>
                <h3 className={styles.networkStatusContainer__title}>Stability: {continuityStatus}%</h3>
                <div className={styles.chartListWrap}>
                    <div>
                        <span>Latency <input type="text" value={hostName} onChange={handleHostNameChange}/></span>
                        <Line data={googleChartData} options={responseChartOptions} style={{width: `${getChartWidth()}px`}}/> <br />
                    </div>
                    <div>
                        <p>Jitter</p>
                        <Line data={jitterChartData} options={jitterChartOptions} style={{width: `${getChartWidth()}px`}}/> 
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResponseTime;