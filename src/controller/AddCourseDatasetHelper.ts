import JSZip, {JSZipObject} from "jszip";
import Sections from "./Sections";
import {InsightError} from "./IInsightFacade";
import * as fs from "fs-extra";
import Dataset from "./Dataset";

export default class AddCourseDatasetHelper {
	public static concatSectionsHelper(reason: any[], sections: Sections[]): Sections[] {
		reason.forEach((section) => {
			if (Array.isArray(section)) {
				sections = sections.concat(section);
			}
		});
		return sections;
	}

	public static rawInputToSec(e: any): Sections {
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

	public static getFileSec(file: JSZipObject): Promise<Sections[]> {
		return new Promise( (resolve, reject) => {
			file.async("text").then((stringContent) => {
				const sections: Sections[] = [];
				try {
					let rawString = JSON.parse(stringContent).result;
					for (let e of rawString) {
						if ((e.Section === "overall")) {
							e.Year = 1900;
						}
						if (Object.prototype.hasOwnProperty.call(e,"Subject")
							&& Object.prototype.hasOwnProperty.call(e,"Course")
							&& Object.prototype.hasOwnProperty.call(e,"Avg")
							&& Object.prototype.hasOwnProperty.call(e,"Professor")
							&& Object.prototype.hasOwnProperty.call(e,"Title")
							&& Object.prototype.hasOwnProperty.call(e,"Pass")
							&& Object.prototype.hasOwnProperty.call(e,"Fail")
							&& Object.prototype.hasOwnProperty.call(e,"Audit")
							&& Object.prototype.hasOwnProperty.call(e,"id")
							&& Object.prototype.hasOwnProperty.call(e,"Year")) {
							sections.push(this.rawInputToSec(e));
						}
					}
					resolve(sections);
				} catch {
					reject("unable to get sections from file");
				}
			});
		});
	}

	// public static addDatasetHelper(content: string) {
	// 	return new Promise( (resolve, reject) => {
	// 		try {
	// 			let sections: Sections[] = [];
	// 			let promises: Array<Promise<any>> = [];
	// 			const zip = new JSZip();
	// 			zip.loadAsync(content, { base64: true}).
	// 				then(async (zips: any) => {
	// 					zips.folder("courses").forEach((relativePath: any, file: any) => {
	// 						const promise: Promise<Sections[]> = this.getFileSec(file);
	// 						// console.log("relative path:", relativePath, "file full path:", file.name);
	// 						promises.push(promise);
	// 					});
	// 					await Promise.all(promises).then((reason) => {
	// 						reason.forEach((section) => {
	// 							if (Array.isArray(section)) {
	// 								sections = sections.concat(section);
	// 							}
	// 						});
	// 					});
	// 				})
	// 				.then(async () => {
	// 					if (sections.length < 1) {
	// 						throw new InsightError("section should not be empty");
	// 					}
	// 					if (!fs.existsSync("data/")) {
	// 						fs.mkdirSync("data/");
	// 					}
	// 					this.datasetId.push(id);
	// 					const newData = new Dataset(id, kind, sections);
	// 					await fs.writeFile(`data/${newData.id}.json`, JSON.stringify(newData));
	// 					return resolve(this.datasetId);
	// 				});
	// 		} catch (error){
	// 			return reject(error);
	// 		}
	// 	});
	// }
}
