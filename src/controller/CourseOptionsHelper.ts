import Sections from "./Sections";
import {CheckValidityQueryHelper} from "./CheckValidityQueryHelper";
import HelperMethod from "./HelperMethod";
import InsightFacade from "./InsightFacade";
import {InsightError} from "./IInsightFacade";
import e from "express";

const mfield = ["avg", "pass", "fail", "audit", "year"];
const sfield = ["dept", "id", "instructor", "title", "uuid"];
export default class CourseOptionsHelper {
	// map courses sections helper
	public static mapSections(newSection: any, columnArr: string[], datasetId: string, section: any): any[] {
		// newSection = {};
		for (let elem of columnArr) {
			if (elem === "dept") {
				newSection[`${datasetId}_dept`] = section["dept"];
			} else if (elem === "id") {
				newSection[`${datasetId}_id`] = section["id"];
			} else if (elem === "instructor") {
				newSection[`${datasetId}_instructor`] = section["instructor"];
			} else if (elem === "title") {
				newSection[`${datasetId}_title`] = section["title"];
			} else if (elem === "uuid") {
				newSection[`${datasetId}_uuid`] = section["uuid"];
			} else if (elem === "avg") {
				newSection[`${datasetId}_avg`] = section["avg"];
			} else if (elem === "pass") {
				newSection[`${datasetId}_pass`] = section["pass"];
			} else if (elem === "fail") {
				newSection[`${datasetId}_fail`] = section["fail"];
			} else if (elem === "audit") {
				newSection[`${datasetId}_audit`] = section["audit"];
			} else if (elem === "year") {
				newSection[`${datasetId}_year`] = section["year"];
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

	public static numberOrderHelper(modifiedFieldInOrder: string, datasetId: string, newSections: any[]): any[] {
		return newSections.sort((a: any, b: any) => {
			if (modifiedFieldInOrder === "avg") {
				return (Number(a[`${datasetId}_avg`]) - Number(b[`${datasetId}_avg`]));
			} else if (modifiedFieldInOrder === "pass") {
				return (Number(a[`${datasetId}_pass`]) - Number(b[`${datasetId}_pass`]));
			} else if (modifiedFieldInOrder === "fail") {
				return (Number(a[`${datasetId}_fail`]) - Number(b[`${datasetId}_fail`]));
			} else if (modifiedFieldInOrder === "audit") {
				return (Number(a[`${datasetId}_audit`]) - Number(b[`${datasetId}_audit`]));
			} else if (modifiedFieldInOrder === "year") {
				return (Number(a[`${datasetId}_year`]) - Number(b[`${datasetId}_year`]));
			} else {
				return 0;
			}
		});
	}

	public static stringOrderHelper(modifiedFieldInOrder: string, datasetId: string, newSections: any[]): any[] {
		return newSections.sort((a: any, b: any) => {
			if (modifiedFieldInOrder === "dept") {
				if (a[`${datasetId}_dept`] < b[`${datasetId}_dept`]) {
					return -1;
				} else if (a[`${datasetId}_dept`] > b[`${datasetId}_dept`]) {
					return 1;
				} else {
					return 0;
				}
			} else if (modifiedFieldInOrder === "id") {
				if (a[`${datasetId}_id`] < b[`${datasetId}_id`]) {
					return -1;
				} else if (a[`${datasetId}_id`] > b[`${datasetId}_id`]) {
					return 1;
				} else {
					return 0;
				}
			} else if (modifiedFieldInOrder === "instructor") {
				if (a[`${datasetId}_instructor`] < b[`${datasetId}_instructor`]) {
					return -1;
				} else if (a[`${datasetId}_instructor`] > b[`${datasetId}_instructor`]) {
					return 1;
				} else {
					return 0;
				}
			} else if (modifiedFieldInOrder === "title") {
				if (a[`${datasetId}_title`] < b[`${datasetId}_title`]) {
					return -1;
				} else if (a[`${datasetId}_title`] > b[`${datasetId}_title`]) {
					return 1;
				} else {
					return 0;
				}
			} else if (modifiedFieldInOrder === "uuid") {
				// this.uuidOrderHelper(a, b);
				if (a[`${datasetId}_uuid`] < b[`${datasetId}_uuid`]) {
					return -1;
				} else if (a[`${datasetId}_uuid`] > b[`${datasetId}_uuid`]) {
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
			// for (let e of columnArr) {
			// 	if (e === "dept") {
			// 		newSection[`${datasetId}_dept`] = section["dept"];
			// 	} else if (e === "id") {
			// 		newSection[`${datasetId}_id`] = section["id"];
			// 	} else if (e === "instructor") {
			// 		newSection[`${datasetId}_instructor`] = section["instructor"];
			// 	} else if (e === "title") {
			// 		newSection[`${datasetId}_title`] = section["title"];
			// 	} else if (e === "uuid") {
			// 		newSection[`${datasetId}_uuid`] = section["uuid"];
			// 	} else if (e === "avg") {
			// 		newSection[`${datasetId}_avg`] = section["avg"];
			// 	} else if (e === "pass") {
			// 		newSection[`${datasetId}_pass`] = section["pass"];
			// 	} else if (e === "fail") {
			// 		newSection[`${datasetId}_fail`] = section["fail"];
			// 	} else if (e === "audit") {
			// 		newSection[`${datasetId}_audit`] = section["audit"];
			// 	} else if (e === "year") {
			// 		newSection[`${datasetId}_year`] = section["year"];
			// 	}
			// }
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
