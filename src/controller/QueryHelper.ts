import Sections from "./Sections";
import {CheckValidityQueryHelper} from "./CheckValidityQueryHelper";
import {WildcardHelper} from "./WildcardHelper";
import {InsightError, ResultTooLargeError} from "./IInsightFacade";
import HelperMethod from "./HelperMethod";
import {CheckCourseQueryValidity} from "./CheckCourseQueryValidity";
import Dataset from "./Dataset";
import * as fs from "fs-extra";
import TransformationsHelper from "./TransformationsHelper";
import CourseOptionsHelper from "./CourseOptionsHelper";
import {CheckRoomQueryValidity} from "./CheckRoomQueryValidity";
import Room from "./Room";
const mComparison = ["LT", "GT", "EQ"];
const sComparison = ["IS"];
const negation = ["NOT"];
const mfield = ["avg", "pass", "fail", "audit", "year"];
const sfield = ["dept", "id", "instructor", "title", "uuid"];
export default class QueryHelper {
	// union several sections arrays
	public static handleOrOperator(tempSections: any[][]): any[] {
		let helperArray: Sections[] = [];
		for (let element of tempSections) {
			// helperArray = helperArray.concat(element);
			let notExistSections: Sections[] = element.filter((section) => {
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
		let helperArray: Sections[] = tempSections[0];
		for (let i: number = 1; i < tempSections.length; i++) {
			helperArray = helperArray.filter((section) => {
				return tempSections[i].includes(section);
			});
		}
		return helperArray;
	}

	public static handleAndOrOperator(objKey: string, insideItem: any, sections: any[]) {
		let tempSections: Sections[][] = [];
		let resultSceions: Sections[] = [];
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
		let tempSections: Sections[] = [];
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

	// helper method just for fixing handleMComparisonOperator method too long
	public static MComparisonHelper(sections: any[], modifiedField: string, insideItemValue: number): any[] {
		let tempSections: any[] = [];
		tempSections = sections.filter((section) => {
			if (modifiedField === "avg") {
				return section.avg < insideItemValue;
			} else if (modifiedField === "pass") {
				return section.pass < insideItemValue;
			} else if (modifiedField === "fail") {
				return section.fail < insideItemValue;
			} else if (modifiedField === "audit") {
				return section.audit < insideItemValue;
			} else if (modifiedField === "year") {
				return section.year < insideItemValue;
			}
		});
		return tempSections;
	}

	// const mfield = ["avg", "pass", "fail", "audit", "year"];
	// handle filter number comparison
	public static handleMComparisonOperator(objKey: string, insideItem: any, sections: any[]): any[] {
		let tempSections: any[] = [];
		let modifiedField = HelperMethod.queryParseField(Object.keys(insideItem)[0]);
		if (typeof (Object.values(insideItem)[0]) !== "number") {
			throw new InsightError("should use Mcomparison");
		}
		let insideItemValue = Number(Object.values(insideItem)[0]);
		if (objKey === "LT") {
			tempSections = this.MComparisonHelper(sections, modifiedField, insideItemValue);
		} else if (objKey === "GT") {
			tempSections = sections.filter((section) => {
				if (modifiedField === "avg") {
					return section.avg > insideItemValue;
				} else if (modifiedField === "pass") {
					return section.pass > insideItemValue;
				} else if (modifiedField === "fail") {
					return section.fail > insideItemValue;
				} else if (modifiedField === "audit") {
					return section.audit > insideItemValue;
				} else if (modifiedField === "year") {
					return section.year > insideItemValue;
				}
			});
		} else if (objKey === "EQ") {
			tempSections = sections.filter((section) => {
				if (modifiedField === "avg") {
					return section.avg === insideItemValue;
				} else if (modifiedField === "pass") {
					return section.pass === insideItemValue;
				} else if (modifiedField === "fail") {
					return section.fail === insideItemValue;
				} else if (modifiedField === "audit") {
					return section.audit === insideItemValue;
				} else if (modifiedField === "year") {
					return section.year === insideItemValue;
				}
			});
		}
		return tempSections;
	}

	// const sfield = ["dept", "id", "instructor", "title", "uuid"];
	// handle filter string comparison
	public static handleSComparisonOperator(insideItem: any, sections: any[]): any[] {
		let tempSections: Sections[] = [];
		let modifiedField = HelperMethod.queryParseField(Object.keys(insideItem)[0]);
		if (typeof (Object.values(insideItem)[0]) !== "string") {
			throw new InsightError("should use scomparison");
		}
		let insideItemValue = String(Object.values(insideItem)[0]);
		if (insideItemValue.includes("*")) {
			tempSections = WildcardHelper.handleStar(modifiedField, insideItemValue, sections);
		} else {
			tempSections = sections.filter((section) => {
				if (modifiedField === "dept") {
					return section.dept === insideItemValue;
				} else if (modifiedField === "id") {
					return section.id === insideItemValue;
				} else if (modifiedField === "instructor") {
					return section.instructor === insideItemValue;
				} else if (modifiedField === "title") {
					return section.title === insideItemValue;
				} else if (modifiedField === "uuid") {
					return section.uuid === insideItemValue;
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

	public static queryCourses(query: any, check: CheckCourseQueryValidity, datasets: Dataset[]): Promise<any[]> {
		return new Promise( (resolve, reject) => {
			try {
				// let dataset: Dataset = JSON.parse(fs.readFileSync(`data/${check.queryDatasetId}.json`, "utf8"));
				let dataset: Dataset[] = datasets.filter((set) => {
					return set.id === check.queryDatasetId;
				});
				let sections: Sections[] = dataset[0].dataContent;
				let afterWhereFilterSections: any[] = this.handleWHERE(query["WHERE"],sections);
				// if (afterWhereFilterSections.length > 5000) {
				// 	reject(new ResultTooLargeError());
				// }
				let resultSections: any[];
				if ("TRANSFORMATIONS" in query) {
					let afterApply = TransformationsHelper.handleTransformations(query, afterWhereFilterSections);
					if (Array.from(afterApply.keys()).length > 5000) {
						reject(new ResultTooLargeError());
					}
					resultSections = CourseOptionsHelper.handleApplyOptions(query["OPTIONS"],afterApply,check);
				} else {
					if (afterWhereFilterSections.length > 5000) {
						reject(new ResultTooLargeError());
					}
					resultSections = CourseOptionsHelper.handleOPTIONS(query["OPTIONS"],afterWhereFilterSections,check);
				}
				resolve(resultSections);
			} catch (error) {
				// console.log(error);
				reject(new InsightError());
			}
		});
	}

}
