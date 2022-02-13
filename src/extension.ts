'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient/node';

export function activate(context: vscode.ExtensionContext) {

    let serverModule = context.asAbsolutePath(path.join('out', 'src', 'lua_language_server.js'));
    let debugOptions = {};

    let serverOptions: ServerOptions = {
        run: { module: serverModule, transport: TransportKind.ipc },
        debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
    }

    let clientOptions: LanguageClientOptions = {
        documentSelector: ['lua'],
        synchronize: {
            configurationSection: 'luacheck',
            fileEvents: vscode.workspace.createFileSystemWatcher('**/.luacheckrc')
        }
    }
    let disposable = new LanguageClient('luacheck', 'Language Server Lua', serverOptions, clientOptions).start();

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
