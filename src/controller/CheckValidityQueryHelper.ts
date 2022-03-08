import HelperMethod from "./HelperMethod";
export class CheckValidityQueryHelper {
	public  whereKeys = ["LT", "GT", "EQ", "IS", "NOT"];
	public  logicComparison = ["AND", "OR"];
	public  totalField = ["avg", "pass", "fail", "audit", "year", "lat", "lon", "seats", "dept", "id","instructor"
		, "title", "uuid", "fullname", "shortname", "number", "name", "address", "type", "furniture", "href"];

	public  APPLYTOKEN = ["MAX", "MIN", "AVG", "COUNT", "SUM"];
	public  NumAPPLYTOKEN = ["MAX", "MIN", "AVG", "SUM"];
	public  CountAPPLYTOKEN = ["COUNT"];
	// "avg", "pass", "fail", "audit", "year", "lat", "lon", "seats"
	public  mfield: string[] = ["avg", "pass", "fail", "audit", "year", "lat", "lon", "seats"];
	public  sfield = ["dept", "id", "instructor", "title", "uuid", "fullname", "shortname", "number", "name"
		, "address", "type", "furniture", "href"];

	public DIRECTION = ["DOWN", "UP"];
	public queryDatasetId: string = "";
	public checkId_fieldValid(id_field: string): boolean {
		let modifiedId: string = HelperMethod.queryParseId(id_field);
		let modifiedField: string = HelperMethod.queryParseField(id_field);
		if (this.queryDatasetId !== modifiedId || !this.totalField.includes(modifiedField)) {
			return false;
		}
		return true;
	}

	public isStringValid(element: string, where: any, check: boolean): boolean {
		let value: string = String(Object.values(where)[0]);
		if (!this.sfield.includes(HelperMethod.queryParseField(element))) {
			check = false;
		}
		if (HelperMethod.queryParseId(element) !== this.queryDatasetId) {
			check = false;
		}

		if (HelperMethod.isIncludeMiddleStar(value)) {
			check = false;
		}
		return check;
	}

	// check WHERE validity: check id, fields and keys
	public isWhereValid(where: any, check: boolean): any {
		try {
			let insideItem: any = where[Object.keys(where)[0]];
			if (Array.isArray(insideItem)) {
				for (let element in where) {
					if (!this.logicComparison.includes(Object.keys(where)[0])) {
						check = false;
					}
					for (let insideArrayItem of insideItem) {
						check = this.isWhereValid(insideArrayItem, check);
					}
				}
			} else if (typeof insideItem === "object" && Object.keys(where).length > 0) {
				for (const element in where) {
					if (!this.whereKeys.includes(element)) {
						check = false;
					} else {
						check = this.isWhereValid(where[element], check);
					}
				}
			} else if (typeof insideItem === "string") {
				check = (Object.keys(where).length > 1) ? false : check;
				for (let element in where) {
					check = this.isStringValid(element, where, check);
				}
			} else if (typeof insideItem === "number") {
				check = (Object.keys(where).length > 1) ?  false : check;
				for (let element in where) {
					let modifiedField = HelperMethod.queryParseField(element);
					let modifiedId = HelperMethod.queryParseId(element);
					if (!this.mfield.includes(modifiedField)) {
						check = false;
					}
					if (modifiedId !== this.queryDatasetId) {
						check = false;
					}
				}
			} else {
				check = false;
			}
		} catch (error) {
			check = false;
		}
		return check;
	}

	// The applykey in an APPLYRULE should be unique (no two APPLYRULEs should share an applykey with the same name).
	public isApplyValid(apply: any[], groupApplyArr: Set<string>): boolean {
		let applyKeys: Set<string> = new Set();
		for (let item of apply) {
			let applyKey: string = Object.keys(item)[0];
			if (applyKey.includes("_")) {
				return false;
			}
			if (applyKeys.has(applyKey)) {
				return false;
			} else {
				applyKeys.add(applyKey);
				groupApplyArr.add(applyKey);
			}
			let applyValue: any = Object.values(item)[0]; // object eg. Object { "AVG": "courses_avg" }
			if (Object.keys(applyValue).length > 1) {
				return false;
			}
			let applyToken: string = Object.keys(applyValue)[0]; // "AVG"
			let key: string = String(Object.values(applyValue)[0]); // "courses_avg"
			if (!this.APPLYTOKEN.includes(applyToken) || !this.checkId_fieldValid(key)) {
				return false;
			}
			// MAX/MIN/AVG/SUM should only be requested for numeric keys. COUNT can be requested for all keys.
			if (this.NumAPPLYTOKEN.includes(applyToken)) {
				let modifiedField: string = HelperMethod.queryParseField(key);
				if (!this.mfield.includes(modifiedField)) {
					return false;
				}
			}
		}
		return true;
	}

	public isGroupValid(group: any, groupApplyArr: Set<string>): boolean {
		for (let groupKey of group) {
			if (!this.checkId_fieldValid(groupKey)) {
				return false;
			}
			groupApplyArr.add(groupKey);
		}
		return true;
	}

	public isTransformationValid(transformations: any, groupApplyArr: Set<string>): boolean {
		if (!("GROUP" in transformations) || !("APPLY" in transformations)) {
			return false;
		}
		const group = transformations["GROUP"];
		const apply = transformations["APPLY"];
		if (!Array.isArray(group) || !Array.isArray(apply)) {
			return false;
		}
		if (!this.isApplyValid(apply, groupApplyArr)) {
			return false;
		}
		if (!this.isGroupValid(group, groupApplyArr)) {
			return false;
		}
		return true;
	}

	// check query validity: check id, fields and keys of WHERE and OPTIONS
	public isQueryValid(query: any): boolean {
		try {
			if (Object.keys(query).length === 0) {
				return false;
			}
			if (!("WHERE" in query) || !("OPTIONS" in query)) {
				return false;
			}
			const where = query["WHERE"];
			const options = query["OPTIONS"];
			if (!("COLUMNS" in query["OPTIONS"])) {
				return false;
			}
			// this.queryDatasetId = HelperMethod.getQueryDatasetId(where);
			this.queryDatasetId = HelperMethod.getQueryDatasetId(query);
			if (this.queryDatasetId === "") {
				return false;
			}
			if (!this.isWhereValid(where, true) && !(Object.keys(where).length === 0)) {
				return false;
			}
			let groupApplyArr: Set<string> = new Set();
			if ("TRANSFORMATIONS" in query) {
				const transformations = query["TRANSFORMATIONS"];
				if (!this.isTransformationValid(transformations, groupApplyArr)) {
					return false;
				}
				if (!this.isOptionsContainTranValid(options, groupApplyArr)) {
					return false;
				}
			} else {
				if (!("COLUMNS" in options)) {
					return false;
				}
				if (!this.isOptionsWithoutTranValid(options)) {
					return false;
				}
			}

			return true;
		} catch (error) {
			return false;
		}
	}

	public isOptionsWithoutTranValid(options: any): boolean {
		let columnArr: string[] = [];
		for (let element of options["COLUMNS"]) {
			if (!this.checkId_fieldValid(element)) {
				return false;
			}
			columnArr.push(element);
		}
		if (columnArr.length < 1) { // COLUMNS must be a non-empty array
			return false;
		}
		if ("ORDER" in options) {
			let element = options["ORDER"];
			return this.checkOrderHelper(element, columnArr, []);
		}
		return true;
	}

	public isOptionsContainTranValid(options: any, groupApplyArr: Set<string>): boolean { // with group
		let columnArr: string[] = [];
		let colApplyArr: string[] = [];
		for (let element of options["COLUMNS"]) {
			if (element.includes("_")) {
				if (!this.checkId_fieldValid(element)) {
					return false;
				}
				columnArr.push(element);
			} else {
				colApplyArr.push(element);
			}
		}
		if (columnArr.length + colApplyArr.length < 1) { // COLUMNS must be a non-empty array
			return false;
		}
		for (let col of columnArr) {
			if (!groupApplyArr.has(col)) {
				return false;
			}
		}
		for (let colApply of colApplyArr) {
			if (!groupApplyArr.has(colApply)) {
				return false;
			}
		}
		if ("ORDER" in options) {
			let order = options["ORDER"];
			if (!this.checkOrderHelper(order, columnArr, colApplyArr)) {
				return false;
			}
		}
		return true;
	}

	public checkOrderHelper(order: any, columnArr: string[], colApplyArr: string[]): boolean {
		if (typeof order === "string") {
			return this.checkSingleOrderString(order, columnArr, colApplyArr);
		} else if (typeof order === "object") {
			return this.checkOrderObject(order, columnArr, colApplyArr);
		} else {
			return false;
		}
	}

	public checkSingleOrderString(order: any, columnArr: string[], colApplyArr: string[]): boolean {
		if (!columnArr.includes(order) && !(colApplyArr.includes(order))) {
			return false;
		}
		if (order.includes("_")) {
			let modifiedId = HelperMethod.queryParseId(order);
			if (modifiedId !== this.queryDatasetId) {
				return false;
			}
		}
		return true;
	}

	// SORT - Any keys provided must be in the COLUMNS.
	public checkOrderObject(order: any, columnArr: string[], colApplyArr: string[]): boolean {
		if (!(Object.keys(order)[0] === "dir") || !(Object.keys(order)[1] === "keys")) {
			return false;
		}
		let dir: string = order["dir"];
		if (!this.DIRECTION.includes(dir)) {
			return false;
		}
		let keys: string[] = order["keys"];
		if (keys.length === 0) {
			return false;
		}
		for (let key of keys) {
			if (!columnArr.includes(key) && !(colApplyArr.includes(key))) {
				return false;
			}
		}
		return true;
	}
}

