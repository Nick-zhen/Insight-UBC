"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckRoomQueryValidity = void 0;
const CheckValidityQueryHelper_1 = require("./CheckValidityQueryHelper");
class CheckRoomQueryValidity extends CheckValidityQueryHelper_1.CheckValidityQueryHelper {
    constructor() {
        super(...arguments);
        this.totalField = ["lat", "lon", "seats", "fullname", "shortname", "number",
            "name", "address", "type", "furniture", "href"];
        this.APPLYTOKEN = ["MAX", "MIN", "AVG", "COUNT", "SUM"];
        this.mfield = ["lat", "lon", "seats"];
        this.sfield = ["fullname", "shortname", "number", "name", "address", "type", "furniture", "href"];
    }
}
exports.CheckRoomQueryValidity = CheckRoomQueryValidity;
//# sourceMappingURL=CheckRoomQueryValidity.js.map