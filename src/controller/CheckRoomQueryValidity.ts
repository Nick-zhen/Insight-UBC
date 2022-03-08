import {CheckValidityQueryHelper} from "./CheckValidityQueryHelper";
import HelperMethod from "./HelperMethod";


export class CheckRoomQueryValidity extends CheckValidityQueryHelper {
	public totalField = ["lat", "lon", "seats", "fullname", "shortname", "number"
		, "name", "address", "type", "furniture", "href"];

	public APPLYTOKEN = ["MAX", "MIN", "AVG", "COUNT", "SUM"];
	public mfield = ["lat", "lon", "seats"];
	public sfield = ["fullname", "shortname", "number", "name", "address", "type", "furniture", "href"];

}
