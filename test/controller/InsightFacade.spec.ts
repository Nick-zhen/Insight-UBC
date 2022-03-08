import chai, {expect, use} from "chai";
import chaiAsPromised from "chai-as-promised";
import {testFolder} from "@ubccpsc310/folder-test";


import InsightFacade from "../../src/controller/InsightFacade";
import {
	InsightDataset,
	InsightDatasetKind,
	InsightError,
	NotFoundError,
	ResultTooLargeError
} from "../../src/controller/IInsightFacade";
import * as fs from "fs-extra";
import QueryHelper from "../../src/controller/QueryHelper";
import Sections from "../../src/controller/Sections";
import {query} from "express";
import exp from "constants";
import {CheckValidityQueryHelper} from "../../src/controller/CheckValidityQueryHelper";
import {CheckRoomQueryValidity} from "../../src/controller/CheckRoomQueryValidity";
import {CheckCourseQueryValidity} from "../../src/controller/CheckCourseQueryValidity";
import TransformationsHelper from "../../src/controller/TransformationsHelper";
import CourseOptionsHelper from "../../src/controller/CourseOptionsHelper";
import QueryRoomsHelper from "../../src/controller/QueryRoomsHelper";
import RoomsOptionsHelper from "../../src/controller/RoomsOptionsHelper";
import TransformationRoomHelper from "../../src/controller/TransformationRoomHelper";

use(chaiAsPromised);

chai.use(chaiAsPromised);


describe ("InsightFacade", function() {
	function getFileContent(path: string): string {
		return fs.readFileSync(path).toString("base64");
	}
	let context: string = getFileContent("test/resources/archives/courses.zip");
	let roomContext: string = getFileContent("test/resources/archives/rooms.zip");

	function clearDatasets(): void {
		fs.removeSync("data");
	}

	describe("firstThreeFn", function () {
		this.timeout(30000);
		let insightFacade: InsightFacade;

		beforeEach(function () {
			clearDatasets();
			insightFacade = new InsightFacade();
		});

		// it("test rooms", async function () {
		// 	let rooms: any[] = [
		// 		{fullname:"aanb",shortname:"aa",number:"1",name:"Jean",address:"310",
		// 			lat:9,lon:0,seats:9,type:"1",furniture:"desk",href:"href"},
		// 		{fullname:"aanb",shortname:"aa",number:"2",name:"Jean",address:"310",
		// 			lat:9,lon:0,seats:8,type:"1",furniture:"desk",href:"href"},
		// 		{fullname:"aanb",shortname:"aa",number:"3",name:"Jean",address:"310",
		// 			lat:9,lon:0,seats:7,type:"1",furniture:"desk",href:"href"},
		// 		{fullname:"aanb",shortname:"aa",number:"4",name:"Jean",address:"310",
		// 			lat:9,lon:0,seats:6,type:"1",furniture:"desk",href:"href"},
		// 		{fullname:"aanb",shortname:"aa",number:"5",name:"Jean",address:"210",
		// 			lat:9,lon:0,seats:5,type:"1",furniture:"desk",href:"href"},
		// 		{fullname:"aanb",shortname:"aa",number:"6",name:"Jean",address:"210",
		// 			lat:9,lon:0,seats:4,type:"1",furniture:"desk",href:"href"},
		// 		{fullname:"aanb",shortname:"aa",number:"7",name:"Jean",address:"210",
		// 			lat:9,lon:0,seats:3,type:"1",furniture:"desk",href:"href"},
		// 		{fullname:"aanb",shortname:"aa",number:"8",name:"Jean",address:"210",
		// 			lat:9,lon:0,seats:2,type:"1",furniture:"desk",href:"href"},
		// 		{fullname:"aanb",shortname:"aa",number:"9",name:"Jean",address:"110",
		// 			lat:9,lon:0,seats:1,type:"1",furniture:"desk",href:"href"},
		// 		{fullname:"aanb",shortname:"aa",number:"10",name:"Jean",address:"110",
		// 			lat:9,lon:0,seats:0,type:"1",furniture:"desk",href:"href"},
		// 		{fullname:"aanb",shortname:"aa",number:"11",name:"Jean",address:"510",
		// 			lat:9,lon:0,seats:0,type:"1",furniture:"desk",href:"href"},
		// 		{fullname:"aanb",shortname:"aa",number:"12",name:"Jean",address:"510",
		// 			lat:9,lon:0,seats:0,type:"1",furniture:"desk",href:"href"}
		// 	];
		// // public mfield = ["lat", "lon", "seats"];
		// // public sfield = ["fullname", "shortname", "number", "name", "address", "type", "furniture", "href"];
		// 	const obj = {
		// 		WHERE: {
		// 			GT: {
		// 				rooms_seats: 1
		// 			}
		// 		},
		// 		OPTIONS: {
		// 			COLUMNS: [
		// 				"rooms_shortname", "maxSeats"
		// 			],
		// 			ORDER: {
		// 				dir: "DOWN",
		// 				keys: ["maxSeats"]
		// 			}
		// 		},
		// 		TRANSFORMATIONS: {
		// 			GROUP: ["rooms_shortname"],
		// 			APPLY: [{
		// 				maxSeats: {
		// 					MAX: "rooms_seats"
		// 				}
		// 			}]
		// 		}
		// 	};
		// 	// let group: any = obj["TRANSFORMATIONS"]["GROUP"];
		// 	// let apply: any = obj["TRANSFORMATIONS"]["APPLY"];
		//
		// 	let check: CheckCourseQueryValidity = new CheckRoomQueryValidity();
		// 	expect(check.isQueryValid(obj)).to.deep.equal(true);
		// 	let afterWhere = QueryRoomsHelper.handleWHERE(obj["WHERE"], rooms);
		// 	let afterApply = TransformationRoomHelper.handleTransformations(obj, afterWhere);
		// 	let resultSections = RoomsOptionsHelper.handleApplyOptions(obj["OPTIONS"],afterApply,check);
		//
		// 	let res = insightFacade.performQuery(obj);
		// 	expect(resultSections).to.deep.equal(true);
		// });

		// it("test courses",  function() {
		// 	let sections: Sections[] = [
		// 		{dept:"aanb",id:"504",avg:90,instructor:"Jean",title:"310",
		// 			pass:9,fail:0,audit:9,uuid:"1",year:2015},
		// 		{dept:"aanb",id:"504",avg:80,instructor:"Jean",title:"310",
		// 			pass:9,fail:0,audit:9,uuid:"2",year:1900},
		// 		{dept:"aanc",id:"504",avg:95,instructor:"Casey",title:"310",
		// 			pass:9,fail:0,audit:9,uuid:"3",year:1900},
		// 		{dept:"aanb",id:"551",avg:85,instructor:"Casey",title:"310",
		// 			pass:6,fail:0,audit:0,uuid:"4",year:2015},
		// 		{dept:"aanb",id:"504",avg:74,instructor:"Kelly",title:"210",
		// 			pass:9,fail:0,audit:9,uuid:"5",year:2015},
		// 		{dept:"aanb",id:"504",avg:78,instructor:"Kelly",title:"210",
		// 			pass:9,fail:0,audit:9,uuid:"6",year:1900},
		// 		{dept:"aanc",id:"504",avg:72,instructor:"Kelly",title:"210",
		// 			pass:9,fail:0,audit:9,uuid:"7",year:1900},
		// 		{dept:"aanb",id:"551",avg:85,instructor:"Eli",title:"210",
		// 			pass:6,fail:0,audit:0,uuid:"8",year:2015},
		// 		{dept:"aanc",id:"504",avg:71,instructor:"Kelly",title:"110",
		// 			pass:9,fail:0,audit:9,uuid:"7",year:1900},
		// 		{dept:"aanc",id:"504",avg:73,instructor:"Kelly",title:"110",
		// 			pass:9,fail:0,audit:9,uuid:"7",year:1900},
		// 		{dept:"aanc",id:"504",avg:72,instructor:"Kelly",title:"510",
		// 			pass:9,fail:0,audit:9,uuid:"7",year:1900},
		// 		{dept:"aanc",id:"504",avg:72,instructor:"Kelly",title:"510",
		// 			pass:9,fail:0,audit:9,uuid:"7",year:1900}];
		// 	const obj = {
		// 		WHERE: {},
		// 		OPTIONS: {
		// 			COLUMNS: ["courses_title", "overallAvg", "maxAvg"],
		// 			ORDER: {
		// 				dir: "DOWN",
		// 				keys: [
		// 					"overallAvg", "maxAvg"
		// 				]
		// 			}
		// 		},
		// 		TRANSFORMATIONS: {
		// 			GROUP: ["courses_title"],
		// 			APPLY: [
		// 				{
		// 					overallAvg: {
		// 						AVG: "courses_avg"
		// 					}
		// 				},
		// 				{
		// 					maxAvg: {
		// 						MAX: "courses_avg"
		// 					}
		// 				}
		// 			]
		// 		}
		// 	};
		// 	let group: any = obj["TRANSFORMATIONS"]["GROUP"];
		// 	let apply: any = obj["TRANSFORMATIONS"]["APPLY"];
		//
		// 	// let content: string = getFileContent("test/resources/archives/courses.zip");
		// 	// return insightFacade.addDataset("ubc", content, InsightDatasetKind.Courses)
		// 	// 	.then(() => {
		// 	// 		try {
		// 	// 			let result = insightFacade.performQuery(obj);
		// 	// 			expect(result).to.deep.equal([]);
		// 	// 		} catch (error) {
		// 	// 			expect(error).instanceof(InsightError);
		// 	// 		}
		// 	// 	});
		//
		// 	let check: CheckCourseQueryValidity = new CheckCourseQueryValidity();
		//
		// 	let map: Map<any, any[]> = TransformationsHelper.handleGroup(group, sections);
		// 	let applyKeys: Set<string[]> = TransformationsHelper.getApplyKeys(apply);
		// 	let afterApply = TransformationsHelper.handleTransformations(obj, sections);
		// 	expect(check.isQueryValid(obj)).to.deep.equal(true);
		// 	let order: any[] = CourseOptionsHelper.handleApplyOptions(obj["OPTIONS"],afterApply,check);
		// 	// let res = insightFacade.performQuery(obj);
		// 	expect(order).to.deep.equal(true);
		// });


		// add room successfully
		// it("should add one correct Room Dataset",async function () {
		// 	const obj = {
		// 		WHERE: {
		// 			GT: {
		// 				rooms_seats: 300
		// 			}
		// 		},
		// 		OPTIONS: {
		// 			COLUMNS: [
		// 				"rooms_shortname", "maxSeats"
		// 			],
		// 			ORDER: {
		// 				dir: "DOWN",
		// 				keys: ["maxSeats"]
		// 			}
		// 		},
		// 		TRANSFORMATIONS: {
		// 			GROUP: ["rooms_shortname"],
		// 			APPLY: [{
		// 				maxSeats: {
		// 					MAX: "rooms_seats"
		// 				}
		// 			}]
		// 		}
		// 	};
		// 	let res = await insightFacade.addDataset("rooms", roomContext, InsightDatasetKind.Rooms);
		// 	// await insightFacade.addDataset("rooms", roomContext, InsightDatasetKind.Rooms);
		// 	let result = insightFacade.performQuery(obj);
		// 	// return expect(result).to.deep.equal({});
		// 	return expect(res).to.deep.equal(["rooms"]);
		// });

		// * to test addDataset
		it("should add one correct Dataset", async function () {
			let obj = {
				WHERE: {
					AND: [
						{
							GT: {
								courses_avg: 65
							}
						},
						{
							IS: {
								courses_instructor: "cox, barbara"
							}
						}
					]
				},
				OPTIONS: {
					COLUMNS: [
						"courses_avg",
						"courses_instructor"
					]
				}
			};
			let res = await insightFacade.addDataset("courses", context, InsightDatasetKind.Courses);
			let result = insightFacade.performQuery(obj);
			return expect(result).eventually.to.deep.equal(["courses"]);
		});

		it("should add one Room Datasets", async function () {
			// return insightFacade.addDataset("rooms", roomContext, InsightDatasetKind.Rooms)
			// 	.then((result) => {
			// 		return expect(result).eventually.to.deep.equal(["rooms"]);
			// 	});
			const result = await insightFacade.addDataset("Rooms", roomContext, InsightDatasetKind.Rooms);
			return expect(result).to.deep.equal(["Rooms"]);
		});

		it("should add multiple Room Datasets", function () {
			// return insightFacade.addDataset("rooms", roomContext, InsightDatasetKind.Rooms).then(() => {
			// 	return insightFacade.addDataset("rooms-2", roomContext, InsightDatasetKind.Rooms);
			// }).then((result) => {
			// 	return expect(result).eventually.to.deep.equal(["rooms", "rooms-2"]);
			// });
			return insightFacade.addDataset("Room", roomContext, InsightDatasetKind.Rooms).then(() => {
				// console.log("test1");
				const result = insightFacade.addDataset("Room-2", roomContext, InsightDatasetKind.Rooms);
				return expect(result).eventually.to.deep.equal(["Room", "Room-2"]);
			});
		});

		it("should add multiple Datasets", function () {
			return insightFacade.addDataset("Courses", context, InsightDatasetKind.Courses).then(() => {
				const result = insightFacade.addDataset("Room-2", roomContext, InsightDatasetKind.Rooms);
				return expect(result).eventually.to.deep.equal(["Courses", "Room-2"]);
			});
		});

		// it should rejected when there is underscore
		it("should reject with only Underscore", function () {
			const result = insightFacade.addDataset("_", context, InsightDatasetKind.Courses);
			return expect(result).eventually.to.be.rejectedWith(InsightError);
		});

		it("should reject with char and Underscore", function () {
			const result = insightFacade.addDataset("course_", context, InsightDatasetKind.Courses);
			return expect(result).eventually.to.be.rejectedWith(InsightError);
		});


		it("should reject with whitespace and Underscore", function () {
			const result = insightFacade.addDataset("_ _", context, InsightDatasetKind.Courses);
			return expect(result).eventually.to.be.rejectedWith(InsightError);
		});

		it("should reject with one WhiteSpace if there is", function () {
			const result = insightFacade.addDataset(" ", context, InsightDatasetKind.Courses);
			return expect(result).eventually.to.be.rejectedWith(InsightError);
		});


		it("should reject to add Dataset with invalid content", function () {
			const result = insightFacade.addDataset(" ", "null", InsightDatasetKind.Courses);
			return expect(result).eventually.to.be.rejectedWith(InsightError);
		});


		// it("should reject to add Dataset with invalid file path", function () {
		//   const result = insightFacade.addDataset(" ", getFileContent("InsightFacade.ts"), InsightDatasetKind.Courses);
		//   return expect(result).eventually.to.be.rejectedWith(InsightError);
		// });


		it("should reject with WhiteSpace char and underscore", function () {
			const result = insightFacade.addDataset("cour_se ", context, InsightDatasetKind.Courses);
			return expect(result).eventually.to.be.rejectedWith(InsightError);
		});


		it("should reject with multiple WhiteSpace if there is", function () {
			const result = insightFacade.addDataset("  ", context, InsightDatasetKind.Courses);
			return expect(result).eventually.to.be.rejectedWith(InsightError);
		});


		it("should add char with WhiteSpace if there is", function () {
			const result = insightFacade.addDataset("c  ", context, InsightDatasetKind.Courses);
			return expect(result).eventually.to.deep.equal(["c  "]);
		});

		it("should reject with existed id", function () {
			return insightFacade.addDataset("Courses", context, InsightDatasetKind.Courses).then(() => {
				return insightFacade.addDataset("Courses", context, InsightDatasetKind.Courses);
			}).catch((result) => {
				return expect(result).to.be.instanceof(InsightError);
			});
		});

		//* to test listDatasets

		it("should list no dataset", function () {
			insightFacade.listDatasets().then((insightDatasets) => {
				// expect(insightDatasets).to.deep.equal([]);
				expect(insightDatasets).to.have.an.instanceof(Array);
				expect(insightDatasets).to.have.length(0);
				// const futureInsightDatasets = insightFacade.listDatasets();
				// return expect(futureInsightDatasets).to.eventually.deep.equal([]);
			});
		});

		it("should list one dataset", function () {
			return insightFacade.addDataset("courses", context, InsightDatasetKind.Courses)
				.then((addedIds) => {
					return insightFacade.listDatasets();
				})
				.then((insightDatasets) => {
					expect(insightDatasets).to.deep.equal([{
						id: "courses",
						kind: InsightDatasetKind.Courses,
						numRows: 64612,
					}]);

					expect(insightDatasets).to.be.an.instanceof(Array);
					expect(insightDatasets).to.have.length(1);
					const [insightDataset] = insightDatasets;
					expect(insightDataset).to.have.property("id");
					expect(insightDataset.id).to.equal("courses");
				});
		});

		it("should list multiple dataset", function () {
			return insightFacade.addDataset("courses", context, InsightDatasetKind.Courses)
				.then(() => {
					return insightFacade.addDataset("courses-2", context, InsightDatasetKind.Courses);
				})
				.then(() => {
					return insightFacade.listDatasets();
				})
				.then((insightDataset) => {
					const expectedDatasets: InsightDataset[] = [
						{
							id: "courses",
							kind: InsightDatasetKind.Courses,
							numRows: 64612,
						},
						{
							id: "courses-2",
							kind: InsightDatasetKind.Courses,
							numRows: 64612,
						}
					];
					expect(insightDataset).to.be.an.instanceof(Array);
					expect(insightDataset).to.have.length(2);
					expect(expectedDatasets).to.deep.equal(insightDataset);
				});
		});

		//* to test removeDataset
		it("should remove one correct dataset", function () {
			return insightFacade.addDataset("Courses", context, InsightDatasetKind.Courses).then(() => {
				return insightFacade.removeDataset("Courses");
			}).then(() => {
				return insightFacade.listDatasets();
			}).then((insightDataset) => {
				expect(insightDataset).to.be.an.instanceof(Array);
				expect(insightDataset).to.have.length(0);
			});
		});

		it("fail to remove one dataset after adding another dataset", function () {
			return insightFacade.addDataset("Courses", context, InsightDatasetKind.Courses).then(() => {
				return insightFacade.removeDataset("Courses-2");
			}).then(() => {
				expect.fail();
			}).catch((result) => {
				expect(result).to.be.instanceof(NotFoundError);
			});
		});


		// it("should remove multiple datasets", function () {
		//   return insightFacade.addDataset("Courses", content, InsightDatasetKind.Courses).then(() =>
		//   {
		//     return insightFacade.addDataset("Courses-2", content, InsightDatasetKind.Courses).then(() =>
		//     {
		//       return insightFacade.removeDataset("Courses")}).then((result) =>
		//     {
		//       return insightFacade.listDatasets()}).then((insightDataset) =>
		//     {
		//       expect(insightDataset).to.be.an.instanceof(Array);
		//       expect(insightDataset).to.have.length(1).
		//
		//


		it("should remove one correct dataset in many datasets", function () {
			return insightFacade.addDataset("Courses", context, InsightDatasetKind.Courses).then(() => {
				return insightFacade.addDataset("Courses-2", context, InsightDatasetKind.Courses).then(() => {
					return insightFacade.removeDataset("Courses");
				}).then((result) => {
					expect(result).to.deep.equal("Courses");
					return insightFacade.listDatasets().then((insightDataset) => {
						expect(insightDataset).to.deep.equal([{
							id: "Courses-2",
							kind: InsightDatasetKind.Courses,
							numRows: 64612,
						}]);
					});
				});
			});
		});


		// when reject with NotFoundError
		it("should reject with NotFoundError when id wasn't added", function () {
			const result = insightFacade.removeDataset("Courses");
			return expect(result).eventually.to.be.rejectedWith(NotFoundError);
		});

		// when reject with InsightError (invalid id or any other source of failure)  //???? how to fully test this one
		it("should reject with InsightError with underscore", function () {
			const result = insightFacade.removeDataset("Courses_");
			return expect(result).eventually.to.be.rejectedWith(InsightError);
		});

		it("should reject with multiple underscore", function () {
			const result = insightFacade.removeDataset("Courses__");
			return expect(result).eventually.to.be.rejectedWith(InsightError);
		});

		it("should reject with one underscore", function () {
			const result = insightFacade.removeDataset("_");
			return expect(result).eventually.to.be.rejectedWith(InsightError);
		});

		it("should reject with InsightError with whitespace", function () {
			const result = insightFacade.removeDataset(" ");
			return expect(result).eventually.to.be.rejectedWith(InsightError);
		});


		it("should reject with InsightError with whitespace and_ mix", function () {
			const result = insightFacade.removeDataset("  _ _ ");
			return expect(result).eventually.to.be.rejectedWith(InsightError);
		});


		it("should reject a dataset with id underline and whitespace", function () {
			const result = insightFacade.removeDataset("_ _");
			return expect(result).eventually.to.be.rejectedWith(InsightError);
		});
	});


	// describe("Dynamic folder test", function () {
	// 	type Input = any;
	// 	type Output = Promise<any[]>;
	// 	// type Error = "InsightError" | "ResultTooLargeError";
	// 	let insightFacade: InsightFacade;
	// 	let content: string = getFileContent("test/resources/archives/courses.zip");
	//
	//
	// 	before(function () {
	// 		clearDatasets();
	// 		insightFacade = new InsightFacade();
	// 		return insightFacade.addDataset("courses", content, InsightDatasetKind.Courses);
	// 	});
	//
	//
	// 	function assertOnResult(expected: any, actual: any[], input: any): void {
	// 		const orderKey = input.OPTIONS.ORDER;
	// 		expect(actual).to.be.an.instanceof(Array);
	// 		expect(actual).to.have.length(expected.length);
	// 		expect(actual).to.have.deep.members(expected);
	// 		if (typeof orderKey === "string") {
	// 			for (let i = 1; i < actual.length; i++) {
	// 				actual[i - 1][orderKey] <= actual[i][orderKey];
	// 			}
	// 		} else if (typeof orderKey === "object") {
	// 			if (orderKey["dir"] === "UP") {
	// 				for (let i = 1; i < actual.length; i++) {
	// 					actual[i - 1][orderKey] <= actual[i][orderKey];
	// 				}
	// 			} else if (orderKey["dir"] === "DOWN") {
	// 				for (let i = 1; i < actual.length; i++) {
	// 					actual[i - 1][orderKey] >= actual[i][orderKey];
	// 				}
	// 			}
	// 		}
	// 	}
	//
	// 	function assertOnError(expected: any, actual: any): void {
	// 		if (expected === "InsightError") {
	// 			expect(actual).to.be.an.instanceOf(InsightError);
	// 		} else if (expected === "ResultTooLargeError") {
	// 			expect(actual).to.be.an.instanceOf(ResultTooLargeError);
	// 		}
	// 	}
	//
	// 	// it("quryTest", function () {
	// 	testFolder<Input, Output, string>(
	// 		"performQuery",
	// 		(input: Input): Output => insightFacade.performQuery(input),
	// 		"./test/resources/queries",
	// 		{
	// 			assertOnResult: assertOnResult,
	// 			assertOnError: assertOnError,
	// 		});
	// });

	describe("Dynamic Room folder test", function () {
		type Input = any;
		type Output = Promise<any[]>;
		// type Error = "InsightError" | "ResultTooLargeError";
		let insightFacade: InsightFacade;
		let content: string = getFileContent("test/resources/archives/rooms.zip");
		let coursesContent: string = getFileContent("test/resources/archives/courses.zip");

		before(function () {
			clearDatasets();
			insightFacade = new InsightFacade();
			// return insightFacade.addDataset("rooms", content, InsightDatasetKind.Rooms);
			return insightFacade.addDataset("courses", coursesContent, InsightDatasetKind.Courses);
		});


		function assertOnResult(expected: any, actual: any[], input: any): void {
			const orderKey = input.OPTIONS.ORDER;
			expect(actual).to.be.an.instanceof(Array);
			expect(actual).to.have.length(expected.length);
			expect(actual).to.have.deep.members(expected);
			if (orderKey !== undefined) {
				for (let i = 1; i < actual.length; i++) {
					actual[i - 1][orderKey] <= actual[i][orderKey];
				}
			}
		}

		function assertOnError(expected: any, actual: any): void {
			if (expected === "InsightError") {
				expect(actual).to.be.an.instanceOf(InsightError);
			} else if (expected === "ResultTooLargeError") {
				expect(actual).to.be.an.instanceOf(ResultTooLargeError);
			}
		}

		testFolder<Input, Output, string>(
			"performQuery",
			(input: Input): Output => insightFacade.performQuery(input),
			"./test/resources/queriesSu",
			{
				assertOnResult: assertOnResult,
				assertOnError: assertOnError,
			});
	});
});
