"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AddCourseDatasetHelper {
    static concatSectionsHelper(reason, sections) {
        reason.forEach((section) => {
            if (Array.isArray(section)) {
                sections = sections.concat(section);
            }
        });
        return sections;
    }
    static rawInputToSec(e) {
        return {
            dept: e.Subject.toString(),
            id: e.Course.toString(),
            avg: Number(e.Avg),
            instructor: e.Professor.toString(),
            title: e.Title.toString(),
            pass: Number(e.Pass),
            fail: Number(e.Fail),
            audit: Number(e.Audit),
            uuid: e.id.toString(),
            year: Number(e.Year)
        };
    }
    static getFileSec(file) {
        return new Promise((resolve, reject) => {
            file.async("text").then((stringContent) => {
                const sections = [];
                try {
                    let rawString = JSON.parse(stringContent).result;
                    for (let e of rawString) {
                        if ((e.Section === "overall")) {
                            e.Year = 1900;
                        }
                        if (Object.prototype.hasOwnProperty.call(e, "Subject")
                            && Object.prototype.hasOwnProperty.call(e, "Course")
                            && Object.prototype.hasOwnProperty.call(e, "Avg")
                            && Object.prototype.hasOwnProperty.call(e, "Professor")
                            && Object.prototype.hasOwnProperty.call(e, "Title")
                            && Object.prototype.hasOwnProperty.call(e, "Pass")
                            && Object.prototype.hasOwnProperty.call(e, "Fail")
                            && Object.prototype.hasOwnProperty.call(e, "Audit")
                            && Object.prototype.hasOwnProperty.call(e, "id")
                            && Object.prototype.hasOwnProperty.call(e, "Year")) {
                            sections.push(this.rawInputToSec(e));
                        }
                    }
                    resolve(sections);
                }
                catch {
                    reject("unable to get sections from file");
                }
            });
        });
    }
}
exports.default = AddCourseDatasetHelper;
//# sourceMappingURL=AddCourseDatasetHelper.js.map