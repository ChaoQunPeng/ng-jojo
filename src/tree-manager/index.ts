import { chain, Rule, apply, url, template, branchAndMerge, mergeWith, noop, filter } from '@angular-devkit/schematics';
import { classify, dasherize, camelize, underscore } from '@angular-devkit/core/src/utils/strings';
import { SchemaOptions } from "./schema";
import { CONFIG, CfgInterface } from '../utils/config';
import { addLoadChilrenToVal, addImportDeclaration } from '../utils/build';

const stringUtils = { classify, dasherize, camelize, underscore };

export function treeManager(options: SchemaOptions): Rule {

    const cfgType = options.isBiz ? 'biz' : 'routes';
    const config = CONFIG[cfgType];

    options.path = config.dirPath;

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

    const templateSource = apply(url('./files'), [
        options.init ? noop() : filter(ext => !ext.endsWith('-api.service.ts')),
        options.init ? noop() : filter(ext => !ext.endsWith('-routing.module.ts')),
        options.init ? noop() : filter(ext => !ext.endsWith('.module.ts')),
        options.init ? noop() : filter(ext => !ext.endsWith('.service.ts')),
        template({
            ...stringUtils,
            ...templateOptions
        })
    ]);

    return chain([
        branchAndMerge(chain([
            mergeWith(templateSource),
            addRef(options, config)
        ]))
    ]);
}

function addRef(options: SchemaOptions, config: CfgInterface): Rule {
    if (options.init) {
        return chain([
            addImportDeclaration(
                `${config.mainModulePath}`,
                `${classify(options.name)}Module`,
                `./${options.module}/${options.module}.module`,
                `${config.mainModuleVal}`,
                `${classify(options.name)}Module`
              ),
            addLoadChilrenToVal(config.routesModulePath, options, config)
        ]);
    } else {
        return addListNewEditRef(options, config);
    }
}

/**
 * 新增列表新增编辑三个页面的引用
 * @param options 外部配置参数
 * @param config 基础配置参数
 */
function addListNewEditRef(options: SchemaOptions, config: CfgInterface): Rule {
    return chain([
        // 暂时先不引入到routing-module.ts
        // addImportDeclaration(
        //     `./${config.dirPath}/${options.module}/${options.module}-routing.module.ts`,
        //     `${classify(options.name)}Component`,
        //     `./${options.name}/${options.name}.component`,
        //     `routes`,
        //     `{ path: '${options.name}', component: ${classify(options.name)}Component, data: { title: "${options.tabTitle}" }}`
        // ),
        // module.ts
        addImportDeclaration(
            `${config.dirPath}/${options.module}/${options.module}.module.ts`,
            `${classify(options.name)}Component`,
            `./${options.name}/${options.name}.component`,
            `COMPONENTS`,
            `${classify(options.name)}Component`
        ),
        // new-component to module
        addImportDeclaration(
            `${config.dirPath}/${options.module}/${options.module}.module.ts`,
            `${classify(options.name)}NewComponent`,
            `./${options.name}/${options.name}-new/${options.name}-new.component`,
            `COMPONENTS`,
            `${classify(options.name)}NewComponent`
        ),
        // edit-component to module
        addImportDeclaration(
            `${config.dirPath}/${options.module}/${options.module}.module.ts`,
            `${classify(options.name)}EditComponent`,
            `./${options.name}/${options.name}-edit/${options.name}-edit.component`,
            `COMPONENTS`,
            `${classify(options.name)}EditComponent`
        )
        // addImport(`./${config.dirPath}/${options.module}/${options.module}-routing.module.ts`, `${classify(options.name)}Component`, `./${options.name}/${options.name}.component`),
        // addValToVar(`./${config.dirPath}/${options.module}/${options.module}-routing.module.ts`, `routes`, `{ path: '${options.name}', component: ${classify(options.name)}Component, data: { title: "${options.tabTitle}" }}`),

        // addImport(`./${config.dirPath}/${options.module}/${options.module}.module.ts`, `${classify(options.name)}Component`, `./${options.name}/${options.name}.component`),
        // addValToVar(`./${config.dirPath}/${options.module}/${options.module}.module.ts`, `COMPONENTS`, `${classify(options.name)}Component`),

        // 新增页
        // addImport(`${config.dirPath}/${options.module}/${options.module}.module.ts`, `${classify(options.name)}NewComponent`, `./${options.name}/${options.name}-new/${options.name}-new.component`),
        // addValToVar(`${config.dirPath}/${options.module}/${options.module}.module.ts`, `COMPONENTS`, `${classify(options.name)}NewComponent`),

        // 编辑页
        // addImport(`${config.dirPath}/${options.module}/${options.module}.module.ts`, `${classify(options.name)}EditComponent`, `./${options.name}/${options.name}-edit/${options.name}-edit.component`),
        // addValToVar(`${config.dirPath}/${options.module}/${options.module}.module.ts`, `COMPONENTS`, `${classify(options.name)}EditComponent`)
    ]);
}