"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importStar(require("chai"));
const chai_as_promised_1 = __importDefault(require("chai-as-promised"));
const InsightFacade_1 = __importDefault(require("../../src/controller/InsightFacade"));
const IInsightFacade_1 = require("../../src/controller/IInsightFacade");
const fs = __importStar(require("fs-extra"));
(0, chai_1.use)(chai_as_promised_1.default);
chai_1.default.use(chai_as_promised_1.default);
describe("InsightFacade", function () {
    function getFileContent(path) {
        return fs.readFileSync(path).toString("base64");
    }
    let context = getFileContent("test/resources/archives/courses.zip");
    function clearDatasets() {
        fs.removeSync("data");
    }
    describe("firstThreeFn", function () {
        let insightFacade;
        beforeEach(function () {
            clearDatasets();
            insightFacade = new InsightFacade_1.default();
        });
        it("test2", function () {
            const obj = {
                WHERE: {
                    GT: {
                        courses_avg: 97
                    }
                },
                OPTIONS: {
                    COLUMNS: [
                        "courses_dept",
                        "courses_avg"
                    ],
                    ORDER: "courses_avg"
                }
            };
            let content = getFileContent("test/resources/archives/courses.zip");
            return insightFacade.addDataset("ubc", content, IInsightFacade_1.InsightDatasetKind.Courses)
                .then(() => {
                let result = insightFacade.performQuery(obj);
                (0, chai_1.expect)(result).to.deep.equal([]);
            });
        });
    });
});
//# sourceMappingURL=test.spec.js.map