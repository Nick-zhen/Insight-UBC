import {CheckRoomQueryValidity} from "./CheckRoomQueryValidity";
import Dataset from "./Dataset";
import * as fs from "fs-extra";
import Room from "./Room";
import {InsightError, ResultTooLargeError} from "./IInsightFacade";
import TransformationsHelper from "./TransformationsHelper";

import Sections from "./Sections";
import HelperMethod from "./HelperMethod";
import {WildcardHelper} from "./WildcardHelper";
import RoomsOptionsHelper from "./RoomsOptionsHelper";
import TransformationRoomHelper from "./TransformationRoomHelper";
const mComparison = ["LT", "GT", "EQ"];
const sComparison = ["IS"];
const negation = ["NOT"];
const mfield = ["lat", "lon", "seats"];
const sfield = ["fullname", "shortname", "number", "name", "address", "type", "furniture", "href"];
export default class QueryRoomsHelper {
	// union several sections arrays
	public static handleOrOperator(tempSections: any[][]): any[] {
		let helperArray: any[] = [];
		for (let element of tempSections) {
			// helperArray = helperArray.concat(element);
			let notExistSections: any[] = element.filter((section) => {
				return !helperArray.includes(section);
			});
			helperArray = helperArray.concat(notExistSections);
			// helperArray.concat(notExistSections);
		}
		// let uniq: Sections[] = [...new Set(helperArray)];
		// return [...new Set(helperArray)];
		return helperArray;
	}

	// joint several sections arrays
	public static handleAndOperator(tempSections: any[][]): any[] {
		let helperArray: any[] = tempSections[0];
		for (let i: number = 1; i < tempSections.length; i++) {
			helperArray = helperArray.filter((section) => {
				return tempSections[i].includes(section);
			});
		}
		return helperArray;
	}

	public static handleAndOrOperator(objKey: string, insideItem: any, sections: any[]) {
		let tempSections: any[][] = [];
		let resultSceions: any[] = [];
		if (objKey === "AND") {
			let i: number = 0;
			for (let insideArrayItem of insideItem) { // insideArrayItem is a object
				tempSections[i] = this.handleWHERE(insideArrayItem, sections);
				i++;
			}
			resultSceions = this.handleAndOperator(tempSections);
		} else if (objKey === "OR") {
			let i: number = 0;
			for (let insideArrayItem of insideItem) { // insideArrayItem is a object
				tempSections[i] = this.handleWHERE(insideArrayItem, sections);
				i++;
			}
			resultSceions = this.handleOrOperator(tempSections);
		}
		return resultSceions;
	}

	private static handleNegationOperator(objKey: string, insideItem: any, sections: any[]): any[] {
		let tempSections: any[] = [];
		// if (Array.isArray(insideItem)) {
		// 	tempSections = this.handleAndOrOperator(objKey, insideItem, sections);
		// } else if (typeof insideItem === "object") {
		// 	tempSections =  this.handleWHERE(insideItem, sections);
		// }
		tempSections = this.handleWHERE(insideItem, sections);
		tempSections = sections.filter((section: Sections) => {
			return !tempSections.includes(section);
		});
		return tempSections;
	}

	// const mfield = ["lat", "lon", "seats"];
	// handle filter number comparison
	public static handleMComparisonOperator(objKey: string, insideItem: any, sections: any[]): any[] {
		let tempSections: any[] = [];
		let modifiedField = HelperMethod.queryParseField(Object.keys(insideItem)[0]);
		if (typeof (Object.values(insideItem)[0]) !== "number") {
			throw new InsightError("should use Mcomparison");
		}
		let insideItemValue = Number(Object.values(insideItem)[0]);
		if (objKey === "LT") {
			tempSections = sections.filter((section) => {
				if (modifiedField === "lat") {
					return section.lat < insideItemValue;
				} else if (modifiedField === "lon") {
					return section.lon < insideItemValue;
				} else if (modifiedField === "seats") {
					return section.seats < insideItemValue;
				}
			});
		} else if (objKey === "GT") {
			tempSections = sections.filter((section) => {
				if (modifiedField === "lat") {
					return section.lat > insideItemValue;
				} else if (modifiedField === "lon") {
					return section.lon > insideItemValue;
				} else if (modifiedField === "seats") {
					return section.seats > insideItemValue;
				}
			});
		} else if (objKey === "EQ") {
			tempSections = sections.filter((section) => {
				if (modifiedField === "lat") {
					return section.lat === insideItemValue;
				} else if (modifiedField === "lon") {
					return section.lon === insideItemValue;
				} else if (modifiedField === "seats") {
					return section.seats === insideItemValue;
				}
			});
		}
		return tempSections;
	}

	// const sfield = ["fullname", "shortname", "number", "name", "address", "type", "furniture", "href"];
	// handle filter string comparison
	public static handleSComparisonOperator(insideItem: any, sections: any[]): any[] {
		let tempSections: any[] = [];
		let modifiedField = HelperMethod.queryParseField(Object.keys(insideItem)[0]);
		if (typeof (Object.values(insideItem)[0]) !== "string") {
			throw new InsightError("should use scomparison");
		}
		let insideItemValue = String(Object.values(insideItem)[0]);
		if (insideItemValue.includes("*")) {
			tempSections = WildcardHelper.handleStar(modifiedField, insideItemValue, sections);
		} else {
			tempSections = sections.filter((section) => {
				if (modifiedField === "fullname") {
					return section.fullname === insideItemValue;
				} else if (modifiedField === "shortname") {
					return section.shortname === insideItemValue;
				} else if (modifiedField === "number") {
					return section.number === insideItemValue;
				} else if (modifiedField === "name") {
					return section.name === insideItemValue;
				} else if (modifiedField === "address") {
					return section.address === insideItemValue;
				} else if (modifiedField === "type") {
					return section.type === insideItemValue;
				} else if (modifiedField === "furniture") {
					return section.furniture === insideItemValue;
				} else if (modifiedField === "href") {
					return section.href === insideItemValue;
				}
			});
		}
		return tempSections;
	}

	// perform query WHERE
	public static handleWHERE(where: any, sections: any[]): any {
		let insideItem: any = where[Object.keys(where)[0]];
		let objKey: string = Object.keys(where)[0];
		if (Array.isArray(insideItem)) {
			return this.handleAndOrOperator(objKey, insideItem, sections);
		} else if (typeof insideItem === "object") {
			if (mComparison.includes(objKey)) {
				return this.handleMComparisonOperator(objKey, insideItem, sections);
			} else if (sComparison.includes(objKey)) {
				return this.handleSComparisonOperator(insideItem, sections);
			} else if (negation.includes(objKey)) {
				return this.handleNegationOperator(objKey, insideItem, sections);
			}
		} else {
			return sections;
		}
	}

	public static queryRooms(query: any, check: CheckRoomQueryValidity): Promise<any[]> {
		return new Promise( (resolve, reject) => {
			try {
				let dataset: Dataset = JSON.parse(fs.readFileSync(`data/${check.queryDatasetId}.json`, "utf8"));
				let rooms: any[] = dataset.dataContent;
				let afterWhereFilterSections: any[] = this.handleWHERE(query["WHERE"],rooms);
				if (afterWhereFilterSections.length > 5000) {
					reject(new ResultTooLargeError());
				}
				let resultSections: any[];
				if ("TRANSFORMATIONS" in query) {
					let afterApply = TransformationRoomHelper.handleTransformations(query, afterWhereFilterSections);
					resultSections = RoomsOptionsHelper.handleApplyOptions(query["OPTIONS"],afterApply,check);
				} else {
					resultSections = RoomsOptionsHelper.handleOPTIONS(query["OPTIONS"],afterWhereFilterSections,check);
				}
				resolve(resultSections);
			} catch (error) {
				reject(InsightError);
			}
		});
	}
}
