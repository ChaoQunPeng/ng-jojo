
import { Rule, apply, url, template, chain, branchAndMerge, mergeWith, } from '@angular-devkit/schematics';
import { classify, dasherize, camelize, underscore } from '@angular-devkit/core/src/utils/strings';
import { SchemaOptions } from './schema';
import { CONFIG } from '../utils/config';
import { addImportDeclaration } from '../utils/build';

const stringUtils = { classify, dasherize, camelize, underscore };

export const MODULE_EXT = '.module.ts';
export const ROUTING_MODULE_EXT = '-routing.module.ts';

export function main(options: SchemaOptions): Rule {
  const config = CONFIG[options.isBiz ? 'biz' : 'routes'];
  options.path = config.dirPath + '/' + options.module + '/' + options.name + '/';

  const templateOptions = {
    path: options.path,
    name: options.name,
    module: options.module,
    searchFormName: options.searchFormName,
    tableName: options.tableName,
    tabTitle: options.tabTitle
  };

  const templateSource = apply(url('./files'), [
    template({
      ...stringUtils,
      ...templateOptions
    })
  ]);

  return chain([
    branchAndMerge(chain([
      mergeWith(templateSource),
      // routing.module.ts
      // 这里也暂时不引入routing.module.ts
      // addImportDeclaration(
      //   `${config.dirPath}/${options.module}/${options.module}-routing.module.ts`,
      //   `${classify(options.name)}Component`,
      //   `./${options.name}/${options.name}.component`,
      //   `routes`,
      //   `{ path: '${options.name}', component: ${classify(options.name)}Component, data: { title: "${options.name}" } }`
      // ),
      // module.ts
      addImportDeclaration(
        `${config.dirPath}/${options.module}/${options.module}.module.ts`,
        `${classify(options.name)}Component`,
        `./${options.name}/${options.name}.component`,
        `COMPONENTS`,
        `${classify(options.name)}Component`
      )
    ]))
  ]);
}