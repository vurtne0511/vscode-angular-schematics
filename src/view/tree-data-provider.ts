import * as vscode from 'vscode';
import * as path from 'path';

import { Workspaces } from '../config';
import { Collection } from '../schematics';

export class SchematicsTreeDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

    private iconPath = '';
    private collections = new Map<string, Collection>();

    constructor() {

        const schematicsExtension = vscode.extensions.getExtension('cyrilletuzi.angular-schematics') as vscode.Extension<unknown>;

        this.iconPath = path.join(schematicsExtension.extensionPath, 'angular.svg');

    }

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: vscode.TreeItem | undefined): Promise<vscode.TreeItem[]> {

        /* Primary level: collection's name */
        if (!element) {

            for (const [, workspaceConfig] of Workspaces.workspaces) {

                for (const [name, collection] of workspaceConfig.collections.collections) {

                    /* Avoid duplicates */
                    if (!this.collections.has(name)) {
                        this.collections.set(name, collection);
                    }

                }

            }

            return Array.from(this.collections.keys()).map((collectionName) => new vscode.TreeItem(collectionName, vscode.TreeItemCollapsibleState.Expanded));

        }
        /* Secondary level: schematics's names for each collection */
        else {

            const collection = this.collections.get(element.label as string)!;

            return collection.getSchematicsNames()
                .map((schemaName) => {

                    const item = new vscode.TreeItem(schemaName, vscode.TreeItemCollapsibleState.None);

                    item.command = {
                        title: `Generate ${schemaName}`,
                        command: 'ngschematics.generate',
                        arguments: [undefined, collection.getName(), schemaName]
                    };
                    item.iconPath = this.iconPath;

                    return item;

                });

        }

    }

}