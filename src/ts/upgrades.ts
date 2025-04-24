import { Building } from "./buildings.js";
import { clamp, commaify } from "./helper.js";
import { hideTooltip } from "./tooltip.js";
import { game, Game } from "./main.js";
import ClickerCookie from "./clickercookie.js";
import { Handlers } from "./handlers.js";

export interface UpgradeSave {
    unlocked: boolean;
    bought: boolean;
}

export interface UpgradeData {
    /** 
     * This is used to save unlocked/bought properties for the upgrade, and should be unique and NEVER CHANGE. it can be whatever you want.
     * See {@link Game.UPGRADES_DATA} for the reserved ones.
     * 
     * todo: with Identifier is this a thing of the past?
     */
    uid: string;
    name: string;
    quote: string;
    price: number;
    img?: string;
    desc: string;
    building: Building;
    /** The number of buildings bought required to unlock the upgrade */
    buildingsRequired: number;
    /** This is mostly just here for the keyboard as a kinda workaround lol */
    multiplyCookiesPerClick?: boolean;
}

export function expandUpgradesHolder(retract: boolean=false) {
    const upgradesShown = document.getElementById("upgradesHolder").children.length;

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

export function updateUpgradesBoughtStatistic() {
    // this.destroyAll(true); // would create duplicates of the same upgrade without this
    // for (let i = 0; i < upgrades.bought.length; i++) {
    //     if (upgrades.bought[i] != 1) continue;

    //     upgrades.create(i,true);
    // }
}

export class Upgrade {
    private clickercookie: ClickerCookie;

    uid: string;
    name: string;
    quote: string;
    price: number;
    img: string;
    desc: string;
    building: Building;
    buildingsRequired: number;
    multiplyCookiesPerClick: boolean;

    bought: boolean;
    unlocked: boolean;

    html: HTMLDivElement;
    constructor(clickercookie: ClickerCookie, data: UpgradeData) {
        this.clickercookie = clickercookie
        
        this.uid = data.uid;
        this.name = data.name;
        this.quote = data.quote;
        this.price = data.price;
        this.img = data.img;
        this.desc = data.desc;
        this.building = data.building;
        this.buildingsRequired = data.buildingsRequired;
        this.multiplyCookiesPerClick = data.multiplyCookiesPerClick;

        this.bought = false;
        this.unlocked = false;

        /** is already getFile()-ed so don't use getFile() with this variable */
        const UPGRADE_ICON = (data.img === undefined || data.img === null) ? "img/unknown-32-32.png" : data.img;
        if (data.img === undefined || data.img === null) { //* this check is only for undefined/null, a check for if the image file is a 404 is below us
            console.warn(`An image file for the "${this.name}" upgrade was not defined. Falling back to the "unknown" image.`);
        }

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

        //* Use unknown-32-32 as a fallback if we can't get the defined image file (404 usually)
        // note: the CSS class already defines this as a fallback but even though it does that this will send a warn (which it wouldn't elsewise) so why not also do it this way :-)
        const img = new Image();    
        img.onload = () => {
            this.html.style.backgroundImage = `url(${UPGRADE_ICON})`;
        };
        img.onerror = () => {
            this.html.style.backgroundImage = `url(img/unknown-32-32.png)`;
            console.warn(`Unable to get the image file "${UPGRADE_ICON}" for the "${this.name}" upgrade (probably 404), falling back to "unknown" image.`);
        };
        img.src = UPGRADE_ICON; //* so the onload/onerror events are actually fired
    }

    /**
     * Appends `this.html` (the upgrade) to `element`.
     * @param element The element to append to. Should pretty much always be the upgrades holder.
     */
    create(element: HTMLElement=document.getElementById("upgradesHolder")) {
        element!.appendChild(this.html);
    }

    clicked() {
        if (this.clickercookie.cookies < this.price) return;

        this.clickercookie.cookies -= this.price;
        this.bought = true;
        this.hovered(); //? i don't remember why this is here but i know it's important just trust me
        this.destroy();
        
        this.building.CPSGiven *= 2;
        this.building.CPSGain *= 2;
        if (this.multiplyCookiesPerClick) this.clickercookie.cookiesPerClick *= 2;

        expandUpgradesHolder(); // sometimes the upgrade holder has one too many rows because of weird onmouseover & onmousemove behavior, this prevents that

        document.getElementById("upgradesBoughtCounter")!.innerText = Handlers.UPGRADE.upgradesBought.toString();

        updateUpgradesBoughtStatistic();
    }

    hovered() { // todo: this is very similar to Building.hovered
        const tooltip = document.getElementById("tooltip")!;

        document.getElementById("tooltipProduces")!.style.display = "none";
        document.getElementById("tooltipProducing")!.style.display = "none";
        document.getElementById("tooltipDesc")!.style.display = "block";

        document.getElementById("tooltipName")!.innerText = this.name;
        document.getElementById("tooltipPrice")!.innerText = `Price: ${commaify(this.price)}`;
        document.getElementById("tooltipDesc")!.innerHTML = this.desc;
        document.getElementById("tooltipQuote")!.innerHTML = `<i>\"${this.quote}\"</i>`;

        tooltip.style.display = "block";
        tooltip.style.right = "346px";
        // clamping allows between 0 and the height of the window minus the height of the box. also add one from the height of the box because it doesn't work correctly normally, idk why
        //! this uses game but shouldn't with the tooltip refactor
        tooltip.style.top = clamp(game.mousePos.y - tooltip.offsetHeight/2,0,window.innerHeight-(tooltip.offsetHeight + 1))+"px";
        tooltip.style.left = "auto"; // when tooltip is a statistic it sets the left property because it won't work correctly with right, this resets that
        tooltip.style.borderRightWidth = "0px";
    }

    destroy() {
        this.html.remove();
        hideTooltip(); // hide the tooltip so it doesn't stick around after you buy the upgrade
    }
}

// export class UpgradeStatistic extends Upgrade {

//     constructor(game: Game, data: UpgradeData) {
//         super(game, data);
//     }
// }