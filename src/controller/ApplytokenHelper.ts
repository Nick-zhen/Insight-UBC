import Sections from "./Sections";
import Decimal from "decimal.js";
import {InsightError} from "./IInsightFacade";

export default class ApplytokenHelper {

	public static handleMAX(afterHandleGroup: Map<any, any[]>,setApplyKey: string,setApplyField: string): any{
		let returnMap: Map<any, Map<string, number>> = new Map<any, Map<string, number>>();
		let mapKeys: any[] = Array.from(afterHandleGroup.keys());
		for (let keySection of mapKeys) {
			let maxNum: number = -1;
			let mapVal: any = afterHandleGroup.get(keySection);
			for (let section of mapVal) {
				if (setApplyField === "avg") {
					if (section.avg > maxNum) {
						maxNum = section.avg;
					}
				} else if (setApplyField === "pass") {
					if (section.pass > maxNum) {
						maxNum = section.pass;
					}
				} else if (setApplyField === "fail") {
					if (section.fail > maxNum) {
						maxNum = section.fail;
					}
				} else if (setApplyField === "audit") {
					if (section.audit > maxNum) {
						maxNum = section.audit;
					}
				} else if (setApplyField === "year") {
					if (section.year > maxNum) {
						maxNum = section.year;
					}
				} else if (setApplyField === "lat") {
					if (section.lat > maxNum) {
						maxNum = section.lat;
					}
				} else if (setApplyField === "lon") {
					if (section.lon > maxNum) {
						maxNum = section.lon;
					}
				} else if (setApplyField === "seats") {
					if (section.seats > maxNum) {
						maxNum = section.seats;
					}
				}
			}
			let insideMap: Map<string, number> = new Map<string, number>();
			insideMap.set(setApplyKey, maxNum);
			returnMap.set(keySection, insideMap);
		}
		return returnMap;
	}

	public static handleMIN(afterHandleGroup: Map<any,any[]>,setApplyKey: string,setApplyField: string): any {
		let returnMap: Map<any, Map<string, number>> = new Map<any, Map<string, number>>();
		let mapKeys: any[] = Array.from(afterHandleGroup.keys());
		for (let keySection of mapKeys) {
			let minNum: number = 10000;
			let mapVal: any = afterHandleGroup.get(keySection);
			for (let section of mapVal) {
				if (setApplyField === "avg") {
					if (section.avg < minNum) {
						minNum = section.avg;
					}
				} else if (setApplyField === "pass") {
					if (section.pass < minNum) {
						minNum = section.pass;
					}
				} else if (setApplyField === "fail") {
					if (section.fail < minNum) {
						minNum = section.fail;
					}
				} else if (setApplyField === "audit") {
					if (section.audit < minNum) {
						minNum = section.audit;
					}
				} else if (setApplyField === "year") {
					if (section.year < minNum) {
						minNum = section.year;
					}
				} else if (setApplyField === "lat") {
					if (section.lat < minNum) {
						minNum = section.lat;
					}
				} else if (setApplyField === "lon") {
					if (section.lon < minNum) {
						minNum = section.lon;
					}
				} else if (setApplyField === "seats") {
					if (section.seats < minNum) {
						minNum = section.seats;
					}
				}
			}
			let insideMap: Map<string, number> = new Map<string, number>();
			insideMap.set(setApplyKey, minNum);
			returnMap.set(keySection, insideMap);
		}
		return returnMap;
	}

	public static handleAVG(afterHandleGroup: Map<any,any[]>,setApplyKey: string,setApplyField: string): any {
		let returnMap: Map<any, Map<string, number>> = new Map<any, Map<string, number>>();
		let mapKeys: any[] = Array.from(afterHandleGroup.keys());
		for (let keySection of mapKeys) {
			let avgNum: Decimal = new Decimal(0);
			let mapVal: any = afterHandleGroup.get(keySection);
			for (let section of mapVal) {
				if (setApplyField === "avg") {
					avgNum = Decimal.add(avgNum, new Decimal(section.avg).toNumber());
				} else if (setApplyField === "pass") {
					avgNum = Decimal.add(avgNum, new Decimal(section.pass));
				} else if (setApplyField === "fail") {
					avgNum = Decimal.add(avgNum, new Decimal(section.fail));
				} else if (setApplyField === "audit") {
					avgNum = Decimal.add(avgNum, new Decimal(section.audit));
				} else if (setApplyField === "year") {
					avgNum = Decimal.add(avgNum, new Decimal(section.year));
				} else if (setApplyField === "lat") {
					avgNum = Decimal.add(avgNum, new Decimal(section.lat));
				} else if (setApplyField === "lon") {
					avgNum = Decimal.add(avgNum, new Decimal(section.lon));
				} else if (setApplyField === "seats") {
					avgNum = Decimal.add(avgNum, new Decimal(section.seats));
				}
			}
			// let upperNum = avgNum.toNumber();
			let avg = avgNum.toNumber() / (mapVal.length);
			let res = Number(avg.toFixed(2));
			let insideMap: Map<string, number> = new Map<string, number>();
			insideMap.set(setApplyKey, res);
			returnMap.set(keySection, insideMap);
		}
		return returnMap;
	}

	public static countHelper(setApplyField: string, countSet: Set<any>, section: any, count: number): number {
		if (setApplyField === "avg") {
			if (!countSet.has(section.avg)) {
				++count;
				countSet.add(section.avg);
			}
		} else if (setApplyField === "pass") {
			if (!countSet.has(section.pass)) {
				++count;
				countSet.add(section.pass);
			}
		} else if (setApplyField === "fail") {
			if (!countSet.has(section.fail)) {
				++count;
				countSet.add(section.fail);
			}
		} else if (setApplyField === "audit") {
			if (!countSet.has(section.audit)) {
				++count;
				countSet.add(section.audit);
			}
		} else if (setApplyField === "year") {
			if (!countSet.has(section.year)) {
				++count;
				countSet.add(section.year);
			}
		} else if (setApplyField === "lat") {
			if (!countSet.has(section.lat)) {
				++count;
				countSet.add(section.lat);
			}
		} else if (setApplyField === "lon") {
			if (!countSet.has(section.lon)) {
				++count;
				countSet.add(section.lon);
			}
		} else if (setApplyField === "seats") {
			if (!countSet.has(section.seats)) {
				++count;
				countSet.add(section.seats);
			}
		}
		return count;
	}

	public static handleCOUNT(afterHandleGroup: Map<any,any[]>,setApplyKey: string
		,setApplyField: string): Map<any, Map<string, number>> {
		let returnMap: Map<any, Map<string, number>> = new Map<any, Map<string, number>>();
		let mapKeys: any[] = Array.from(afterHandleGroup.keys());
		for (let keySection of mapKeys) {
			let mapVal: any = afterHandleGroup.get(keySection);
			let count: number = 0;
			let countSet: Set<any> = new Set<any>();
			for (let section of mapVal) {
				count = this.countHelper(setApplyField,countSet,section, count);
			}
			let insideMap: Map<string, number> = new Map<string, number>();
			insideMap.set(setApplyKey, count);
			returnMap.set(keySection, insideMap);
		}
		return returnMap;
	}

	public static handleSUM(afterHandleGroup: Map<any,any[]>,setApplyKey: string,setApplyField: string): any {
		let returnMap: Map<any, Map<string, number>> = new Map<any, Map<string, number>>();
		let mapKeys: any[] = Array.from(afterHandleGroup.keys());
		for (let keySection of mapKeys) {
			let sumNum: number = 0;
			let mapVal: any = afterHandleGroup.get(keySection);
			for (let section of mapVal) {
				if (setApplyField === "avg") {
					sumNum += section.avg;
				} else if (setApplyField === "pass") {
					sumNum += section.pass;
				} else if (setApplyField === "fail") {
					sumNum += section.fail;
				} else if (setApplyField === "audit") {
					sumNum += section.audit;
				} else if (setApplyField === "year") {
					sumNum += section.year;
				} else if (setApplyField === "lat") {
					sumNum += section.lat;
				} else if (setApplyField === "lon") {
					sumNum += section.lon;
				} else if (setApplyField === "seats") {
					sumNum += section.seats;
				}
			}
			let insideMap: Map<string, number> = new Map<string, number>();
			insideMap.set(setApplyKey, Number(sumNum.toFixed(2)));
			returnMap.set(keySection, insideMap);
		}
		return returnMap;
	}

	public static mergeMaps(afterApplyMap: Map<any, Map<string, number>>
		, returnMap: Map<any, Map<string, number>>): Map<any, Map<string, number>> {
		let firstMapKeys: any[] = Array.from(afterApplyMap.keys());
		if (firstMapKeys.length === 0) {
			return returnMap;
		} else {
			for (let mapKey of firstMapKeys) {
				let firstMapVal: Map<string, number> | undefined = afterApplyMap.get(mapKey);
				let secondMapVal: Map<string, number> | undefined = returnMap.get(mapKey);
				if (firstMapVal === undefined || secondMapVal === undefined) {
					throw new InsightError("mergeMaps Problem!");
				}
				let [secondKey] = secondMapVal.keys();
				let [secondValue] = secondMapVal.values();
				firstMapVal.set(secondKey, secondValue);
			}
		}
		return afterApplyMap;
	}
}
