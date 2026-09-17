import { describe, expect, it } from "vitest";
import { handoffHref } from "./app-handoff";

const APP = "https://cmssy.io";

describe("handoffHref", () => {
  it("carries the visitor id and the landing UTM to the app", () => {
    expect(
      handoffHref(
        "https://cmssy.io/signup",
        "https://www.cmssy.com/pl/pricing?utm_source=linkedin&utm_campaign=l1&fbclid=x",
        APP,
        "01J-anon",
      ),
    ).toBe(
      "https://cmssy.io/signup?utm_source=linkedin&utm_campaign=l1&ph_distinct_id=01J-anon",
    );
  });

  it("treats www and the bare host as the same app", () => {
    expect(
      handoffHref(
        "https://www.cmssy.io/login",
        "https://www.cmssy.com/",
        APP,
        "a",
      ),
    ).toBe("https://www.cmssy.io/login?ph_distinct_id=a");
    expect(
      handoffHref(
        "https://cmssy.io/login",
        "https://www.cmssy.com/",
        "https://www.cmssy.io",
        "a",
      ),
    ).toBe("https://cmssy.io/login?ph_distinct_id=a");
  });

  it("keeps a UTM the link already sets", () => {
    expect(
      handoffHref(
        "https://cmssy.io/signup?utm_campaign=pricing_cta",
        "https://www.cmssy.com/?utm_campaign=l1&utm_medium=social",
        APP,
        null,
      ),
    ).toBe(
      "https://cmssy.io/signup?utm_campaign=pricing_cta&utm_medium=social",
    );
  });

  it("passes only UTM when there is no consented visitor id", () => {
    expect(
      handoffHref(
        "https://cmssy.io/signup",
        "https://www.cmssy.com/?utm_source=x",
        APP,
        null,
      ),
    ).toBe("https://cmssy.io/signup?utm_source=x");
  });

  it("leaves every link that is not the app alone", () => {
    const page = "https://www.cmssy.com/?utm_source=x";
    for (const href of [
      "/pricing",
      "#cookie-settings",
      "https://github.com/cmssy-io",
      "https://evilcmssy.io/signup",
      "https://cmssy.io.evil.com/signup",
      "http://cmssy.io/signup",
      "mailto:contact@cmssy.com",
    ]) {
      expect(handoffHref(href, page, APP, "a"), href).toBeNull();
    }
  });

  it("treats another port on the same host as another app", () => {
    expect(
      handoffHref(
        "http://localhost:4000/signup",
        "http://localhost:3001/",
        "http://localhost:3000",
        "a",
      ),
    ).toBeNull();
    expect(
      handoffHref(
        "http://localhost:3000/signup",
        "http://localhost:3001/",
        "http://localhost:3000",
        "a",
      ),
    ).toBe("http://localhost:3000/signup?ph_distinct_id=a");
  });

  it("strips a visitor id the link already carries when there is no consent", () => {
    expect(
      handoffHref(
        "https://cmssy.io/signup?ph_distinct_id=stale&plan=pro",
        "https://www.cmssy.com/",
        APP,
        null,
      ),
    ).toBe("https://cmssy.io/signup?plan=pro");
  });

  it("refuses to act on an unparseable app URL", () => {
    expect(
      handoffHref(
        "https://cmssy.io/signup",
        "https://www.cmssy.com/",
        "not a url",
        "a",
      ),
    ).toBeNull();
  });
});
