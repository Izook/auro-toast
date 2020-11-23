// Copyright (c) 2020 Alaska Airlines. All right reserved. Licensed under the Apache-2.0 license
// See LICENSE in the project root for license information.

// ---------------------------------------------------------------------

// If use litElement base class
import { LitElement, html, css } from "lit-element";

// Import touch detection lib
import "focus-visible/dist/focus-visible.min.js";
import styleCss from "./style-css.js";

// Import Auro Icons
import xIcon from "@alaskaairux/icons/dist/icons/interface/x-lg_es6";
import checkmarkIcon from "@alaskaairux/icons/dist/icons/interface/checkmark-lg_es6";
import infoIcon from "@alaskaairux/icons/dist/icons/alert/information-stroke_es6";
import warningIcon from "@alaskaairux/icons/dist/icons/alert/warning-stroke_es6";
import errorIcon from "@alaskaairux/icons/dist/icons/alert/error_es6";

// Timing constants
const DELAY = 100,
  DISMISS_DURATION = 300,
  MS = 1000;

/**
 * auro-toast provides users a way to create temporary, unobtrusive, notifications.
 *
 * @attr {Boolean} info - Styles toast as informational.
 * @attr {Boolean} warning - Styles toast as warning.
 * @attr {Boolean} error - Styles toast as error.
 * @attr {String} position - Sets corner position of toast. ["top-left", "top-right", "bottom-left", "bottom-right"]
 * @attr {Number} duration - Lifetime of the toast (in seconds).
 * @attr {Boolean} dismiss - Set attribute to dismiss the toast.
 * @attr {Boolean} persistent - Set true if you do not want the toast to automatically dismiss itself.
 */
class AuroToast extends LitElement {
  constructor() {
    super();
    this.getIconSVGs();

    this.timeOuts = [];
    this.type = "success";
    this.svg = this.checkmarkIconSVG;

    this.setDefaultProperties();
  }

  setDefaultProperties() {
    // default properties
    this.info = false;
    this.warning = false;
    this.error = false;
    this.duration = 5;
    this.position = "bottom-left";
    this.dismiss = false;
    this.persistent = false;
  }

  // function to define props used within the scope of this component
  static get properties() {
    return {
      ...super.properties,
      info: { type: Boolean },
      warning: { type: Boolean },
      error: { type: Boolean },
      position: { type: String },
      duration: { type: Number },
      dismiss: { type: Boolean },
      persistent: { type: Boolean },
    };
  }

  static get styles() {
    return css`
      ${styleCss}
    `;
  }

  updated() {
    this.updateType();
    this.updatePosition();
  }

  firstUpdated() {
    // place in setInterval after short delay so transition picks up after styles load
    setTimeout(() => {
      this.shadowRoot.getElementById("toast").style.transform = `translateX(0%)`;
    }, DELAY);
    if (!this.persistent) {
      setTimeout(() => {
        this.shadowRoot.getElementById("timerRemaining").style.transition = `height ${this.duration}s linear`;
        this.shadowRoot.getElementById("timerRemaining").style.height = `0%`;
        this.shadowRoot.getElementById("toast").style.transform = `translateX(0%)`;
      }, DELAY);
      this.timeOuts.push(setTimeout(() => {
          this.dismissToast();
        }, this.duration * MS));
    }
  }

  getIconSVGs() {
    this.domParser = new DOMParser();

    this.xIconSVG = this.domParser.parseFromString(
      xIcon.svg,
      "text/html"
    ).body.firstChild;
    this.checkmarkIconSVG = this.domParser.parseFromString(
      checkmarkIcon.svg,
      "text/html"
    ).body.firstChild;
    this.infoIconSVG = this.domParser.parseFromString(
      infoIcon.svg,
      "text/html"
    ).body.firstChild;
    this.warningIconSVG = this.domParser.parseFromString(
      warningIcon.svg,
      "text/html"
    ).body.firstChild;
    this.errorIconSVG = this.domParser.parseFromString(
      errorIcon.svg,
      "text/html"
    ).body.firstChild;
  }

  dismissToast() {
    this.shadowRoot.getElementById("toast").classList.add("fadeout");
    setTimeout(() => {
      this.timeOuts.forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
      this.parentElement.removeChild(this);
    }, DISMISS_DURATION);
  }

  updateType() {
    this.type = "success";
    this.type = this.info ? "info" : this.type;
    this.type = this.warning ? "warning" : this.type;
    this.type = this.error ? "error" : this.type;

    switch (this.type) {
      case "success":
        this.svg = this.checkmarkIconSVG;
        break;
      case "info":
        this.svg = this.infoIconSVG;
        break;
      case "warning":
        this.svg = this.warningIconSVG;
        break;
      case "error":
        this.svg = this.errorIconSVG;
        break;
      default:
        this.svg = this.infoIconSVG;
        break;
    }
  }

  updatePosition() {
    const positions = [
"top-left",
"top-right",
"bottom-left",
"bottom-right"
];

    if (!positions.includes(this.position)) {
      this.position = "bottom-left";
    }
  }

  // function that renders the HTML and CSS into  the scope of the component
  render() {
    this.updateType();
    this.updatePosition();
    if (this.dismiss) {
      this.dismissToast();
    }

    return html`
      <div id="toast" class="${this.type} toast-${this.position}">
        <div class="timer">
          <div id="timerRemaining"></div>
          <div class="timerIcon">${this.svg}</div>
        </div>
        <div class="toastMessage">
          <slot></slot>
        </div>
        <button
          class="toastDismiss"
          @click="${this.dismissToast}"
          aria-label="Dismiss toast notification."
        >
          ${this.xIconSVG}
        </button>
      </div>
    `;
  }
}

/* istanbul ignore else */
// define the name of the custom component(s)
if (!customElements.get("auro-toast")) {
  customElements.define("auro-toast", AuroToast);
}
