
import { chain, Rule, apply, url, template, branchAndMerge, mergeWith, Tree, filter, noop } from '@angular-devkit/schematics';
import { classify, dasherize, camelize, underscore } from '@angular-devkit/core/src/utils/strings';
import { SchemaOptions } from './schema';
import { createDefaultPath } from '../utility/workspace';
import { parseName } from '../utility/parse-name';

const stringUtils = { classify, dasherize, camelize, underscore };

export function main(options: SchemaOptions | any): Rule {
  return async (host: Tree) => {
    if (options.path === undefined) {
      console.log(`before createDefaultPath`)
      console.log(options.path)
      options.path = await createDefaultPath(host, options.project as string);
      console.log(`after createDefaultPath`)
      console.log(options.path)
    }

    const parsedPath = parseName(options.path, options.name);
    console.log(`parsedPath`)
    console.log(parsedPath)
    options.path = parsedPath.path;

    const templateOptions: SchemaOptions = {
      path: options.path,
      name: options.name,
      module: options.module,
      tabTitle: options.tabTitle,
      searchFormName: options.searchFormName,
      tableName: options.tableName,
      newFormName: options.newFormName,
      editFormName: options.editFormName
    }
    console.log(`options`)
    console.log(options)
    const templateSource = apply(url('./files'), [
      options.isInit ? noop() : filter(ext => !ext.endsWith('-api.service.ts')),
      options.isInit ? noop() : filter(ext => !ext.endsWith('-routing.module.ts')),
      options.isInit ? noop() : filter(ext => !ext.endsWith('.module.ts')),
      options.isInit ? noop() : filter(ext => !ext.endsWith('.service.ts')),
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
}