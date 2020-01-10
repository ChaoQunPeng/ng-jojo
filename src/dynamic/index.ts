
import { chain, Rule, apply, url, template, branchAndMerge, mergeWith, filter, noop, Tree, DirEntry } from '@angular-devkit/schematics';
import { classify, dasherize, camelize, underscore } from '@angular-devkit/core/src/utils/strings';
import { SchemaOptions } from './schema';
// import { createDefaultPath } from '../utility/workspace';Tree, 
import { parseName } from '../utility/parse-name';
import { addValToVar, addImport } from '../utils/build';//addImport, 
import { bizConfig, routeConfig, BaseCfgInterface } from '../utils/config';
import { PathFragment } from '@angular-devkit/core';

const stringUtils = { classify, dasherize, camelize, underscore };

export const MODULE_EXT = '.module.ts';
export const ROUTING_MODULE_EXT = '-routing.module.ts';

export function main(options: SchemaOptions): Rule {
  return async (host: Tree) => {
    console.log(options)

    const config = options.isBiz ? bizConfig : routeConfig;
    config.childrenPath(options.module);

    if (options.path === undefined) {
      options.path = config.basePath + '/';
    }

    const parsedPath = parseName(options.path, options.name);

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
        addReferences(options, config, host)
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
function addReferences(options: SchemaOptions, config: BaseCfgInterface, host: Tree): Rule {
  // 为true,则是第一次创建带有module和routing.module的时候
  if (options.init) {

    if (options.path) {
      const pathToCheck = (options.path || '') + '/' + options.name;
      const fp = getClosestModule(host, pathToCheck)
      console.log(`最近的两个module路径:::::`);
      console.log(fp);
    }

    if (options.isBiz) {
      return chain([
        // 给biz-children.ts加
        addValToVar(config.filePath, config.variableName, config.text),
        // 给biz.module.ts里加
        addImport(`src/app/biz/biz.module.ts`, `${classify(options.module)}Module`, `./page/${options.module}/${options.module}.module`),
        addValToVar(`src/app/biz/biz.module.ts`, `MODULE`, `${classify(options.module)}Module`),
      ]);
    } else {
      return chain([
        // 给routes-children.ts加
        addValToVar(config.filePath, config.variableName, config.text),
        // 给routes.module.ts里加
        addImport(`src/app/routes/routes.module.ts`, `${classify(options.module)}Module`, `./page/${options.module}/${options.module}.module`),
        addValToVar(`src/app/routes/routes.module.ts`, `FRAMEWORK_MODULE`, `${classify(options.module)}Module`),
      ]);
    }


  } else {
    return addListNewEditRef(options, config);
  }
}

/**
 * 新增列表新增编辑三个页面的引用
 * @param options 外部配置参数
 * @param config 基础配置参数
 */
function addListNewEditRef(options: SchemaOptions, config: BaseCfgInterface): Rule {
  return chain([
    // routing.module.ts
    addImport(`${config.basePath}/${options.module}/${options.module}-routing.module.ts`, `${classify(options.name)}Component`, `./${options.name}/${options.name}.component`),
    addValToVar(`${config.basePath}/${options.module}/${options.module}-routing.module.ts`, `routes`, `{ path: '${options.name}', component: ${classify(options.name)}Component, data: { title: '${options.tabTitle}' } }`),

    // 列表页
    addImport(`${config.basePath}/${options.module}/${options.module}.module.ts`, `${classify(options.name)}Component`, `./${options.name}/${options.name}.component`),
    addValToVar(`${config.basePath}/${options.module}/${options.module}.module.ts`, `COMPONENTS`, `${classify(options.name)}Component`),

    // 新增页
    addImport(`${config.basePath}/${options.module}/${options.module}.module.ts`, `${classify(options.name)}NewComponent`, `./${options.name}/${options.name}-new/${options.name}-new.component`),
    addValToVar(`${config.basePath}/${options.module}/${options.module}.module.ts`, `COMPONENTS`, `${classify(options.name)}NewComponent`),

    // 编辑页
    addImport(`${config.basePath}/${options.module}/${options.module}.module.ts`, `${classify(options.name)}EditComponent`, `./${options.name}/${options.name}-edit/${options.name}-edit.component`),
    addValToVar(`${config.basePath}/${options.module}/${options.module}.module.ts`, `COMPONENTS`, `${classify(options.name)}EditComponent`)
  ]);
}

function getClosestModule(host: Tree, generateDir: string): PathFragment[] | undefined {
  let dir: DirEntry | null = host.getDir('/' + generateDir);
  while (dir) {
    const allMatches = dir.subfiles.filter(p => p.endsWith(MODULE_EXT));

    if (allMatches.length > 0) {
      return allMatches;
    }
    dir = dir.parent;
  }
}