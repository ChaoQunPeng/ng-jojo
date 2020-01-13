import { Rule, Tree, SchematicContext, chain } from "@angular-devkit/schematics";
import { insertImport, getSourceFile } from "./utils";
import { InsertChange } from "./change";
import * as ts from '../third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import chalk from "chalk";
import { CfgInterface, BaseSchmeOptions } from "./config";
import { classify } from "@angular-devkit/core/src/utils/strings";

/**
 * Add Import `import { symbolName } from filePath` 
 * @param filePath 文件路径
 * @param symbolName 要引入组件的类名
 * @param componentPath 引入组件的路径
 */
export function addImport(filePath: string, symbolName: string, componentPath: string): Rule {
    return (host: Tree) => {
        const recorder = host.beginUpdate(filePath);
        let fileSource = getSourceFile(host, filePath);
        const routesChange = insertImport(fileSource, filePath, symbolName, componentPath) as InsertChange;
        if (routesChange.toAdd) {
            recorder.insertLeft(routesChange.pos, routesChange.toAdd);
        }
        host.commitUpdate(recorder);
        return host;
    }
}

/**
 * 添加文本到某个变量里
 * @param filePath 文件名
 * @param variableName 变量名
 * @param text 要添加的文本
 */
export function addValToVar(filePath: string, variableName: string, text: string): Rule {
    return (host: Tree) => {
        let moduleSource = getSourceFile(host, filePath);

        const node = findNode(moduleSource, ts.SyntaxKind.Identifier, variableName) as ts.Node;

        const arr = (node.parent as any).initializer as ts.ArrayLiteralExpression;

        const change = new InsertChange(
            filePath,
            arr.end - 1,
            `${arr.elements && arr.elements.length > 0 ? ',' : ''}\n  ${text}`,
        );

        const declarationRecorder = host.beginUpdate(filePath);
        declarationRecorder.insertLeft(change.pos, change.toAdd);
        host.commitUpdate(declarationRecorder);
        return host;
    }
}

/**
 * 添加路由配置。形如{ path: '', loadChildren: () => import('').then(m =>m.Module ) }
 * @param filePath 文件路径
 * @param options 当前配置
 * @param config 配置对象
 */
export function addLoadChilrenToVal(filePath: string, options: any, config: CfgInterface): Rule {
    let text = `{ path: '${options.module}', loadChildren: () => import('./${options.module}/${options.module}.module').then(m =>m.${classify(options.module)}Module ) }`;
    return addValToVar(filePath, config.routesModuleVar, text);
}

/**
 * 引入某个文件并自动import和在某个变量加入symbolName
 * @param filePath 要操作的文件路径
 * @param symbolName import { symbolName } from symbolPath。
 * @param symbolPath import { symbolName } from symbolPath。
 * @param variableName 要在哪个变量里添加这个symbolName
 * @param text 这个变量里要添加的文本
 */
export function addImportDeclaration(filePath: string, symbolName: string, symbolPath: string, variableName: string, text: string) {
    return chain([
        addImport(filePath, symbolName, symbolPath),
        addValToVar(filePath, variableName, text),
    ]);
}

/**
 * 添加Component引用
 * @param options 当前schematics配置
 * @param config 基础配置
 * @param valName 要操作的变量明年，默认是 `COMPONENTS`
 */
export function addComponentImport(options: BaseSchmeOptions, config: CfgInterface, valName: string = 'COMPONENTS'): Rule {
    return addImportDeclaration(
        `${config.dirPath}/${options.module}/${options.module}.module.ts`,
        `${classify(options.name)}Component`,
        `./${options.name}/${options.name}.component`,
        valName,
        `${classify(options.name)}Component`
    )
}

/**
 * 添加Module引用
 * @param options 当前schematics配置
 * @param config 基础配置
 * @param valName 要操作的变量，默认是 `MODULES`
 */
export function addModuleImport(options: BaseSchmeOptions, config: CfgInterface, valName: string = 'MODULES'): Rule {
    return addImportDeclaration(
        `${config.dirPath}/${options.module}/${options.module}.module.ts`,
        `${classify(options.name)}Module`,
        `./${options.name}/${options.name}.module`,
        valName,
        `${classify(options.name)}Module`
    )
}

/**
 * 新增列表、新增、编辑三个页面的引用
 * @param options 外部配置参数
 * @param config 基础配置参数
 *  类似下面这种
    import { Component } from './component/component.component';
    import { NewComponent } from './component/component-new/component-new.component';
    import { EditComponent } from './component/component-edit/component-edit.component';
 */
// export function addListNewEditRef(options: any, config: CfgInterface): Rule {
//     return chain([
//         // routing-module.ts
//         addImportDeclaration(
//             `./${config.dirPath}/${options.module}/${options.module}-routing.module.ts`,
//             `${classify(options.name)}Component`,
//             `./${options.name}/${options.name}.component`,
//             `routes`,
//             `${classify(options.name)}Component`
//         ),
//         // module.ts
//         addImportDeclaration(
//             `./${config.dirPath}/${options.module}/${options.module}.module.ts`,
//             `${classify(options.name)}Component`,
//             `./${options.name}/${options.name}.component`,
//             `COMPONENTS`,
//             `${classify(options.name)}Component`
//         ),
//         // new-component to module
//         addImportDeclaration(
//             `./${config.dirPath}/${options.module}/${options.module}.module.ts`,
//             `${classify(options.name)}NewComponent`,
//             `./${options.name}/${options.name}-new/${options.name}-new.component`,
//             `routes`,
//             `${classify(options.name)}NewComponent`
//         ),
//         // edit-component to module
//         addImportDeclaration(
//             `./${config.dirPath}/${options.module}/${options.module}.module.ts`,
//             `${classify(options.name)}EditComponent`,
//             `./${options.name}/${options.name}-edit/${options.name}-edit.component`,
//             `routes`,
//             `${classify(options.name)}EditComponent`
//         )
//     ]);
// }

/**
 * 添加package.json依赖并执行下载任务
 * @param packageObj { pkgName: string, version: string } 的数组
 */
export function addPackageJsonDependency(packageObj: { pkgName: string, version: string }[]) {
    return (host: Tree, _context: SchematicContext) => {
        const jsonStr = host.read('package.json')!.toString('utf-8');
        const json = JSON.parse(jsonStr);
        const type = 'dependencies';
        if (!json[type]) {
            json[type] = {};
        }

        packageObj.forEach(e => {
            if (!json[type][e.pkgName]) {
                json[type][e.pkgName] = e.version;
                host.overwrite('package.json', JSON.stringify(json, null, 2));
                console.log(`${chalk.cyan(`Add Downloading Task=> ${e.pkgName}  version:${e.version}`)}`)
            }
        });
        _context.addTask(new NodePackageInstallTask());
        return host;
    };
}

/**************************** 下面这些一般不予理会 ********************************* */


/**
 * Get all the nodes from a source.
 * @param sourceFile The source file object.
 * @returns {Observable<ts.Node>} An observable of all the nodes in the source.
 */
export function getSourceNodes(sourceFile: ts.SourceFile): ts.Node[] {
    const nodes: ts.Node[] = [sourceFile];
    const result = [];

    while (nodes.length > 0) {
        const node = nodes.shift();

        if (node) {
            result.push(node);
            if (node.getChildCount(sourceFile) >= 0) {
                nodes.unshift(...node.getChildren());
            }
        }
    }

    return result;
}

export function findNode(node: ts.Node, kind: ts.SyntaxKind, text: string): ts.Node | null {
    if (node.kind === kind && node.getText() === text) {
        // throw new Error(node.getText());
        return node;
    }

    let foundNode: ts.Node | null = null;
    ts.forEachChild(node, childNode => {
        foundNode = foundNode || findNode(childNode, kind, text);
    });

    return foundNode;
}