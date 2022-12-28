const log = console.log.bind(console);


enum CssStyle {
    Background = "background",
    Color = "color",
    Width = "width",
    Height = "height",
    Left = "left",
    Top = "top",
    Right = "right",
    Bottom = "bottom"
}

const delay_creatingEnemy_2000ms = 2000;
const delay_clearTimer_1000ms = 1000;
const goUp = 80;
const goDown = 80;
const device_width = window.innerWidth;
const hero = document.querySelector(".wrapper_hero") as HTMLElement;
const shootingSound = document.getElementById("shootingSound") as HTMLAudioElement;
const DOMKilledCount = document.getElementById("h1") as HTMLElement;
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
const playSound = (sound: HTMLAudioElement) => sound.play();
let killedCount = initialCount;
const zero = 0;
const px = "px";
const example_enemy = document.querySelector(".example_enemy") as HTMLDivElement;
const keydown = "keydown";
const left: CssStyle = CssStyle.Left;
const bottom: CssStyle = CssStyle.Bottom;
const width: CssStyle = CssStyle.Width;
const right: CssStyle = CssStyle.Right;
const background:CssStyle = CssStyle.Background;
const GAME_OVER = document.getElementById('GAME_OVER') as HTMLElement;
const littleLife = 50;
const YOU_WIN = document.getElementById('YOU_WIN') as HTMLElement;
const killer = 10;

{
    window.addEventListener(keydown, changeHeroPosition);
    window.addEventListener(keydown, fire);

    const updateKilledCount = () => {
        killedCount += 1;
        DOMKilledCount.innerHTML = `${killedCount}`;


        if(killedCount == killer) {
            YOU_WIN.hidden = false;
            finishGame(YOU_WIN);
        }
    };

    window.addEventListener("enemy", () => {
        let enemy: string | HTMLDivElement = example_enemy.outerHTML;
        document.body.insertAdjacentHTML("afterbegin", enemy);

        enemy = document.querySelector(".example_enemy") as HTMLDivElement;

        enemy.hidden = false;

        enemy.getBoundingClientRect();

        const enemy_bullet = getElement(enemy, ".enemy_bullet") as HTMLElement;

        setStyle(enemy_bullet, left, maxRange, px);
        setStyle(enemy, left, maxRange, px);
        setStyle(enemy, bottom, Math.random() * maxTop, px);

        playSound(shootingSound)    

        passingBulletCoordinates(enemy_bullet, "hero", "enemy_bullet");
    });

    const userEventEnemy = new Event("enemy");
    let timerId = setTimeout(function generateUserEvent() {
        window.dispatchEvent(userEventEnemy);
        clearTimeout(timerId);

        return (timerId = setTimeout(
            generateUserEvent,
            delay_creatingEnemy_2000ms
        ));
    });

    function kill(left: number, top: number, dataPerson: string, dataBullet: string) {
        const gameObjects = (document
            .elementsFromPoint(left, top)as HTMLElement[])
            .filter(
                (DOMElement: HTMLElement) =>
                    DOMElement.dataset.person == dataPerson ||
                    DOMElement.dataset.person == dataBullet
            );

        if (gameObjects.length < numberOfRemoved) return;

        const [person, bullet]  = gameObjects;

        const DOMPersonLife = getElement(person, ".life") as HTMLElement;

        const person_life = getStyleAsNumber(DOMPersonLife, width);

        lossOflives = person.dataset.person == 'hero' ? lossOflivesHero : lossOflivesEnemy;

        const isKilled =
            person_life - lossOflives == zero ? true : false;

            setStyle(DOMPersonLife, width, person_life - lossOflives, px);      
            
            if(person_life - lossOflives <= littleLife) {
                setStyle(DOMPersonLife, background, "red");
            }
        
        const resultIsKilledHero = isKilledHero(person,isKilled)    

        if (resultIsKilledHero) {
            finishGame(GAME_OVER);
        }

        if (isKilled) {
            if(isKilled && !resultIsKilledHero) {
                updateKilledCount();
            }
            person.remove();
        }

        bullet.remove();
    }

    function finishGame(scenario: HTMLElement) {
        clearTimeout(timerId);
        scenario.hidden = false
        document.body.innerHTML = scenario.innerHTML;
        window.removeEventListener(keydown, fire)
        window.removeEventListener(keydown, changeHeroPosition)
    }

    function passingBulletCoordinates(bullet: HTMLElement, dataPerson: string, dataBullet: string) {
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

    function isKilledHero(hero: HTMLElement, isKilled: boolean) {
        return isKilled && hero.dataset.person == "hero";
    }

    function getStyleAsNumber(element: HTMLElement, prop: CssStyle) {
        return Number(window.getComputedStyle(element)[prop].match("[0-9]*"));
    }

    function setStyle(element: HTMLElement, prop: CssStyle, value: string | number, unit?: string) {
        if (!unit) {
            element.style[prop] = `${value}`;
            return;
        }

        element.style[prop] = value + unit;
        return;
    }

    function getElement(element: HTMLElement, selector: string) {
        return element.querySelector(selector);
    }

    function changeHeroPosition({ code }: {code: string}) {
        if (code !== ArrowDown && code !== ArrowUp) return;
        let heroPosition = getStyleAsNumber(hero, bottom);
        keyName = code == ArrowUp ? ArrowUp : ArrowDown;

        if (keyName == ArrowUp) {
            if (heroPosition >= maxTop) return;
            setStyle(hero, bottom, heroPosition + goUp, px);
        }

        if (keyName == ArrowDown) {
            if (heroPosition <= maxBottom) return;
            setStyle(hero, bottom, heroPosition - goDown, px);
        }
    }

    function fire({ code }: {code: string}) {
        keyName = code;
        if (keyName !== Enter) return;

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

    function createElement(type: string, attributes: Attributes) {
        let elem = document.createElement(type);
        let attibutesArray = Object.entries(attributes);

        for (let [key, value] of attibutesArray) {
            elem.setAttribute(key, value);
        }
        return elem;
    }
}


interface Attributes {
    'data-bullet'?: string
    'data-person'?: string
    src?: string;
    class?: string;
    id?: string
}