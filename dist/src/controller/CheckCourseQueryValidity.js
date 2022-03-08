"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckCourseQueryValidity = void 0;
const CheckValidityQueryHelper_1 = require("./CheckValidityQueryHelper");
class CheckCourseQueryValidity extends CheckValidityQueryHelper_1.CheckValidityQueryHelper {
    constructor() {
        super(...arguments);
        this.totalField = ["avg", "pass", "fail", "audit", "year", "dept", "id", "instructor", "title", "uuid"];
        this.APPLYTOKEN = ["MAX", "MIN", "AVG", "COUNT", "SUM"];
        this.NumAPPLYTOKEN = ["MAX", "MIN", "AVG", "SUM"];
        this.CountAPPLYTOKEN = ["COUNT"];
        this.mfield = ["avg", "pass", "fail", "audit", "year"];
        this.sfield = ["dept", "id", "instructor", "title", "uuid"];
    }
}
exports.CheckCourseQueryValidity = CheckCourseQueryValidity;
//# sourceMappingURL=CheckCourseQueryValidity.js.map