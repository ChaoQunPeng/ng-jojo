
import { chain, Rule, apply, url, template, branchAndMerge, mergeWith } from '@angular-devkit/schematics';
import { classify, dasherize, camelize, underscore } from '@angular-devkit/core/src/utils/strings';
import { SchemaOptions } from './schema';

const stringUtils = { classify, dasherize, camelize, underscore };

export function main(options: SchemaOptions): Rule {
  console.log(__dirname)
  console.log(__filename)
  console.log(process.cwd())

  const p = process.cwd();
  const templateOptions: SchemaOptions = {
    path: p,
    name: options.name,
    module: options.module,
    tabTitle: options.tabTitle,
    searchFormName: options.searchFormName,
    tableName: options.tableName,
    newFormName: options.newFormName,
    editFormName: options.editFormName
  }

  const templateSource = apply(url('./files'), [
    template({
      ...stringUtils,
      ...templateOptions
    })
  ]);

  // return noop();
  return chain([
    branchAndMerge(chain([
      mergeWith(templateSource)
    ]))
  ]);
}