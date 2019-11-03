import { chain, Rule, apply, url, template, branchAndMerge, mergeWith } from '@angular-devkit/schematics';
import { classify, dasherize, camelize, underscore } from '@angular-devkit/core/src/utils/strings';
import { schemaOptions } from "./schema";
import { addImport, addValToVar } from '../utils/build';
import { Routes, Biz } from '../utils/config';

const stringUtils = { classify, dasherize, camelize, underscore };

export function drawer(options: schemaOptions): Rule {
    const MODULE = options.isBiz ? Biz : Routes;
    options.path = MODULE.SharedComponentDir + options.module;

    options.filePath = MODULE.SharedModulePath;
    options.symbolName = `${classify(options.name)}Component`;
    options.componentPath = `./components/${options.module}/${options.name}/${options.name}.component`;

    const templateSource = apply(url('./files'), [
        template({
            ...stringUtils,
            ...options,
        }),
    ]);

    return chain([
        branchAndMerge(chain([
            mergeWith(templateSource),
            addImport(options.filePath, options.symbolName, options.componentPath),
            addValToVar(MODULE.SharedModulePath, "COMPONENTS", options.symbolName)
        ]))
    ]);
}