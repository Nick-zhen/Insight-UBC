import Sections from "./Sections";
import {CheckValidityQueryHelper} from "./CheckValidityQueryHelper";
import HelperMethod from "./HelperMethod";
import InsightFacade from "./InsightFacade";
import {InsightError} from "./IInsightFacade";
import e from "express";

const mfield = ["lat", "lon", "seats"];
const sfield = ["fullname", "shortname", "number", "name", "address", "type", "furniture", "href"];
export default class RoomsOptionsHelper {
	// map rooms helper
	public static mapSections(newSection: any, columnArr: string[], datasetId: string, section: any): any[] {
		// newSection = {};
		for (let elem of columnArr) {
			if (elem === "lat") {
				newSection[`${datasetId}_lat`] = section["lat"];
			} else if (elem === "lon") {
				newSection[`${datasetId}_lon`] = section["lon"];
			} else if (elem === "seats") {
				newSection[`${datasetId}_seats`] = section["seats"];
			} else if (elem === "fullname") {
				newSection[`${datasetId}_fullname`] = section["fullname"];
			} else if (elem === "shortname") {
				newSection[`${datasetId}_shortname`] = section["shortname"];
			} else if (elem === "number") {
				newSection[`${datasetId}_number`] = section["number"];
			} else if (elem === "name") {
				newSection[`${datasetId}_name`] = section["name"];
			} else if (elem === "address") {
				newSection[`${datasetId}_address`] = section["address"];
			} else if (elem === "type") {
				newSection[`${datasetId}_type`] = section["type"];
			} else if (elem === "furniture") {
				newSection[`${datasetId}_furniture`] = section["furniture"];
			} else if (elem === "href") {
				newSection[`${datasetId}_href`] = section["href"];
			}
		}
		return newSection;
	}

	public static orderHelper(order: any,newSections: any[],datasetId: string): any[] {
		if (typeof order === "string") {
			return this.singleOrderHelper(order, newSections, datasetId);
		} else if (typeof order === "object") {
			return this.objectOrderHelper(order, newSections, datasetId);
		} else {
			throw new InsightError("problem in ORDER !");
		}
	}

	public static objectOrderHelper(order: any, newSections: any[], datasetId: string): any[] {
		let orderVal: any[] = Object.values(order);
		let dir: string = orderVal[0]; // "UP" or "DOWN"
		let keys: string[] = orderVal[1]; // Array["courses_tittle", "courses_id"]
		if (dir === "UP") { // default is up order
			for (let i: number = keys.length - 1; i >= 0; --i) {
				newSections = this.singleOrderHelper(keys[i], newSections, datasetId);
			}
		} else {
			for (let i: number = keys.length - 1; i >= 0; --i) {
				newSections = this.singleOrderHelper(keys[i], newSections, datasetId);
			}
			newSections = newSections.reverse();
		}
		return newSections;
	}

	public static singleOrderHelper(orderKey: string, newSections: any[], datasetId: string): any[] {
		let modifiedFieldInOrder = HelperMethod.queryParseField(orderKey); // field (eg. avg)
		if (mfield.includes(modifiedFieldInOrder)) {
			return this.numberOrderHelper(modifiedFieldInOrder, datasetId, newSections);
		} else if (sfield.includes(modifiedFieldInOrder)) {
			return this.stringOrderHelper(modifiedFieldInOrder, datasetId, newSections);
		} else {
			throw new InsightError("problem in singleOrderHelper");
		}
	}

	// const mfield = ["lat", "lon", "seats"];
	public static numberOrderHelper(modifiedFieldInOrder: string, datasetId: string, newSections: any[]): any[] {
		return newSections.sort((a: any, b: any) => {
			if (modifiedFieldInOrder === "lat") {
				return (Number(a[`${datasetId}_lat`]) - Number(b[`${datasetId}_lat`]));
			} else if (modifiedFieldInOrder === "lon") {
				return (Number(a[`${datasetId}_lon`]) - Number(b[`${datasetId}_lon`]));
			} else if (modifiedFieldInOrder === "seats") {
				return (Number(a[`${datasetId}_seats`]) - Number(b[`${datasetId}_seats`]));
			} else {
				return 0;
			}
		});
	}

	public static fullnameOrderHelperH(modifiedFieldInOrder: string, a: any, b: any, datasetId: string): number {
		if (a[`${datasetId}_fullname`] < b[`${datasetId}_fullname`]) {
			return -1;
		} else if (a[`${datasetId}_fullname`] > b[`${datasetId}_fullname`]) {
			return 1;
		} else {
			return 0;
		}
	}

	public static shortnameOrderHelperH(modifiedFieldInOrder: string, a: any, b: any, datasetId: string): number {
		if (a[`${datasetId}_shortname`] < b[`${datasetId}_shortname`]) {
			return -1;
		} else if (a[`${datasetId}_shortname`] > b[`${datasetId}_shortname`]) {
			return 1;
		} else {
			return 0;
		}
	}

	public static numberOrderHelperH(modifiedFieldInOrder: string, a: any, b: any, datasetId: string): number {
		if (a[`${datasetId}_number`] < b[`${datasetId}_number`]) {
			return -1;
		} else if (a[`${datasetId}_number`] > b[`${datasetId}_number`]) {
			return 1;
		} else {
			return 0;
		}
	}

	public static nameOrderHelperH(modifiedFieldInOrder: string, a: any, b: any, datasetId: string): number {
		if (a[`${datasetId}_name`] < b[`${datasetId}_name`]) {
			return -1;
		} else if (a[`${datasetId}_name`] > b[`${datasetId}_name`]) {
			return 1;
		} else {
			return 0;
		}
	}

	// const sfield = ["fullname", "shortname", "number", "name", "address", "type", "furniture", "href"];
	public static stringOrderHelper(modifiedFieldInOrder: string, datasetId: string, newSections: any[]): any[] {
		return newSections.sort((a: any, b: any) => {
			if (modifiedFieldInOrder === "fullname") {
				return this.fullnameOrderHelperH(modifiedFieldInOrder,a,b,datasetId);
			} else if (modifiedFieldInOrder === "shortname") {
				return this.shortnameOrderHelperH(modifiedFieldInOrder,a,b,datasetId);
			} else if (modifiedFieldInOrder === "number") {
				return this.numberOrderHelperH(modifiedFieldInOrder,a,b,datasetId);
			} else if (modifiedFieldInOrder === "name") {
				return this.nameOrderHelperH(modifiedFieldInOrder,a,b,datasetId);
			} else if (modifiedFieldInOrder === "address") {
				if (a[`${datasetId}_address`] < b[`${datasetId}_address`]) {
					return -1;
				} else if (a[`${datasetId}_address`] > b[`${datasetId}_address`]) {
					return 1;
				} else {
					return 0;
				}
			} else if (modifiedFieldInOrder === "type") {
				if (a[`${datasetId}_type`] < b[`${datasetId}_type`]) {
					return -1;
				} else if (a[`${datasetId}_type`] > b[`${datasetId}_type`]) {
					return 1;
				} else {
					return 0;
				}
			} else if (modifiedFieldInOrder === "furniture") {
				if (a[`${datasetId}_furniture`] < b[`${datasetId}_furniture`]) {
					return -1;
				} else if (a[`${datasetId}_furniture`] > b[`${datasetId}_furniture`]) {
					return 1;
				} else {
					return 0;
				}
			}  else if (modifiedFieldInOrder === "href") {
				if (a[`${datasetId}_href`] < b[`${datasetId}_href`]) {
					return -1;
				} else if (a[`${datasetId}_href`] > b[`${datasetId}_href`]) {
					return 1;
				} else {
					return 0;
				}
			} else {
				return 0;
			}
		});
	}

	// perform query OPTIONS without transformations
	public static handleOPTIONS(options: any, sections: Sections[], check: CheckValidityQueryHelper): any[] {
		let columnArr: string[] = [];
		let datasetId: string = check.queryDatasetId;
		for (const element of options["COLUMNS"]) {
			let modifiedField = HelperMethod.queryParseField(element);
			columnArr.push(modifiedField);
		}
		let newSections: any[] = sections.map((section) => {
			let newSection: any = {};
			this.mapSections(newSection, columnArr, datasetId, section);
			return newSection;
		});
		if ("ORDER" in options) {
			let order = options["ORDER"];
			newSections = this.orderHelper(order, newSections, datasetId);
		}
		return newSections;
	}

	public static handleApplyOptions(options: any, afterApply: Map<any, Map<string, number>>
		,check: CheckValidityQueryHelper): any[] {
		let columnArr: string[] = []; // "id", "title"
		let columnApplyArr: string[] = []; // "overallAvg"
		let datasetId: string = check.queryDatasetId;
		for (let element of options["COLUMNS"]) {
			if (element.includes("_")) {
				let modifiedField = HelperMethod.queryParseField(element);
				columnArr.push(modifiedField);
			} else {
				columnApplyArr.push(element);
			}
		}
		let mapKeys: any[] = Array.from(afterApply.keys());
		let newSections: any[] = mapKeys.map((section) => {
			let newSection: any = {};
			this.mapSections(newSection, columnArr, datasetId, section);
			let insideMap: Map<string, number> | undefined = afterApply.get(section);
			for (let elem of columnApplyArr) {
				newSection[`${elem}`] = insideMap?.get(elem);
			}
			return newSection;
		});
		if ("ORDER" in options) {
			let element = options["ORDER"];
			// let modifiedFieldInOrder = HelperMethod.queryParseField(element); // field (eg. avg)
			newSections = this.transOrderHelper(element, newSections, datasetId);
		}
		return newSections;
	}

	public static transOrderHelper(order: any,newSections: any[],datasetId: string): any[] {
		if (typeof order === "string") {
			return this.singleTransOrderHelper(order, newSections, datasetId);
		} else if (typeof order === "object") {
			return this.objectTranOrderHelper(order, newSections, datasetId);
		} else {
			throw new InsightError("problem in ORDER !");
		}
	}

	public static singleTransOrderHelper(orderKey: string, newSections: any[], datasetId: string): any[] {
		if (orderKey.includes("_")) {
			let modifiedFieldInOrder = HelperMethod.queryParseField(orderKey); // field (eg. avg)
			if (mfield.includes(modifiedFieldInOrder)) {
				return this.numberOrderHelper(modifiedFieldInOrder, datasetId, newSections);
			} else if (sfield.includes(modifiedFieldInOrder)) {
				return this.stringOrderHelper(modifiedFieldInOrder, datasetId, newSections);
			} else {
				throw new InsightError("problem in singleOrderHelper");
			}
		} else {
			return this.applyNumberOrderHelper(orderKey, newSections);
		}
	}

	public static applyNumberOrderHelper(orderKey: string, newSections: any[]): any[] {
		return newSections.sort((a: any, b: any) => {
			return (Number(a[`${orderKey}`]) - Number(b[`${orderKey}`]));
		});
	}

	public static objectTranOrderHelper(order: string, newSections: any[], datasetId: string): any[] {
		let orderVal: any[] = Object.values(order);
		let dir: string = orderVal[0]; // "UP" or "DOWN"
		let keys: string[] = orderVal[1]; // Array["overallAvg", "maxAvg", "courses_id"]
		if (dir === "UP") { // default is up order
			for (let i: number = keys.length - 1; i >= 0; --i) {
				if (keys[i].includes("_")) {
					newSections = this.singleOrderHelper(keys[i], newSections, datasetId);
				} else {
					newSections = this.applyNumberOrderHelper(keys[i], newSections);
				}
			}
		} else {
			for (let i: number = keys.length - 1; i >= 0; --i) {
				if (keys[i].includes("_")) {
					newSections = this.singleOrderHelper(keys[i], newSections, datasetId);
				} else {
					newSections = this.applyNumberOrderHelper(keys[i], newSections);
				}
			}
			newSections = newSections.reverse();
		}
		return newSections;
	}
}
