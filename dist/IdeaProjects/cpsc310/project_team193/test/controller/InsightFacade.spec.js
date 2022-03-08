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
const folder_test_1 = require("@ubccpsc310/folder-test");
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
    let roomContext = getFileContent("test/resources/archives/rooms.zip");
    function clearDatasets() {
        fs.removeSync("data");
    }
    describe("firstThreeFn", function () {
        let insightFacade;
        beforeEach(function () {
            clearDatasets();
            insightFacade = new InsightFacade_1.default();
        });
        it("should add one Room Datasets", function () {
            return insightFacade.addDataset("rooms", roomContext, IInsightFacade_1.InsightDatasetKind.Rooms)
                .catch((result) => {
                return (0, chai_1.expect)(result).eventually.to.deep.equal(["rooms"]);
            });
        });
        it("should add multiple Room Datasets", function () {
            return insightFacade.addDataset("rooms", roomContext, IInsightFacade_1.InsightDatasetKind.Rooms).then(() => {
                return insightFacade.addDataset("rooms-2", roomContext, IInsightFacade_1.InsightDatasetKind.Rooms);
            }).catch((result) => {
                return (0, chai_1.expect)(result).eventually.to.deep.equal(["rooms", "rooms-2"]);
            });
        });
        it("should add multiple Datasets", function () {
            return insightFacade.addDataset("Courses", context, IInsightFacade_1.InsightDatasetKind.Courses).then(() => {
                return insightFacade.addDataset("Courses-2", context, IInsightFacade_1.InsightDatasetKind.Courses);
            }).catch((result) => {
                return (0, chai_1.expect)(result).eventually.to.deep.equal(["Courses", "Courses-2"]);
            });
        });
        it("should reject with only Underscore", function () {
            const result = insightFacade.addDataset("_", context, IInsightFacade_1.InsightDatasetKind.Courses);
            return (0, chai_1.expect)(result).eventually.to.be.rejectedWith(IInsightFacade_1.InsightError);
        });
        it("should reject with char and Underscore", function () {
            const result = insightFacade.addDataset("course_", context, IInsightFacade_1.InsightDatasetKind.Courses);
            return (0, chai_1.expect)(result).eventually.to.be.rejectedWith(IInsightFacade_1.InsightError);
        });
        it("should reject with whitespace and Underscore", function () {
            const result = insightFacade.addDataset("_ _", context, IInsightFacade_1.InsightDatasetKind.Courses);
            return (0, chai_1.expect)(result).eventually.to.be.rejectedWith(IInsightFacade_1.InsightError);
        });
        it("should reject with one WhiteSpace if there is", function () {
            const result = insightFacade.addDataset(" ", context, IInsightFacade_1.InsightDatasetKind.Courses);
            return (0, chai_1.expect)(result).eventually.to.be.rejectedWith(IInsightFacade_1.InsightError);
        });
        it("should reject to add Dataset with invalid content", function () {
            const result = insightFacade.addDataset(" ", "null", IInsightFacade_1.InsightDatasetKind.Courses);
            return (0, chai_1.expect)(result).eventually.to.be.rejectedWith(IInsightFacade_1.InsightError);
        });
        it("should reject with WhiteSpace char and underscore", function () {
            const result = insightFacade.addDataset("cour_se ", context, IInsightFacade_1.InsightDatasetKind.Courses);
            return (0, chai_1.expect)(result).eventually.to.be.rejectedWith(IInsightFacade_1.InsightError);
        });
        it("should reject with multiple WhiteSpace if there is", function () {
            const result = insightFacade.addDataset("  ", context, IInsightFacade_1.InsightDatasetKind.Courses);
            return (0, chai_1.expect)(result).eventually.to.be.rejectedWith(IInsightFacade_1.InsightError);
        });
        it("should add char with WhiteSpace if there is", function () {
            const result = insightFacade.addDataset("c  ", context, IInsightFacade_1.InsightDatasetKind.Courses);
            return (0, chai_1.expect)(result).eventually.to.deep.equal(["c  "]);
        });
        it("should reject with existed id", function () {
            return insightFacade.addDataset("Courses", context, IInsightFacade_1.InsightDatasetKind.Courses).then(() => {
                return insightFacade.addDataset("Courses", context, IInsightFacade_1.InsightDatasetKind.Courses);
            }).catch((result) => {
                return (0, chai_1.expect)(result).to.be.instanceof(IInsightFacade_1.InsightError);
            });
        });
        it("should list no dataset", function () {
            insightFacade.listDatasets().then((insightDatasets) => {
                (0, chai_1.expect)(insightDatasets).to.have.an.instanceof(Array);
                (0, chai_1.expect)(insightDatasets).to.have.length(0);
            });
        });
        it("should list one dataset", function () {
            return insightFacade.addDataset("courses", context, IInsightFacade_1.InsightDatasetKind.Courses)
                .then((addedIds) => {
                return insightFacade.listDatasets();
            })
                .then((insightDatasets) => {
                (0, chai_1.expect)(insightDatasets).to.deep.equal([{
                        id: "courses",
                        kind: IInsightFacade_1.InsightDatasetKind.Courses,
                        numRows: 64612,
                    }]);
                (0, chai_1.expect)(insightDatasets).to.be.an.instanceof(Array);
                (0, chai_1.expect)(insightDatasets).to.have.length(1);
                const [insightDataset] = insightDatasets;
                (0, chai_1.expect)(insightDataset).to.have.property("id");
                (0, chai_1.expect)(insightDataset.id).to.equal("courses");
            });
        });
        it("should list multiple dataset", function () {
            return insightFacade.addDataset("courses", context, IInsightFacade_1.InsightDatasetKind.Courses)
                .then(() => {
                return insightFacade.addDataset("courses-2", context, IInsightFacade_1.InsightDatasetKind.Courses);
            })
                .then(() => {
                return insightFacade.listDatasets();
            })
                .then((insightDataset) => {
                const expectedDatasets = [
                    {
                        id: "courses",
                        kind: IInsightFacade_1.InsightDatasetKind.Courses,
                        numRows: 64612,
                    },
                    {
                        id: "courses-2",
                        kind: IInsightFacade_1.InsightDatasetKind.Courses,
                        numRows: 64612,
                    }
                ];
                (0, chai_1.expect)(insightDataset).to.be.an.instanceof(Array);
                (0, chai_1.expect)(insightDataset).to.have.length(2);
                (0, chai_1.expect)(expectedDatasets).to.deep.equal(insightDataset);
            });
        });
        it("should remove one correct dataset", function () {
            return insightFacade.addDataset("Courses", context, IInsightFacade_1.InsightDatasetKind.Courses).then(() => {
                return insightFacade.removeDataset("Courses");
            }).then(() => {
                return insightFacade.listDatasets();
            }).then((insightDataset) => {
                (0, chai_1.expect)(insightDataset).to.be.an.instanceof(Array);
                (0, chai_1.expect)(insightDataset).to.have.length(0);
            });
        });
        it("fail to remove one dataset after adding another dataset", function () {
            return insightFacade.addDataset("Courses", context, IInsightFacade_1.InsightDatasetKind.Courses).then(() => {
                return insightFacade.removeDataset("Courses-2");
            }).then(() => {
                chai_1.expect.fail();
            }).catch((result) => {
                (0, chai_1.expect)(result).to.be.instanceof(IInsightFacade_1.NotFoundError);
            });
        });
        it("should remove one correct dataset in many datasets", function () {
            return insightFacade.addDataset("Courses", context, IInsightFacade_1.InsightDatasetKind.Courses).then(() => {
                return insightFacade.addDataset("Courses-2", context, IInsightFacade_1.InsightDatasetKind.Courses).then(() => {
                    return insightFacade.removeDataset("Courses");
                }).then((result) => {
                    (0, chai_1.expect)(result).to.deep.equal("Courses");
                    return insightFacade.listDatasets().then((insightDataset) => {
                        (0, chai_1.expect)(insightDataset).to.deep.equal([{
                                id: "Courses-2",
                                kind: IInsightFacade_1.InsightDatasetKind.Courses,
                                numRows: 64612,
                            }]);
                    });
                });
            });
        });
        it("should reject with NotFoundError when id wasn't added", function () {
            const result = insightFacade.removeDataset("Courses");
            return (0, chai_1.expect)(result).eventually.to.be.rejectedWith(IInsightFacade_1.NotFoundError);
        });
        it("should reject with InsightError with underscore", function () {
            const result = insightFacade.removeDataset("Courses_");
            return (0, chai_1.expect)(result).eventually.to.be.rejectedWith(IInsightFacade_1.InsightError);
        });
        it("should reject with multiple underscore", function () {
            const result = insightFacade.removeDataset("Courses__");
            return (0, chai_1.expect)(result).eventually.to.be.rejectedWith(IInsightFacade_1.InsightError);
        });
        it("should reject with one underscore", function () {
            const result = insightFacade.removeDataset("_");
            return (0, chai_1.expect)(result).eventually.to.be.rejectedWith(IInsightFacade_1.InsightError);
        });
        it("should reject with InsightError with whitespace", function () {
            const result = insightFacade.removeDataset(" ");
            return (0, chai_1.expect)(result).eventually.to.be.rejectedWith(IInsightFacade_1.InsightError);
        });
        it("should reject with InsightError with whitespace and_ mix", function () {
            const result = insightFacade.removeDataset("  _ _ ");
            return (0, chai_1.expect)(result).eventually.to.be.rejectedWith(IInsightFacade_1.InsightError);
        });
        it("should reject a dataset with id underline and whitespace", function () {
            const result = insightFacade.removeDataset("_ _");
            return (0, chai_1.expect)(result).eventually.to.be.rejectedWith(IInsightFacade_1.InsightError);
        });
    });
    describe("Dynamic folder test", function () {
        let insightFacade;
        let content = getFileContent("test/resources/archives/courses.zip");
        before(function () {
            clearDatasets();
            insightFacade = new InsightFacade_1.default();
            return insightFacade.addDataset("courses", content, IInsightFacade_1.InsightDatasetKind.Courses);
        });
        function assertOnResult(expected, actual, input) {
            const orderKey = input.OPTIONS.ORDER;
            (0, chai_1.expect)(actual).to.be.an.instanceof(Array);
            (0, chai_1.expect)(actual).to.have.length(expected.length);
            (0, chai_1.expect)(actual).to.have.deep.members(expected);
            if (typeof orderKey === "string") {
                for (let i = 1; i < actual.length; i++) {
                    actual[i - 1][orderKey] <= actual[i][orderKey];
                }
            }
            else if (typeof orderKey === "object") {
                if (orderKey["dir"] === "UP") {
                    for (let i = 1; i < actual.length; i++) {
                        actual[i - 1][orderKey] <= actual[i][orderKey];
                    }
                }
                else if (orderKey["dir"] === "DOWN") {
                    for (let i = 1; i < actual.length; i++) {
                        actual[i - 1][orderKey] >= actual[i][orderKey];
                    }
                }
            }
        }
        function assertOnError(expected, actual) {
            if (expected === "InsightError") {
                (0, chai_1.expect)(actual).to.be.an.instanceOf(IInsightFacade_1.InsightError);
            }
            else if (expected === "ResultTooLargeError") {
                (0, chai_1.expect)(actual).to.be.an.instanceOf(IInsightFacade_1.ResultTooLargeError);
            }
        }
        (0, folder_test_1.testFolder)("performQuery", (input) => insightFacade.performQuery(input), "./test/resources/queries", {
            assertOnResult: assertOnResult,
            assertOnError: assertOnError,
        });
    });
});
//# sourceMappingURL=InsightFacade.spec.js.map