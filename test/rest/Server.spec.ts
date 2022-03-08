import Server from "../../src/rest/Server";
import InsightFacade from "../../src/controller/InsightFacade";
import chai, {expect, use} from "chai";
import chaiHttp from "chai-http";
import * as fs from "fs-extra";
import {InsightDatasetKind} from "../../src/controller/IInsightFacade";

// describe("Facade D3", function () {
// 	this.timeout(30000);
// 	const SERVER_URL = "http://localhost:4321";
// 	const ZIP_FILE_DATA = getFileContent("test/resources/archives/courses.zip");
// 	const roomsContent = getFileContent("test/resources/archives/rooms.zip");
// 	const PUT_ENDPOINT_URL = "/dataset/course/courses";
// 	const DEL_ENDPOINT_URL = "/dataset/courses";
// 	const POST_ENDPOINT_URL = "/query";
// 	const GET_ENDPOINT_URL = "/datasets";
//
// 	let facade: InsightFacade;
// 	let server: Server;
//
// 	function getFileContent(path: string): any {
// 		return fs.readFileSync(path);
// 	}
//
// 	use(chaiHttp);
//
// 	function clearDatasets(): void {
// 		fs.removeSync("data");
// 	}
// 	before(async function () {
// 		await clearDatasets();
// 		facade = new InsightFacade();
// 		server = new Server(4321);
// 		await facade.addDataset("courses", ZIP_FILE_DATA, InsightDatasetKind.Courses);
// 		await facade.addDataset("courseForDel", ZIP_FILE_DATA, InsightDatasetKind.Courses);
// 		// await facade.addDataset("rooms", roomsContent, InsightDatasetKind.Rooms);
// 		// TODO: start server here once and handle errors properly
// 		return server.start().then(() => {
// 			console.info("App::initServer() - started");
// 		}).catch((err: Error) => {
// 			console.error(`App::initServer() - ERROR: ${err.message}`);
// 		});
// 	});
//
// 	after(function () {
// 		// TODO: stop server here once!
// 		server.stop();
// 	});
//
// 	beforeEach(async function () {
// 		// might want to add some process logging here to keep track of what"s going on
// 	});
//
// 	afterEach(function () {
// 		// might want to add some process logging here to keep track of what"s going on
// 		// clearDatasets();
// 	});
//
// 	// Sample on how to format PUT requests
//
// 	it("PUT test for courses dataset", function () {
// 		try {
// 			return chai.request("http://localhost:4321")
// 				.put("/dataset/courseForPut/courses")
// 				.send(ZIP_FILE_DATA)
// 				.set("Content-Type", "application/x-zip-compressed")
// 				.then(function (res: any) {
// 					// some logging here please!
// 					console.log("success!");
// 					expect(res.status).to.be.equal(200);
// 				})
// 				.catch(function (err) {
// 					// some logging here please!
// 					expect.fail();
// 				});
// 		} catch (err) {
// 			console.log(err);
// 			expect.fail();
// 			// and some more logging here!
// 		}
// 	});
//
// 	it("DELETE test for courses dataset", async function () {
// 		try {
// 			return chai.request(SERVER_URL)
// 				.delete("/dataset/courseForDel")
// 				.then(function (res: any) {
// 					// some logging here please!
// 					expect(res.status).to.be.equal(200);
// 				})
// 				.catch(function (err) {
// 					// some logging here please!
// 					console.log(err);
// 					expect.fail();
// 				});
// 		} catch (err) {
// 			// and some more logging here!
// 			console.log(err);
// 			expect.fail();
// 		}
// 	});
//
// 	it("DELETE non-exist test for courses dataset", function () {
// 		try {
// 			return chai.request(SERVER_URL)
// 				.delete("/dataset/rooms")
// 				.send()
// 				.set("Content-Type", "application/x-zip-compressed")
// 				.then(function (res: any) {
// 					// some logging here please!
// 					expect(res.status).to.be.equal(404);
// 				})
// 				.catch(function (err) {
// 					// some logging here please!
// 					expect.fail();
// 				});
// 		} catch (err) {
// 			// and some more logging here!
// 			console.log(err);
// 			expect.fail();
// 		}
// 	});
//
// 	it("POST test for courses dataset", function () {
// 		const obj = {
// 			WHERE: {
// 				GT: {
// 					courses_avg: 99
// 				}
// 			},
// 			OPTIONS: {
// 				COLUMNS: [
// 					"courses_id",
// 					"courses_avg"
// 				],
// 				ORDER: "courses_id"
// 			}
// 		};
// 		try {
// 			return chai.request(SERVER_URL)
// 				.post("/query")
// 				.send(obj)
// 				// .set("Content-Type", "application/x-zip-compressed")
// 				.then(function (res: any) {
// 					// some logging here please!
// 					expect(res.status).to.be.equal(200);
// 					console.log("success!");
// 				})
// 				.catch(function (err) {
// 					// some logging here please!
// 					expect.fail();
// 				});
// 		} catch (err) {
// 			// and some more logging here!
// 			expect.fail();
// 		}
// 	});
//
// 	it("GET test for courses dataset", function () {
// 		try {
// 			return chai.request(SERVER_URL)
// 				.get("/datasets")
// 				.then(function (res: any) {
// 						// some logging here please!
// 					expect(res.status).to.be.equal(200);
// 					console.log("success!");
// 				})
// 				.catch(function (err) {
// 						// some logging here please!
// 					expect.fail();
// 				});
// 		} catch (err) {
// 			// and some more logging here!
// 			console.log(err);
// 			expect.fail();
// 		}
// 	});
//
//
// 	// The other endpoints work similarly. You should be able to find all instructions at the chai-http documentation
// });
