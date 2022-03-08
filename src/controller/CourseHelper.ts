// import * as fs from "fs-extra";
import * as JSZip from "jszip";
import {JSZipObject} from "jszip";
import Sections from "./Sections";
import {InsightDataset, InsightDatasetKind, InsightError} from "./IInsightFacade";

export default class CourseHelper {

	public getOneSection(content: any): any {
		const sections: Sections[] = [];
		const raw: any = JSON.parse(content).result;
		for (let e of raw) {
			try {
				const courseObj: any = {};
				// change to quicker method using https://stackoverflow.com/questions/41870411/object-index-key-type-in-typescript
				courseObj["dept"] = e.Subject.toString();
				courseObj["id"] = e.Course.toString();
				courseObj["avg"] = Number(e.Avg);
				courseObj["instructor"] = e.Professor.toString();
				courseObj["title"] = e.Title.toString();
				courseObj["pass"] = Number(e.Pass);
				courseObj["fail"] = Number(e.Fail);
				courseObj["audit"] = Number(e.Audit);
				courseObj["uuid"] = e.id.toString();
				courseObj["year"] = Number(e.Year);
				// if all succeed
				sections.push(courseObj);
			} catch (err) {
				// if try has failed and we do the catch
				// get the keys of the object
				console.log("cant build course object from given zipfile :" + err);
			}
		}
		return sections;
	}

	public getSections(content: string): Promise<Sections[]> {
		return new Promise((resolve, reject) => {
			let sections: Sections[] = [];
			const promisesArray: Array<Promise<any>> = [];
			let courseObj: Sections[];

			JSZip.loadAsync(content, {base64: true})
				.then((zips: any) => {
					zips.folder("courses").forEach((relativePath: any, file: any) => {
						promisesArray.push(file.async("text"));
					});
					return Promise.all(promisesArray);
				})
				.then((courseJsonStrArray) => {
					courseJsonStrArray.forEach((jsonStr) => {
						courseObj = this.getOneSection(jsonStr);
						// console.log("after get one file sec");
						// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/concat
						sections = sections.concat(courseObj);
					});
					resolve(sections);
				})
				.catch((error: any) => {
					reject(new InsightError("zip file is not valid"));
				});
		});
	}
}
