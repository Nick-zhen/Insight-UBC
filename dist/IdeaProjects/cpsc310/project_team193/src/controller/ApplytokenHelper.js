"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const decimal_js_1 = __importDefault(require("decimal.js"));
const IInsightFacade_1 = require("./IInsightFacade");
class ApplytokenHelper {
    static handleMAX(afterHandleGroup, setApplyKey, setApplyField) {
        let returnMap = new Map();
        let mapKeys = Array.from(afterHandleGroup.keys());
        for (let keySection of mapKeys) {
            let maxNum = -1;
            let mapVal = afterHandleGroup.get(keySection);
            for (let section of mapVal) {
                if (setApplyField === "avg") {
                    if (section.avg > maxNum) {
                        maxNum = section.avg;
                    }
                }
                else if (setApplyField === "pass") {
                    if (section.pass > maxNum) {
                        maxNum = section.pass;
                    }
                }
                else if (setApplyField === "fail") {
                    if (section.fail > maxNum) {
                        maxNum = section.fail;
                    }
                }
                else if (setApplyField === "audit") {
                    if (section.audit > maxNum) {
                        maxNum = section.audit;
                    }
                }
                else if (setApplyField === "year") {
                    if (section.year > maxNum) {
                        maxNum = section.year;
                    }
                }
                else if (setApplyField === "lat") {
                    if (section.lat > maxNum) {
                        maxNum = section.lat;
                    }
                }
                else if (setApplyField === "lon") {
                    if (section.lon > maxNum) {
                        maxNum = section.lon;
                    }
                }
                else if (setApplyField === "seats") {
                    if (section.seats > maxNum) {
                        maxNum = section.seats;
                    }
                }
            }
            let insideMap = new Map();
            insideMap.set(setApplyKey, maxNum);
            returnMap.set(keySection, insideMap);
        }
        return returnMap;
    }
    static handleMIN(afterHandleGroup, setApplyKey, setApplyField) {
        let returnMap = new Map();
        let mapKeys = Array.from(afterHandleGroup.keys());
        for (let keySection of mapKeys) {
            let minNum = 10000;
            let mapVal = afterHandleGroup.get(keySection);
            for (let section of mapVal) {
                if (setApplyField === "avg") {
                    if (section.avg < minNum) {
                        minNum = section.avg;
                    }
                }
                else if (setApplyField === "pass") {
                    if (section.pass < minNum) {
                        minNum = section.pass;
                    }
                }
                else if (setApplyField === "fail") {
                    if (section.fail < minNum) {
                        minNum = section.fail;
                    }
                }
                else if (setApplyField === "audit") {
                    if (section.audit < minNum) {
                        minNum = section.audit;
                    }
                }
                else if (setApplyField === "year") {
                    if (section.year < minNum) {
                        minNum = section.year;
                    }
                }
                else if (setApplyField === "lat") {
                    if (section.lat < minNum) {
                        minNum = section.lat;
                    }
                }
                else if (setApplyField === "lon") {
                    if (section.lon < minNum) {
                        minNum = section.lon;
                    }
                }
                else if (setApplyField === "seats") {
                    if (section.seats < minNum) {
                        minNum = section.seats;
                    }
                }
            }
            let insideMap = new Map();
            insideMap.set(setApplyKey, minNum);
            returnMap.set(keySection, insideMap);
        }
        return returnMap;
    }
    static handleAVG(afterHandleGroup, setApplyKey, setApplyField) {
        let returnMap = new Map();
        let mapKeys = Array.from(afterHandleGroup.keys());
        for (let keySection of mapKeys) {
            let avgNum = new decimal_js_1.default(0);
            let mapVal = afterHandleGroup.get(keySection);
            for (let section of mapVal) {
                if (setApplyField === "avg") {
                    avgNum = avgNum.add(new decimal_js_1.default(section.avg));
                }
                else if (setApplyField === "pass") {
                    avgNum = avgNum.add(new decimal_js_1.default(section.pass));
                }
                else if (setApplyField === "fail") {
                    avgNum = avgNum.add(new decimal_js_1.default(section.fail));
                }
                else if (setApplyField === "audit") {
                    avgNum = avgNum.add(new decimal_js_1.default(section.audit));
                }
                else if (setApplyField === "year") {
                    avgNum = avgNum.add(new decimal_js_1.default(section.year));
                }
                else if (setApplyField === "lat") {
                    avgNum.add(new decimal_js_1.default(section.lat));
                }
                else if (setApplyField === "lon") {
                    avgNum.add(new decimal_js_1.default(section.lon));
                }
                else if (setApplyField === "seats") {
                    avgNum.add(new decimal_js_1.default(section.seats));
                }
            }
            let avg = avgNum.toNumber() / (mapVal.length);
            let res = Number(avg.toFixed(2));
            let insideMap = new Map();
            insideMap.set(setApplyKey, res);
            returnMap.set(keySection, insideMap);
        }
        return returnMap;
    }
    static countHelper(setApplyField, countSet, section, count) {
        if (setApplyField === "avg") {
            if (!countSet.has(section.avg)) {
                ++count;
                countSet.add(section.avg);
            }
        }
        else if (setApplyField === "pass") {
            if (countSet.has(section.pass)) {
                ++count;
                countSet.add(section.pass);
            }
        }
        else if (setApplyField === "fail") {
            if (countSet.has(section.fail)) {
                ++count;
                countSet.add(section.fail);
            }
        }
        else if (setApplyField === "audit") {
            if (countSet.has(section.audit)) {
                ++count;
                countSet.add(section.audit);
            }
        }
        else if (setApplyField === "year") {
            if (countSet.has(section.year)) {
                ++count;
                countSet.add(section.year);
            }
        }
        else if (setApplyField === "lat") {
            if (countSet.has(section.lat)) {
                ++count;
                countSet.add(section.lat);
            }
        }
        else if (setApplyField === "lon") {
            if (countSet.has(section.lon)) {
                ++count;
                countSet.add(section.lon);
            }
        }
        else if (setApplyField === "seats") {
            if (countSet.has(section.seats)) {
                ++count;
                countSet.add(section.seats);
            }
        }
        return count;
    }
    static handleCOUNT(afterHandleGroup, setApplyKey, setApplyField) {
        let returnMap = new Map();
        let mapKeys = Array.from(afterHandleGroup.keys());
        for (let keySection of mapKeys) {
            let mapVal = afterHandleGroup.get(keySection);
            let count = 0;
            let countSet = new Set();
            for (let section of mapVal) {
                count = this.countHelper(setApplyField, countSet, section, count);
            }
            let insideMap = new Map();
            insideMap.set(setApplyKey, count);
            returnMap.set(keySection, insideMap);
        }
        return returnMap;
    }
    static handleSUM(afterHandleGroup, setApplyKey, setApplyField) {
        let returnMap = new Map();
        let mapKeys = Array.from(afterHandleGroup.keys());
        for (let keySection of mapKeys) {
            let sumNum = 0;
            let mapVal = afterHandleGroup.get(keySection);
            for (let section of mapVal) {
                if (setApplyField === "avg") {
                    sumNum += section.avg;
                }
                else if (setApplyField === "pass") {
                    sumNum += section.pass;
                }
                else if (setApplyField === "fail") {
                    sumNum += section.fail;
                }
                else if (setApplyField === "audit") {
                    sumNum += section.audit;
                }
                else if (setApplyField === "year") {
                    sumNum += section.year;
                }
                else if (setApplyField === "lat") {
                    sumNum += section.lat;
                }
                else if (setApplyField === "lon") {
                    sumNum += section.lon;
                }
                else if (setApplyField === "seats") {
                    sumNum += section.seats;
                }
            }
            let insideMap = new Map();
            insideMap.set(setApplyKey, Number(sumNum.toFixed(2)));
            returnMap.set(keySection, insideMap);
        }
        return returnMap;
    }
    static mergeMaps(afterApplyMap, returnMap) {
        let firstMapKeys = Array.from(afterApplyMap.keys());
        if (firstMapKeys.length === 0) {
            return returnMap;
        }
        else {
            for (let mapKey of firstMapKeys) {
                let firstMapVal = afterApplyMap.get(mapKey);
                let secondMapVal = returnMap.get(mapKey);
                if (firstMapVal === undefined || secondMapVal === undefined) {
                    throw new IInsightFacade_1.InsightError("mergeMaps Problem!");
                }
                let [secondKey] = secondMapVal.keys();
                let [secondValue] = secondMapVal.values();
                firstMapVal.set(secondKey, secondValue);
            }
        }
        return afterApplyMap;
    }
}
exports.default = ApplytokenHelper;
//# sourceMappingURL=ApplytokenHelper.js.map