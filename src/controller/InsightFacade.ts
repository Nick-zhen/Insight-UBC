import {IInsightFacade, InsightDataset, InsightDatasetKind, InsightError, NotFoundError} from "./IInsightFacade";
import * as fs from "fs-extra";
import JSZip from "jszip";
import Sections from "./Sections";
import Dataset from "./Dataset";
import {CheckValidityQueryHelper} from "./CheckValidityQueryHelper";
import QueryHelper from "./QueryHelper";
import AddCourseDatasetHelper from "./AddCourseDatasetHelper";
import {CheckCourseQueryValidity} from "./CheckCourseQueryValidity";
import {CheckRoomQueryValidity} from "./CheckRoomQueryValidity";
import HelperMethod from "./HelperMethod";
import QueryRoomsHelper from "./QueryRoomsHelper";
import CourseHelper from "./CourseHelper";
import RoomHelper from "./RoomHelper";

/**
 * This is the main programmatic entry point for the project.
 * Method documentation is in IInsightFacade
 *
 */
const whereKeys = ["LT", "GT", "EQ", "IS", "NOT"];
const logicComparison = ["AND", "OR"];
const mComparison = ["LT", "GT", "EQ"];
const sComparison = ["IS"];
const negation = ["NOT"];

const totalField = ["avg", "pass", "fail", "audit", "year", "dept", "id", "instructor", "title", "uuid"];
const mfield = ["avg", "pass", "fail", "audit", "year"];
const sfield = ["dept", "id", "instructor", "title", "uuid"];
// TODO: server time out （error in addDataset) ; read from disk cause room time out 11-26


export default class InsightFacade implements IInsightFacade {
	public datasets: Dataset[] = [];
	public queryDatasetId: string = "";
	public insightDatasets: InsightDataset[] = [];
	constructor() {
		this.makeDir();
		fs.readdirSync("data/").map((f) => {
			const p = fs.readFileSync("data/" + f, "utf8");
			return p;
		}).map((f) => {
			const json = JSON.parse(f);
			this.datasets.push(json);
			this.insightDatasets.push({
				id: json.id,
				kind: json.kind === "rooms" ? InsightDatasetKind.Rooms : InsightDatasetKind.Courses,
				numRows: json.dataContent.length
			});
		});
	}

	public makeDir() {
		// check and make data path
		if (!fs.existsSync("data/")) {
			fs.mkdirSync("data/");
		}
	}

	public addRoomHelper(
		rHelper: RoomHelper,
		id: string,
		content: string,
		kind: InsightDatasetKind
	): Promise<string[]> {
		return new Promise((resolve, reject) => {
			try {
				// const rooms: any = await rHelper.getRooms(content);
				rHelper.getRooms(content)
					.then(async (rooms: any) => {
						if (rooms.length < 1) {
							return reject(new InsightError("rooms should not be empty"));
						}
						const newData = new Dataset(id, kind, rooms);
						this.datasets.push(newData);
						const newInsightDataset: InsightDataset = {
							id: id,
							kind: InsightDatasetKind.Rooms,
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
					.catch((error: any) => {
						return reject(error);
					});
			} catch (error) {
				return reject(error);
			}
		});
	}

	private getIds(): string[] {
		const ids = this.insightDatasets.map((ds) => {
			return ds.id;
		});
		return ids;
	}

	// refactor: put course helpers into another class (get sections/getOneSection)
	// use simplier methods
	public addDataset(id: string, content: string, kind: InsightDatasetKind): Promise<string[]> {
		if (id === "" || id === null || !id.trim() || id.includes("_")) {
			return Promise.reject(new InsightError("input can't be only white space or _"));
		}
		if (kind !== InsightDatasetKind.Courses && kind !== InsightDatasetKind.Rooms) {
			return Promise.reject(new InsightError("input must have kind course"));
		}
		if (this.getIds().includes(id)) {
			return Promise.reject(new InsightError("input has already exist"));
		}
		if (kind === InsightDatasetKind.Rooms) {
			const rHelper = new RoomHelper();
			return this.addRoomHelper(rHelper, id, content, kind);
		} else {
			return new Promise((resolve, reject) => {
				try {
					const cHelper = new CourseHelper();
					// const sections = await cHelper.getSections(content);
					cHelper.getSections(content)
						.then(async (sections) => {
							if (sections.length < 1) {
								return reject(new InsightError("sections should not be empty"));
							}
							this.makeDir();
							const newData = new Dataset(id, kind, sections);
							this.getIds().push(id);
							this.datasets.push(newData);
							const newInsightDataset: InsightDataset = {
								id: id,
								kind: InsightDatasetKind.Courses,
								numRows: sections.length,
							};
							this.insightDatasets.push(newInsightDataset);
							await fs.writeFile(`${"data/"}${newData.id}.json`, JSON.stringify(newData), "utf-8", () => {
							// return resolve(this.insightDatasets.map((ds) => {
							// 	return ds.id;
							// }));
								return resolve(this.getIds());
							});
							return resolve(
								this.insightDatasets.map((ds) => {
									return ds.id;
								})
							);
						}).catch((error) => {
							return reject(error);
						});
				} catch (error) {
					return reject(error);
				}
			});
		}
	}

	public removeDataset(id: string): Promise<string> {
		if (id === "" || id === null || !id.trim()) {
			return Promise.reject(new InsightError("id can't be only white space"));
		}
		if (id.includes("_")) {
			return Promise.reject(new InsightError("id can't have _"));
		}
		if (!this.getIds().includes(id)) {
			return Promise.reject(new NotFoundError("id hasn't been added"));
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
			} catch (err) {
				return reject(err);
			}
		});
	}

	public performQuery(query: any): Promise<any[]> {
		try {
			this.queryDatasetId = HelperMethod.getQueryDatasetId(query);
		} catch (err) {
			return Promise.reject(new InsightError("The query syntax is invalid."));
		}
		if (!this.getIds().includes(this.queryDatasetId)) {
			return Promise.reject(new InsightError("The dataset is not exist."));
		}
		let check: CheckValidityQueryHelper;
		let item: Dataset | undefined = this.datasets.find((element) => element.id === this.queryDatasetId);
		let datasetKind = item?.kind;
		if (datasetKind === InsightDatasetKind.Courses) {
			check = new CheckCourseQueryValidity();
		} else if (datasetKind === InsightDatasetKind.Rooms) {
			check = new CheckRoomQueryValidity();
		} else {
			check = new CheckValidityQueryHelper();
		}
		if (!check.isQueryValid(query)) {
			return Promise.reject(new InsightError("The query syntax is invalid."));
		}
		try {
			if (datasetKind === InsightDatasetKind.Courses) {
				let res = QueryHelper.queryCourses(query, check, this.datasets);
				// console.log(res);
				return Promise.resolve(res);
			} else if (datasetKind === InsightDatasetKind.Rooms) {
				let res = QueryRoomsHelper.queryRooms(query, check);
				// console.log(res);
				return Promise.resolve(res);
			}
			return Promise.reject(new InsightError());
		} catch (error) {
			return Promise.reject(new InsightError());
		}
	}

	public listDatasets(): Promise<InsightDataset[]> {
		return Promise.resolve(this.insightDatasets);
	}
}
