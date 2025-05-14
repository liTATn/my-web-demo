import styles from './game-amidakuji.css?raw';
import {
  generateRandomNumber,
  randomOrder,
  generateRandomNumbers,
} from 'utilities';

export class GameAmidakuji extends HTMLElement {
  question: number[] = [];
  answer: number[] = [0,0,0,0];
  guessAnswer: number[] = [1,2,3,4];

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(styles);
    shadow.adoptedStyleSheets = [sheet];
  }

  connectedCallback() {
    this.render();
    this.shadowRoot
      ?.querySelectorAll('.guess-number-button')
      .forEach((button) => {
        button.addEventListener('click', (event) => {
          this.onClickGuessNumber(event);
        });
      });
    let numbers = [1, 2, 3, 4];
    this.answer = Array.from(numbers);
    numbers = randomOrder(numbers);
    this.question = Array.from(numbers);
    const originNumberContainer =
      this.shadowRoot?.getElementById('origin-number');
    if (originNumberContainer) {
      numbers.forEach((number) => {
        const numberElement = document.createElement('div');
        numberElement.classList.add('origin-number-item');
        numberElement.textContent = String(number);
        originNumberContainer.appendChild(numberElement);
      });
    } else {
      console.error('origin-number container not found');
    }
    const column1lines = generateRandomNumber(1, 4);
    const column2lines = generateRandomNumber(1, 4);
    const column3lines = generateRandomNumber(1, 4);
    const column1Number = generateRandomNumbers(
      column1lines,
      1,
      5,
      true
    ).sort();
    const column2Number = generateRandomNumbers(
      column2lines,
      1,
      5,
      true
    ).sort();
    const column3Number = generateRandomNumbers(
      column3lines,
      1,
      5,
      true
    ).sort();
    column1Number.forEach((number, index) => {
      if (number !== 0) {
        if (column2Number.includes(number)) {
          const keep = generateRandomNumber(0, 1);
          if (keep === 0) {
            column1Number[index] = 0;
          } else {
            const i = column2Number.findIndex((x) => x == number);
            column2Number[i] = 0;
          }
        }
      }
    });
    column2Number.forEach((number, index) => {
      if (number !== 0) {
        if (column3Number.includes(number)) {
          const keep = generateRandomNumber(0, 1);
          if (keep === 0) {
            column2Number[index] = 0;
          } else {
            const i = column3Number.findIndex((x) => x == number);
            column3Number[i] = 0;
          }
        }
      }
    });
    for (let i = 0; i < 5; i++) {
      if (column1Number.includes(i + 1)) {
        const line1 = document.createElement('div');
        line1.classList.add('game-board-line-item');
        this.shadowRoot?.getElementById('line-1')?.appendChild(line1);
        continue;
      }else{
        const newElement = document.createElement('div');
        newElement.classList.add('game-board-line-item-base');
        this.shadowRoot?.getElementById('line-1')?.appendChild(newElement);
      }
    }
    for (let i = 0; i < 5; i++) {
      if (column2Number.includes(i + 1)) {
        const line2 = document.createElement('div');
        line2.classList.add('game-board-line-item');
        this.shadowRoot?.getElementById('line-2')?.appendChild(line2);
        continue;
      }else{
        const newElement = document.createElement('div');
        newElement.classList.add('game-board-line-item-base');
        this.shadowRoot?.getElementById('line-2')?.appendChild(newElement);
      }
    }
    for (let i = 0; i < 5; i++) {
      if (column3Number.includes(i + 1)) {
        const line3 = document.createElement('div');
        line3.classList.add('game-board-line-item');
        this.shadowRoot?.getElementById('line-3')?.appendChild(line3);
        continue;
      }else{
        const newElement = document.createElement('div');
        newElement.classList.add('game-board-line-item-base');
        this.shadowRoot?.getElementById('line-3')?.appendChild(newElement);
      }
    }

    for(let i = 0; i < 4; i++) {
      let p = i;
      for(let j = 0; j < 5; j++) {
        if(p === 0){
          if(column1Number.includes(j + 1)){
            p += 1;
            continue;
          }
        }
        if(p === 1){
          if(column1Number.includes(j + 1)){
            p -= 1;
            continue;
          }
          if(column2Number.includes(j + 1)){
            p += 1;
            continue;
          }
        }
        if(p === 2){
          if(column2Number.includes(j + 1)){
            p -= 1;
            continue;
          }
          if(column3Number.includes(j + 1)){
            p += 1;
            continue;
          }
        }
        if(p === 3){
          if(column3Number.includes(j + 1)){
            p -= 1;
            continue;
          }
        }
      }
      this.answer[p] = this.question[i];
    }
    const leftTime = this.shadowRoot?.getElementById('left-time');
    if (leftTime) {
      let time = 30;
      leftTime.textContent = String(time);
      const timer = setInterval(() => {
        time--;
        leftTime.textContent = String(time);
        if (time <= 0) {
          clearInterval(timer);
          this.shadowRoot
            ?.querySelector('dialog')
            ?.showModal();
          const yesButton = this.shadowRoot?.getElementById('yes');
          const noButton = this.shadowRoot?.getElementById('no');
          yesButton?.addEventListener('click', () => {
            this.shadowRoot?.querySelector('dialog')?.close();
            window.location.reload();
          });
          noButton?.addEventListener('click', () => {
            this.shadowRoot?.querySelector('dialog')?.close();
          });
        }
      }, 1000);
    }
    
      
  }

  onClickGuessNumber(event: Event) {
    const target = event.target as HTMLButtonElement;
    const guessNumber = target.textContent;
    const guessId = Number(target.id);
    if (Number(guessNumber) === 4) {
      target.textContent = '1';
    } else {
      target.textContent = String(Number(guessNumber) + 1);
    }
    this.guessAnswer[guessId] = Number(target.textContent);
    if (this.checkAnswer()) {
      this.shadowRoot
        ?.querySelector('dialog')
        ?.showModal();
      const yesButton = this.shadowRoot?.getElementById('yes');
      const noButton = this.shadowRoot?.getElementById('no');
      yesButton?.addEventListener('click', () => {
        this.shadowRoot?.querySelector('dialog')?.close();
        window.location.reload();
      });
      noButton?.addEventListener('click', () => {
        this.shadowRoot?.querySelector('dialog')?.close();
      });
      
    }
  }

  checkAnswer() {
    let i = 0;
    while (i < 4) {
      if (this.guessAnswer[i] === this.answer[i]) {
        i++;
      } else {
        return false;
      }
    }
    return true;
  }

  render() {
    this.shadowRoot.innerHTML = String.raw`
      <style>
        ${styles}
      </style>
      <div>
        <div part="game" class="game">
          <div part="header" class="game-header">
            <h1>Game Amidakuji</h1>
            <p>This is a simple game of Amidakuji.</p>           
          </div>
          <div id="game-container" part="body" class="game-container">
            <div id="origin-number" class="origin-number">
            </div>
            <div class="game-board">
              <div id="line-1" class="game-board-line"></div>
              <div id="line-2" class="game-board-line"></div>
              <div id="line-3" class="game-board-line"></div>
              <div class="game-board-line"></div>
            </div>
            <div class="guess-number">
              <div class="guess-number-item">
                <button type="button" id="0" class="guess-number-button">1</button>
              </div>
              <div class="guess-number-item">
                <button type="button" id="1" class="guess-number-button">2</button>
              </div>
              <div class="guess-number-item">
                <button type="button" id="2" class="guess-number-button">3</button>
              </div>
              <div class="guess-number-item">
                <button type="button" id="3" class="guess-number-button">4</button>
              </div>
            </div>
          </div>
          <div part="footer" class="game-footer">
            <p>left <span id="left-time"></span>s</p>
          </div>
        </div>
      </div>
      <dialog close>
        <form method="dialog">
          <p>Do you want to play again?</p>
          <menu>
            <button id="yes">Yes</button>
            <button id="no">No</button>
          </menu>
        </form>
      </dialog>
    `;
  }
}
customElements.define('game-amidakuji', GameAmidakuji);
