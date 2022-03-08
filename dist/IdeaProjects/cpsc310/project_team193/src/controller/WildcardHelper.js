"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WildcardHelper = void 0;
class WildcardHelper {
    static removeStar(insideItemValue) {
        if ((insideItemValue[0] === "*") && (insideItemValue[insideItemValue.length - 1] === "*")) {
            return insideItemValue.slice(1, insideItemValue.length - 1);
        }
        else if (insideItemValue[insideItemValue.length - 1] === "*") {
            return insideItemValue.slice(0, insideItemValue.length - 1);
        }
        else if (insideItemValue[0] === "*") {
            return insideItemValue.slice(1);
        }
        else {
            throw new Error();
        }
    }
    static handleStarFirstCase(modifiedField, removedStarValue, s) {
        return s.filter((section) => {
            if (modifiedField === "dept") {
                return section.dept.includes(removedStarValue);
            }
            else if (modifiedField === "id") {
                return section.id.includes(removedStarValue);
            }
            else if (modifiedField === "instructor") {
                return section.instructor.includes(removedStarValue);
            }
            else if (modifiedField === "title") {
                return section.title.includes(removedStarValue);
            }
            else if (modifiedField === "uuid") {
                return section.uuid.includes(removedStarValue);
            }
        });
    }
    static handleStarSecondCase(modifiedField, removedStarValue, s) {
        let indexStar = removedStarValue.length;
        return s.filter((section) => {
            if (modifiedField === "dept") {
                return section.dept.slice(0, indexStar).includes(removedStarValue);
            }
            else if (modifiedField === "id") {
                return section.id.slice(0, indexStar).includes(removedStarValue);
            }
            else if (modifiedField === "instructor") {
                return section.instructor.slice(0, indexStar).includes(removedStarValue);
            }
            else if (modifiedField === "title") {
                return section.title.slice(0, indexStar).includes(removedStarValue);
            }
            else if (modifiedField === "uuid") {
                return section.uuid.slice(0, indexStar).includes(removedStarValue);
            }
        });
    }
    static handleStarThirdCase(modifiedField, removedStarValue, s) {
        let indexStar = removedStarValue.length;
        return s.filter((section) => {
            if (modifiedField === "dept") {
                return section.dept.slice(section.dept.length - indexStar).includes(removedStarValue);
            }
            else if (modifiedField === "id") {
                return section.id.slice(section.id.length - indexStar).includes(removedStarValue);
            }
            else if (modifiedField === "instructor") {
                return section.instructor.slice(section.instructor.length - indexStar).includes(removedStarValue);
            }
            else if (modifiedField === "title") {
                return section.title.slice(section.title.length - indexStar).includes(removedStarValue);
            }
            else if (modifiedField === "uuid") {
                return section.uuid.slice(section.uuid.length - indexStar).includes(removedStarValue);
            }
        });
    }
    static handleStar(modifiedField, insideItemValue, sections) {
        let removedStarValue = WildcardHelper.removeStar(insideItemValue);
        let result = [];
        if ((insideItemValue[0] === "*") && (insideItemValue[insideItemValue.length - 1] === "*")) {
            result = WildcardHelper.handleStarFirstCase(modifiedField, removedStarValue, sections);
        }
        else if (insideItemValue[insideItemValue.length - 1] === "*") {
            result = WildcardHelper.handleStarSecondCase(modifiedField, removedStarValue, sections);
        }
        else if (insideItemValue[0] === "*") {
            result = WildcardHelper.handleStarThirdCase(modifiedField, removedStarValue, sections);
        }
        return result;
    }
}
exports.WildcardHelper = WildcardHelper;
//# sourceMappingURL=WildcardHelper.js.map