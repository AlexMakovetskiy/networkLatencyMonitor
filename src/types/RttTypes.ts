export interface IResponseData {
	responseTime: number[];
	timestamps: string[];
}

export interface ChartOptions {
	scales: {
		y: {
			max: number;
		};
	};
}

export interface ChartData {
	labels: string[];
	datasets: ChartDatasets[];
}

export interface ChartDatasets {
	label: string;
	data: number[];
	fill: boolean;
	borderColor: string;
	tension: number;
}
