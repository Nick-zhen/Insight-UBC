"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HelperMethod {
    static queryParseId(inputId) {
        let modifiedId = "";
        let underscore = inputId.indexOf("_");
        for (let i = 0; i < underscore; i++) {
            modifiedId += inputId[i];
        }
        return modifiedId;
    }
    static getQueryDatasetIdFromWhere(query) {
        let where = query["WHERE"];
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
    static getQueryDatasetId(query) {
        let columns = query["OPTIONS"]["COLUMNS"];
        if (columns.length < 1) {
            return "";
        }
        for (let elem of columns) {
            if (elem.includes("_")) {
                return this.queryParseId(elem);
            }
        }
        if ("TRANSFORMATIONS" in query) {
            let group = query["TRANSFORMATIONS"]["GROUP"];
            for (let elem of group) {
                if (elem.includes("_")) {
                    return this.queryParseId(elem);
                }
            }
        }
        return this.getQueryDatasetIdFromWhere(query);
    }
    static queryParseField(inputId) {
        let modifiedField = "";
        let underscore = inputId.indexOf("_");
        underscore++;
        for (let i = underscore; i < inputId.length; i++) {
            modifiedField += inputId[i];
        }
        return modifiedField;
    }
    static isIncludeMiddleStar(value) {
        if (value.includes("*")) {
            for (let i = 1; i < (value.length - 1); i++) {
                if (value[i] === "*") {
                    return true;
                }
            }
        }
        return false;
    }
}
exports.default = HelperMethod;
//# sourceMappingURL=HelperMethod.js.map