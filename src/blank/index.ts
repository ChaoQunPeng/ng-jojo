
import { Rule, apply, url, template, chain, branchAndMerge, mergeWith, } from '@angular-devkit/schematics';
import { classify, dasherize, camelize, underscore } from '@angular-devkit/core/src/utils/strings';
import { SchemaOptions } from './schema';
import { CONFIG } from '../utils/config';
import { addImportDeclaration } from '../utils/build';
// import { addImportDeclaration } from '../utils/build';

const stringUtils = { classify, dasherize, camelize, underscore };

export const MODULE_EXT = '.module.ts';
export const ROUTING_MODULE_EXT = '-routing.module.ts';

export function main(options: SchemaOptions): Rule {
  const config = CONFIG[options.isBiz ? 'biz' : 'routes'];
  options.path = config.dirPath + '/' + options.module + '/' + options.name + '/';
  const templateOptions = {
    path: options.path,
    name: options.name,
    module: options.module
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
      // 这个blank暂时先不进行自动引入到routing.module.ts
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

// function addLoadChilrenToVal(filePath: string, options: SchemaOptions): Rule {
//   let text = `{ path: '${options.name}', component: ${classify(options.name)}Component, data: { title: "${options.name}" } }`;
//   return addValToVar(filePath, `routes`, text);
// }

// function addComponentRef(filePath: string, options: SchemaOptions) {
//   return chain([
//     addImport(filePath, `${classify(options.name)}Component`, `./${options.name}/${options.name}.component`),
//     addValToVar(filePath, `COMPONENTS`, `${classify(options.name)}Component`),
//   ]);
// }