"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WildcardHelper_1 = require("./WildcardHelper");
const IInsightFacade_1 = require("./IInsightFacade");
const HelperMethod_1 = __importDefault(require("./HelperMethod"));
const TransformationsHelper_1 = __importDefault(require("./TransformationsHelper"));
const CourseOptionsHelper_1 = __importDefault(require("./CourseOptionsHelper"));
const mComparison = ["LT", "GT", "EQ"];
const sComparison = ["IS"];
const negation = ["NOT"];
const mfield = ["avg", "pass", "fail", "audit", "year"];
const sfield = ["dept", "id", "instructor", "title", "uuid"];
class QueryHelper {
    static handleOrOperator(tempSections) {
        let helperArray = [];
        for (let element of tempSections) {
            let notExistSections = element.filter((section) => {
                return !helperArray.includes(section);
            });
            helperArray = helperArray.concat(notExistSections);
        }
        return helperArray;
    }
    static handleAndOperator(tempSections) {
        let helperArray = tempSections[0];
        for (let i = 1; i < tempSections.length; i++) {
            helperArray = helperArray.filter((section) => {
                return tempSections[i].includes(section);
            });
        }
        return helperArray;
    }
    static handleAndOrOperator(objKey, insideItem, sections) {
        let tempSections = [];
        let resultSceions = [];
        if (objKey === "AND") {
            let i = 0;
            for (let insideArrayItem of insideItem) {
                tempSections[i] = this.handleWHERE(insideArrayItem, sections);
                i++;
            }
            resultSceions = this.handleAndOperator(tempSections);
        }
        else if (objKey === "OR") {
            let i = 0;
            for (let insideArrayItem of insideItem) {
                tempSections[i] = this.handleWHERE(insideArrayItem, sections);
                i++;
            }
            resultSceions = this.handleOrOperator(tempSections);
        }
        return resultSceions;
    }
    static handleNegationOperator(objKey, insideItem, sections) {
        let tempSections = [];
        tempSections = this.handleWHERE(insideItem, sections);
        tempSections = sections.filter((section) => {
            return !tempSections.includes(section);
        });
        return tempSections;
    }
    static MComparisonHelper(sections, modifiedField, insideItemValue) {
        let tempSections = [];
        tempSections = sections.filter((section) => {
            if (modifiedField === "avg") {
                return section.avg < insideItemValue;
            }
            else if (modifiedField === "pass") {
                return section.pass < insideItemValue;
            }
            else if (modifiedField === "fail") {
                return section.fail < insideItemValue;
            }
            else if (modifiedField === "audit") {
                return section.audit < insideItemValue;
            }
            else if (modifiedField === "year") {
                return section.year < insideItemValue;
            }
        });
        return tempSections;
    }
    static handleMComparisonOperator(objKey, insideItem, sections) {
        let tempSections = [];
        let modifiedField = HelperMethod_1.default.queryParseField(Object.keys(insideItem)[0]);
        if (typeof (Object.values(insideItem)[0]) !== "number") {
            throw new IInsightFacade_1.InsightError("should use Mcomparison");
        }
        let insideItemValue = Number(Object.values(insideItem)[0]);
        if (objKey === "LT") {
            tempSections = this.MComparisonHelper(sections, modifiedField, insideItemValue);
        }
        else if (objKey === "GT") {
            tempSections = sections.filter((section) => {
                if (modifiedField === "avg") {
                    return section.avg > insideItemValue;
                }
                else if (modifiedField === "pass") {
                    return section.pass > insideItemValue;
                }
                else if (modifiedField === "fail") {
                    return section.fail > insideItemValue;
                }
                else if (modifiedField === "audit") {
                    return section.audit > insideItemValue;
                }
                else if (modifiedField === "year") {
                    return section.year > insideItemValue;
                }
            });
        }
        else if (objKey === "EQ") {
            tempSections = sections.filter((section) => {
                if (modifiedField === "avg") {
                    return section.avg === insideItemValue;
                }
                else if (modifiedField === "pass") {
                    return section.pass === insideItemValue;
                }
                else if (modifiedField === "fail") {
                    return section.fail === insideItemValue;
                }
                else if (modifiedField === "audit") {
                    return section.audit === insideItemValue;
                }
                else if (modifiedField === "year") {
                    return section.year === insideItemValue;
                }
            });
        }
        return tempSections;
    }
    static handleSComparisonOperator(insideItem, sections) {
        let tempSections = [];
        let modifiedField = HelperMethod_1.default.queryParseField(Object.keys(insideItem)[0]);
        if (typeof (Object.values(insideItem)[0]) !== "string") {
            throw new IInsightFacade_1.InsightError("should use scomparison");
        }
        let insideItemValue = String(Object.values(insideItem)[0]);
        if (insideItemValue.includes("*")) {
            tempSections = WildcardHelper_1.WildcardHelper.handleStar(modifiedField, insideItemValue, sections);
        }
        else {
            tempSections = sections.filter((section) => {
                if (modifiedField === "dept") {
                    return section.dept === insideItemValue;
                }
                else if (modifiedField === "id") {
                    return section.id === insideItemValue;
                }
                else if (modifiedField === "instructor") {
                    return section.instructor === insideItemValue;
                }
                else if (modifiedField === "title") {
                    return section.title === insideItemValue;
                }
                else if (modifiedField === "uuid") {
                    return section.uuid === insideItemValue;
                }
            });
        }
        return tempSections;
    }
    static handleWHERE(where, sections) {
        let insideItem = where[Object.keys(where)[0]];
        let objKey = Object.keys(where)[0];
        if (Array.isArray(insideItem)) {
            return this.handleAndOrOperator(objKey, insideItem, sections);
        }
        else if (typeof insideItem === "object") {
            if (mComparison.includes(objKey)) {
                return this.handleMComparisonOperator(objKey, insideItem, sections);
            }
            else if (sComparison.includes(objKey)) {
                return this.handleSComparisonOperator(insideItem, sections);
            }
            else if (negation.includes(objKey)) {
                return this.handleNegationOperator(objKey, insideItem, sections);
            }
        }
        else {
            return sections;
        }
    }
    static queryCourses(query, check, datasets) {
        return new Promise((resolve, reject) => {
            try {
                let dataset = datasets.filter((set) => {
                    return set.id === check.queryDatasetId;
                });
                let sections = dataset[0].dataContent;
                let afterWhereFilterSections = this.handleWHERE(query["WHERE"], sections);
                let resultSections;
                if ("TRANSFORMATIONS" in query) {
                    let afterApply = TransformationsHelper_1.default.handleTransformations(query, afterWhereFilterSections);
                    if (Array.from(afterApply.keys()).length > 5000) {
                        reject(new IInsightFacade_1.ResultTooLargeError());
                    }
                    resultSections = CourseOptionsHelper_1.default.handleApplyOptions(query["OPTIONS"], afterApply, check);
                }
                else {
                    if (afterWhereFilterSections.length > 5000) {
                        reject(new IInsightFacade_1.ResultTooLargeError());
                    }
                    resultSections = CourseOptionsHelper_1.default.handleOPTIONS(query["OPTIONS"], afterWhereFilterSections, check);
                }
                resolve(resultSections);
            }
            catch (error) {
                reject(new IInsightFacade_1.InsightError());
            }
        });
    }
}
exports.default = QueryHelper;
//# sourceMappingURL=QueryHelper.js.map