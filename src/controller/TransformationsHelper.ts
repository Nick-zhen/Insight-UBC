import Sections from "./Sections";
import HelperMethod from "./HelperMethod";
import {InsightError} from "./IInsightFacade";
import ApplytokenHelper from "./ApplytokenHelper";

const  totalField = ["avg", "pass", "fail", "audit", "year", "lat", "lon", "seats", "dept", "id","instructor"
	, "title", "uuid", "fullname", "shortname", "number", "name", "address", "type", "furniture", "href"];

const  APPLYTOKEN = ["MAX", "MIN", "AVG", "COUNT", "SUM"];
const  NumAPPLYTOKEN = ["MAX", "MIN", "AVG", "SUM"];
const  CountAPPLYTOKEN = ["COUNT"];
const  mfield: string[] = ["avg", "pass", "fail", "audit", "year", "lat", "lon", "seats"];
const  sfield = ["dept", "id", "instructor", "title", "uuid", "fullname", "shortname", "number", "name"
	, "address", "type", "furniture", "href"];
export default class TransformationsHelper {
	// return Set <[overallAvg, AVG, avg]> ...
	public static getApplyKeys(apply: any[]): Set<string[]> {
		let applyKeys: Set<string[]> = new Set<string[]>();
		for (let elem of apply) {
			let elemVal: any = Object.values(elem)[0];
			let applyToken: string = Object.keys(elemVal)[0];
			let key: string = String(Object.values(elemVal)[0]);
			key = HelperMethod.queryParseField(key);
			applyKeys.add([Object.keys(elem)[0], applyToken, key]);
		}
		return applyKeys;
	}

	// TOdo :implement rooms
	public static isGroupValueSame(mapKey: Sections,section: Sections,modifiedFieldArr: string[]): boolean {
		let check: boolean = false;
		for (let group of modifiedFieldArr) {
			if (mfield.includes(group)) {
				if (group === "avg") {
					check = (mapKey.avg === section.avg);
				} else if (group === "pass") {
					check = (mapKey.pass === section.pass);
				} else if (group === "fail") {
					check = (mapKey.fail === section.fail);
				} else if (group === "audit") {
					check = (mapKey.audit === section.audit);
				} else if (group === "year") {
					check = (mapKey.year === section.year);
				}
				// else if (group === "lat") {
				// 	check = (mapKey.lat === section.lat);
				// } else if (group === "lon") {
				// 	check = (mapKey.lon === section.lon);
				// } else if (group === "seats") {
				// 	check = (mapKey.seats === section.seats);
				// }
			} else if (sfield.includes(group)) {
				if (group === "dept") {
					check = (mapKey.dept === section.dept);
				} else if (group === "id") {
					check = (mapKey.id === section.id);
				} else if (group === "instructor") {
					check = (mapKey.instructor === section.instructor);
				} else if (group === "title") {
					check = (mapKey.title === section.title);
				} else if (group === "uuid") {
					check = (mapKey.uuid === section.uuid);
				}
				// else if (group === "fullname") {
				// 	check = (mapKey.fullname === section.fullname);
				// } else if (group === "shortname") {
				// 	check = (mapKey.shortname === section.shortname);
				// } else if (group === "number") {
				// 	check = (mapKey.number === section.number);
				// } else if (group === "name") {
				// 	check = (mapKey.name === section.name);
				// } else if (group === "address") {
				// 	check = (mapKey.address === section.address);
				// } else if (group === "type") {
				// 	check = (mapKey.type === section.type);
				// } else if (group === "furniture") {
				// 	check = (mapKey.furniture === section.furniture);
				// } else if (group === "href") {
				// 	check = (mapKey.href === section.href);
				// }
			}
			if (!check) {
				return false;
			}
		}
		return check;
	}

	public static getMapKeys(mapSections: Map<Sections, Sections[]>, section: Sections,FieldArr: string[]): any {
		let mapKeys: Sections[] = Array.from(mapSections.keys());
		for (let mapKey of mapKeys) {
			if (this.isGroupValueSame(mapKey, section, FieldArr)) {
				return mapKey;
			}
		}
	}

	public static isSectionExist(mapSections: Map<Sections,Sections[]>,section: Sections,FieldArr: string[]): boolean {
		let mapKeys: any[] = Array.from(mapSections.keys());
		for (let mapKey of mapKeys) {
			if (this.isGroupValueSame(mapKey, section, FieldArr)) {
				return true;
			}
		}
		return false;
	}

	public static handleGroup(group: string[], sections: any[]):  Map<any, any[]> {
		let mapSections: Map<any, any[]> = new Map<any, any[]>();
		let modifiedFieldArr: string[] = [];
		for (let elem of group) {
			modifiedFieldArr.push(HelperMethod.queryParseField(elem));
		}
		for (let section of sections) {
			if (!this.isSectionExist(mapSections, section, modifiedFieldArr)) {
				let mapVal: any[] = [];
				mapVal.push(section);
				mapSections.set(section,mapVal);
			} else { // already exist, so add apply attributes
				let mapKey: any = this.getMapKeys(mapSections, section, modifiedFieldArr);
				let mapValAddr: any = mapSections.get(mapKey);
				mapValAddr.push(section);
			}
		}
		return mapSections;
	}

	public static handleApply(afterHandleGroup: Map<Sections, Sections[]>,applyKeys: Set<string[]>) {
		let applySets: string[][] = Array.from(applyKeys);
		let afterApplyMap: Map<any, Map<string, number>> = new Map<any, Map<string, number>>();
		for (let applySet of applySets) { // applySetKey === string[overallAvg, AVG, avg]
			let setApplyKey: any = applySet[0]; // overallAvg
			let setApplyToken: any = applySet[1];  // AVG
			let setApplyField: any = applySet[2]; // avg
			let returnMap: Map<any, Map<string, number>>;
			if (setApplyToken === "MAX") {
				returnMap = ApplytokenHelper.handleMAX(afterHandleGroup, setApplyKey, setApplyField);
			} else if (setApplyToken === "MIN") {
				returnMap = ApplytokenHelper.handleMIN(afterHandleGroup, setApplyKey, setApplyField);
			} else if (setApplyToken === "AVG") {
				returnMap = ApplytokenHelper.handleAVG(afterHandleGroup, setApplyKey, setApplyField);
			} else if (setApplyToken === "COUNT") {
				returnMap = ApplytokenHelper.handleCOUNT(afterHandleGroup, setApplyKey, setApplyField);
			} else if (setApplyToken === "SUM") {
				returnMap = ApplytokenHelper.handleSUM(afterHandleGroup, setApplyKey, setApplyField);
			} else  {
				throw new InsightError();
			}
			afterApplyMap = ApplytokenHelper.mergeMaps(afterApplyMap, returnMap);
		}
		return afterApplyMap;
	}

	public static handleTransformations(query: any, sections: any[]): Map<any, Map<string, number>> {
		let transformations: any = query["TRANSFORMATIONS"];
		let group: string[] = transformations["GROUP"]; // "courses_id", "courses_title"
		let apply: any[] = transformations["APPLY"];
		// return Map<Section sample, same apply value section array>
		let afterHandleGroup:  Map<any, any[]> = this.handleGroup(group, sections);

		let applyKeys: Set<string[]> = this.getApplyKeys(apply); // eg. <overallAvg, AVG, avg>  <maxAvg, MAX, avg>
		// afterApplyMap: Map<object, Map<overallAvg, 95>>
		let afterApplyMap: Map<any, Map<string, number>> = this.handleApply(afterHandleGroup, applyKeys);
		return afterApplyMap;
	}

}
