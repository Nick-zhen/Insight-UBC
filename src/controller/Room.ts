interface Iroom{
	fullname: string;
	shortname: string;
	number: string;
	name: string;
	address: string;
	lat: number;
	lon: number;
	seats: number;
	type: string;
	furniture: string;
	href: string;
}
export default class Room implements Iroom{
	public fullname: string;
	public shortname: string;
	public number: string;
	public name: string;
	public address: string;
	public lat: number = 0;
	public lon: number = 0;
	public seats: number;
	public type: string;
	public furniture: string;
	public href: string;

	constructor(
		fullname: string,
		shortname: string,
		number: string,
		name: string,
		address: string,
		seats: number,
		type: string,
		furniture: string,
		href: string
	) {
		this.fullname = fullname;
		this.shortname = shortname;
		this.number = number;
		this.name = name;
		this.address = address;
		this.seats = seats;
		this.type = type;
		this.furniture = furniture;
		this.href = href;
	}

	public setCoordinate(coordinate: any) {
		this.lat = coordinate.lat;
		this.lon = coordinate.lon;
	}
}
