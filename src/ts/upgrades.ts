import { Building } from "./buildings.js";
import { clamp, commaify, convertCollectionToArray } from "./helper.js";
import { hideTooltip } from "./tooltip.js";
import { Game } from "./main.js";

const personalization = {
    currentClicked: "cookie"
}

// the description of almost every upgrade is the same, but just in case we want to add more upgrades in the future
// a "desc" field has been added to the upgrades array. Most upgrade will just reference a string in this array
// that correlates to the upgrade it's associated with, though.
const defaultUpgradeDescriptions = [
    `Multiplys Keyboard and clicking ${personalization.currentClicked.toLowerCase()} production by 2`,
    "Multiplys Grandpa production by 2"
    // so on, so forth
];

class UpgradeData {
    name: string;
    quote: string;
    price: number;
    img: string;
    desc: string;
    building?: Building;
}

export const UPGRADES_DATA: UpgradeData[] = [
    { // the "id" would be 0 because that's the index in the array
        name: "Reinforced Keys",
        quote: "press harder",
        price: 100,
        img: "reinforced-keys.png",
        desc: defaultUpgradeDescriptions[0],
        // building: keyboard // not sure exactly how buffing the building will work, maybe passing the instance into this will work?
    }
];

export function expandUpgradesHolder(retract: boolean=false) {
    const rowsOfUpgrades = Math.ceil(Upgrade.currentlyShown / 5);

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

/**
 * TODO: NEEDS STATISTIC SUPPORT
 * @param game Game
 * @param statistic Are we destroying all the upgrades in the Statistics page?
 */
export function destroyAllUpgrades(game: Game, statistic: boolean=false) {
    for (let i in game.upgrades) {
        game.upgrades[i].destroy();
    }
    
    if (!statistic)
        Upgrade.currentlyShown = 0;
}

export function showUnlockedUpgrades(game: Game) {
    for (let i in game.upgrades) {
        if (game.upgrades[i].unlocked === true && game.upgrades[i].bought !== true) 
            new Upgrade(game, UPGRADES_DATA[i]);
    }
}

// const keyboard = new Building(new Game(), "es1", "12312312", 123, 123

export class Upgrade {
    public static currentlyShown: number = 0;
    public static upgradesBought: number = 0;

    private game: Game;

    name: string;
    quote: string;
    price: number;
    img: string;
    desc: string;
    building: Building;

    bought: boolean;
    unlocked: boolean;

    html: HTMLDivElement;
    constructor(game: Game, data: UpgradeData) {
        this.game = game;

        this.name = data.name;
        this.quote = data.quote;
        this.price = data.price;
        this.img = data.img;
        this.desc = data.desc;
        this.building = data.building;

        const icon = data.img; //? does this need to exist?
        /** is already getFile()-ed so don't use getFile() with this variable */
        const UPGRADE_ICON_PATH = (icon === undefined || icon === null) ? "img/unknown-32-32.png" : `img/upgrades/${icon}`;
        if (icon === undefined || icon === null) { // todo 0.7: add check if a 404 is returned for the upgrade icon, might require async/await shenanigans but whatevs
            console.warn(`An image file for the "${this.name}" upgrade was not defined. Falling back to the "unknown" image.`);
        }

        this.html = document.createElement("div");
        this.html.setAttribute("class","upgrade");
        // upgrade.setAttribute("id",`notathingrn${this.name}`);
        this.html.addEventListener("onclick", () => {
            this.clicked();
        });
        this.html.addEventListener("onmouseover", () => { // for some reason, the element needs onmousemove AND onmouseover so it doesn't flicker, see #24
            this.hovered();
        });
        this.html.addEventListener("onmousemove", () => { // for some reason, the element needs onmousemove AND onmouseover so it doesn't flicker, see #24
            this.hovered();
        });
        this.html.addEventListener("onmouseout", () => {
            hideTooltip();
        });
        this.html.style.backgroundImage = `url(${UPGRADE_ICON_PATH})`;
        
        document.getElementById("upgradesHolder")!.appendChild(this.html);
        
        Upgrade.currentlyShown++;
    }

    clicked() {
        if (this.game.cookies < this.price) return;

        this.game.cookies -= this.price;
        this.bought = true;
        this.hovered(); //? i don't remember why this is here but i know it's important just trust me
        this.destroy();
        Upgrade.upgradesBought++;
        Upgrade.currentlyShown--;
        
        //! i do not know if this works and doesn't work with keyboard benefit
        this.building.CPSGiven *= 2;
        this.building.CPSGain *= 2;
        // core.cookiesPerClick *= 2;

        expandUpgradesHolder(); // sometimes the upgrade holder has one too many rows because of weird onmouseover & onmousemove behavior, this prevents that

        document.getElementById("upgradesBoughtCounter")!.innerHTML = Upgrade.upgradesBought.toString();

        updateUpgradesBoughtStatistic();
    }

    hovered() {
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
        tooltip.style.top = clamp(this.game.mousePos.y - tooltip.offsetHeight/2,0,window.innerHeight-(tooltip.offsetHeight + 1))+"px";
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