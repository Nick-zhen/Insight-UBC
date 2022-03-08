"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HelperMethod_1 = __importDefault(require("./HelperMethod"));
const IInsightFacade_1 = require("./IInsightFacade");
const mfield = ["lat", "lon", "seats"];
const sfield = ["fullname", "shortname", "number", "name", "address", "type", "furniture", "href"];
class RoomsOptionsHelper {
    static mapSections(newSection, columnArr, datasetId, section) {
        for (let elem of columnArr) {
            if (elem === "lat") {
                newSection[`${datasetId}_lat`] = section["lat"];
            }
            else if (elem === "lon") {
                newSection[`${datasetId}_lon`] = section["lon"];
            }
            else if (elem === "seats") {
                newSection[`${datasetId}_seats`] = section["seats"];
            }
            else if (elem === "fullname") {
                newSection[`${datasetId}_fullname`] = section["fullname"];
            }
            else if (elem === "shortname") {
                newSection[`${datasetId}_shortname`] = section["shortname"];
            }
            else if (elem === "number") {
                newSection[`${datasetId}_number`] = section["number"];
            }
            else if (elem === "name") {
                newSection[`${datasetId}_name`] = section["name"];
            }
            else if (elem === "address") {
                newSection[`${datasetId}_address`] = section["address"];
            }
            else if (elem === "type") {
                newSection[`${datasetId}_type`] = section["type"];
            }
            else if (elem === "furniture") {
                newSection[`${datasetId}_furniture`] = section["furniture"];
            }
            else if (elem === "href") {
                newSection[`${datasetId}_href`] = section["href"];
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
            if (modifiedFieldInOrder === "lat") {
                return (Number(a[`${datasetId}_lat`]) - Number(b[`${datasetId}_lat`]));
            }
            else if (modifiedFieldInOrder === "lon") {
                return (Number(a[`${datasetId}_lon`]) - Number(b[`${datasetId}_lon`]));
            }
            else if (modifiedFieldInOrder === "seats") {
                return (Number(a[`${datasetId}_seats`]) - Number(b[`${datasetId}_seats`]));
            }
            else {
                return 0;
            }
        });
    }
    static fullnameOrderHelperH(modifiedFieldInOrder, a, b, datasetId) {
        if (a[`${datasetId}_fullname`] < b[`${datasetId}_fullname`]) {
            return -1;
        }
        else if (a[`${datasetId}_fullname`] > b[`${datasetId}_fullname`]) {
            return 1;
        }
        else {
            return 0;
        }
    }
    static shortnameOrderHelperH(modifiedFieldInOrder, a, b, datasetId) {
        if (a[`${datasetId}_shortname`] < b[`${datasetId}_shortname`]) {
            return -1;
        }
        else if (a[`${datasetId}_shortname`] > b[`${datasetId}_shortname`]) {
            return 1;
        }
        else {
            return 0;
        }
    }
    static numberOrderHelperH(modifiedFieldInOrder, a, b, datasetId) {
        if (a[`${datasetId}_number`] < b[`${datasetId}_number`]) {
            return -1;
        }
        else if (a[`${datasetId}_number`] > b[`${datasetId}_number`]) {
            return 1;
        }
        else {
            return 0;
        }
    }
    static nameOrderHelperH(modifiedFieldInOrder, a, b, datasetId) {
        if (a[`${datasetId}_name`] < b[`${datasetId}_name`]) {
            return -1;
        }
        else if (a[`${datasetId}_name`] > b[`${datasetId}_name`]) {
            return 1;
        }
        else {
            return 0;
        }
    }
    static stringOrderHelper(modifiedFieldInOrder, datasetId, newSections) {
        return newSections.sort((a, b) => {
            if (modifiedFieldInOrder === "fullname") {
                return this.fullnameOrderHelperH(modifiedFieldInOrder, a, b, datasetId);
            }
            else if (modifiedFieldInOrder === "shortname") {
                return this.shortnameOrderHelperH(modifiedFieldInOrder, a, b, datasetId);
            }
            else if (modifiedFieldInOrder === "number") {
                return this.numberOrderHelperH(modifiedFieldInOrder, a, b, datasetId);
            }
            else if (modifiedFieldInOrder === "name") {
                return this.nameOrderHelperH(modifiedFieldInOrder, a, b, datasetId);
            }
            else if (modifiedFieldInOrder === "address") {
                if (a[`${datasetId}_address`] < b[`${datasetId}_address`]) {
                    return -1;
                }
                else if (a[`${datasetId}_address`] > b[`${datasetId}_address`]) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
            else if (modifiedFieldInOrder === "type") {
                if (a[`${datasetId}_type`] < b[`${datasetId}_type`]) {
                    return -1;
                }
                else if (a[`${datasetId}_type`] > b[`${datasetId}_type`]) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
            else if (modifiedFieldInOrder === "furniture") {
                if (a[`${datasetId}_furniture`] < b[`${datasetId}_furniture`]) {
                    return -1;
                }
                else if (a[`${datasetId}_furniture`] > b[`${datasetId}_furniture`]) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
            else if (modifiedFieldInOrder === "href") {
                if (a[`${datasetId}_href`] < b[`${datasetId}_href`]) {
                    return -1;
                }
                else if (a[`${datasetId}_href`] > b[`${datasetId}_href`]) {
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
exports.default = RoomsOptionsHelper;
//# sourceMappingURL=RoomsOptionsHelper.js.map