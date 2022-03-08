import {CheckValidityQueryHelper} from "./CheckValidityQueryHelper";


export class CheckCourseQueryValidity extends CheckValidityQueryHelper {
	public totalField = ["avg", "pass", "fail", "audit", "year", "dept", "id","instructor", "title", "uuid"];
	public APPLYTOKEN = ["MAX", "MIN", "AVG", "COUNT", "SUM"];
	public NumAPPLYTOKEN = ["MAX", "MIN", "AVG", "SUM"];
	public CountAPPLYTOKEN = ["COUNT"];
	public mfield: string[] = ["avg", "pass", "fail", "audit", "year"];
	public sfield = ["dept", "id", "instructor", "title", "uuid"];
}
