import { fixture, html, expect, aTimeout } from "@open-wc/testing";
import sinon from "sinon";
import "../src/auro-toast.js";

describe("auro-toast", () => {
  it("auro-toast is accessible", async () => {
    const el = await fixture(html` <auro-toast></auro-toast> `);

    await expect(el).to.be.accessible();
  });

  it("auro-toast custom element is defined", async () => {
    const el = await Boolean(customElements.get("auro-toast"));

    await expect(el).to.be.true;
  });

  describe("handles styling correctly", () => {
    describe("when type is ", () => {
      it("not specified", async () => {
        const el = await fixture(html`<auro-toast></auro-toast>`);
        const root = el.shadowRoot;
        const toast = root.querySelector("#toast");
        const toastIcon = root.querySelector(".timerIcon");

        await expect([...toast.classList]).to.contain("success");
        await expect(toastIcon.innerHTML).to.contain(
          "Checkmark display indicator"
        );
      });

      it("success", async () => {
        const el = await fixture(html`<auro-toast success></auro-toast>`);
        const root = el.shadowRoot;
        const toast = root.querySelector("#toast");
        const toastIcon = root.querySelector(".timerIcon");

        await expect([...toast.classList]).to.contain("success");
        await expect(toastIcon.innerHTML).to.contain(
          "Checkmark display indicator"
        );
      });

      it("info", async () => {
        const el = await fixture(html`<auro-toast info></auro-toast>`);
        const root = el.shadowRoot;
        const toast = root.querySelector("#toast");
        const toastIcon = root.querySelector(".timerIcon");

        await expect([...toast.classList]).to.contain("info");
        await expect(toastIcon.innerHTML).to.contain("Information");
      });

      it("warning", async () => {
        const el = await fixture(html`<auro-toast warning></auro-toast>`);
        const root = el.shadowRoot;
        const toast = root.querySelector("#toast");
        const toastIcon = root.querySelector(".timerIcon");

        await expect([...toast.classList]).to.contain("warning");
        await expect(toastIcon.innerHTML).to.contain("Warning");
      });

      it("error", async () => {
        const el = await fixture(html`<auro-toast error></auro-toast>`);
        const root = el.shadowRoot;
        const toast = root.querySelector("#toast");
        const toastIcon = root.querySelector(".timerIcon");

        await expect([...toast.classList]).to.contain("error");
        await expect(toastIcon.innerHTML).to.contain("Error");
      });
    });

    describe("when position is ", () => {
      it("not set", async () => {
        const el = await fixture(html`<auro-toast></auro-toast>`);
        const root = el.shadowRoot;
        const toast = root.querySelector("#toast");

        await expect([...toast.classList]).to.contain("toast-left");
      });

      it("invalid", async () => {
        const el = await fixture(
          html`<auro-toast position="absolute"></auro-toast>`
        );
        const root = el.shadowRoot;
        const toast = root.querySelector("#toast");

        await expect([...toast.classList]).to.contain("toast-left");
      });

      it("left", async () => {
        const el = await fixture(
          html`<auro-toast position="left"></auro-toast>`
        );
        const root = el.shadowRoot;
        const toast = root.querySelector("#toast");

        await expect([...toast.classList]).to.contain("toast-left");
      });

      it("right", async () => {
        const el = await fixture(
          html`<auro-toast position="right"></auro-toast>`
        );
        const root = el.shadowRoot;
        const toast = root.querySelector("#toast");

        await expect([...toast.classList]).to.contain("toast-right");
      });
    });
  });

  describe("handles dismissal", () => {
    it("from attribute", async () => {
      const el = await fixture(
        html`<div><auro-toast dismiss></auro-toast></div>`
      );
      const root = el.querySelector("auro-toast").shadowRoot;
      const toast = root.querySelector("#toast");

      await expect([...toast.classList]).to.contain("fadeout");
      await expect(el.children.length).to.be.equal(1);

      await aTimeout(300);

      await expect(el.children.length).to.be.equal(0);
    });

    it("from timeout", async () => {
      const el = await fixture(
        html`<div><auro-toast duration="1"></auro-toast></div>`
      );
      const root = el.querySelector("auro-toast").shadowRoot;
      const toast = root.querySelector("#toast");

      await aTimeout(1000);

      await expect([...toast.classList]).to.contain("fadeout");
      await expect(el.children.length).to.be.equal(1);

      await aTimeout(300);

      await expect(el.children.length).to.be.equal(0);
    });

    it("when persistent", async () => {
      const el = await fixture(
        html`<div><auro-toast duration="1" persistent></auro-toast></div>`
      );
      const root = el.querySelector("auro-toast").shadowRoot;
      const toast = root.querySelector("#toast");

      await aTimeout(1000);

      await expect([...toast.classList]).to.not.contain("fadeout");
      await expect(el.children.length).to.be.equal(1);

      await aTimeout(300);

      await expect(el.children.length).to.be.equal(1);
    });
  });
});
