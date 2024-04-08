import { ChangeEvent, useEffect, useState } from "react";
import Ping from "ping.js";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";

import { ChartData, ChartOptions, IResponseData } from "../types/RttTypes";
import { getContinuityStatus, getCurrentTime } from "../utils/RttUtils1";
import {
	aquaColor,
	aquamarineColor,
	chartWidthList,
	defaultHost,
	deviceWidthList,
	hostPattern,
} from "../helpers/ResponseTime1";

import styles from "./ResponseTime1.module.css";

const ping = new Ping();

const ResponseTime = () => {
	const [hostName, sethostName] = useState<string>(defaultHost);
	const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
	const [continuityStatus, setContinuityStatus] = useState<number>(0);
	const [hostResponseData, setHostResponseData] = useState<IResponseData>({
		responseTime: [0],
		timestamps: [getCurrentTime()],
	});

	const [jitterData, setJitterData] = useState<IResponseData>({
		responseTime: [0],
		timestamps: [getCurrentTime()],
	});

	const updatingStep = 5000;
	const hostResponseMaxLength = 15;

	const jitterToggler = hostResponseData.responseTime[0];

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
		const interval = setInterval(() => {
			ping.ping(hostName, async (_error: Error, data: number) => {
				const currentTime = getCurrentTime();

				await setHostResponseData((prevState) => {
					const newData = {
						responseTime: [...prevState.responseTime, data],
						timestamps: [...prevState.timestamps, currentTime],
					};

					if (newData.responseTime.length > hostResponseMaxLength) {
						return {
							responseTime: newData.responseTime.filter((_, index) => index !== 0),
							timestamps: newData.timestamps.filter((_, index) => index !== 0),
						};
					}
					return newData;
				});
			});
		}, updatingStep);

		return () => {
			clearInterval(interval);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		function getLastResponseTimeValue(): number {
			return Math.round(hostResponseData.responseTime[hostResponseData.responseTime.length - 1] ?? 0);
		}

		function getPreLastResponseTimeValue(): number {
			return Math.round(hostResponseData.responseTime[hostResponseData.responseTime.length - 2] ?? 0);
		}

		const interval = setInterval(() => {
			const currentTime = getCurrentTime();

			return setJitterData((prevState) => {
				const jitterValue = Math.abs(getPreLastResponseTimeValue() - getLastResponseTimeValue());

				const newData = {
					responseTime: [...prevState.responseTime, +jitterValue],
					timestamps: [...prevState.timestamps, currentTime],
				};

				if (newData.responseTime.length > hostResponseMaxLength) {
					return {
						responseTime: newData.responseTime.filter((_, index) => index !== 0),
						timestamps: newData.timestamps.filter((_, index) => index !== 0),
					};
				}

				return newData;
			});
		}, updatingStep);

		return () => {
			clearInterval(interval);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [jitterToggler]);

	useEffect(() => {
		setContinuityStatus(getContinuityStatus(hostResponseData.responseTime));
	}, [hostResponseData.responseTime, jitterToggler]);

	const hostChartData: ChartData = {
		labels: hostResponseData.timestamps,
		datasets: [
			{
				label: "RTT",
				data: hostResponseData.responseTime,
				fill: false,
				borderColor: aquaColor,
				tension: 0,
			},
		],
	};

	const jitterChartData: ChartData = {
		labels: jitterData.timestamps,
		datasets: [
			{
				label: "RTT",
				data: jitterData.responseTime,
				fill: false,
				borderColor: aquamarineColor,
				tension: 0,
			},
		],
	};

	const responseChartOptions: ChartOptions = {
		scales: {
			y: {
				max: 500,
			},
		},
	};

	const jitterChartOptions: ChartOptions = {
		scales: {
			y: {
				max: 50,
			},
		},
	};

	function getChartWidth(): number {
		if (windowWidth <= deviceWidthList.mobileValue) {
			return chartWidthList.mobileValue;
		}

		if (windowWidth <= deviceWidthList.tabletValue) {
			return chartWidthList.tabletValue;
		}

		if (windowWidth <= deviceWidthList.thirdDesktopValue) {
			return chartWidthList.thirdDesktopValue;
		}

		if (windowWidth <= deviceWidthList.secondDesktopValue) {
			return chartWidthList.secondDesktopValue;
		}

		if (windowWidth <= deviceWidthList.firstDesktopValue) {
			return chartWidthList.firstDesktopValue;
		}

		return chartWidthList.defaultValue;
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
						<span>
							Latency <input type="text" value={hostName} onChange={handleHostNameChange} />
						</span>
						<Line data={hostChartData} options={responseChartOptions} style={{ width: `${getChartWidth()}px` }} />{" "}
						<br />
					</div>
					<div>
						<p>Jitter</p>
						<Line data={jitterChartData} options={jitterChartOptions} style={{ width: `${getChartWidth()}px` }} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default ResponseTime;
