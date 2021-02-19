// Copyright (c) 2020 Alaska Airlines. All right reserved. Licensed under the Apache-2.0 license
// See LICENSE in the project root for license information.

// ---------------------------------------------------------------------

// If use litElement base class
import { LitElement, html, css } from "lit-element";

// Import touch detection lib
import "focus-visible/dist/focus-visible.min.js";
import styleCss from "./style-css.js";

/**
 * auro-toast provides users with an optional container to position and display auro-toasts.
 *
 * @attr {String} position - Sets corner position of toaster. ["top-left", "top-right", "bottom-left", "bottom-right"]
 */

class AuroToaster extends LitElement {
  constructor() {
    super();

    // default properties
    this.position = "bottom-left";
  }

  // function to define props used within the scope of this component
  static get properties() {
    return {
      ...super.properties,
      position: { type: String },
    };
  }

  static get styles() {
    return css`
      ${styleCss}
    `;
  }

  /**
   * @private function to update the position of the toast based on attributes
   * @returns {void}
   */
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

  /**
   * @public function to dismiss all of the toast children
   * @returns {void}
   */
  clearChildren() {
    this.childNodes.forEach((node) => {
      node.setAttribute("dismiss", "true");
    });
  }

  /**
   * @public function to add a generic toast notification to the toaster
   * @param {HTMLElement} toastContent - The message to attach to the toast
   * @param {string} type - the type of toast notification to add (optional)
   * @param {object} attributes - attributes that you want to override in the toast, e.g. duration or persistent. (optional)
   * @returns {void}
   */
  addToast(toastContent, type = "success", attributes = {}) {
    const auroToast = document.createElement("auro-toast"),
      toastPosition = this.position.includes("left") ? "left" : "right";

    auroToast.setAttribute(type, "true");
    auroToast.setAttribute("position", toastPosition);

    Object.keys(attributes).forEach((key) => {
      auroToast.setAttribute(key, attributes[key]);
    });

    auroToast.appendChild(toastContent);
    this.insertBefore(auroToast, this.firstChild);
  }

  // function that renders the HTML and CSS into  the scope of the component
  render() {
    this.updatePosition();

    return html`
      <div
        id="toaster"
        class="toaster-${this.position}"
        role="region"
        aria-live="polite"
      >
        <slot></slot>
      </div>
    `;
  }
}

/* istanbul ignore else */
// define the name of the custom component(s)
if (!customElements.get("auro-toaster")) {
  customElements.define("auro-toaster", AuroToaster);
}
