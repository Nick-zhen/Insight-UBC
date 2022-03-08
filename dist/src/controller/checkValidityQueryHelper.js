"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckValidityQueryHelper = void 0;
const HelperMethod_1 = __importDefault(require("./HelperMethod"));
class CheckValidityQueryHelper {
    constructor() {
        this.whereKeys = ["LT", "GT", "EQ", "IS", "NOT"];
        this.logicComparison = ["AND", "OR"];
        this.totalField = ["avg", "pass", "fail", "audit", "year", "lat", "lon", "seats", "dept", "id", "instructor",
            "title", "uuid", "fullname", "shortname", "number", "name", "address", "type", "furniture", "href"];
        this.APPLYTOKEN = ["MAX", "MIN", "AVG", "COUNT", "SUM"];
        this.NumAPPLYTOKEN = ["MAX", "MIN", "AVG", "SUM"];
        this.CountAPPLYTOKEN = ["COUNT"];
        this.mfield = ["avg", "pass", "fail", "audit", "year", "lat", "lon", "seats"];
        this.sfield = ["dept", "id", "instructor", "title", "uuid", "fullname", "shortname", "number", "name",
            "address", "type", "furniture", "href"];
        this.DIRECTION = ["DOWN", "UP"];
        this.queryDatasetId = "";
    }
    checkId_fieldValid(id_field) {
        let modifiedId = HelperMethod_1.default.queryParseId(id_field);
        let modifiedField = HelperMethod_1.default.queryParseField(id_field);
        if (this.queryDatasetId !== modifiedId || !this.totalField.includes(modifiedField)) {
            return false;
        }
        return true;
    }
    isStringValid(element, where, check) {
        let value = String(Object.values(where)[0]);
        if (!this.sfield.includes(HelperMethod_1.default.queryParseField(element))) {
            check = false;
        }
        if (HelperMethod_1.default.queryParseId(element) !== this.queryDatasetId) {
            check = false;
        }
        if (HelperMethod_1.default.isIncludeMiddleStar(value)) {
            check = false;
        }
        return check;
    }
    isWhereValid(where, check) {
        try {
            let insideItem = where[Object.keys(where)[0]];
            if (Array.isArray(insideItem)) {
                for (let element in where) {
                    if (!this.logicComparison.includes(Object.keys(where)[0])) {
                        check = false;
                    }
                    for (let insideArrayItem of insideItem) {
                        check = this.isWhereValid(insideArrayItem, check);
                    }
                }
            }
            else if (typeof insideItem === "object" && Object.keys(where).length > 0) {
                for (const element in where) {
                    if (!this.whereKeys.includes(element)) {
                        check = false;
                    }
                    else {
                        check = this.isWhereValid(where[element], check);
                    }
                }
            }
            else if (typeof insideItem === "string") {
                check = (Object.keys(where).length > 1) ? false : check;
                for (let element in where) {
                    check = this.isStringValid(element, where, check);
                }
            }
            else if (typeof insideItem === "number") {
                check = (Object.keys(where).length > 1) ? false : check;
                for (let element in where) {
                    let modifiedField = HelperMethod_1.default.queryParseField(element);
                    let modifiedId = HelperMethod_1.default.queryParseId(element);
                    if (!this.mfield.includes(modifiedField)) {
                        check = false;
                    }
                    if (modifiedId !== this.queryDatasetId) {
                        check = false;
                    }
                }
            }
            else {
                check = false;
            }
        }
        catch (error) {
            check = false;
        }
        return check;
    }
    isApplyValid(apply, groupApplyArr) {
        let applyKeys = new Set();
        for (let item of apply) {
            let applyKey = Object.keys(item)[0];
            if (applyKey.includes("_")) {
                return false;
            }
            if (applyKeys.has(applyKey)) {
                return false;
            }
            else {
                applyKeys.add(applyKey);
                groupApplyArr.add(applyKey);
            }
            let applyValue = Object.values(item)[0];
            if (Object.keys(applyValue).length > 1) {
                return false;
            }
            let applyToken = Object.keys(applyValue)[0];
            let key = String(Object.values(applyValue)[0]);
            if (!this.APPLYTOKEN.includes(applyToken) || !this.checkId_fieldValid(key)) {
                return false;
            }
            if (this.NumAPPLYTOKEN.includes(applyToken)) {
                let modifiedField = HelperMethod_1.default.queryParseField(key);
                if (!this.mfield.includes(modifiedField)) {
                    return false;
                }
            }
        }
        return true;
    }
    isGroupValid(group, groupApplyArr) {
        for (let groupKey of group) {
            if (!this.checkId_fieldValid(groupKey)) {
                return false;
            }
            groupApplyArr.add(groupKey);
        }
        return true;
    }
    isTransformationValid(transformations, groupApplyArr) {
        if (!("GROUP" in transformations) || !("APPLY" in transformations)) {
            return false;
        }
        const group = transformations["GROUP"];
        const apply = transformations["APPLY"];
        if (!Array.isArray(group) || !Array.isArray(apply)) {
            return false;
        }
        if (!this.isApplyValid(apply, groupApplyArr)) {
            return false;
        }
        if (!this.isGroupValid(group, groupApplyArr)) {
            return false;
        }
        return true;
    }
    isQueryValid(query) {
        try {
            if (Object.keys(query).length === 0) {
                return false;
            }
            if (!("WHERE" in query) || !("OPTIONS" in query)) {
                return false;
            }
            const where = query["WHERE"];
            const options = query["OPTIONS"];
            if (!("COLUMNS" in query["OPTIONS"])) {
                return false;
            }
            this.queryDatasetId = HelperMethod_1.default.getQueryDatasetId(query);
            if (this.queryDatasetId === "") {
                return false;
            }
            if (!this.isWhereValid(where, true) && !(Object.keys(where).length === 0)) {
                return false;
            }
            let groupApplyArr = new Set();
            if ("TRANSFORMATIONS" in query) {
                const transformations = query["TRANSFORMATIONS"];
                if (!this.isTransformationValid(transformations, groupApplyArr)) {
                    return false;
                }
                if (!this.isOptionsContainTranValid(options, groupApplyArr)) {
                    return false;
                }
            }
            else {
                if (!("COLUMNS" in options)) {
                    return false;
                }
                if (!this.isOptionsWithoutTranValid(options)) {
                    return false;
                }
            }
            return true;
        }
        catch (error) {
            return false;
        }
    }
    isOptionsWithoutTranValid(options) {
        let columnArr = [];
        for (let element of options["COLUMNS"]) {
            if (!this.checkId_fieldValid(element)) {
                return false;
            }
            columnArr.push(element);
        }
        if (columnArr.length < 1) {
            return false;
        }
        if ("ORDER" in options) {
            let element = options["ORDER"];
            return this.checkOrderHelper(element, columnArr, []);
        }
        return true;
    }
    isOptionsContainTranValid(options, groupApplyArr) {
        let columnArr = [];
        let colApplyArr = [];
        for (let element of options["COLUMNS"]) {
            if (element.includes("_")) {
                if (!this.checkId_fieldValid(element)) {
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
            let order = options["ORDER"];
            if (!this.checkOrderHelper(order, columnArr, colApplyArr)) {
                return false;
            }
        }
        return true;
    }
    checkOrderHelper(order, columnArr, colApplyArr) {
        if (typeof order === "string") {
            return this.checkSingleOrderString(order, columnArr, colApplyArr);
        }
        else if (typeof order === "object") {
            return this.checkOrderObject(order, columnArr, colApplyArr);
        }
        else {
            return false;
        }
    }
    checkSingleOrderString(order, columnArr, colApplyArr) {
        if (!columnArr.includes(order) && !(colApplyArr.includes(order))) {
            return false;
        }
        if (order.includes("_")) {
            let modifiedId = HelperMethod_1.default.queryParseId(order);
            if (modifiedId !== this.queryDatasetId) {
                return false;
            }
        }
        return true;
    }
    checkOrderObject(order, columnArr, colApplyArr) {
        if (!(Object.keys(order)[0] === "dir") || !(Object.keys(order)[1] === "keys")) {
            return false;
        }
        let dir = order["dir"];
        if (!this.DIRECTION.includes(dir)) {
            return false;
        }
        let keys = order["keys"];
        if (keys.length === 0) {
            return false;
        }
        for (let key of keys) {
            if (!columnArr.includes(key) && !(colApplyArr.includes(key))) {
                return false;
            }
        }
        return true;
    }
}
exports.CheckValidityQueryHelper = CheckValidityQueryHelper;
//# sourceMappingURL=CheckValidityQueryHelper.js.map