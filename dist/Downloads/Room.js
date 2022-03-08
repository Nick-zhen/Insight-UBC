"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
class Room {
    constructor(fullname, shortname, number, name, address, seats, type, furniture, href) {
        this.lat = 0;
        this.lon = 0;
        this.fullname = fullname;
        this.shortname = shortname;
        this.number = number;
        this.name = name;
        this.address = address;
        this.seats = seats;
        this.type = type;
        this.furniture = furniture;
        this.href = href;
    }
    setCoordinate(coordinate) {
        this.lat = coordinate.lat;
        this.lon = coordinate.lon;
    }
}
exports.Room = Room;
//# sourceMappingURL=Room.js.map