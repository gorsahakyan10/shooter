"use strict";
const log = console.log.bind(console);
var CssStyle;
(function (CssStyle) {
    CssStyle["Background"] = "background";
    CssStyle["Color"] = "color";
    CssStyle["Width"] = "width";
    CssStyle["Height"] = "height";
    CssStyle["Left"] = "left";
    CssStyle["Top"] = "top";
    CssStyle["Right"] = "right";
    CssStyle["Bottom"] = "bottom";
})(CssStyle || (CssStyle = {}));
const delay_creatingEnemy_2000ms = 2000;
const delay_clearTimer_1000ms = 1000;
const goUp = 80;
const goDown = 80;
const device_width = window.innerWidth;
const hero = document.querySelector(".wrapper_hero");
const shootingSound = document.getElementById("shootingSound");
const DOMKilledCount = document.getElementById("h1");
const numberOfRemoved = 2;
const maxRange = window.innerWidth;
const maxTop = 160;
const maxBottom = 0;
let keyName = "";
const ArrowUp = "ArrowUp";
const ArrowDown = "ArrowDown";
const Enter = "Enter";
let lossOflives = 50;
const lossOflivesEnemy = 50;
let lossOflivesHero = 20;
const initialCount = 0;
const playSound = (sound) => sound.play();
let killedCount = initialCount;
const zero = 0;
const px = "px";
const example_enemy = document.querySelector(".example_enemy");
const keydown = "keydown";
const left = CssStyle.Left;
const bottom = CssStyle.Bottom;
const width = CssStyle.Width;
const right = CssStyle.Right;
const background = CssStyle.Background;
const GAME_OVER = document.getElementById('GAME_OVER');
const littleLife = 50;
const YOU_WIN = document.getElementById('YOU_WIN');
const killer = 10;
{
    window.addEventListener(keydown, changeHeroPosition);
    window.addEventListener(keydown, fire);
    const updateKilledCount = () => {
        killedCount += 1;
        DOMKilledCount.innerHTML = `${killedCount}`;
        if (killedCount == killer) {
            YOU_WIN.hidden = false;
            finishGame(YOU_WIN);
        }
    };
    window.addEventListener("enemy", () => {
        let enemy = example_enemy.outerHTML;
        document.body.insertAdjacentHTML("afterbegin", enemy);
        enemy = document.querySelector(".example_enemy");
        enemy.hidden = false;
        enemy.getBoundingClientRect();
        const enemy_bullet = getElement(enemy, ".enemy_bullet");
        setStyle(enemy_bullet, left, maxRange, px);
        setStyle(enemy, left, maxRange, px);
        setStyle(enemy, bottom, Math.random() * maxTop, px);
        playSound(shootingSound);
        passingBulletCoordinates(enemy_bullet, "hero", "enemy_bullet");
    });
    const userEventEnemy = new Event("enemy");
    let timerId = setTimeout(function generateUserEvent() {
        window.dispatchEvent(userEventEnemy);
        clearTimeout(timerId);
        return (timerId = setTimeout(generateUserEvent, delay_creatingEnemy_2000ms));
    });
    function kill(left, top, dataPerson, dataBullet) {
        const gameObjects = document
            .elementsFromPoint(left, top)
            .filter((DOMElement) => DOMElement.dataset.person == dataPerson ||
            DOMElement.dataset.person == dataBullet);
        if (gameObjects.length < numberOfRemoved)
            return;
        const [person, bullet] = gameObjects;
        const DOMPersonLife = getElement(person, ".life");
        const person_life = getStyleAsNumber(DOMPersonLife, width);
        lossOflives = person.dataset.person == 'hero' ? lossOflivesHero : lossOflivesEnemy;
        const isKilled = person_life - lossOflives == zero ? true : false;
        setStyle(DOMPersonLife, width, person_life - lossOflives, px);
        if (person_life - lossOflives <= littleLife) {
            setStyle(DOMPersonLife, background, "red");
        }
        const resultIsKilledHero = isKilledHero(person, isKilled);
        if (resultIsKilledHero) {
            finishGame(GAME_OVER);
        }
        if (isKilled) {
            if (isKilled && !resultIsKilledHero) {
                updateKilledCount();
            }
            person.remove();
        }
        bullet.remove();
    }
    function finishGame(scenario) {
        clearTimeout(timerId);
        scenario.hidden = false;
        document.body.innerHTML = scenario.innerHTML;
        window.removeEventListener(keydown, fire);
        window.removeEventListener(keydown, changeHeroPosition);
    }
    function passingBulletCoordinates(bullet, dataPerson, dataBullet) {
        const timerInterval = setInterval(() => {
            const { left, top } = bullet.getBoundingClientRect();
            kill(left, top, dataPerson, dataBullet);
        });
        const timerId = setTimeout(() => {
            bullet.remove();
            clearInterval(timerInterval);
            clearTimeout(timerId);
        }, delay_clearTimer_1000ms);
    }
    function isKilledHero(hero, isKilled) {
        return isKilled && hero.dataset.person == "hero";
    }
    function getStyleAsNumber(element, prop) {
        return Number(window.getComputedStyle(element)[prop].match("[0-9]*"));
    }
    function setStyle(element, prop, value, unit) {
        if (!unit) {
            element.style[prop] = `${value}`;
            return;
        }
        element.style[prop] = value + unit;
        return;
    }
    function getElement(element, selector) {
        return element.querySelector(selector);
    }
    function changeHeroPosition({ code }) {
        if (code !== ArrowDown && code !== ArrowUp)
            return;
        let heroPosition = getStyleAsNumber(hero, bottom);
        keyName = code == ArrowUp ? ArrowUp : ArrowDown;
        if (keyName == ArrowUp) {
            if (heroPosition >= maxTop)
                return;
            setStyle(hero, bottom, heroPosition + goUp, px);
        }
        if (keyName == ArrowDown) {
            if (heroPosition <= maxBottom)
                return;
            setStyle(hero, bottom, heroPosition - goDown, px);
        }
    }
    function fire({ code }) {
        keyName = code;
        if (keyName !== Enter)
            return;
        const bullet = createElement("img", {
            src: "./img/bullet.webp",
            id: "bullet",
            "data-person": "hero_bullet",
        });
        hero.appendChild(bullet);
        bullet.getBoundingClientRect();
        setStyle(bullet, right, maxRange, px);
        playSound(shootingSound);
        passingBulletCoordinates(bullet, "enemy", "hero_bullet");
    }
    function createElement(type, attributes) {
        let elem = document.createElement(type);
        let attibutesArray = Object.entries(attributes);
        for (let [key, value] of attibutesArray) {
            elem.setAttribute(key, value);
        }
        return elem;
    }
}
