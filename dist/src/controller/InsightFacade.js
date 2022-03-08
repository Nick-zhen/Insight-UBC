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
const IInsightFacade_1 = require("./IInsightFacade");
const fs = __importStar(require("fs-extra"));
const Dataset_1 = __importDefault(require("./Dataset"));
const CheckValidityQueryHelper_1 = require("./CheckValidityQueryHelper");
const QueryHelper_1 = __importDefault(require("./QueryHelper"));
const CheckCourseQueryValidity_1 = require("./CheckCourseQueryValidity");
const CheckRoomQueryValidity_1 = require("./CheckRoomQueryValidity");
const HelperMethod_1 = __importDefault(require("./HelperMethod"));
const QueryRoomsHelper_1 = __importDefault(require("./QueryRoomsHelper"));
const CourseHelper_1 = __importDefault(require("./CourseHelper"));
const RoomHelper_1 = __importDefault(require("./RoomHelper"));
const whereKeys = ["LT", "GT", "EQ", "IS", "NOT"];
const logicComparison = ["AND", "OR"];
const mComparison = ["LT", "GT", "EQ"];
const sComparison = ["IS"];
const negation = ["NOT"];
const totalField = ["avg", "pass", "fail", "audit", "year", "dept", "id", "instructor", "title", "uuid"];
const mfield = ["avg", "pass", "fail", "audit", "year"];
const sfield = ["dept", "id", "instructor", "title", "uuid"];
class InsightFacade {
    constructor() {
        this.datasets = [];
        this.queryDatasetId = "";
        this.insightDatasets = [];
        this.makeDir();
        fs.readdirSync("data/").map((f) => {
            const p = fs.readFileSync("data/" + f, "utf8");
            return p;
        }).map((f) => {
            const json = JSON.parse(f);
            this.datasets.push(json);
            this.insightDatasets.push({
                id: json.id,
                kind: json.kind === "rooms" ? IInsightFacade_1.InsightDatasetKind.Rooms : IInsightFacade_1.InsightDatasetKind.Courses,
                numRows: json.dataContent.length
            });
        });
    }
    makeDir() {
        if (!fs.existsSync("data/")) {
            fs.mkdirSync("data/");
        }
    }
    addRoomHelper(rHelper, id, content, kind) {
        return new Promise((resolve, reject) => {
            try {
                rHelper.getRooms(content)
                    .then(async (rooms) => {
                    if (rooms.length < 1) {
                        return reject(new IInsightFacade_1.InsightError("rooms should not be empty"));
                    }
                    const newData = new Dataset_1.default(id, kind, rooms);
                    this.datasets.push(newData);
                    const newInsightDataset = {
                        id: id,
                        kind: IInsightFacade_1.InsightDatasetKind.Rooms,
                        numRows: rooms.length,
                    };
                    this.insightDatasets.push(newInsightDataset);
                    if (!fs.existsSync("data/")) {
                        fs.mkdirSync("data/");
                    }
                    await fs.writeFile(`${"data/"}${newData.id}.json`, JSON.stringify(newData), "utf-8", () => {
                        return resolve(this.getIds());
                    });
                })
                    .catch((error) => {
                    return reject(error);
                });
            }
            catch (error) {
                return reject(error);
            }
        });
    }
    getIds() {
        const ids = this.insightDatasets.map((ds) => {
            return ds.id;
        });
        return ids;
    }
    addDataset(id, content, kind) {
        if (id === "" || id === null || !id.trim() || id.includes("_")) {
            return Promise.reject(new IInsightFacade_1.InsightError("input can't be only white space or _"));
        }
        if (kind !== IInsightFacade_1.InsightDatasetKind.Courses && kind !== IInsightFacade_1.InsightDatasetKind.Rooms) {
            return Promise.reject(new IInsightFacade_1.InsightError("input must have kind course"));
        }
        if (this.getIds().includes(id)) {
            return Promise.reject(new IInsightFacade_1.InsightError("input has already exist"));
        }
        if (kind === IInsightFacade_1.InsightDatasetKind.Rooms) {
            const rHelper = new RoomHelper_1.default();
            return this.addRoomHelper(rHelper, id, content, kind);
        }
        else {
            return new Promise((resolve, reject) => {
                try {
                    const cHelper = new CourseHelper_1.default();
                    cHelper.getSections(content)
                        .then(async (sections) => {
                        if (sections.length < 1) {
                            return reject(new IInsightFacade_1.InsightError("sections should not be empty"));
                        }
                        this.makeDir();
                        const newData = new Dataset_1.default(id, kind, sections);
                        this.getIds().push(id);
                        this.datasets.push(newData);
                        const newInsightDataset = {
                            id: id,
                            kind: IInsightFacade_1.InsightDatasetKind.Courses,
                            numRows: sections.length,
                        };
                        this.insightDatasets.push(newInsightDataset);
                        await fs.writeFile(`${"data/"}${newData.id}.json`, JSON.stringify(newData), "utf-8", () => {
                            return resolve(this.getIds());
                        });
                        return resolve(this.insightDatasets.map((ds) => {
                            return ds.id;
                        }));
                    }).catch((error) => {
                        return reject(error);
                    });
                }
                catch (error) {
                    return reject(error);
                }
            });
        }
    }
    removeDataset(id) {
        if (id === "" || id === null || !id.trim()) {
            return Promise.reject(new IInsightFacade_1.InsightError("id can't be only white space"));
        }
        if (id.includes("_")) {
            return Promise.reject(new IInsightFacade_1.InsightError("id can't have _"));
        }
        if (!this.getIds().includes(id)) {
            return Promise.reject(new IInsightFacade_1.NotFoundError("id hasn't been added"));
        }
        return new Promise((resolve, reject) => {
            try {
                this.datasets = this.datasets.filter((ds) => {
                    return ds.id !== id;
                });
                this.insightDatasets = this.insightDatasets.filter((ds) => {
                    return ds.id !== id;
                });
                fs.unlinkSync(`${"data/"}${id}.json`);
                return resolve(id);
            }
            catch (err) {
                return reject(err);
            }
        });
    }
    performQuery(query) {
        try {
            this.queryDatasetId = HelperMethod_1.default.getQueryDatasetId(query);
        }
        catch (err) {
            return Promise.reject(new IInsightFacade_1.InsightError("The query syntax is invalid."));
        }
        if (!this.getIds().includes(this.queryDatasetId)) {
            return Promise.reject(new IInsightFacade_1.InsightError("The dataset is not exist."));
        }
        let check;
        let item = this.datasets.find((element) => element.id === this.queryDatasetId);
        let datasetKind = item?.kind;
        if (datasetKind === IInsightFacade_1.InsightDatasetKind.Courses) {
            check = new CheckCourseQueryValidity_1.CheckCourseQueryValidity();
        }
        else if (datasetKind === IInsightFacade_1.InsightDatasetKind.Rooms) {
            check = new CheckRoomQueryValidity_1.CheckRoomQueryValidity();
        }
        else {
            check = new CheckValidityQueryHelper_1.CheckValidityQueryHelper();
        }
        if (!check.isQueryValid(query)) {
            return Promise.reject(new IInsightFacade_1.InsightError("The query syntax is invalid."));
        }
        try {
            if (datasetKind === IInsightFacade_1.InsightDatasetKind.Courses) {
                let res = QueryHelper_1.default.queryCourses(query, check, this.datasets);
                return Promise.resolve(res);
            }
            else if (datasetKind === IInsightFacade_1.InsightDatasetKind.Rooms) {
                let res = QueryRoomsHelper_1.default.queryRooms(query, check);
                return Promise.resolve(res);
            }
            return Promise.reject(new IInsightFacade_1.InsightError());
        }
        catch (error) {
            return Promise.reject(new IInsightFacade_1.InsightError());
        }
    }
    listDatasets() {
        return Promise.resolve(this.insightDatasets);
    }
}
exports.default = InsightFacade;
//# sourceMappingURL=InsightFacade.js.map