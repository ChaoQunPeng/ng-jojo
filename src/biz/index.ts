import { chain, Rule, apply, url, template, branchAndMerge, mergeWith } from '@angular-devkit/schematics';
import { classify, dasherize, camelize, underscore } from '@angular-devkit/core/src/utils/strings';
import { bizOptions } from "./schema";
import { addImport, addValToVar } from '../utils/build'; // buildSmart
import { Biz, Routes } from '../utils/config';


const stringUtils = { classify, dasherize, camelize, underscore };

export function biz(options: bizOptions): Rule {
    
    // 是业务模块还是框架模块
    const MODULE = options.IsBiz ? Biz : Routes;

    const bizChildren = {
        ChildrenPath: MODULE.RoutingModuleChildrenPath,
        symbolName: `{ path: '${options.module}', loadChildren: () => import('./page/${options.module}/${options.module}.module').then(m => m.${classify(options.module)}Module) }`
    }

    // const listOptions = {
    //     modPath: `${options.listPath}${options.module}/${options.module}.module.ts`,
    //     routeModPath: `${options.listPath}${options.module}/${options.module}-routing.module.ts`,
    //     symbolName: `${classify(options.name)}Component`,
    //     componentPath: `./${options.name}/${options.name}.component`,
    //     route: `{ path: '${options.name}', component: ${classify(options.name)}Component }`
    // };

    const newOptions = {
        sharedModulePath: MODULE.SharedModulePath,
        symbolName: `${classify(options.name)}NewComponent`,
        componentPath: `./components/${options.module}/${options.name}-new/${options.name}-new.component`,
    };

    const editOptions = {
        sharedModulePath: MODULE.SharedModulePath,
        symbolName: `${classify(options.name)}EditComponent`,
        componentPath: `./components/${options.module}/${options.name}-edit/${options.name}-edit.component`,
    };

    const templateOption = {
        name: options.name,
        module: options.module,
        operaComponent: options.operaComponent,
        apiPath: options.apiPath,
        listPath: options.listPath + options.module + "/",
        newPath: options.newPath + options.module + "/",
        editPath: options.editPath + options.module + "/",
        listComponentType: options.listComponentType,
        editComponentType: options.editComponentType,
        newComponentType: options.newComponentType
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
            addValToVar(bizChildren.ChildrenPath, "BizModules", bizChildren.symbolName),
            // //list module.ts
            // addImport(listOptions.modPath, listOptions.symbolName, listOptions.componentPath),
            // addValToVar(listOptions.modPath, "COMPONENTS", listOptions.symbolName),
            // //list routing-module.ts
            // addImport(listOptions.routeModPath, listOptions.symbolName, listOptions.componentPath),
            // addValToVar(listOptions.routeModPath, "routes", listOptions.route),

            //new module.ts
            addImport(newOptions.sharedModulePath, newOptions.symbolName, newOptions.componentPath),
            addValToVar(newOptions.sharedModulePath, "COMPONENTS", newOptions.symbolName),

            //edit module.ts
            addImport(editOptions.sharedModulePath, editOptions.symbolName, editOptions.componentPath),
            addValToVar(editOptions.sharedModulePath, "COMPONENTS", editOptions.symbolName)
        ]))
    ]);
}