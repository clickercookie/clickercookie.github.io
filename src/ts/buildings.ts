import ClickerCookie from "./clickercookie.js";
import { capitalize, commaify, clamp } from "./helper.js";
import { game } from "./main.js";
import { hideTooltip } from "./tooltip.js";

export class Building {
    static UPGRADECOST_MULTIPLIER = 1.15; //? should this be static?

    private clickercookie: ClickerCookie;

    name: string;
    quote: string;
    upgradeCost: number;
    CPSGiven: number;
    GPSGain: number;
    CPSGain: number;

    bought: number; // todo: add set method to change the html for this
    unlocked: boolean;
    plural: "s" | "es";

    html: HTMLDivElement;
    constructor(clickercookie: ClickerCookie, name: string, quote: string, upgradeCost: number, CPSGain: number, iconImg: string="unknown.png", esPlural: boolean=false) {
        this.clickercookie = clickercookie;
        
        this.name = name;
        this.quote = quote;
        this.upgradeCost = upgradeCost;
        this.CPSGiven = 0;
        this.CPSGain = CPSGain;

        this.bought = 0;
        this.unlocked = false;
        if (esPlural) this.plural = "es";
        else this.plural = "s";

        // setup HTML (uses indentation to show structure)
        this.html = document.createElement("div");
        this.html.setAttribute("class","building");
        this.html.addEventListener("click", () => {this.buy()});
        this.html.addEventListener("mousemove", () => {this.hovered()});
        this.html.addEventListener("mouseover", () => {this.hovered()});
        this.html.addEventListener("mouseout",() => {hideTooltip()});
            const icon = document.createElement("img");
            icon.setAttribute("class", "building-icon");
            icon.setAttribute("src", `img/${iconImg}`);
            icon.setAttribute("alt", `${this.name} icon`);
            this.html.appendChild(icon);

            const buildingContent = document.createElement("div");
            buildingContent.setAttribute("class","building-content");
                const namePriceDiv = document.createElement("div");
                    const buildingName = document.createElement("p");
                    buildingName.setAttribute("class","building-name");
                    buildingName.innerHTML = `${capitalize(this.name)}`;
                    namePriceDiv.appendChild(buildingName);

                    const buildingPrice = document.createElement("p");
                    buildingPrice.setAttribute("class","building-price");
                    buildingPrice.setAttribute("id",`${this.name}Cost`);
                    buildingPrice.innerHTML = this.upgradeCost.toString();
                    namePriceDiv.appendChild(buildingPrice);
                buildingContent.appendChild(namePriceDiv);

                const buildingsBoughtWrapper = document.createElement("div");
                buildingsBoughtWrapper.setAttribute("class","buildings-bought-wrapper");
                    const buildingsBought = document.createElement("p");
                    buildingsBought.setAttribute("class","buildings-bought");
                    buildingsBought.setAttribute("id",`${this.name}${this.plural}Bought`);
                    buildingsBought.innerHTML = "0";
                    buildingsBoughtWrapper.appendChild(buildingsBought);
                buildingContent.appendChild(buildingsBoughtWrapper);
            this.html.appendChild(buildingContent);

        document.getElementById("buildingsWrapper").appendChild(this.html);
        // end setup HTML
    }

    buy() {
        if (this.clickercookie.cookies >= this.upgradeCost) {
            this.clickercookie.cookies -= this.upgradeCost;
            this.upgradeCost *= Building.UPGRADECOST_MULTIPLIER;
            this.upgradeCost = Math.floor(this.upgradeCost);
            this.bought++;
            this.CPSGiven += this.CPSGain;
            this.clickercookie.reloadCookieCounter();
            document.getElementById(`${this.name}Cost`).innerHTML = commaify(this.upgradeCost);
            document.getElementById(`${this.name}${this.plural}Bought`).innerText = commaify(this.bought);
            this.hovered();
            this.reloadDynamicElements();
        }
    }

    hovered() { // todo: this is very similar to Upgrade.hovered
        const tooltip = document.getElementById("tooltip");

        document.getElementById("tooltipDesc").style.display = "none";
        document.getElementById("tooltipProduces").style.display = "block";
        document.getElementById("tooltipProducing").style.display = "block";

        const buildingInfoName = capitalize(this.name);
        const buildingInfoPrice = commaify(this.upgradeCost);
        const buildingInfoQuote = this.quote;
        const buildingInfoProduces = commaify(this.CPSGain);
        const buildingInfoProducing = commaify(Math.round(this.CPSGiven * 10) / 10);

        // clamping allows between 0 and the height of the window minus the height of the box. also add one from the height of the box because it doesn't work correctly normally, idk why
        //! this uses game but shouldn't with the tooltip refactor
        tooltip.style.top = clamp(game.mousePos.y - tooltip.offsetHeight/2,0,window.innerHeight-(tooltip.offsetHeight + 1))+"px";
        tooltip.style.right = "346px";
        tooltip.style.left = "auto"; // when tooltip is a statistic it sets the left property because it won't work correctly with right, this resets that

        tooltip.style.borderRightWidth = "0px";

        document.getElementById("tooltipName").innerHTML = buildingInfoName;
        document.getElementById("tooltipPrice").innerHTML = `Price: ${buildingInfoPrice}`;
        document.getElementById("tooltipQuote").innerHTML = `\"${buildingInfoQuote}\"`;
        document.getElementById("tooltipProduces").innerHTML = `Produces: ${buildingInfoProduces} CPS`;
        document.getElementById("tooltipProducing").innerHTML = `Producing: ${buildingInfoProducing} CPS`;
    
        tooltip.style.display = "block";
    }

    setVisibility(bool: boolean) {
        this.html.style.display = bool ? "block" : "none";
    }

    /** Price and bought */
    reloadDynamicElements() {
        document.getElementById(`${this.name}Cost`).innerHTML = commaify(this.upgradeCost);
        document.getElementById(`${this.name}${this.plural}Bought`).innerText = commaify(this.bought);
    }

    destroy() {
        this.html.remove();
    }
}