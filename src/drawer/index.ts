import { chain, Rule, apply, url, template, branchAndMerge, mergeWith } from '@angular-devkit/schematics';
import { classify, dasherize, camelize, underscore } from '@angular-devkit/core/src/utils/strings';
import { schemaOptions } from "./schema";
import { addImport, addValToVar } from '../utils/build';
const stringUtils = { classify, dasherize, camelize, underscore };

const SharedModulePath = `src/app/biz/shared/biz.shared.module.ts`;

export function drawer(options: schemaOptions): Rule {
    options.path = options.path + options.module;
    options.filePath = SharedModulePath;
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
            addValToVar(SharedModulePath, "COMPONENTS", options.symbolName)
        ]))
    ]);
}