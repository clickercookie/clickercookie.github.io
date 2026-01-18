import { Building } from "./buildings.js";
import { clamp, commaify, countVisibleChildren, url } from "./helper.js";
import { hideTooltip } from "./tooltip.js";
import { Game } from "./main.js";
import { Handlers } from "./handlers.js";
import { SaveProvider } from "./saving.js";

export interface UpgradeSave {
    unlocked: boolean;
    bought: boolean;
}

export interface UpgradeData {
    name: string;
    quote: string;
    price: number;
    img?: string;
    desc: string;
    building: Building;
    /**
     * Return a boolean for whether the upgrade may be unlocked, i.e `if building.bought >= 5 return true, else return false`
     * 
     * Will be run automatically in game loop and unlock status will be set accordingly.
     * @param game Game
     */
    condition(game: Game): boolean;
    /**
     * Function to run when the upgrade is bought. By default, if this is not declared, then multiply the {@link Building.CPSGain} of our {@link building} by 2.
     * @param game Game
     */
    bought?(game: Game): void;
}

export function expandUpgradesHolder(retract: boolean=false) {
    const upgradesShown = countVisibleChildren(document.getElementById("upgradesHolder"));

    const rowsOfUpgrades = Math.ceil(upgradesShown / 5);

    const holder = document.getElementById("upgradesHolder");
    const holderHeight = 67.6; // this is the height of the upgrade holder set in style.css, i would figure out how to get the height directly from the element but the height is constantly changing when it's hovered so it's more trouble then it's worth
    if (retract) {
        holder.style.height = holderHeight+"px";
        return;
    }
    const size = (rowsOfUpgrades === 0) ? holderHeight : holderHeight * rowsOfUpgrades;
    holder.style.height = `${size}px`;
}

export class Upgrade implements SaveProvider<UpgradeSave> {
    name: string;
    quote: string;
    price: number;
    img: string;
    desc: string;
    building: Building;
    onBuy: (game: Game) => void;
    condition: (game: Game) => boolean;

    bought: boolean;
    unlocked: boolean;

    html: HTMLDivElement;
    statisticHTML: HTMLDivElement;
    constructor(data: UpgradeData) {
        this.name = data.name;
        this.quote = data.quote;
        this.price = data.price;
        this.img = data.img;
        this.desc = data.desc;
        this.building = data.building;
        this.onBuy = data.bought;
        this.condition = data.condition;

        this.bought = false;
        this.unlocked = false;

        /** is already getFile()-ed so don't use getFile() with this variable */
        const UPGRADE_ICON = (data.img === undefined || data.img === null) ? "img/unknown-32-32.png" : data.img;
        if (data.img === undefined || data.img === null) { //* this check is only for undefined/null, a check for if the image file is a 404 is below us
            console.warn(`An image file for the "${this.name}" upgrade was not defined. Falling back to the "unknown" image.`);
        }

        /* Setup main HTML */
        this.html = document.createElement("div"); //* this will be appended to the upgradesHolder in this.create()
        this.html.setAttribute("class","upgrade");
        // upgrade.setAttribute("id",`notathingrn${this.name}`);
        this.html.addEventListener("click", () => {
            this.clicked();
        });
        this.html.addEventListener("mouseover", () => { // for some reason, the element needs onmousemove AND onmouseover so it doesn't flicker, see #24
            this.hovered();
        });
        this.html.addEventListener("mousemove", () => { // for some reason, the element needs onmousemove AND onmouseover so it doesn't flicker, see #24
            this.hovered();
        });
        this.html.addEventListener("mouseout", () => {
            hideTooltip();
        });

        /* Setup statistic HTML */
        this.statisticHTML = document.createElement("div");
        this.statisticHTML.className = "upgrade-stats pointer";
        this.statisticHTML.addEventListener("mouseover", () => { this.hovered(true) });
        this.statisticHTML.addEventListener("mousemove", () => { this.hovered(true) });
        this.statisticHTML.addEventListener("mouseout", () => { hideTooltip() });

        //* Use unknown-32-32 as a fallback if we can't get the defined image file (404 usually)
        // note: the CSS class already defines this as a fallback but even though it does that this will send a warn (which it wouldn't elsewise) so why not also do it this way :-)
        const img = new Image();    
        img.onload = () => {
            this.html.style.backgroundImage = url(UPGRADE_ICON);
            this.statisticHTML.style.backgroundImage = url(UPGRADE_ICON);
        };
        img.onerror = () => {
            this.html.style.backgroundImage = url("img/unknown-32-32.png");
            this.statisticHTML.style.backgroundImage = url("img/unknown-32-32.png");
            console.warn(`Unable to get the image file "${UPGRADE_ICON}" for the "${this.name}" upgrade (probably 404), falling back to "unknown" image.`);
        };
        img.src = UPGRADE_ICON; //* so the onload/onerror events are actually fired

        // create it
        document.getElementById("upgradesHolder").appendChild(this.html);
        document.getElementById("upgradesBoughtStatsHolder").appendChild(this.statisticHTML);
    }

    clicked() {
        const clickercookie = Game.getInstance().clickercookie;

        if (clickercookie.cookies < this.price) return;

        clickercookie.cookies -= this.price;
        this.bought = true;
        this.hovered(); //? i don't remember why this is here but i know it's important just trust me
        this.setVisibility(false);
        
        if (this.onBuy) {
            this.onBuy(Game.getInstance());
        } else {
            this.building.CPSGiven *= 2;
            this.building.CPSGain *= 2;
        }

        expandUpgradesHolder(); // sometimes the upgrade holder has one too many rows because of weird onmouseover & onmousemove behavior, this prevents that

        document.getElementById("upgradesBoughtCounter")!.innerText = Handlers.UPGRADE.upgradesBought.toString();

        Handlers.UPGRADE.updateStatisticUpgrades(); // we don't run createStatistic() here and instead run this so that the order shown in the upgrades menu is correct
    }

    hovered(statistic: boolean=false) { // todo: this is very similar to Building.hovered
        const tooltip = document.getElementById("tooltip")!;

        document.getElementById("tooltipProduces")!.style.display = "none";
        document.getElementById("tooltipProducing")!.style.display = "none";
        document.getElementById("tooltipDesc")!.style.display = "block";

        document.getElementById("tooltipName")!.innerText = this.name;
        document.getElementById("tooltipPrice")!.innerText = `Price: ${commaify(this.price)}`;
        document.getElementById("tooltipDesc")!.innerHTML = this.desc;
        document.getElementById("tooltipQuote")!.innerHTML = `<i>"${this.quote}"</i>`;

        tooltip.style.display = "block";
        const mousePos = Game.getMousePosition();
        if (statistic) { // todo: make the tooltip clamp here
            tooltip.style.left = `${mousePos.x}px`;
            tooltip.style.top = `${mousePos.y - tooltip.offsetHeight}px`;  // it's minus offsetHeight because we don't want the cursor touching the tooltip
            tooltip.style.borderRightWidth = "3px";
        } else {
            tooltip.style.right = "346px";
            // clamping allows between 0 and the height of the window minus the height of the box. also add one from the height of the box because it doesn't work correctly normally, idk why
            tooltip.style.top = clamp(mousePos.y - tooltip.offsetHeight/2,0,window.innerHeight-(tooltip.offsetHeight + 1))+"px";
            tooltip.style.left = "auto"; // when tooltip is a statistic it sets the left property because it won't work correctly with right, this resets that
            tooltip.style.borderRightWidth = "0px";
        }
    }

    setVisibility(bool: boolean) {
        this.html.style.display = bool ? "inline-block" : "none";
    }
    setStatisticVisibility(bool: boolean) {
        this.statisticHTML.style.display = bool ? "block" : "none";
    }

    getSaveData(): UpgradeSave {
        return {
            unlocked: this.unlocked,
            bought: this.bought
        };
    }

    loadSaveData(saveData: UpgradeSave): void {
        this.unlocked = saveData.unlocked;
        this.bought = saveData.bought;
    }
}