import * as ts from '../third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { Change, InsertChange, NoopChange } from './change';
import { Tree, SchematicsException } from '@angular-devkit/schematics';


/**
 * Add Import `import { symbolName } from fileName` if the import doesn't exit
 * already. Assumes fileToEdit can be resolved and accessed.
 * @param fileToEdit (file we want to add import to)
 * @param symbolName (item to import)
 * @param fileName (path to the file)
 * @param isDefault (if true, import follows style for importing default exports)
 * @return Change
 */
export function insertImport(source: ts.SourceFile, fileToEdit: string, symbolName: string,
    fileName: string, isDefault = false): Change {
    const rootNode = source;
    const allImports = findNodes(rootNode, ts.SyntaxKind.ImportDeclaration);

    // get nodes that map to import statements from the file fileName
    const relevantImports = allImports.filter(node => {
        // StringLiteral of the ImportDeclaration is the import file (fileName in this case).
        const importFiles = node.getChildren()
            .filter(child => child.kind === ts.SyntaxKind.StringLiteral)
            .map(n => (n as ts.StringLiteral).text);

        return importFiles.filter(file => file === fileName).length === 1;
    });

    if (relevantImports.length > 0) {
        let importsAsterisk = false;
        // imports from import file
        const imports: ts.Node[] = [];
        relevantImports.forEach(n => {
            Array.prototype.push.apply(imports, findNodes(n, ts.SyntaxKind.Identifier));
            if (findNodes(n, ts.SyntaxKind.AsteriskToken).length > 0) {
                importsAsterisk = true;
            }
        });

        // if imports * from fileName, don't add symbolName
        if (importsAsterisk) {
            return new NoopChange();
        }

        const importTextNodes = imports.filter(n => (n as ts.Identifier).text === symbolName);

        // insert import if it's not there
        if (importTextNodes.length === 0) {
            const fallbackPos =
                findNodes(relevantImports[0], ts.SyntaxKind.CloseBraceToken)[0].getStart() ||
                findNodes(relevantImports[0], ts.SyntaxKind.FromKeyword)[0].getStart();

            return insertAfterLastOccurrence(imports, `, ${symbolName}`, fileToEdit, fallbackPos);
        }

        return new NoopChange();
    }

    // no such import declaration exists
    const useStrict = findNodes(rootNode, ts.SyntaxKind.StringLiteral)
        .filter((n: ts.StringLiteral) => n.text === 'use strict');
    let fallbackPos = 0;
    if (useStrict.length > 0) {
        fallbackPos = useStrict[0].end;
    }
    const open = isDefault ? '' : '{ ';
    const close = isDefault ? '' : ' }';
    // if there are no imports or 'use strict' statement, insert import at beginning of file
    const insertAtBeginning = allImports.length === 0 && useStrict.length === 0;
    const separator = insertAtBeginning ? '' : ';\n';
    const toInsert = `${separator}import ${open}${symbolName}${close}` +
        ` from '${fileName}'${insertAtBeginning ? ';\n' : ''}`;

    return insertAfterLastOccurrence(
        allImports,
        toInsert,
        fileToEdit,
        fallbackPos,
        ts.SyntaxKind.StringLiteral,
    );
}

/**
 * Insert `toInsert` after the last occurence of `ts.SyntaxKind[nodes[i].kind]`
 * or after the last of occurence of `syntaxKind` if the last occurence is a sub child
 * of ts.SyntaxKind[nodes[i].kind] and save the changes in file.
 *
 * @param nodes insert after the last occurence of nodes
 * @param toInsert string to insert
 * @param file file to insert changes into
 * @param fallbackPos position to insert if toInsert happens to be the first occurence
 * @param syntaxKind the ts.SyntaxKind of the subchildren to insert after
 * @return Change instance
 * @throw Error if toInsert is first occurence but fall back is not set
 */
export function insertAfterLastOccurrence(nodes: ts.Node[],
    toInsert: string,
    file: string,
    fallbackPos: number,
    syntaxKind?: ts.SyntaxKind): Change {
    let lastItem: ts.Node | undefined;
    for (const node of nodes) {
        if (!lastItem || lastItem.getStart() < node.getStart()) {
            lastItem = node;
        }
    }
    if (syntaxKind && lastItem) {
        lastItem = findNodes(lastItem, syntaxKind).sort(nodesByPosition).pop();
    }
    if (!lastItem && fallbackPos == undefined) {
        throw new Error(`tried to insert ${toInsert} as first occurence with no fallback position`);
    }
    const lastItemPosition: number = lastItem ? lastItem.getEnd() : fallbackPos;

    return new InsertChange(file, lastItemPosition, toInsert);
}

/**
 * Find all nodes from the AST in the subtree of node of SyntaxKind kind.
 * @param node
 * @param kind
 * @param max The maximum number of items to return.
 * @param recursive Continue looking for nodes of kind recursive until end
 * the last child even when node of kind has been found.
 * @return all nodes of kind, or [] if none is found
 */
export function findNodes(node: ts.Node, kind: ts.SyntaxKind, max = Infinity, recursive = false): ts.Node[] {
    if (!node || max == 0) {
        return [];
    }

    const arr: ts.Node[] = [];
    if (node.kind === kind) {
        arr.push(node);
        max--;
    }
    if (max > 0 && (recursive || node.kind !== kind)) {
        for (const child of node.getChildren()) {
            findNodes(child, kind, max).forEach(node => {
                if (max > 0) {
                    arr.push(node);
                }
                max--;
            });

            if (max <= 0) {
                break;
            }
        }
    }

    return arr;
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

/**
 * Helper for sorting nodes.
 * @return function to sort nodes in increasing order of position in sourceFile
 */
function nodesByPosition(first: ts.Node, second: ts.Node): number {
    return first.getStart() - second.getStart();
}

export function getSourceFile(host: Tree, path: string): ts.SourceFile {
    const buffer = host.read(path);
    if (!buffer) {
        throw new SchematicsException(`Could not find ${path}.`);
    }
    const content = buffer.toString();
    const source = ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true);

    return source;
}