import { beforeEach, describe, expect, it, vi } from "vitest";

const submitForm = vi.hoisted(() => vi.fn());

vi.mock("@/services/forms", () => ({ submitForm }));

import { submitContact } from "./actions";

function formData(entries: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(entries)) data.append(key, value);
  return data;
}

beforeEach(() => {
  submitForm.mockReset().mockResolvedValue({ success: true, message: null });
});

describe("submitContact", () => {
  it("sends only the form's own fields, not the hidden inputs React adds for a bound server action", async () => {
    await submitContact(
      "form-1",
      { status: "idle", message: null },
      formData({
        "$ACTION_REF_1": "",
        "$ACTION_1:0": '{"id":"abc","bound":"$@1"}',
        "$ACTION_1:1": '["form-1"]',
        "$ACTION_KEY": "k123",
        name: "Ada",
        email: "ada@example.test",
        message: "Hello",
      }),
    );

    expect(submitForm).toHaveBeenCalledWith("form-1", {
      name: "Ada",
      email: "ada@example.test",
      message: "Hello",
    });
  });

  it("drops a filled honeypot without submitting", async () => {
    const state = await submitContact(
      "form-1",
      { status: "idle", message: null },
      formData({ website: "spam.example", message: "Buy" }),
    );

    expect(state.status).toBe("success");
    expect(submitForm).not.toHaveBeenCalled();
  });
});
