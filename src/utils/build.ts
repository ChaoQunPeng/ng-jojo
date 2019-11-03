import { Rule, Tree } from "@angular-devkit/schematics";
import { insertImport, getSourceFile } from "./utils";
import { InsertChange } from "./change";
import * as ts from '../third_party/github.com/Microsoft/TypeScript/lib/typescript';
// import { piece3Options } from "../piece3/schema";

// export function buildSmart(options: piece3Options): Rule {
//     return chain([
//         addImport(options),
//         addValToVar(options.listRoutePath, 'routes', `{ path: '${options.name}', component: UsersComponent }`),
//     ]);
// }

/**
 * Add Import `import { symbolName } from filePath` 
 * @param filePath 文件路径。要在哪个文件件添加import { symbolName } from filePath
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

export function addValToVar(filePath: string, variableName: string, text: string): Rule {
    return (host: Tree) => {
        let moduleSource = getSourceFile(host, filePath);
        // const allNodes = getSourceNodes(moduleSource);
        // allNodes[0].parent as any

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