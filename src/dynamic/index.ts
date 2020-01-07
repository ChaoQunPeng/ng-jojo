
import { chain, Rule, apply, url, template, branchAndMerge, mergeWith } from '@angular-devkit/schematics';
import { classify, dasherize, camelize, underscore } from '@angular-devkit/core/src/utils/strings';
import { SchemaOptions } from './schema';
import * as path from "path";

const stringUtils = { classify, dasherize, camelize, underscore };

export function main(options: SchemaOptions): Rule {

  const templateOptions: SchemaOptions = {
    path: path.resolve('./'),
    name: options.name,
    module: options.module,
    tabTitle: options.tabTitle,
    searchFormName: options.searchFormName,
    tableName: options.tableName,
    newFormName: options.newFormName,
    editFormName: options.editFormName
  }
  console.log(templateOptions)

  const templateSource = apply(url('./files'), [
    template({
      ...stringUtils,
      ...templateOptions
    })
  ]);

  return chain([
    branchAndMerge(chain([
      mergeWith(templateSource)
    ]))
  ]);
}