import * as vscode from 'vscode';

export class Output {

    private static readonly channelName = 'Angular schematics';
    private static _channel: vscode.OutputChannel | undefined;

    /**
     * Get the output channel
     */
    private static get channel(): vscode.OutputChannel {

        /* Create the channel just once */
        if (!this._channel) {
            this._channel =  vscode.window.createOutputChannel(this.channelName);
        }

        return this._channel;

    }

    /**
     * Log an info in output channel.
     */
    static logInfo(message: string): void {

        this.channel.appendLine(`[Info - ${(new Date().toLocaleTimeString())}] ${message}`);

    }

    /**
     * Log an error in output channel.
     */
    static logError(message: string): void {

        this.channel.appendLine(`[Error - ${(new Date().toLocaleTimeString())}] ${message}`);

    }

    /**
     * Log an error in output channel and show it to the user.
     */
    static showError(message: string): void {

        this.logError(message);

        vscode.window.showErrorMessage(message);

    }

    /**
     * Close the output channel.
     */
    static dispose(): void {

        this.channel.dispose();

    }

}
