export const defaultHost = "https://www.google.com";

export const aquaColor = "rgba(75, 192, 192, 1)";
export const aquamarineColor = "rgba(100, 190, 150, 1)";

export const hostPattern: RegExp = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,3}\/?$/;

export const deviceWidthList = {
	firstDesktopValue: 1500,
	secondDesktopValue: 1350,
	thirdDesktopValue: 1150,
	tabletValue: 500,
	mobileValue: 300,
} as const;

export const chartWidthList = {
	defaultValue: 700,
	firstDesktopValue: 600,
	secondDesktopValue: 500,
	thirdDesktopValue: 400,
	tabletValue: 300,
	mobileValue: 280,
} as const;
