import { Rule, Tree, SchematicContext } from "@angular-devkit/schematics";
import { insertImport, getSourceFile } from "./utils";
import { InsertChange } from "./change";
import * as ts from '../third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import chalk from "chalk";

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
 * 
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