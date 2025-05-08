import ClickerCookie from "./clickercookie.js";
import { capitalize, commaify, clamp } from "./helper.js";
import { Game } from "./main.js";
import { SaveProvider } from "./saving.js";
import { hideTooltip } from "./tooltip.js";

export interface BuildingData {
    /** Display name for your building. Should be capitialized.*/
    name: string;
    /** *Plural* display name for your building. Should be capitialized.*/
    namePlural: string;
    quote: string;
    /** Base upgrade cost for the building. */
    upgradeCost: number;
    CPSGain: number;
    img?: string;
    /** Default is 1.15 */
    upgradeCostMultiplier?: number;
}

export interface BuildingSave {
    bought: number;
    CPSGain: number;
    CPSGiven: number;
}

export class Building extends SaveProvider {
    private _clickercookie: ClickerCookie;

    name: string;
    namePlural: string;
    quote: string;
    readonly baseUpgradeCost: number;
    /** Upgrade cost is obtained programmatically using the base cost, multiplier, and number bought. */
    public get upgradeCost() {
        let cost = this.baseUpgradeCost;
        for (let i = 0; i < this.bought; i++) {
            cost = Math.floor(cost * this.upgradeCostMultiplier);
        }
        return cost;
    }
    CPSGiven: number;
    CPSGain: number;
    readonly upgradeCostMultiplier: number;

    private _bought: number;
    /** Number of buildings bought */
    public get bought() { return this._bought }
    public set bought(num: number) {
        this._bought = num;
        document.getElementById(`${this.namePlural}Bought`).innerText = commaify(this._bought);

        document.getElementById(`${this.name}Cost`).innerText = commaify(this.upgradeCost); //? does this make sense here?
    }
    unlocked: boolean;

    html: HTMLDivElement;
    constructor(clickercookie: ClickerCookie, data: BuildingData) {
        super();

        this._clickercookie = clickercookie;

        // setup HTML (uses indentation to show structure)
        this.html = document.createElement("div");
        this.html.className = "building";
        this.html.addEventListener("click", () => {this.buy()});
        this.html.addEventListener("mousemove", () => {this.hovered()});
        this.html.addEventListener("mouseover", () => {this.hovered()});
        this.html.addEventListener("mouseout",() => {hideTooltip()});
            const icon = document.createElement("img");
            icon.className = "building-icon";
            const BUILDING_ICON_IMG = (data.img) ? data.img : "img/unknown.png";
            //* Use unknown as a fallback if we can't get the defined image file (404 usually)   
            icon.onerror = () => {
                icon.src = "img/unknown.png";
                console.warn(`Unable to get the image file "${BUILDING_ICON_IMG}" for the "${this.name}" building (probably 404), falling back to "unknown" image.`);
            };
            icon.src = BUILDING_ICON_IMG;
            icon.alt = `${data.name} icon`;
            this.html.appendChild(icon);

            const buildingContent = document.createElement("div");
            buildingContent.className = "building-content";
                const namePriceDiv = document.createElement("div");
                    const buildingName = document.createElement("p");
                    buildingName.className = "building-name";
                    buildingName.innerText = data.name;
                    namePriceDiv.appendChild(buildingName);

                    const buildingPrice = document.createElement("p");
                    buildingPrice.className = "building-price";
                    buildingPrice.id = `${data.name}Cost`;
                    buildingPrice.innerText = data.upgradeCost.toString();
                    namePriceDiv.appendChild(buildingPrice);
                buildingContent.appendChild(namePriceDiv);

                const buildingsBoughtWrapper = document.createElement("div");
                buildingsBoughtWrapper.className = "buildings-bought-wrapper";
                    const buildingsBought = document.createElement("p");
                    buildingsBought.className = "buildings-bought";
                    buildingsBought.id = `${data.namePlural}Bought`;
                    buildingsBought.innerText = "0";
                    buildingsBoughtWrapper.appendChild(buildingsBought);
                buildingContent.appendChild(buildingsBoughtWrapper);
            this.html.appendChild(buildingContent);
        document.getElementById("buildingsWrapper").appendChild(this.html);
        // end setup HTML
        
        // must setup HTML before assigning these, see setters
        this.name = data.name;
        this.namePlural = data.namePlural;
        this.quote = data.quote;
        this.baseUpgradeCost = data.upgradeCost;
        this.CPSGiven = 0;
        this.CPSGain = data.CPSGain;
        if (data.upgradeCostMultiplier)
            this.upgradeCostMultiplier = data.upgradeCostMultiplier;
        else
            this.upgradeCostMultiplier = 1.15;

        //* if upgradeCost is too low, Math.floor'ing it after multiplying it by upgradeCostMultiplier can actually just get you the same upgradeCost as before. warn in console if this will happen, but don't throw an error in case it's intended or smth stupid
        if (Math.floor(this.baseUpgradeCost * this.upgradeCostMultiplier) === this.baseUpgradeCost) {
            console.warn(`${this.name} base upgrade cost is too low to increase after buy. Increase BuildingData.upgradeCost or BuildingData.upgradeCostMultiplier.`)
        }

        this.bought = 0;
        this.unlocked = false;
    }

    buy() {
        if (this._clickercookie.cookies >= this.upgradeCost) {
            this._clickercookie.cookies -= this.upgradeCost;
            this.bought++;
            this.CPSGiven += this.CPSGain;
            this.hovered();
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
        tooltip.style.top = clamp(Game.getMousePosition().y - tooltip.offsetHeight/2,0,window.innerHeight-(tooltip.offsetHeight + 1))+"px";
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

    destroy() {
        this.html.remove();
    }

    getSaveData(): BuildingSave {
        return {
            bought: this.bought,
            CPSGain: this.CPSGain,
            CPSGiven: this.CPSGiven
        }
    }

    loadSaveData(saveData: BuildingSave) {
        this.bought = saveData.bought;
        this.CPSGain = saveData.CPSGain;
        this.CPSGiven = saveData.CPSGiven
    }
}