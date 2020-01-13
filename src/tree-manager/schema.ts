import { BaseSchmeOptions } from "../utils/config";

export interface SchemaOptions extends BaseSchmeOptions {
    path: string;
    tabTitle: string;
    searchFormName: string;
    tableName: string;
    newFormName: string;
    editFormName: string;
    init?: boolean;
    project?: any;
    isBiz?: boolean;
  }