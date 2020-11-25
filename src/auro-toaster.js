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
 * @attr {Boolean} clear - Set attribute to dismiss all of the toasts within the toaster.
 */

class AuroToaster extends LitElement {
  constructor() {
    super();

    // default properties
    this.position = "bottom-left";
    this.clear = "false";
  }

  // function to define props used within the scope of this component
  static get properties() {
    return {
      ...super.properties,
      position: { type: String },
      clear: { type: Boolean },
    };
  }

  static get styles() {
    return css`
      ${styleCss}
    `;
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

  clearChildren() {
    if (this.clear) {
      this.childNodes.forEach((node) => {
        node.setAttribute("dismiss", "true");
      });
      this.clear = false;
      this.removeAttribute("clear");
    }
  }

  // function that renders the HTML and CSS into  the scope of the component
  render() {
    this.updatePosition();
    this.clearChildren();

    return html`
      <div id="toaster" class="toaster-${this.position}">
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
