
import {InsightDatasetKind} from "./IInsightFacade";
import Sections from "./Sections";
import Room from "./Room";

export default class Dataset {
	public id: string;
	public dataContent: any[];
	public kind: InsightDatasetKind;
	constructor(id: string, kind: InsightDatasetKind, content: Sections[]) {
		this.id = id;
		this.dataContent = content;
		this.kind = kind;
	}
}
