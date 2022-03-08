export default class HelperMethod {
	public static queryParseId(inputId: string): string {
		let modifiedId: string = "";
		let underscore: number = inputId.indexOf("_");
		for (let i: number = 0; i < underscore; i++) {
			modifiedId += inputId[i];
		}
		return modifiedId;
	}

	// get dataset id from query
	public static getQueryDatasetIdFromWhere(query: any): any {
		let where: any = query["WHERE"];
		if (where[Object.keys(where)[0]] === undefined) {
			return "";
		}
		let insideItem: any = where[Object.keys(where)[0]];
		if ( (typeof insideItem) === "object" && Object.keys(insideItem).length > 0) {
			return this.getQueryDatasetId(where[Object.keys(where)[0]]);
		} else if (typeof insideItem === "string" || (typeof insideItem) === "number") {
			return this.queryParseId(Object.keys(where)[0]); // change courses_string into courses
		} else {
			return "";
		}
	}

	public static getQueryDatasetId(query: any): string {
		let columns: string[] = query["OPTIONS"]["COLUMNS"];
		if (columns.length < 1) {
			return "";
		}
		for (let elem of columns) {
			if (elem.includes("_")) {
				return this.queryParseId(elem);
			}
		}
		if ("TRANSFORMATIONS" in query) {
			let group: string[] = query["TRANSFORMATIONS"]["GROUP"];
			for (let elem of group) {
				if (elem.includes("_")) {
					return this.queryParseId(elem);
				}
			}
		}
		return this.getQueryDatasetIdFromWhere(query);
	}

	public static queryParseField(inputId: string) {
		let modifiedField: string = "";
		let underscore: number = inputId.indexOf("_");
		underscore++;
		for (let i: number = underscore; i < inputId.length; i++) {
			modifiedField += inputId[i];
		}
		return modifiedField;
	}

	public static isIncludeMiddleStar(value: string): boolean {
		if (value.includes("*")) {
			for (let i: number = 1; i < (value.length - 1); i++) {
				if( value[i] === "*") {
					return true;
				}
			}
		}
		return false;
	}
}
