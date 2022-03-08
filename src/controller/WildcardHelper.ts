import Sections from "./Sections";

export class WildcardHelper {
	public static removeStar(insideItemValue: string): string {
		if ((insideItemValue[0] === "*") && (insideItemValue[insideItemValue.length - 1] === "*")) {
			return insideItemValue.slice(1, insideItemValue.length - 1);
		} else if (insideItemValue[insideItemValue.length - 1] === "*") { // second case: star in the end (eg.cp*)
			return insideItemValue.slice(0,insideItemValue.length - 1);
		} else if (insideItemValue[0] === "*") { // third case: star in front (eg.*sc)
			return insideItemValue.slice(1,);
		} else {
			throw new Error();
		}
	}

	// handle two stars (eg.*c*, *p*, *cp*)
	public static handleStarFirstCase(modifiedField: string, removedStarValue: string, s: any[]): any[] {
		return s.filter((section) => {
			if (modifiedField === "dept") {
				return section.dept.includes(removedStarValue);
			} else if (modifiedField === "id") {
				return section.id.includes(removedStarValue);
			} else if (modifiedField === "instructor") {
				return section.instructor.includes(removedStarValue);
			} else if (modifiedField === "title") {
				return section.title.includes(removedStarValue);
			} else if (modifiedField === "uuid") {
				return section.uuid.includes(removedStarValue);
			} else if (modifiedField === "fullname") {
				return section.fullname.includes(removedStarValue);
			} else if (modifiedField === "shortname") {
				return section.shortname.includes(removedStarValue);
			} else if (modifiedField === "number") {
				return section.number.includes(removedStarValue);
			} else if (modifiedField === "name") {
				return section.name.includes(removedStarValue);
			} else if (modifiedField === "address") {
				return section.address.includes(removedStarValue);
			} else if (modifiedField === "type") {
				return section.type.includes(removedStarValue);
			} else if (modifiedField === "furniture") {
				return section.furniture.includes(removedStarValue);
			} else if (modifiedField === "href") {
				return section.href.includes(removedStarValue);
			}
		});
	}

	// second case: star in the end (eg.cp*)
	public static handleStarSecondCase(modifiedField: string, removedStarValue: string, s: any[]): any[] {
		let indexStar: number = removedStarValue.length;
		return s.filter((section) => {
			if (modifiedField === "dept") {
				return section.dept.slice(0,indexStar).includes(removedStarValue);
			} else if (modifiedField === "id") {
				return section.id.slice(0,indexStar).includes(removedStarValue);
			} else if (modifiedField === "instructor") {
				return section.instructor.slice(0,indexStar).includes(removedStarValue);
			} else if (modifiedField === "title") {
				return section.title.slice(0,indexStar).includes(removedStarValue);
			} else if (modifiedField === "uuid") {
				return section.uuid.slice(0,indexStar).includes(removedStarValue);
			} else if (modifiedField === "fullname") {
				return section.fullname.slice(0,indexStar).includes(removedStarValue);
			} else if (modifiedField === "shortname") {
				return section.shortname.slice(0,indexStar).includes(removedStarValue);
			} else if (modifiedField === "number") {
				return section.number.slice(0,indexStar).includes(removedStarValue);
			} else if (modifiedField === "name") {
				return section.name.slice(0,indexStar).includes(removedStarValue);
			} else if (modifiedField === "address") {
				return section.address.slice(0,indexStar).includes(removedStarValue);
			} else if (modifiedField === "type") {
				return section.type.slice(0,indexStar).includes(removedStarValue);
			} else if (modifiedField === "furniture") {
				return section.furniture.slice(0,indexStar).includes(removedStarValue);
			} else if (modifiedField === "href") {
				return section.href.slice(0,indexStar).includes(removedStarValue);
			}
		});
	}

	// third case: star in front (eg.*sc)
	public static handleStarThirdCase(modifiedField: string, removedStarValue: string, s: any[]): any[] {
		let indexStar: number = removedStarValue.length;
		return s.filter((section) => {
			if (modifiedField === "dept") {
				return section.dept.slice(section.dept.length - indexStar).includes(removedStarValue);
			} else if (modifiedField === "id") {
				return section.id.slice(section.id.length - indexStar).includes(removedStarValue);
			} else if (modifiedField === "instructor") {
				return section.instructor.slice(section.instructor.length - indexStar).includes(removedStarValue);
			} else if (modifiedField === "title") {
				return section.title.slice(section.title.length - indexStar).includes(removedStarValue);
			} else if (modifiedField === "uuid") {
				return section.uuid.slice(section.uuid.length - indexStar).includes(removedStarValue);
			} else if (modifiedField === "fullname") {
				return section.fullname.slice(section.uuid.length - indexStar).includes(removedStarValue);
			} else if (modifiedField === "shortname") {
				return section.shortname.slice(section.uuid.length - indexStar).includes(removedStarValue);
			} else if (modifiedField === "number") {
				return section.number.slice(section.uuid.length - indexStar).includes(removedStarValue);
			} else if (modifiedField === "name") {
				return section.name.slice(section.uuid.length - indexStar).includes(removedStarValue);
			} else if (modifiedField === "address") {
				return section.address.slice(section.uuid.length - indexStar).includes(removedStarValue);
			} else if (modifiedField === "type") {
				return section.type.slice(section.uuid.length - indexStar).includes(removedStarValue);
			} else if (modifiedField === "furniture") {
				return section.furniture.slice(section.uuid.length - indexStar).includes(removedStarValue);
			} else if (modifiedField === "href") {
				return section.href.slice(section.uuid.length - indexStar).includes(removedStarValue);
			}
		});
	}

	public static handleStar(modifiedField: string, insideItemValue: string, sections: any[]): any[] {
		let removedStarValue = WildcardHelper.removeStar(insideItemValue);
		let result: Sections[] = [];
		// first case: star in front (eg.*ps*, *p*, *s*)
		if ((insideItemValue[0] === "*") && (insideItemValue[insideItemValue.length - 1] === "*")) {
			result = WildcardHelper.handleStarFirstCase(modifiedField, removedStarValue, sections);
		} else if (insideItemValue[insideItemValue.length - 1] === "*") { // second case: star in the end (eg.cp*)
			result = WildcardHelper.handleStarSecondCase(modifiedField, removedStarValue, sections);
		} else if (insideItemValue[0] === "*") { // third case: star in front (eg.*sc)
			result = WildcardHelper.handleStarThirdCase(modifiedField, removedStarValue, sections);
		}
		return result;
	}
}
