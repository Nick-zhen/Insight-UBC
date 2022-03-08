"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HelperMethod_1 = __importDefault(require("./HelperMethod"));
const mfield = ["avg", "pass", "fail", "audit", "year"];
const sfield = ["dept", "id", "instructor", "title", "uuid"];
class CoursesOptionsHelper {
    static mapSections(newSection, columnArr, datasetId, section) {
        for (let e of columnArr) {
            if (e === "dept") {
                newSection[`${datasetId}_dept`] = section["dept"];
            }
            else if (e === "id") {
                newSection[`${datasetId}_id`] = section["id"];
            }
            else if (e === "instructor") {
                newSection[`${datasetId}_instructor`] = section["instructor"];
            }
            else if (e === "title") {
                newSection[`${datasetId}_title`] = section["title"];
            }
            else if (e === "uuid") {
                newSection[`${datasetId}_uuid`] = section["uuid"];
            }
            else if (e === "avg") {
                newSection[`${datasetId}_avg`] = section["avg"];
            }
            else if (e === "pass") {
                newSection[`${datasetId}_pass`] = section["pass"];
            }
            else if (e === "fail") {
                newSection[`${datasetId}_fail`] = section["fail"];
            }
            else if (e === "audit") {
                newSection[`${datasetId}_audit`] = section["audit"];
            }
            else if (e === "year") {
                newSection[`${datasetId}_year`] = section["year"];
            }
        }
    }
    static OrderHelper(modifiedFieldInOrder, newSections, check) {
        let datasetId = check.queryDatasetId;
        if (mfield.includes(modifiedFieldInOrder)) {
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
        else if (sfield.includes(modifiedFieldInOrder)) {
            return this.stringOrderHelper(modifiedFieldInOrder, datasetId, newSections);
        }
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
            for (let e of columnArr) {
                if (e === "dept") {
                    newSection[`${datasetId}_dept`] = section["dept"];
                }
                else if (e === "id") {
                    newSection[`${datasetId}_id`] = section["id"];
                }
                else if (e === "instructor") {
                    newSection[`${datasetId}_instructor`] = section["instructor"];
                }
                else if (e === "title") {
                    newSection[`${datasetId}_title`] = section["title"];
                }
                else if (e === "uuid") {
                    newSection[`${datasetId}_uuid`] = section["uuid"];
                }
                else if (e === "avg") {
                    newSection[`${datasetId}_avg`] = section["avg"];
                }
                else if (e === "pass") {
                    newSection[`${datasetId}_pass`] = section["pass"];
                }
                else if (e === "fail") {
                    newSection[`${datasetId}_fail`] = section["fail"];
                }
                else if (e === "audit") {
                    newSection[`${datasetId}_audit`] = section["audit"];
                }
                else if (e === "year") {
                    newSection[`${datasetId}_year`] = section["year"];
                }
            }
            return newSection;
        });
        if ("ORDER" in options) {
            let element = options["ORDER"];
            let modifiedFieldInOrder = HelperMethod_1.default.queryParseField(element);
            newSections = this.OrderHelper(modifiedFieldInOrder, newSections, check);
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
            this.mapSections(newSections, columnArr, datasetId, section);
            let insideMap = afterApply.get(section);
            for (let e of columnApplyArr) {
                newSection[`${e}`] = insideMap?.get(e);
            }
            return newSection;
        });
        if ("ORDER" in options) {
            let element = options["ORDER"];
            let modifiedFieldInOrder = HelperMethod_1.default.queryParseField(element);
            newSections = this.OrderHelper(modifiedFieldInOrder, newSections, check);
        }
        return newSections;
    }
}
exports.default = CoursesOptionsHelper;
//# sourceMappingURL=CoursesOptionsHelper.js.map