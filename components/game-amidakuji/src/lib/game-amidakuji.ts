import './game-amidakuji.css';

export class GameAmidakuji extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = String.raw`
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100%;
        }
      </style>
      <div>
        <h1>Game Amidakuji</h1>
        <p>This is a simple game of Amidakuji.</p>
        <div class="game-container">
        </div>
      </div>
    `;
  }
}
customElements.define('game-amidakuji', GameAmidakuji);
