"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const InsightFacade_1 = __importDefault(require("../controller/InsightFacade"));
const IInsightFacade_1 = require("../controller/IInsightFacade");
class Server {
    constructor(port) {
        this.insightFacade = new InsightFacade_1.default();
        this.addDataset = (req, res) => {
            const context = req.body.toString("base64");
            let kind = IInsightFacade_1.InsightDatasetKind.Rooms;
            if (req.params.kind === "courses") {
                kind = IInsightFacade_1.InsightDatasetKind.Courses;
            }
            try {
                this.insightFacade
                    .addDataset(req.params.id, context, kind)
                    .then((result) => {
                    res.status(200);
                    res.json({ result: result });
                })
                    .catch((error) => {
                    console.log(error);
                    res.status(400).json({ error: "fail to add dataset" });
                });
            }
            catch (e) {
                res.status(400).send({ error: "fail to add dataset" });
            }
        };
        this.deleteDataset = (req, res) => {
            try {
                this.insightFacade
                    .removeDataset(req.params.id)
                    .then((result) => {
                    res.status(200).json({ result: result });
                })
                    .catch((err) => {
                    if (err instanceof IInsightFacade_1.InsightError) {
                        console.log(400);
                        res.status(400).json({ error: "fail due to InsightError" });
                    }
                    else {
                        console.log(404);
                        res.status(404).json({ error: "fail due to NotFoundError" });
                    }
                });
            }
            catch (err) {
                console.log(err);
                res.status(404).json({ error: "fail due to NotFoundError" });
            }
        };
        this.listDataset = (req, res) => {
            try {
                this.insightFacade.listDatasets().then((result) => {
                    res.status(200).json({ result: result });
                }).catch((error) => {
                    res.status(400).json({ error: "fail to list the dataset" });
                });
            }
            catch (err) {
                console.log(err);
            }
        };
        this.performQuery = (req, res) => {
            try {
                this.insightFacade.performQuery(req.body).then((result) => {
                    res.status(200).json({ result: result });
                }).catch((error) => {
                    console.log(error);
                    res.status(400).json({ error: "fail to return the result" });
                });
            }
            catch (err) {
                console.log(err);
                res.status(400).json({ error: "fail to return the result" });
            }
        };
        console.info(`Server::<init>( ${port} )`);
        this.port = port;
        this.express = (0, express_1.default)();
        this.registerMiddleware();
        this.registerRoutes();
        this.express.use(express_1.default.static("./frontend/public"));
    }
    start() {
        return new Promise((resolve, reject) => {
            console.info("Server::start() - start");
            if (this.server !== undefined) {
                console.error("Server::start() - server already listening");
                reject();
            }
            else {
                this.server = this.express.listen(this.port, () => {
                    console.info(`Server::start() - server listening on port: ${this.port}`);
                    resolve();
                }).on("error", (err) => {
                    console.error(`Server::start() - server ERROR: ${err.message}`);
                    reject(err);
                });
            }
        });
    }
    stop() {
        console.info("Server::stop()");
        return new Promise((resolve, reject) => {
            if (this.server === undefined) {
                console.error("Server::stop() - ERROR: server not started");
                reject();
            }
            else {
                this.server.close(() => {
                    console.info("Server::stop() - server closed");
                    resolve();
                });
            }
        });
    }
    registerMiddleware() {
        this.express.use(express_1.default.json());
        this.express.use(express_1.default.raw({ type: "application/*", limit: "10mb" }));
        this.express.use((0, cors_1.default)());
    }
    registerRoutes() {
        this.express.get("/echo/:msg", Server.echo);
        console.log(this.insightFacade);
        this.express.get("/datasets", this.listDataset);
        this.express.put("/dataset/:id/:kind", this.addDataset);
        this.express.delete("/dataset/:id", this.deleteDataset);
        this.express.post("/query", this.performQuery);
    }
    static echo(req, res) {
        try {
            console.log(`Server::echo(..) - params: ${JSON.stringify(req.params)}`);
            const response = Server.performEcho(req.params.msg);
            res.status(200).json({ result: response });
        }
        catch (err) {
            res.status(400).json({ error: err });
        }
    }
    static performEcho(msg) {
        if (typeof msg !== "undefined" && msg !== null) {
            return `${msg}...${msg}`;
        }
        else {
            return "Message not provided";
        }
    }
}
exports.default = Server;
//# sourceMappingURL=Server.js.map