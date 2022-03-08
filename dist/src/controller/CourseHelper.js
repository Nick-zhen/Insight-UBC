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
Object.defineProperty(exports, "__esModule", { value: true });
const JSZip = __importStar(require("jszip"));
const IInsightFacade_1 = require("./IInsightFacade");
class CourseHelper {
    getOneSection(content) {
        const sections = [];
        const raw = JSON.parse(content).result;
        for (let e of raw) {
            try {
                const courseObj = {};
                courseObj["dept"] = e.Subject.toString();
                courseObj["id"] = e.Course.toString();
                courseObj["avg"] = Number(e.Avg);
                courseObj["instructor"] = e.Professor.toString();
                courseObj["title"] = e.Title.toString();
                courseObj["pass"] = Number(e.Pass);
                courseObj["fail"] = Number(e.Fail);
                courseObj["audit"] = Number(e.Audit);
                courseObj["uuid"] = e.id.toString();
                courseObj["year"] = Number(e.Year);
                sections.push(courseObj);
            }
            catch (err) {
                console.log("cant build course object from given zipfile :" + err);
            }
        }
        return sections;
    }
    getSections(content) {
        return new Promise((resolve, reject) => {
            let sections = [];
            const promisesArray = [];
            let courseObj;
            JSZip.loadAsync(content, { base64: true })
                .then((zips) => {
                zips.folder("courses").forEach((relativePath, file) => {
                    promisesArray.push(file.async("text"));
                });
                return Promise.all(promisesArray);
            })
                .then((courseJsonStrArray) => {
                courseJsonStrArray.forEach((jsonStr) => {
                    courseObj = this.getOneSection(jsonStr);
                    sections = sections.concat(courseObj);
                });
                resolve(sections);
            })
                .catch((error) => {
                reject(new IInsightFacade_1.InsightError("zip file is not valid"));
            });
        });
    }
}
exports.default = CourseHelper;
//# sourceMappingURL=CourseHelper.js.map