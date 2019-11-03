import { chain, Rule, apply, url, template, branchAndMerge, mergeWith } from '@angular-devkit/schematics';
import { classify, dasherize, camelize, underscore } from '@angular-devkit/core/src/utils/strings';
import { DynamicOptions } from "./schema";
import { addImport, addValToVar } from '../utils/build'; // buildSmart

const stringUtils = { classify, dasherize, camelize, underscore };

export function dynamic(options: DynamicOptions): Rule {

    const listOptions = {
        modPath: `${options.listPath}${options.module}/${options.module}.module.ts`,
        routeModPath: `${options.listPath}${options.module}/${options.module}-routing.module.ts`,
        symbolName: `${classify(options.name)}Component`,
        componentPath: `./${options.name}/${options.name}.component`,
        route: `{ path: '${options.name}', component: ${classify(options.name)}Component }`
    };

    const newOptions = {
        sharedModulePath: `src/app/biz/shared/biz.shared.module.ts`,
        symbolName: `${classify(options.name)}NewComponent`,
        componentPath: `./components/${options.module}/${options.name}-new/${options.name}-new.component`,
    };

    const editOptions = {
        sharedModulePath: `src/app/biz/shared/biz.shared.module.ts`,
        symbolName: `${classify(options.name)}EditComponent`,
        componentPath: `./components/${options.module}/${options.name}-edit/${options.name}-edit.component`,
    };

    const templateOption = {
        name: options.name,
        module: options.module,
        listPath: options.listPath + options.module + "/",
        newPath: options.newPath + options.module + "/",
        editPath: options.editPath + options.module + "/"
    }
    const templateSource = apply(url('./files'), [
        template({
            ...stringUtils,
            ...templateOption
        })
    ]);

    return chain([
        branchAndMerge(chain([
            mergeWith(templateSource),
            //list module.ts
            addImport(listOptions.modPath, listOptions.symbolName, listOptions.componentPath),
            addValToVar(listOptions.modPath, "COMPONENTS", listOptions.symbolName),
            //list routing-module.ts
            addImport(listOptions.routeModPath, listOptions.symbolName, listOptions.componentPath),
            addValToVar(listOptions.routeModPath, "routes", listOptions.route),

            //new module.ts
            addImport(newOptions.sharedModulePath, newOptions.symbolName, newOptions.componentPath),
            addValToVar(newOptions.sharedModulePath, "COMPONENTS", newOptions.symbolName),

            //edit module.ts
            addImport(editOptions.sharedModulePath, editOptions.symbolName, editOptions.componentPath),
            addValToVar(editOptions.sharedModulePath, "COMPONENTS", editOptions.symbolName)
        ]))
    ]);
}