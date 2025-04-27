interface SimplePopupData {
    x: number;
    y: number; 
    text: string; 
    /** Will there be a button on the popup? Default: true */
    button?: boolean;
    /** Function to run when the OK button is clicked */
    func?: () => void;
    /** The popup title. Default is "" (no title) */
    title?: string;
    /** Will there be a "Back" button on the popup? Default: false */
    backButton?: boolean;
    /** Is the popup an error (will have red border)? Default: false */
    isError?: boolean;
}

export class SimplePopup {
    html: HTMLDialogElement;

    constructor(data: SimplePopupData) {
        this.html = document.createElement("dialog");
        this.html.className = "popup";
        this.html.style.width = `${data.x}px`;
        this.html.style.height = `${data.y}px`;
        
            const title = document.createElement("h3");
            title.className = "simple-popup-title";
            if (data.title) {
                title.style.display = "block";
                title.innerText = data.title;
            } else {
                title.style.display = "none"
            }
            this.html.appendChild(title);

            const content = document.createElement("p");
            content.className = "popup-content";
            content.innerHTML = data.text;
            this.html.appendChild(content);

            const buttonDiv = document.createElement("div");
            buttonDiv.className = "simple-popup-button-div";
            buttonDiv.style.width = `${data.x}px`;

                const backButton = document.createElement("button");
                backButton.className = "popup-button";
                backButton.innerText = "Back";
                backButton.style.marginRight = "3px";
                backButton.addEventListener("click", () => { this.destroy() });
                if (data.backButton)
                    backButton.style.display = "inline-block";
                else
                    backButton.style.display = "none";
                buttonDiv.appendChild(backButton);

                const button = document.createElement("button");
                button.className = "popup-button";
                button.innerText = "OK";
                button.addEventListener("click", () => { if (data.func !== undefined) data.func(); this.destroy() });
                if (data.button === false)
                    button.style.display = "none";
                else
                    button.style.display = "inline-block";
                buttonDiv.appendChild(button);
            this.html.appendChild(buttonDiv);

        if (data.isError) {
            this.html.style.borderColor = "red";
        } else {
            this.html.style.borderColor = "black";
        }

        document.body.appendChild(this.html);

        this.html.showModal(); // html must exist to show modal
    }

    destroy() {
        this.html.close(); //? do we need this?
        this.html.remove();
    }
}

export interface AdvancedPopupOptions {
    /** The `opacity` percentage of the dialog backdrop. Default: 50 */
    filterLevel?: number;
    /** The padding to apply to the popup HTML, in `px` */
    innerPadding?: number;
}
const defaultValues: Required<AdvancedPopupOptions> = {
    filterLevel: 50,
    innerPadding: 0
}

export class AdvancedPopup {
    html: HTMLDialogElement

    constructor(x: number, y: number, html: string, options: AdvancedPopupOptions=undefined) { // todo: possibly add HTMLElement to html instead of just string?
        this.html = document.createElement("dialog");
        this.html.className = "popup";
        this.html.style.display = "flex";
        this.html.style.width = `${x}px`;
        this.html.style.height = `${y}px`;

        this.html.innerHTML = html;

        const filledOptions = {
            ...defaultValues,
            ...options
        };

        this.html.style.padding = filledOptions.innerPadding+"px";
        this.html.style.setProperty("--dialog-backdrop-opacity", filledOptions.filterLevel+"%");
        
        document.body.appendChild(this.html);

        this.html.showModal(); // html must exist to show modal
        this.html.addEventListener("cancel", () => { //* make the esc key work, for some reason simple popups don't need this
            this.destroy();
        });
    }

    destroy() {
        this.html.close();
        this.html.remove();
    }
}