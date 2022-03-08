"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs-extra"));
const IInsightFacade_1 = require("./IInsightFacade");
const HelperMethod_1 = __importDefault(require("./HelperMethod"));
const WildcardHelper_1 = require("./WildcardHelper");
const RoomsOptionsHelper_1 = __importDefault(require("./RoomsOptionsHelper"));
const TransformationRoomHelper_1 = __importDefault(require("./TransformationRoomHelper"));
const mComparison = ["LT", "GT", "EQ"];
const sComparison = ["IS"];
const negation = ["NOT"];
const mfield = ["lat", "lon", "seats"];
const sfield = ["fullname", "shortname", "number", "name", "address", "type", "furniture", "href"];
class QueryRoomsHelper {
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
    static handleMComparisonOperator(objKey, insideItem, sections) {
        let tempSections = [];
        let modifiedField = HelperMethod_1.default.queryParseField(Object.keys(insideItem)[0]);
        if (typeof (Object.values(insideItem)[0]) !== "number") {
            throw new IInsightFacade_1.InsightError("should use Mcomparison");
        }
        let insideItemValue = Number(Object.values(insideItem)[0]);
        if (objKey === "LT") {
            tempSections = sections.filter((section) => {
                if (modifiedField === "lat") {
                    return section.lat < insideItemValue;
                }
                else if (modifiedField === "lon") {
                    return section.lon < insideItemValue;
                }
                else if (modifiedField === "seats") {
                    return section.seats < insideItemValue;
                }
            });
        }
        else if (objKey === "GT") {
            tempSections = sections.filter((section) => {
                if (modifiedField === "lat") {
                    return section.lat > insideItemValue;
                }
                else if (modifiedField === "lon") {
                    return section.lon > insideItemValue;
                }
                else if (modifiedField === "seats") {
                    return section.seats > insideItemValue;
                }
            });
        }
        else if (objKey === "EQ") {
            tempSections = sections.filter((section) => {
                if (modifiedField === "lat") {
                    return section.lat === insideItemValue;
                }
                else if (modifiedField === "lon") {
                    return section.lon === insideItemValue;
                }
                else if (modifiedField === "seats") {
                    return section.seats === insideItemValue;
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
                if (modifiedField === "fullname") {
                    return section.fullname === insideItemValue;
                }
                else if (modifiedField === "shortname") {
                    return section.shortname === insideItemValue;
                }
                else if (modifiedField === "number") {
                    return section.number === insideItemValue;
                }
                else if (modifiedField === "name") {
                    return section.name === insideItemValue;
                }
                else if (modifiedField === "address") {
                    return section.address === insideItemValue;
                }
                else if (modifiedField === "type") {
                    return section.type === insideItemValue;
                }
                else if (modifiedField === "furniture") {
                    return section.furniture === insideItemValue;
                }
                else if (modifiedField === "href") {
                    return section.href === insideItemValue;
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
    }
    static queryRooms(query, check) {
        return new Promise((resolve, reject) => {
            try {
                let dataset = JSON.parse(fs.readFileSync(`data/${check.queryDatasetId}.json`, "utf8"));
                let rooms = dataset.dataContent;
                let afterWhereFilterSections = this.handleWHERE(query["WHERE"], rooms);
                if (afterWhereFilterSections.length > 5000) {
                    reject(new IInsightFacade_1.ResultTooLargeError());
                }
                let resultSections;
                if ("TRANSFORMATIONS" in query) {
                    let afterApply = TransformationRoomHelper_1.default.handleTransformations(query, afterWhereFilterSections);
                    resultSections = RoomsOptionsHelper_1.default.handleApplyOptions(query["OPTIONS"], afterApply, check);
                }
                else {
                    resultSections = RoomsOptionsHelper_1.default.handleOPTIONS(query["OPTIONS"], afterWhereFilterSections, check);
                }
                resolve(resultSections);
            }
            catch (error) {
                reject(IInsightFacade_1.InsightError);
            }
        });
    }
}
exports.default = QueryRoomsHelper;
//# sourceMappingURL=QueryRoomsHelper.js.map