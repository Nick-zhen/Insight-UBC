"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HelperMethod_1 = __importDefault(require("./HelperMethod"));
const IInsightFacade_1 = require("./IInsightFacade");
const ApplytokenHelper_1 = __importDefault(require("./ApplytokenHelper"));
const totalField = ["avg", "pass", "fail", "audit", "year", "lat", "lon", "seats", "dept", "id", "instructor",
    "title", "uuid", "fullname", "shortname", "number", "name", "address", "type", "furniture", "href"];
const APPLYTOKEN = ["MAX", "MIN", "AVG", "COUNT", "SUM"];
const NumAPPLYTOKEN = ["MAX", "MIN", "AVG", "SUM"];
const CountAPPLYTOKEN = ["COUNT"];
const mfield = ["avg", "pass", "fail", "audit", "year", "lat", "lon", "seats"];
const sfield = ["dept", "id", "instructor", "title", "uuid", "fullname", "shortname", "number", "name",
    "address", "type", "furniture", "href"];
class TransformationsHelper {
    static getApplyKeys(apply) {
        let applyKeys = new Set();
        for (let elem of apply) {
            let elemVal = Object.values(elem)[0];
            let applyToken = Object.keys(elemVal)[0];
            let key = String(Object.values(elemVal)[0]);
            key = HelperMethod_1.default.queryParseField(key);
            applyKeys.add([Object.keys(elem)[0], applyToken, key]);
        }
        return applyKeys;
    }
    static isGroupValueSame(mapKey, section, modifiedFieldArr) {
        let check = false;
        for (let group of modifiedFieldArr) {
            if (mfield.includes(group)) {
                if (group === "avg") {
                    check = (mapKey.avg === section.avg);
                }
                else if (group === "pass") {
                    check = (mapKey.pass === section.pass);
                }
                else if (group === "fail") {
                    check = (mapKey.fail === section.fail);
                }
                else if (group === "audit") {
                    check = (mapKey.audit === section.audit);
                }
                else if (group === "year") {
                    check = (mapKey.year === section.year);
                }
            }
            else if (sfield.includes(group)) {
                if (group === "dept") {
                    check = (mapKey.dept === section.dept);
                }
                else if (group === "id") {
                    check = (mapKey.id === section.id);
                }
                else if (group === "instructor") {
                    check = (mapKey.instructor === section.instructor);
                }
                else if (group === "title") {
                    check = (mapKey.title === section.title);
                }
                else if (group === "uuid") {
                    check = (mapKey.uuid === section.uuid);
                }
            }
            if (!check) {
                return false;
            }
        }
        return check;
    }
    static getMapKeys(mapSections, section, FieldArr) {
        let mapKeys = Array.from(mapSections.keys());
        for (let mapKey of mapKeys) {
            if (this.isGroupValueSame(mapKey, section, FieldArr)) {
                return mapKey;
            }
        }
    }
    static isSectionExist(mapSections, section, FieldArr) {
        let mapKeys = Array.from(mapSections.keys());
        for (let mapKey of mapKeys) {
            if (this.isGroupValueSame(mapKey, section, FieldArr)) {
                return true;
            }
        }
        return false;
    }
    static handleGroup(group, sections) {
        let mapSections = new Map();
        let modifiedFieldArr = [];
        for (let elem of group) {
            modifiedFieldArr.push(HelperMethod_1.default.queryParseField(elem));
        }
        for (let section of sections) {
            if (!this.isSectionExist(mapSections, section, modifiedFieldArr)) {
                let mapVal = [];
                mapVal.push(section);
                mapSections.set(section, mapVal);
            }
            else {
                let mapKey = this.getMapKeys(mapSections, section, modifiedFieldArr);
                let mapValAddr = mapSections.get(mapKey);
                mapValAddr.push(section);
            }
        }
        return mapSections;
    }
    static handleApply(afterHandleGroup, applyKeys) {
        let applySets = Array.from(applyKeys);
        let afterApplyMap = new Map();
        for (let applySet of applySets) {
            let setApplyKey = applySet[0];
            let setApplyToken = applySet[1];
            let setApplyField = applySet[2];
            let returnMap;
            if (setApplyToken === "MAX") {
                returnMap = ApplytokenHelper_1.default.handleMAX(afterHandleGroup, setApplyKey, setApplyField);
            }
            else if (setApplyToken === "MIN") {
                returnMap = ApplytokenHelper_1.default.handleMIN(afterHandleGroup, setApplyKey, setApplyField);
            }
            else if (setApplyToken === "AVG") {
                returnMap = ApplytokenHelper_1.default.handleAVG(afterHandleGroup, setApplyKey, setApplyField);
            }
            else if (setApplyToken === "COUNT") {
                returnMap = ApplytokenHelper_1.default.handleCOUNT(afterHandleGroup, setApplyKey, setApplyField);
            }
            else if (setApplyToken === "SUM") {
                returnMap = ApplytokenHelper_1.default.handleSUM(afterHandleGroup, setApplyKey, setApplyField);
            }
            else {
                throw new IInsightFacade_1.InsightError();
            }
            afterApplyMap = ApplytokenHelper_1.default.mergeMaps(afterApplyMap, returnMap);
        }
        return afterApplyMap;
    }
    static handleTransformations(query, sections) {
        let transformations = query["TRANSFORMATIONS"];
        let group = transformations["GROUP"];
        let apply = transformations["APPLY"];
        let afterHandleGroup = this.handleGroup(group, sections);
        let applyKeys = this.getApplyKeys(apply);
        let afterApplyMap = this.handleApply(afterHandleGroup, applyKeys);
        return afterApplyMap;
    }
}
exports.default = TransformationsHelper;
//# sourceMappingURL=TransformationsHelper.js.map