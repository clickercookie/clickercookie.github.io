import { Window } from "ts-windowman";
import { LogManager } from "./helper.js";

export class ConsoleWindow extends Window {
    static windowUp: boolean = false;

    logs: HTMLDivElement;

    constructor() {
        super(600, 450, "Console");

        if (ConsoleWindow.windowUp) {
            this.kill();
        }
        ConsoleWindow.windowUp = true;

        this.html.style.backgroundColor = "#12001e";
        this.html.style.display = "flex";
        this.html.style.flexDirection = "column";
        
        this.logs = document.createElement("div");
        this.logs.style.fontFamily = "monospace"
        this.content.appendChild(this.logs);

        this.content.style.flex = "1 1 auto";
        this.content.style.overflowY = "scroll";

        this.updateConsole();
        LogManager.logSubscribers.push(() => {
            this.updateConsole();
        });
    }

    updateConsole() {
        console.log("updating console")
        this.logs.innerHTML = "";

        const logs = LogManager.getLogs()
        for (let i in logs) {
            //! this really probably shouldn't be innerHTML
            this.logs.innerHTML = this.logs.innerHTML + logs[i] + "<br>\n";
        }
    }

    override kill() {
        ConsoleWindow.windowUp = false;
        super.kill();
    }
}