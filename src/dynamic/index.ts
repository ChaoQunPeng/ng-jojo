
import { chain, Rule, apply, url, template, branchAndMerge, mergeWith, filter, noop } from '@angular-devkit/schematics';
import { classify, dasherize, camelize, underscore } from '@angular-devkit/core/src/utils/strings';
import { SchemaOptions } from './schema';
import { addLoadChilrenToVal, addImport, addValToVar,  addImportDeclaration } from '../utils/build';//addImport, 
import { CONFIG, CfgInterface } from '../utils/config';

const stringUtils = { classify, dasherize, camelize, underscore };

export const MODULE_EXT = '.module.ts';
export const ROUTING_MODULE_EXT = '-routing.module.ts';

export function main(options: SchemaOptions): Rule {
  return async () => {
    const cfgType = options.isBiz ? 'biz' : 'routes';
    const config = CONFIG[cfgType];

    options.path = config.dirPath;

    // 当前路径
    // const parsedPath = parseName(options.path as string, options.name);
    // const pathToCheck = (options.path || '') + '/' + options.name;
    // 最近的两个module路径
    // const fp = findModule(host, pathToCheck)

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
        addReferences(options, config)
      ]))

    ]);
  }
}

/**
 * 添加引用。这里主要是根据options.init判断是否执行addListNewEditRef这一系列的操作。
 * 如果option.init等于true则直接在生成的module里生成列表、新增和编辑的配置了。
 * @param options 外部配置参数
 * @param config 基础配置参数
 */
function addReferences(options: SchemaOptions, config: CfgInterface): Rule {
  // options.init为true的话说明是第一次创建，一般都会需要module.ts和routing.module.ts
  // 所以需要引入到主module和routeModule
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
    return chain([
      addListNewEditRef(options, config)
    ]);
  }
}

/**
 * 新增列表新增编辑三个页面的引用
 * @param options 外部配置参数
 * @param config 基础配置参数
 */
function addListNewEditRef(options: SchemaOptions, config: CfgInterface): Rule {
  return chain([
    // addImport(`./${config.dirPath}/${options.module}/${options.module}-routing.module.ts`, `${classify(options.name)}Component`, `./${options.name}/${options.name}.component`),
    // addValToVar(`./${config.dirPath}/${options.module}/${options.module}-routing.module.ts`, `routes`, `{ path: '${options.name}', component: ${classify(options.name)}Component, data: { title: "${options.tabTitle}" }}`),

    // 列表页
    addImport(`${config.dirPath}/${options.module}/${options.module}.module.ts`, `${classify(options.name)}Component`, `./${options.name}/${options.name}.component`),
    addValToVar(`${config.dirPath}/${options.module}/${options.module}.module.ts`, `COMPONENTS`, `${classify(options.name)}Component`),

    // 新增页
    addImport(`${config.dirPath}/${options.module}/${options.module}.module.ts`, `${classify(options.name)}NewComponent`, `./${options.name}/${options.name}-new/${options.name}-new.component`),
    addValToVar(`${config.dirPath}/${options.module}/${options.module}.module.ts`, `COMPONENTS`, `${classify(options.name)}NewComponent`),

    // 编辑页
    addImport(`${config.dirPath}/${options.module}/${options.module}.module.ts`, `${classify(options.name)}EditComponent`, `./${options.name}/${options.name}-edit/${options.name}-edit.component`),
    addValToVar(`${config.dirPath}/${options.module}/${options.module}.module.ts`, `COMPONENTS`, `${classify(options.name)}EditComponent`)
  ]);
}