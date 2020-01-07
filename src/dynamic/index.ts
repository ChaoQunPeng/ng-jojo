
import { chain, Rule, apply, url, mergeWith, move, applyTemplates, Tree } from '@angular-devkit/schematics';
import { classify, dasherize, camelize, underscore } from '@angular-devkit/core/src/utils/strings';
import { SchemaOptions } from './schema';
import { createDefaultPath } from '../utility/workspace';
import { parseName } from '../utility/parse-name';
// import * as path from "path";

const stringUtils = { classify, dasherize, camelize, underscore };

export function main(options: SchemaOptions | any): Rule {
  return async (host: Tree) => {
    if (options.path === undefined) {
      options.path = await createDefaultPath(host, options.project as string);
    }

    const parsedPath = parseName(options.path, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;
    
    console.log(`parsedPath`)
    console.log(parsedPath)

    const templateOptions: SchemaOptions = {
      path: process.cwd(),
      name: options.name,
      module: options.module,
      tabTitle: options.tabTitle,
      searchFormName: options.searchFormName,
      tableName: options.tableName,
      newFormName: options.newFormName,
      editFormName: options.editFormName
    }
    console.log(templateOptions)
    console.log(templateOptions)

    const templateSource = apply(url('./files'), [
      applyTemplates({
        ...stringUtils,
        ...templateOptions
      }),
      move(parsedPath.path)
    ]);

    // return noop();
    return chain([
      mergeWith(templateSource)
    ]);
  }
}