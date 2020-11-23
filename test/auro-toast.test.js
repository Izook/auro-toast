import { fixture, html, expect } from "@open-wc/testing";
import sinon from "sinon";
import "../src/auro-toast.js";

describe("auro-toast", () => {
  it("auro-toast is accessible", async () => {
    const el = await fixture(html`
      <auro-toast cssclass="testClass"></auro-toast>
    `);

    await expect(el).to.be.accessible();
  });

  it("auro-toast custom element is defined", async () => {
    const el = await !!customElements.get("auro-toast");

    await expect(el).to.be.true;
  });
});
