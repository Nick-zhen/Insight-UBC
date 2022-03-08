"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformQueryHelper = void 0;
const whereKeys = ["LT", "GT", "EQ", "IS", "NOT"];
const logicComparison = ["AND", "OR"];
const mComparison = ["LT", "GT", "EQ"];
const sComparison = ["IS"];
const negation = ["NOT"];
const totalField = ["avg", "pass", "fail", "audit", "year", "dept", "id", "instructor", "title", "uuid"];
const mfield = ["avg", "pass", "fail", "audit", "year"];
const sfield = ["dept", "id", "instructor", "title", "uuid"];
class PerformQueryHelper {
    static queryParseId(inputId) {
        let modifiedId = "";
        let underscore = inputId.indexOf("_");
        for (let i = 0; i < underscore; i++) {
            modifiedId += inputId[i];
        }
        return modifiedId;
    }
    static getQueryDatasetId(where) {
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
    static queryParseField(inputId) {
        let modifiedField = "";
        let underscore = inputId.indexOf("_");
        underscore++;
        for (let i = underscore; i < inputId.length; i++) {
            modifiedField += inputId[i];
        }
        return modifiedField;
    }
    static isWhereValid(where, check) {
        try {
            let insideItem = where[Object.keys(where)[0]];
            if (Array.isArray(insideItem)) {
                for (let element in where) {
                    if (!logicComparison.includes(Object.keys(where)[0])) {
                        check = false;
                    }
                    for (let insideArrayItem of insideItem) {
                        check = this.isWhereValid(insideArrayItem, check);
                    }
                }
            }
            else if (typeof insideItem === "object" && Object.keys(where).length > 0) {
                for (const element in where) {
                    if (!whereKeys.includes(element)) {
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
                    if (!sfield.includes(this.queryParseField(element))) {
                        check = false;
                    }
                    if (this.queryParseId(element) !== this.queryDatasetId) {
                        check = false;
                    }
                }
            }
            else if (typeof insideItem === "number") {
                check = (Object.keys(where).length > 1) ? false : check;
                for (let element in where) {
                    let modifiedField = this.queryParseField(element);
                    let modifiedId = this.queryParseId(element);
                    if (!mfield.includes(modifiedField)) {
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
    static isOptionsValid(options) {
        if (!("COLUMNS" in options)) {
            return false;
        }
        let columnArr = [];
        for (let element of options["COLUMNS"]) {
            let modifiedField = this.queryParseField(element);
            let modifiedId = this.queryParseId(element);
            if (!totalField.includes(modifiedField)) {
                return false;
            }
            if (modifiedId !== this.queryDatasetId) {
                return false;
            }
            columnArr.push(element);
        }
        if ("ORDER" in options) {
            let element = options["ORDER"];
            let modifiedId = this.queryParseId(element);
            if (!columnArr.includes(element)) {
                return false;
            }
            if (modifiedId !== this.queryDatasetId) {
                return false;
            }
        }
        return true;
    }
    static isQueryValid(query) {
        try {
            if (Object.keys(query).length === 0) {
                return false;
            }
            if (!("WHERE" in query) || !("OPTIONS" in query)) {
                return false;
            }
            const where = query["WHERE"];
            const options = query["OPTIONS"];
            this.queryDatasetId = this.getQueryDatasetId(where);
            if (this.queryDatasetId === "") {
                return false;
            }
            if (!this.isWhereValid(where, true)) {
                return false;
            }
            if (!this.isOptionsValid(options)) {
                return false;
            }
            return true;
        }
        catch (error) {
            return false;
        }
    }
    static handleOrOperator() {
    }
    static handleAndOperator() {
    }
    static handleAndOrOperator(objKey, insideItem, sections) {
        let tempSections = [];
        if (objKey === "AND") {
            let i = 0;
            for (let insideArrayItem of insideItem) {
                tempSections[i] = this.handleWHERE(insideArrayItem, sections);
                i++;
            }
            this.handleAndOperator(tempSections);
        }
        else if (objKey === "OR") {
            let i = 0;
            for (let insideArrayItem of insideItem) {
                tempSections[i] = this.handleWHERE(insideArrayItem, sections);
                i++;
            }
            this.handleOrOperator(tempSections);
        }
        return tempSections;
    }
    static handleMComparisonOperator(objKey, insideItem, sections) {
        let tempSections = [];
        let modefiedField = this.queryParseField(Object.keys(insideItem)[0]);
        let insideItemValue = Number(Object.values(insideItem)[0]);
        if (objKey === "LT") {
            tempSections = sections.filter((section) => {
                if (modefiedField === "avg") {
                    return section.avg < insideItemValue;
                }
                else if (modefiedField === "pass") {
                    return section.pass < insideItemValue;
                }
                else if (modefiedField === "fail") {
                    return section.fail < insideItemValue;
                }
                else if (modefiedField === "audit") {
                    return section.audit < insideItemValue;
                }
                else if (modefiedField === "year") {
                    return section.year < insideItemValue;
                }
            });
        }
        else if (objKey === "GT") {
            tempSections = sections.filter((section) => {
                if (modefiedField === "avg") {
                    return section.avg > insideItemValue;
                }
                else if (modefiedField === "pass") {
                    return section.pass > insideItemValue;
                }
                else if (modefiedField === "fail") {
                    return section.fail > insideItemValue;
                }
                else if (modefiedField === "audit") {
                    return section.audit > insideItemValue;
                }
                else if (modefiedField === "year") {
                    return section.year > insideItemValue;
                }
            });
        }
        else if (objKey === "EQ") {
            tempSections = sections.filter((section) => {
                if (modefiedField === "avg") {
                    return section.avg === insideItemValue;
                }
                else if (modefiedField === "pass") {
                    return section.pass === insideItemValue;
                }
                else if (modefiedField === "fail") {
                    return section.fail === insideItemValue;
                }
                else if (modefiedField === "audit") {
                    return section.audit === insideItemValue;
                }
                else if (modefiedField === "year") {
                    return section.year === insideItemValue;
                }
            });
        }
        return tempSections;
    }
    static handleSComparisonOperator(sections) {
    }
    static handleNegationOperator(sections) {
    }
    static handleWHERE(where, sections) {
        let insideItem = where[Object.keys(where)[0]];
        let objKey = Object.keys(where)[0];
        if (Array.isArray(insideItem)) {
            this.handleAndOrOperator(objKey, insideItem, sections);
        }
        else if (typeof insideItem === "object") {
            if (mComparison.includes(objKey)) {
                this.handleMComparisonOperator(objKey, insideItem, sections);
            }
            else if (sComparison.includes(objKey)) {
                this.handleSComparisonOperator(sections);
            }
            else if (negation.includes(objKey)) {
                this.handleNegationOperator(sections);
            }
        }
        else if (typeof insideItem === "string") {
            check = (Object.keys(where).length > 1) ? false : check;
            for (let element in where) {
                if (!sfield.includes(this.queryParseField(element))) {
                    check = false;
                }
                if (this.queryParseId(element) !== this.queryDatasetId) {
                    check = false;
                }
            }
        }
        else if (typeof insideItem === "number") {
            check = (Object.keys(where).length > 1) ? false : check;
            for (let element in where) {
                let modifiedField = this.queryParseField(element);
                let modifiedId = this.queryParseId(element);
                if (!mfield.includes(modifiedField)) {
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
    static handleOPTIONS(query) {
    }
}
exports.PerformQueryHelper = PerformQueryHelper;
PerformQueryHelper.queryDatasetId = "";
//# sourceMappingURL=performQueryHelper.js.map