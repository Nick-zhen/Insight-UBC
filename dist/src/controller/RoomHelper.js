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
const Room_1 = __importDefault(require("./Room"));
const jszip_1 = __importDefault(require("jszip"));
const parse5_1 = __importDefault(require("parse5"));
const IInsightFacade_1 = require("./IInsightFacade");
class RoomHelper {
    constructor() {
        this.rooms = [];
        this.rooms = [];
    }
    getIndexFilePromise(zips) {
        const indexFile = zips
            .filter((relativePath, file) => {
            return relativePath === "rooms/index.htm";
        })
            .map((file) => {
            return file.async("text");
        });
        if (indexFile.length === 0) {
            return Promise.reject("couldn't find index file");
        }
        return indexFile[0];
    }
    getBuildings(indexHtml) {
        const parseRoom = parse5_1.default.parse(indexHtml);
        let resultArray = [];
        this.getIndexHtmlBuildingTable(parseRoom, resultArray);
        const buildings = resultArray
            .filter((node) => {
            return node.nodeName === "tr";
        })
            .map((row) => {
            const abc = row.childNodes.filter((cell) => {
                return cell.nodeName === "td";
            });
            abc.shift();
            const code = abc.shift().childNodes[0].value.trim();
            const refLink = abc[0].childNodes[1].attrs
                .filter((attr) => {
                return attr.name === "href";
            })
                .map((attr) => {
                return attr.value;
            })[0];
            const fullName = abc.shift().childNodes[1].childNodes[0].value.trim();
            const address = abc.shift().childNodes[0].value.trim();
            return { shortname: code, href: refLink, fullname: fullName, address: address };
        });
        return buildings;
    }
    readBuildingFile(zips, buildingShortsNames) {
        const buildingPromises = zips
            .filter((relativePath, file) => {
            const shortname = relativePath.split("/").pop();
            return buildingShortsNames.includes(shortname);
        })
            .map((zip) => {
            return zip.async("text");
        });
        return Promise.all(buildingPromises);
    }
    getRoomFromBuildings(requiredBuilding, buildings) {
        const roomsFromBuildings = requiredBuilding.map((htmlStr) => {
            const parseRoom = parse5_1.default.parse(htmlStr);
            const roomFromThisBuilding = this.getRoomObjFromFiles(parseRoom, buildings);
            if (roomFromThisBuilding !== undefined && roomFromThisBuilding.length > 0) {
                return roomFromThisBuilding;
            }
            return [];
        });
        const returnRooms = roomsFromBuildings.flat();
        return returnRooms;
    }
    getRoomCoordinate(rooms) {
        this.rooms.push(...rooms);
        const promiseArray = [];
        for (let room of rooms) {
            promiseArray.push(this.getCoordinates(room.address));
        }
        return Promise.all(promiseArray);
    }
    getRooms(content) {
        return new Promise((resolve, reject) => {
            const promisesArray = [];
            jszip_1.default.loadAsync(content, { base64: true })
                .then((zips) => {
                return this.getIndexFilePromise(zips);
            })
                .then((indexHtml) => {
                return this.getBuildings(indexHtml);
            })
                .then((buildings) => {
                const buildingShortsNames = buildings.map((building) => {
                    return building.shortname;
                });
                jszip_1.default.loadAsync(content, { base64: true })
                    .then((zips) => {
                    return this.readBuildingFile(zips, buildingShortsNames);
                })
                    .then((requiredBuilding) => {
                    const allRooms = this.getRoomFromBuildings(requiredBuilding, buildings);
                    return allRooms;
                })
                    .then((rooms) => {
                    return this.getRoomCoordinate(rooms);
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
            })
                .catch((error) => {
                return reject(new IInsightFacade_1.InsightError(error.toString()));
            });
        });
    }
    getIndexHtmlBuildingTable(parsedHtml, resultArray) {
        if (parsedHtml.nodeName === "tbody") {
            resultArray.push(...parsedHtml.childNodes);
        }
        if (Object.keys(parsedHtml).includes("childNodes")) {
            for (const child of parsedHtml.childNodes) {
                this.getIndexHtmlBuildingTable(child, resultArray);
            }
        }
    }
    getBuildingShortname(htmlNode) {
        const htmlStr = parse5_1.default.serialize(htmlNode);
        const pattern = '<link rel="canonical" href=';
        const position = htmlStr.search(pattern);
        return htmlStr.substr(position, pattern.length + 10).split('"')[3];
        console.log(htmlStr.substr(position, pattern.length + 10));
    }
    getRoomObjFromFiles(htmlNode, buildings) {
        let tableArray = [];
        this.getBuildingTable(htmlNode, tableArray);
        if (tableArray.length > 0) {
            const shortname = this.getBuildingShortname(htmlNode);
            let building = buildings.filter((b) => {
                return b.shortname === shortname;
            })[0];
            let roomArray = [];
            this.getBuildingRooms(htmlNode, roomArray);
            return roomArray
                .map((row) => {
                const tds = row.childNodes.filter((cell) => {
                    return cell.nodeName === "td";
                });
                let roomObj = { shortname: building.shortname };
                tds.forEach((td) => {
                    this.getRoomValByProperty(td, roomObj);
                });
                return roomObj;
            })
                .filter((room) => {
                return Object.keys(room).length > 1;
            })
                .map((roomObj) => {
                return this.buildRoom(building, roomObj);
            });
        }
    }
    buildRoom(buildingObj, roomObj) {
        const fullname = buildingObj["fullname"];
        const shortname = buildingObj["shortname"];
        const name = shortname + "_" + roomObj["number"];
        const address = buildingObj["address"];
        const href = roomObj["href"];
        const room1 = new Room_1.default(fullname, shortname, roomObj["number"], name, address, roomObj["seats"], roomObj["type"], roomObj["furniture"], href);
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
        if (attrs.length > 0 && attrs[0].name === "class" && attrs[0].value === "views-field views-field-nothing") {
            roomObj["href"] = htmlNode.childNodes[1].attrs[0].value.trim();
        }
        if (attrs.length > 0 &&
            attrs[0].name === "class" &&
            attrs[0].value === "views-field views-field-field-room-number") {
            roomObj["number"] = htmlNode.childNodes[1].childNodes[0].value.trim();
        }
        if (attrs.length > 0 &&
            attrs[0].name === "class" &&
            attrs[0].value === "views-field views-field-field-room-capacity") {
            const x = htmlNode.childNodes[0].value.trim();
            const y = +x;
            roomObj["seats"] = y;
        }
        if (attrs.length > 0 &&
            attrs[0].name === "class" &&
            attrs[0].value === "views-field views-field-field-room-furniture") {
            roomObj["furniture"] = htmlNode.childNodes[0].value.trim();
        }
        if (attrs.length > 0 &&
            attrs[0].name === "class" &&
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
                agent: false,
            }, (res) => {
                const { statusCode } = res;
                let error;
                if (statusCode === 404) {
                    error = new Error("Request Failed.\n" + `Status Code: ${statusCode}`);
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