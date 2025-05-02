import './app.element.css';
import 'game-amidakuji';

export class AppElement extends HTMLElement {
  public static observedAttributes = [];

  connectedCallback() {
    const title = 'demo-web';
    this.innerHTML = String.raw`
      <div>
        <h1>${title}</h1>
        <p>Welcome to ${title}!</p>
        <game-amidakuji></game-amidakuji>
      </div>
      `;
  }
}
customElements.define('app-root', AppElement);
