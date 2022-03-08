"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HelperMethod_1 = __importDefault(require("./HelperMethod"));
const IInsightFacade_1 = require("./IInsightFacade");
const mfield = ["avg", "pass", "fail", "audit", "year"];
const sfield = ["dept", "id", "instructor", "title", "uuid"];
class CourseOptionsHelper {
    static mapSections(newSection, columnArr, datasetId, section) {
        for (let elem of columnArr) {
            if (elem === "dept") {
                newSection[`${datasetId}_dept`] = section["dept"];
            }
            else if (elem === "id") {
                newSection[`${datasetId}_id`] = section["id"];
            }
            else if (elem === "instructor") {
                newSection[`${datasetId}_instructor`] = section["instructor"];
            }
            else if (elem === "title") {
                newSection[`${datasetId}_title`] = section["title"];
            }
            else if (elem === "uuid") {
                newSection[`${datasetId}_uuid`] = section["uuid"];
            }
            else if (elem === "avg") {
                newSection[`${datasetId}_avg`] = section["avg"];
            }
            else if (elem === "pass") {
                newSection[`${datasetId}_pass`] = section["pass"];
            }
            else if (elem === "fail") {
                newSection[`${datasetId}_fail`] = section["fail"];
            }
            else if (elem === "audit") {
                newSection[`${datasetId}_audit`] = section["audit"];
            }
            else if (elem === "year") {
                newSection[`${datasetId}_year`] = section["year"];
            }
        }
        return newSection;
    }
    static orderHelper(order, newSections, datasetId) {
        if (typeof order === "string") {
            return this.singleOrderHelper(order, newSections, datasetId);
        }
        else if (typeof order === "object") {
            return this.objectOrderHelper(order, newSections, datasetId);
        }
        else {
            throw new IInsightFacade_1.InsightError("problem in ORDER !");
        }
    }
    static objectOrderHelper(order, newSections, datasetId) {
        let orderVal = Object.values(order);
        let dir = orderVal[0];
        let keys = orderVal[1];
        if (dir === "UP") {
            for (let i = keys.length - 1; i >= 0; --i) {
                newSections = this.singleOrderHelper(keys[i], newSections, datasetId);
            }
        }
        else {
            for (let i = keys.length - 1; i >= 0; --i) {
                newSections = this.singleOrderHelper(keys[i], newSections, datasetId);
            }
            newSections = newSections.reverse();
        }
        return newSections;
    }
    static singleOrderHelper(orderKey, newSections, datasetId) {
        let modifiedFieldInOrder = HelperMethod_1.default.queryParseField(orderKey);
        if (mfield.includes(modifiedFieldInOrder)) {
            return this.numberOrderHelper(modifiedFieldInOrder, datasetId, newSections);
        }
        else if (sfield.includes(modifiedFieldInOrder)) {
            return this.stringOrderHelper(modifiedFieldInOrder, datasetId, newSections);
        }
        else {
            throw new IInsightFacade_1.InsightError("problem in singleOrderHelper");
        }
    }
    static numberOrderHelper(modifiedFieldInOrder, datasetId, newSections) {
        return newSections.sort((a, b) => {
            if (modifiedFieldInOrder === "avg") {
                return (Number(a[`${datasetId}_avg`]) - Number(b[`${datasetId}_avg`]));
            }
            else if (modifiedFieldInOrder === "pass") {
                return (Number(a[`${datasetId}_pass`]) - Number(b[`${datasetId}_pass`]));
            }
            else if (modifiedFieldInOrder === "fail") {
                return (Number(a[`${datasetId}_fail`]) - Number(b[`${datasetId}_fail`]));
            }
            else if (modifiedFieldInOrder === "audit") {
                return (Number(a[`${datasetId}_audit`]) - Number(b[`${datasetId}_audit`]));
            }
            else if (modifiedFieldInOrder === "year") {
                return (Number(a[`${datasetId}_year`]) - Number(b[`${datasetId}_year`]));
            }
            else {
                return 0;
            }
        });
    }
    static stringOrderHelper(modifiedFieldInOrder, datasetId, newSections) {
        return newSections.sort((a, b) => {
            if (modifiedFieldInOrder === "dept") {
                if (a[`${datasetId}_dept`] < b[`${datasetId}_dept`]) {
                    return -1;
                }
                else if (a[`${datasetId}_dept`] > b[`${datasetId}_dept`]) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
            else if (modifiedFieldInOrder === "id") {
                if (a[`${datasetId}_id`] < b[`${datasetId}_id`]) {
                    return -1;
                }
                else if (a[`${datasetId}_id`] > b[`${datasetId}_id`]) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
            else if (modifiedFieldInOrder === "instructor") {
                if (a[`${datasetId}_instructor`] < b[`${datasetId}_instructor`]) {
                    return -1;
                }
                else if (a[`${datasetId}_instructor`] > b[`${datasetId}_instructor`]) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
            else if (modifiedFieldInOrder === "title") {
                if (a[`${datasetId}_title`] < b[`${datasetId}_title`]) {
                    return -1;
                }
                else if (a[`${datasetId}_title`] > b[`${datasetId}_title`]) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
            else if (modifiedFieldInOrder === "uuid") {
                if (a[`${datasetId}_uuid`] < b[`${datasetId}_uuid`]) {
                    return -1;
                }
                else if (a[`${datasetId}_uuid`] > b[`${datasetId}_uuid`]) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
            else {
                return 0;
            }
        });
    }
    static handleOPTIONS(options, sections, check) {
        let columnArr = [];
        let datasetId = check.queryDatasetId;
        for (const element of options["COLUMNS"]) {
            let modifiedField = HelperMethod_1.default.queryParseField(element);
            columnArr.push(modifiedField);
        }
        let newSections = sections.map((section) => {
            let newSection = {};
            this.mapSections(newSection, columnArr, datasetId, section);
            return newSection;
        });
        if ("ORDER" in options) {
            let order = options["ORDER"];
            newSections = this.orderHelper(order, newSections, datasetId);
        }
        return newSections;
    }
    static handleApplyOptions(options, afterApply, check) {
        let columnArr = [];
        let columnApplyArr = [];
        let datasetId = check.queryDatasetId;
        for (let element of options["COLUMNS"]) {
            if (element.includes("_")) {
                let modifiedField = HelperMethod_1.default.queryParseField(element);
                columnArr.push(modifiedField);
            }
            else {
                columnApplyArr.push(element);
            }
        }
        let mapKeys = Array.from(afterApply.keys());
        let newSections = mapKeys.map((section) => {
            let newSection = {};
            this.mapSections(newSection, columnArr, datasetId, section);
            let insideMap = afterApply.get(section);
            for (let elem of columnApplyArr) {
                newSection[`${elem}`] = insideMap?.get(elem);
            }
            return newSection;
        });
        if ("ORDER" in options) {
            let element = options["ORDER"];
            newSections = this.transOrderHelper(element, newSections, datasetId);
        }
        return newSections;
    }
    static transOrderHelper(order, newSections, datasetId) {
        if (typeof order === "string") {
            return this.singleTransOrderHelper(order, newSections, datasetId);
        }
        else if (typeof order === "object") {
            return this.objectTranOrderHelper(order, newSections, datasetId);
        }
        else {
            throw new IInsightFacade_1.InsightError("problem in ORDER !");
        }
    }
    static singleTransOrderHelper(orderKey, newSections, datasetId) {
        if (orderKey.includes("_")) {
            let modifiedFieldInOrder = HelperMethod_1.default.queryParseField(orderKey);
            if (mfield.includes(modifiedFieldInOrder)) {
                return this.numberOrderHelper(modifiedFieldInOrder, datasetId, newSections);
            }
            else if (sfield.includes(modifiedFieldInOrder)) {
                return this.stringOrderHelper(modifiedFieldInOrder, datasetId, newSections);
            }
            else {
                throw new IInsightFacade_1.InsightError("problem in singleOrderHelper");
            }
        }
        else {
            return this.applyNumberOrderHelper(orderKey, newSections);
        }
    }
    static applyNumberOrderHelper(orderKey, newSections) {
        return newSections.sort((a, b) => {
            return (Number(a[`${orderKey}`]) - Number(b[`${orderKey}`]));
        });
    }
    static objectTranOrderHelper(order, newSections, datasetId) {
        let orderVal = Object.values(order);
        let dir = orderVal[0];
        let keys = orderVal[1];
        if (dir === "UP") {
            for (let i = keys.length - 1; i >= 0; --i) {
                if (keys[i].includes("_")) {
                    newSections = this.singleOrderHelper(keys[i], newSections, datasetId);
                }
                else {
                    newSections = this.applyNumberOrderHelper(keys[i], newSections);
                }
            }
        }
        else {
            for (let i = keys.length - 1; i >= 0; --i) {
                if (keys[i].includes("_")) {
                    newSections = this.singleOrderHelper(keys[i], newSections, datasetId);
                }
                else {
                    newSections = this.applyNumberOrderHelper(keys[i], newSections);
                }
            }
            newSections = newSections.reverse();
        }
        return newSections;
    }
}
exports.default = CourseOptionsHelper;
//# sourceMappingURL=CourseOptionsHelper.js.map