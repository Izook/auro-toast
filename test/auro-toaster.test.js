import { fixture, html, expect, aTimeout } from "@open-wc/testing";
import sinon from "sinon";
import "../src/auro-toaster.js";
import "../src/auro-toast.js";

describe("auro-toaster", () => {
  it("auro-toaster is accessible", async () => {
    const el = await fixture(html` <auro-toaster></auro-toaster> `);

    await expect(el).to.be.accessible();
  });

  it("auro-toaster custom element is defined", async () => {
    const el = await Boolean(customElements.get("auro-toaster"));

    await expect(el).to.be.true;
  });

  describe("handles positioning correctly", () => {
    it("when position is not set", async () => {
      const el = await fixture(html` <auro-toaster></auro-toaster> `);
      const root = el.shadowRoot;
      const toast = root.querySelector("#toaster");

      await expect([...toast.classList]).to.contain("toaster-bottom-left");
    });

    it("when position is set", async () => {
      const el = await fixture(
        html` <auro-toaster position="top-right"></auro-toaster> `
      );
      const root = el.shadowRoot;
      const toast = root.querySelector("#toaster");

      await expect([...toast.classList]).to.contain("toaster-top-right");
    });

    it("when position is invalid", async () => {
      const el = await fixture(
        html` <auro-toaster position="middle"></auro-toaster> `
      );
      const root = el.shadowRoot;
      const toast = root.querySelector("#toaster");

      await expect([...toast.classList]).to.contain("toaster-bottom-left");
    });
  });

  describe("can add new toasts", () => {
    it("with default settings", async () => {
      const el = await fixture(
        html`<auro-toaster position="top-right"></auro-toaster>`
      );

      await expect(el.children.length).to.be.equal(0);
      const toastMessage = document.createTextNode(
        "This is a brand new toast message!"
      );
      el.addToast(toastMessage);

      const toast = el.querySelector("auro-toast");

      await expect(el.children.length).to.be.equal(1);
      await expect(toast.getAttribute("position")).to.be.equal("right");
    });

    it("with custom type", async () => {
      const el = await fixture(html`<auro-toaster></auro-toaster>`);

      await expect(el.children.length).to.be.equal(0);

      const toastMessage = document.createTextNode(
        "This is a dangerous and erroneously new toast message!"
      );
      el.addToast(toastMessage, "error");

      const toast = el.querySelector("auro-toast");

      await expect(el.children.length).to.be.equal(1);
      await expect(toast.getAttribute("error")).to.be.equal("true");
    });

    it("with overriden toast attributes", async () => {
      const el = await fixture(html`<auro-toaster></auro-toaster>`);

      await expect(el.children.length).to.be.equal(0);

      const toastMessage = document.createTextNode(
        "This new toast message is a maverick!"
      );
      el.addToast(toastMessage, "info", {
        persistent: true,
      });

      const toast = el.querySelector("auro-toast");

      await expect(el.children.length).to.be.equal(1);
      await expect(toast.getAttribute("persistent")).to.be.equal("true");
    });
  });
});
