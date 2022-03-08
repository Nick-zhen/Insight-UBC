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
const mfield = ["lat", "lon", "seats"];
const sfield = ["fullname", "shortname", "number", "name", "address", "type", "furniture", "href"];
class TransformationRoomHelper {
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
                if (group === "lat") {
                    check = (mapKey.lat === section.lat);
                }
                else if (group === "lon") {
                    check = (mapKey.lon === section.lon);
                }
                else if (group === "seats") {
                    check = (mapKey.seats === section.seats);
                }
            }
            else if (sfield.includes(group)) {
                if (group === "fullname") {
                    check = (mapKey.fullname === section.fullname);
                }
                else if (group === "shortname") {
                    check = (mapKey.shortname === section.shortname);
                }
                else if (group === "number") {
                    check = (mapKey.number === section.number);
                }
                else if (group === "name") {
                    check = (mapKey.name === section.name);
                }
                else if (group === "address") {
                    check = (mapKey.address === section.address);
                }
                else if (group === "type") {
                    check = (mapKey.type === section.type);
                }
                else if (group === "furniture") {
                    check = (mapKey.furniture === section.furniture);
                }
                else if (group === "href") {
                    check = (mapKey.href === section.href);
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
        if (applySets.length === 0) {
            let mapKeys = Array.from(afterHandleGroup.keys());
            for (let mapKey of mapKeys) {
                afterApplyMap.set(mapKey, new Map());
            }
            return afterApplyMap;
        }
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
exports.default = TransformationRoomHelper;
//# sourceMappingURL=TransformationRoomHelper.js.map