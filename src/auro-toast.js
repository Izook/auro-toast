// Copyright (c) 2020 Alaska Airlines. All right reserved. Licensed under the Apache-2.0 license
// See LICENSE in the project root for license information.

// ---------------------------------------------------------------------

// If use litElement base class
import { LitElement, html, css } from "lit-element";

// Import touch detection lib
import "focus-visible/dist/focus-visible.min.js";
import styleCss from "./style-css.js";

// Import Icons
import dismiss from "@alaskaairux/icons/dist/icons/interface/x-lg_es6";
import success from "@alaskaairux/icons/dist/icons/interface/checkmark-lg_es6";
import information from "@alaskaairux/icons/dist/icons/alert/information-stroke_es6";
import warning from "@alaskaairux/icons/dist/icons/alert/warning-stroke_es6";
import error from "@alaskaairux/icons/dist/icons/alert/error_es6";

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
 * @attr {Number} duration - Lifetime of the toast (in seconds).
 * @attr {Boolean} dismiss - Set attribute to dismiss the toast.
 * @attr {Boolean} persistent - Set true if you do not want the toast to automatically dismiss itself.
 */
class AuroToast extends LitElement {
  constructor() {
    super();

    /**
     * @private internal variable
     */
    this.timeOuts = [];

    /**
     * @private internal variable
     */
    this.type = "success";

    /**
     * @private internal variable
     */
    this.svg = this.generateIconHtml(success.svg);

    /**
     * @private internal variable
     */
    this.dismissIcon = this.generateIconHtml(dismiss.svg);

    /**
     * @private internal variable
     */
    this.dismissed = false;

    this.setDefaultProperties();
  }


  /**
   * @private function to set default properties within the constructor
   * @returns {void}
   */
  setDefaultProperties() {
    // default properties
    this.info = false;
    this.warning = false;
    this.error = false;
    this.duration = 5;
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


  /**
   * @private Internal function to generate the HTML for the icon to use
   * @param {string} svgContent - The imported svg icon
   * @returns {TemplateResult} - The html template for the icon
   */
  generateIconHtml(svgContent) {
    const dom = new DOMParser().parseFromString(svgContent, "text/html"),
      svg = dom.body.firstChild;

    return svg;
  }


  // This function applies styles after the components loads to animate the component and
  // it starts its dismissal timer.
  firstUpdated() {
    setTimeout(() => {
      this.shadowRoot.querySelector(".toast").style.transform = `translateX(0%)`;
    }, DELAY);
    if (!this.persistent) {
      setTimeout(() => {
        this.shadowRoot.querySelector(".timeRemaining").style.transition = `height ${this.duration}s linear`;
        this.shadowRoot.querySelector(".timeRemaining").style.height = `0%`;
        this.shadowRoot.querySelector(".toast").style.transform = `translateX(0%)`;
      }, DELAY);
      this.timeOuts.push(setTimeout(() => {
          this.dismissToast();
        }, this.duration * MS));
    }
  }


  /**
   * @private function to dismiss toast by animating dissapearance and removing component from DOM
   * @returns {void}
   */
  dismissToast() {
    /* istanbul ignore else */
    if (!this.dismissed) {
      this.dismissed = true;
      this.shadowRoot.querySelector(".toast").classList.add("isCleared");
      setTimeout(() => {
        this.timeOuts.forEach((timeoutId) => {
          clearTimeout(timeoutId);
        });
        this.parentNode.removeChild(this);
      }, DISMISS_DURATION);
    }
  }


  /**
   * @private function to update the type of the toast based on attributes
   * @returns {void}
   */
  updateType() {
    this.type = this.info ? "info" : this.type;
    this.type = this.warning ? "warning" : this.type;
    this.type = this.error ? "error" : this.type;

    switch (this.type) {
      case "success":
        this.svg = this.generateIconHtml(success.svg);
        break;
      case "info":
        this.svg = this.generateIconHtml(information.svg);
        break;
      case "warning":
        this.svg = this.generateIconHtml(warning.svg);
        break;
      case "error":
        this.svg = this.generateIconHtml(error.svg);
        break;
      /* istanbul ignore next */
      default:
        this.svg = this.generateIconHtml(information.svg);
        break;
    }
  }

  // function that renders the HTML and CSS into  the scope of the component
  render() {
    this.updateType();

    return html`
      <div id="toast" class="toast toast--${this.type}" role="log">
        <div class="timer">
          <div class="timeRemaining"></div>
          <div class="icon">${this.svg}</div>
        </div>
        <div class="message">
          <slot></slot>
        </div>
        <button
          class="dismissButton"
          @click="${this.dismissToast}"
          aria-label="Dismiss toast notification."
        >
          ${this.dismissIcon}
        </button>
      </div>
    `;
  }

  // function that is called when the elements DOM has been updated and rendered
  updated() {
    if (this.dismiss) {
      this.dismissToast();
    }
  }
}

/* istanbul ignore else */
// define the name of the custom component(s)
if (!customElements.get("auro-toast")) {
  customElements.define("auro-toast", AuroToast);
}
