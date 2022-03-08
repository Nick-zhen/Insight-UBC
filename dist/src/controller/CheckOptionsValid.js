"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CheckOptionsValid {
    queryParseField(inputId) {
        let modifiedField = "";
        let underscore = inputId.indexOf("_");
        underscore++;
        for (let i = underscore; i < inputId.length; i++) {
            modifiedField += inputId[i];
        }
        return modifiedField;
    }
    queryParseId(inputId) {
        let modifiedId = "";
        let underscore = inputId.indexOf("_");
        for (let i = 0; i < underscore; i++) {
            modifiedId += inputId[i];
        }
        return modifiedId;
    }
    getQueryDatasetId(where) {
        if (where[Object.keys(where)[0]] === undefined) {
            return "";
        }
        let insideItem = where[Object.keys(where)[0]];
        if ((typeof insideItem) === "object" && Object.keys(insideItem).length > 0) {
            return this.getQueryDatasetId(where[Object.keys(where)[0]]);
        }
        else if (typeof insideItem === "string" || (typeof insideItem) === "number") {
            return this.queryParseId(Object.keys(where)[0]);
        }
        else {
            return "";
        }
    }
    checkId_fieldValid(id_field) {
        let modifiedId = this.queryParseId(id_field);
        let modifiedField = this.queryParseField(id_field);
        if (this.queryDatasetId !== modifiedId || !this.totalField.includes(modifiedField)) {
            return false;
        }
        return true;
    }
    static isOptionsWithoutTranValid(options, queryDatasetId) {
        if (!("COLUMNS" in options)) {
            return false;
        }
        let columnArr = [];
        for (let element of options["COLUMNS"]) {
            if (!check.checkId_fieldValid(element)) {
                return false;
            }
            columnArr.push(element);
        }
        if (columnArr.length < 1) {
            return false;
        }
        if ("ORDER" in options) {
            let element = options["ORDER"];
            let modifiedId = check.queryParseId(element);
            if (!columnArr.includes(element)) {
                return false;
            }
            if (modifiedId !== queryDatasetId) {
                return false;
            }
        }
        return true;
    }
    static isOptionsContainTranValid(options, groupApplyArr, queryDatasetId) {
        if (!("COLUMNS" in options)) {
            return false;
        }
        let columnArr = [];
        let colApplyArr = [];
        for (let element of options["COLUMNS"]) {
            if (element.includes("_")) {
                if (!check.checkId_fieldValid(element)) {
                    return false;
                }
                columnArr.push(element);
            }
            else {
                colApplyArr.push(element);
            }
        }
        if (columnArr.length + colApplyArr.length < 1) {
            return false;
        }
        for (let col of columnArr) {
            if (!groupApplyArr.has(col)) {
                return false;
            }
        }
        for (let colApply of colApplyArr) {
            if (!groupApplyArr.has(colApply)) {
                return false;
            }
        }
        if ("ORDER" in options) {
            let element = options["ORDER"];
            let modifiedId = check.queryParseId(element);
            if (!columnArr.includes(element) && !(colApplyArr.includes(element))) {
                return false;
            }
            if (modifiedId !== queryDatasetId) {
                return false;
            }
        }
        return true;
    }
}
exports.default = CheckOptionsValid;
//# sourceMappingURL=CheckOptionsValid.js.map