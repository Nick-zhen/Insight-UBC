import * as http from "http";
import Room from "./Room";
import JSZip from "jszip";
import parse5, {Node} from "parse5";
import {InsightError} from "./IInsightFacade";

export default class RoomHelper {
	public rooms: Room[] = [];

	constructor() {
		this.rooms = [];
	}

	private getIndexFilePromise(zips: any) {
		const indexFile = zips
			.filter((relativePath: any, file: any) => {
				return relativePath === "rooms/index.htm";
			})
			.map((file: any) => {
				return file.async("text");
			});
		if (indexFile.length === 0) {
			return Promise.reject("couldn't find index file");
		}
		return indexFile[0];
	}

	private getBuildings(indexHtml: string) {
		const parseRoom: any = parse5.parse(indexHtml);
		let resultArray: any = [];
		this.getIndexHtmlBuildingTable(parseRoom, resultArray);
		const buildings = resultArray
			.filter((node: any) => {
				return node.nodeName === "tr";
			})
			.map((row: any) => {
				const abc = row.childNodes.filter((cell: any) => {
					return cell.nodeName === "td";
				});
				abc.shift();
				const code = abc.shift().childNodes[0].value.trim();
				const refLink = abc[0].childNodes[1].attrs
					.filter((attr: any) => {
						return attr.name === "href";
					})
					.map((attr: any) => {
						return attr.value;
					})[0];
				const fullName = abc.shift().childNodes[1].childNodes[0].value.trim();
				const address = abc.shift().childNodes[0].value.trim();
				return {shortname: code, href: refLink, fullname: fullName, address: address};
			});
		return buildings;
	}

	private readBuildingFile(zips: any, buildingShortsNames: string[]) {
		const buildingPromises = zips
			.filter((relativePath: any, file: any) => {
				const shortname = relativePath.split("/").pop();
				return buildingShortsNames.includes(shortname);
			})
			.map((zip: any) => {
				return zip.async("text");
			});
		return Promise.all(buildingPromises);
	}

	private getRoomFromBuildings(requiredBuilding: any[], buildings: any[]) {
		const roomsFromBuildings: Room[][] = requiredBuilding.map((htmlStr) => {
			const parseRoom: any = parse5.parse(htmlStr);
			const roomFromThisBuilding = this.getRoomObjFromFiles(parseRoom, buildings);
			if (roomFromThisBuilding !== undefined && roomFromThisBuilding.length > 0) {
				return roomFromThisBuilding;
			}
			return [];
			// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/concat
		});
		const returnRooms = roomsFromBuildings.flat();
		return returnRooms;
	}

	private getRoomCoordinate(rooms: Room[]) {
		this.rooms.push(...rooms);
		const promiseArray: Array<Promise<any>> = [];
		for (let room of rooms) {
			promiseArray.push(this.getCoordinates(room.address));
		}
		return Promise.all(promiseArray);
	}

	public getRooms(content: string): any {
		return new Promise((resolve, reject) => {
			const promisesArray: Array<Promise<any>> = [];
			JSZip.loadAsync(content, {base64: true})
				.then((zips: any) => {
					return this.getIndexFilePromise(zips);
				})
				.then((indexHtml) => {
					return this.getBuildings(indexHtml);
				})
				.then((buildings) => {
					const buildingShortsNames = buildings.map((building: any) => {
						return building.shortname;
					});
					JSZip.loadAsync(content, {base64: true})
						.then((zips: any) => {
							return this.readBuildingFile(zips, buildingShortsNames);
						})
						.then((requiredBuilding: any[]) => {
							const allRooms = this.getRoomFromBuildings(requiredBuilding, buildings);
							return allRooms;
						})
						.then((rooms: Room[]) => {
							return this.getRoomCoordinate(rooms);
						})
						.then((coordArray: any[]) => {
							for (let i in coordArray) {
								this.rooms[i].setCoordinate(coordArray[i]);
							}
							return resolve(this.rooms);
						})
						.catch((error: any) => {
							return reject(new InsightError("zip file is not valid"));
						});
				})
				.catch((error) => {
					return reject(new InsightError(error.toString()));
				});
		});
	}

	private getIndexHtmlBuildingTable(parsedHtml: any, resultArray: any[]): any {
		if (parsedHtml.nodeName === "tbody") {
			resultArray.push(...parsedHtml.childNodes);
		}
		if (Object.keys(parsedHtml).includes("childNodes")) {
			for (const child of parsedHtml.childNodes) {
				this.getIndexHtmlBuildingTable(child, resultArray);
			}
		}
	}

	private getBuildingShortname(htmlNode: Node) {
		const htmlStr = parse5.serialize(htmlNode);
		const pattern = '<link rel="canonical" href=';
		const position = htmlStr.search(pattern);
		return htmlStr.substr(position, pattern.length + 10).split('"')[3];
		console.log(htmlStr.substr(position, pattern.length + 10));
	}

	public getRoomObjFromFiles(htmlNode: Node, buildings: any[]) {
		let tableArray: any[] = [];
		this.getBuildingTable(htmlNode, tableArray);
		if (tableArray.length > 0) {
			const shortname = this.getBuildingShortname(htmlNode);
			let building: any = buildings.filter((b) => {
				return b.shortname === shortname;
			})[0];
			let roomArray: any[] = [];
			this.getBuildingRooms(htmlNode, roomArray);
			return roomArray
				.map((row) => {
					const tds = row.childNodes.filter((cell: any) => {
						return cell.nodeName === "td";
					});
					let roomObj = {shortname: building.shortname};
					tds.forEach((td: any) => {
						this.getRoomValByProperty(td, roomObj);
					});
					return roomObj;
				})
				.filter((room) => {
					return Object.keys(room).length > 1;
				})
				.map((roomObj: any) => {
					return this.buildRoom(building, roomObj);
				});
		}
	}

	private buildRoom(buildingObj: any, roomObj: any): Room {
		const fullname = buildingObj["fullname"];
		const shortname = buildingObj["shortname"];
		const name = shortname + "_" + roomObj["number"];
		const address = buildingObj["address"];
		const href = roomObj["href"];
		const room1: Room = new Room(
			fullname,
			shortname,
			roomObj["number"],
			name,
			address,
			roomObj["seats"],
			roomObj["type"],
			roomObj["furniture"],
			href
		);
		return room1;
	}

	private getBuildingRooms(parsedHtml: any, resultArray: any[]) {
		if (parsedHtml.nodeName === "tr") {
			resultArray.push(parsedHtml);
		} else {
			if (Object.keys(parsedHtml).includes("childNodes")) {
				for (const child of parsedHtml.childNodes) {
					this.getBuildingRooms(child, resultArray);
				}
			}
		}
	}

	private getBuildingTable(parsedHtml: any, resultArray: any[]) {
		if (parsedHtml.nodeName === "tbody") {
			resultArray.push(parsedHtml);
		} else {
			if (Object.keys(parsedHtml).includes("childNodes")) {
				for (const child of parsedHtml.childNodes) {
					this.getBuildingTable(child, resultArray);
				}
			}
		}
	}

	public getRoomValByProperty(htmlNode: any, roomObj: any): any {
		let attrs: any = htmlNode["attrs"];
		if (attrs.length > 0 && attrs[0].name === "class" && attrs[0].value === "views-field views-field-nothing") {
			roomObj["href"] = htmlNode.childNodes[1].attrs[0].value.trim();
		}
		if (
			attrs.length > 0 &&
			attrs[0].name === "class" &&
			attrs[0].value === "views-field views-field-field-room-number"
		) {
			roomObj["number"] = htmlNode.childNodes[1].childNodes[0].value.trim();
		}
		if (
			attrs.length > 0 &&
			attrs[0].name === "class" &&
			attrs[0].value === "views-field views-field-field-room-capacity"
		) {
			const x = htmlNode.childNodes[0].value.trim();
			const y: number = +x;
			roomObj["seats"] = y;
		}
		if (
			attrs.length > 0 &&
			attrs[0].name === "class" &&
			attrs[0].value === "views-field views-field-field-room-furniture"
		) {
			roomObj["furniture"] = htmlNode.childNodes[0].value.trim();
		}
		if (
			attrs.length > 0 &&
			attrs[0].name === "class" &&
			attrs[0].value === "views-field views-field-field-room-type"
		) {
			roomObj["type"] = htmlNode.childNodes[0].value.trim();
		}
	}

	private getCoordinates(address: string): Promise<any[]> {
		return new Promise((resolve, reject) => {
			const encodedAddress: string = encodeURI(address);
			// from given resource https://nodejs.org/api/http.html#httpgetoptions-callback
			http.get(
				{
					hostname: "cs310.students.cs.ubc.ca",
					port: 11316,
					path: "/api/v1/project_team193/" + encodedAddress,
					agent: false, // Create a new agent just for this one request
				},
				(res) => {
					const {statusCode} = res;
					// https://nodejs.org/api/http.html#httpgetoptions-callback
					let error;
					if (statusCode === 404) {
						error = new Error("Request Failed.\n" + `Status Code: ${statusCode}`);
					}
					res.setEncoding("utf8");
					let rawData = "";
					res.on("data", (chunkData) => {
						rawData += chunkData;
					});
					res.on("end", () => {
						try {
							// transform to json file
							const parsedData = JSON.parse(rawData);
							resolve(parsedData);
						} catch (err: any) {
							console.error(err.message);
						}
					});
				}
			).on("err", (e) => {
				console.error(`Got err: ${e.message}`);
			});
		});
	}
}
