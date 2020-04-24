export class CurrentWeather {
	coord: CoordinateInstance;
	weather: WeatherInstance;
	main: MainInstance;
	wind: WindInstance;
	sys: SystemInstance;
	name: string;
}
export class CoordinateInstance {
	lat: number;
	lon: number;
}
export class WeatherInstance {
	main: string;
	description: string;
	icon: string;
}
export class MainInstance {
	temp: number;
	feels_like: number;
	temp_min: number;
	temp_max: number;
	pressure: number;
	humidity: number;
}
export class WindInstance {
	speed: number;
	deg: number;
}
export class SystemInstance {
	country: string;
	sunrise: number;
	sunset: number;
}