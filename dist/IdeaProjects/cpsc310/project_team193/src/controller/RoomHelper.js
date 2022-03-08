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
const http = __importStar(require("http"));
const Room_1 = require("../../../../../Downloads/Room");
const jszip_1 = __importDefault(require("jszip"));
const parse5_1 = __importDefault(require("parse5"));
const IInsightFacade_1 = require("./IInsightFacade");
class RoomHelper {
    constructor() {
        this.rooms = [];
        this.shortName = [];
        this.rooms = [];
        this.shortName = [];
    }
    getRooms(content) {
        return new Promise((resolve, reject) => {
            const promisesArray = [];
            jszip_1.default.loadAsync(content, { base64: true })
                .then((zips) => {
                zips.forEach((relativePath, file) => {
                    promisesArray.push(file.async("text"));
                    const filePath = relativePath.split("/");
                    if (filePath.length > 4) {
                        this.shortName.push(filePath[4]);
                    }
                    else {
                        this.shortName.push("");
                    }
                });
                return Promise.all(promisesArray);
            })
                .then((roomHtmlStringArray) => {
                const roomsFromBuildings = roomHtmlStringArray
                    .map((htmlStr) => {
                    const parseRoom = parse5_1.default.parse(htmlStr);
                    const roomFromThisBuilding = this.getRoomObjFromFiles(parseRoom, this.shortName.shift());
                    if (roomFromThisBuilding !== undefined && roomFromThisBuilding.length > 0) {
                        return roomFromThisBuilding;
                    }
                    return [];
                });
                return roomsFromBuildings.flat();
            })
                .then((rooms) => {
                this.rooms.push(...rooms);
                const promiseArray = [];
                for (let room of rooms) {
                    promiseArray.push(this.getCoordinates(room.address));
                }
                return Promise.all(promiseArray);
            })
                .then((coordArray) => {
                for (let i in coordArray) {
                    this.rooms[i].setCoordinate(coordArray[i]);
                }
                return resolve(this.rooms);
            })
                .catch((error) => {
                return reject(new IInsightFacade_1.InsightError("zip file is not valid"));
            });
        });
    }
    getRoomObjFromFiles(htmlNode, shortName) {
        let tableArray = [];
        this.getBuildingTable(htmlNode, tableArray);
        if (tableArray.length > 0) {
            let buildingObj = { shortname: shortName };
            this.getBuildingInfo(htmlNode, buildingObj);
            this.buildBuildingObj(buildingObj);
            const tableBody = tableArray[0];
            tableArray = [];
            this.getBuildingRooms(htmlNode, tableArray);
            tableArray.shift();
            return tableArray.map((row) => {
                const tds = row.childNodes.filter((cell) => {
                    return cell.nodeName === "td";
                });
                let roomObj = {};
                tds.forEach((td) => {
                    this.getRoomValByProperty(td, roomObj);
                });
                return roomObj;
            }).map((roomObj) => {
                return this.buildRoom(buildingObj, roomObj);
            });
        }
    }
    buildBuildingObj(buildingObj) {
        const buildingHtml = buildingObj.buildingInfo;
        this.getBuildingFullName(buildingHtml, buildingObj);
        this.getBuildingAddress(buildingHtml, buildingObj);
    }
    getBuildingFullName(parsedHtml, buildingObj) {
        if (parsedHtml !== undefined && Object.keys(parsedHtml).includes("childNodes")) {
            for (const child of parsedHtml.childNodes) {
                this.getBuildingFullName(child, buildingObj);
            }
        }
        if (this.isBuildingFullName(parsedHtml)) {
            buildingObj["fullname"] = parsedHtml.childNodes[0].value;
        }
    }
    getBuildingAddress(parsedHtml, buildingObj) {
        if (parsedHtml !== undefined && Object.keys(parsedHtml).includes("childNodes")) {
            for (const child of parsedHtml.childNodes) {
                this.getBuildingAddress(child, buildingObj);
            }
        }
        if (this.isBuildingAddress(parsedHtml) && !Object.keys(buildingObj).includes("address")) {
            buildingObj["address"] = parsedHtml.childNodes[0].value;
        }
    }
    isBuildingAddress(parsedHtml) {
        if (parsedHtml !== undefined && parsedHtml.nodeName === "div" && parsedHtml.attrs !== undefined) {
            for (let attr of parsedHtml.attrs) {
                if (attr.name === "class" && attr.value === "field-content") {
                    return true;
                }
            }
        }
        return false;
    }
    isBuildingFullName(parsedHtml) {
        if (parsedHtml !== undefined && parsedHtml.nodeName === "span" && parsedHtml.attrs !== undefined) {
            for (let attr of parsedHtml.attrs) {
                if (attr.name === "class" && attr.value === "field-content") {
                    return true;
                }
            }
        }
        return false;
    }
    getBuildingInfo(parsedHtml, buildingObj) {
        if (Object.keys(parsedHtml).includes("childNodes")) {
            for (const child of parsedHtml.childNodes) {
                this.getBuildingInfo(child, buildingObj);
            }
        }
        if (this.isBuildingInfo(parsedHtml)) {
            buildingObj["buildingInfo"] = parsedHtml;
        }
    }
    isBuildingInfo(parsedHtml) {
        if (parsedHtml.nodeName === "div" && parsedHtml.attrs !== undefined) {
            for (let attr of parsedHtml.attrs) {
                if (attr.name === "id" && attr.value === "building-info") {
                    return true;
                }
            }
        }
        return false;
    }
    buildRoom(buildingObj, roomObj) {
        const fullname = buildingObj["fullname"];
        const shortname = buildingObj["shortname"];
        const name = shortname + "_" + roomObj["number"];
        const address = buildingObj["address"];
        const href = roomObj["href"];
        const room1 = new Room_1.Room(fullname, shortname, roomObj["number"], name, address, roomObj["seats"], roomObj["type"], roomObj["furniture"], href);
        return room1;
    }
    getBuildingRooms(parsedHtml, resultArray) {
        if (parsedHtml.nodeName === "tr") {
            resultArray.push(parsedHtml);
        }
        else {
            if (Object.keys(parsedHtml).includes("childNodes")) {
                for (const child of parsedHtml.childNodes) {
                    this.getBuildingRooms(child, resultArray);
                }
            }
        }
    }
    getBuildingTable(parsedHtml, resultArray) {
        if (parsedHtml.nodeName === "tbody") {
            resultArray.push(parsedHtml);
        }
        else {
            if (Object.keys(parsedHtml).includes("childNodes")) {
                for (const child of parsedHtml.childNodes) {
                    this.getBuildingTable(child, resultArray);
                }
            }
        }
    }
    getRoomValByProperty(htmlNode, roomObj) {
        let attrs = htmlNode["attrs"];
        if (attrs.length > 0 && attrs[0].name === "class" &&
            attrs[0].value === "views-field views-field-nothing") {
            roomObj["href"] = htmlNode.childNodes[1].attrs[0].value.trim();
        }
        if (attrs.length > 0 && attrs[0].name === "class" &&
            attrs[0].value === "views-field views-field-field-room-number") {
            roomObj["number"] = htmlNode.childNodes[1].childNodes[0].value.trim();
        }
        if (attrs.length > 0 && attrs[0].name === "class" &&
            attrs[0].value === "views-field views-field-field-room-capacity") {
            const x = htmlNode.childNodes[0].value.trim();
            const y = +x;
            roomObj["seats"] = y;
        }
        if (attrs.length > 0 && attrs[0].name === "class" &&
            attrs[0].value === "views-field views-field-field-room-furniture") {
            roomObj["furniture"] = htmlNode.childNodes[0].value.trim();
        }
        if (attrs.length > 0 && attrs[0].name === "class" &&
            attrs[0].value === "views-field views-field-field-room-type") {
            roomObj["type"] = htmlNode.childNodes[0].value.trim();
        }
    }
    getCoordinates(address) {
        return new Promise((resolve, reject) => {
            const encodedAddress = encodeURI(address);
            http.get({
                hostname: "cs310.students.cs.ubc.ca",
                port: 11316,
                path: "/api/v1/project_team193/" + encodedAddress,
                agent: false
            }, (res) => {
                const { statusCode } = res;
                let error;
                if (statusCode === 404) {
                    error = new Error("Request Failed.\n" +
                        `Status Code: ${statusCode}`);
                }
                res.setEncoding("utf8");
                let rawData = "";
                res.on("data", (chunkData) => {
                    rawData += chunkData;
                });
                res.on("end", () => {
                    try {
                        const parsedData = JSON.parse(rawData);
                        resolve(parsedData);
                    }
                    catch (err) {
                        console.error(err.message);
                    }
                });
            }).on("err", (e) => {
                console.error(`Got err: ${e.message}`);
            });
        });
    }
}
exports.default = RoomHelper;
//# sourceMappingURL=RoomHelper.js.map