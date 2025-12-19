import { describe, it, expect, beforeAll } from "vitest";
import * as db from "../db";

describe("Contact Management", () => {
  let testContactId: number;

  beforeAll(async () => {
    // Wait for database to be ready
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });

  it("should create a new contact", async () => {
    const result = await db.createContact({
      type: "seminar_application",
      name: "テスト太郎",
      email: "test@example.com",
      phone: "090-1234-5678",
      companyName: "テスト株式会社",
      message: "モーニングセミナーに参加したいです。",
      status: "pending",
    });

    expect(result).toHaveProperty("id");
    expect(typeof result.id).toBe("number");
    testContactId = result.id;
  });

  it("should get all contacts", async () => {
    const contacts = await db.getAllContacts();
    expect(Array.isArray(contacts)).toBe(true);
    expect(contacts.length).toBeGreaterThan(0);
  });

  it("should get contact by id", async () => {
    const contact = await db.getContactById(testContactId);
    expect(contact).not.toBeNull();
    expect(contact?.name).toBe("テスト太郎");
    expect(contact?.email).toBe("test@example.com");
    expect(contact?.type).toBe("seminar_application");
    expect(contact?.status).toBe("pending");
  });

  it("should filter contacts by type", async () => {
    const contacts = await db.getFilteredContacts({
      type: "seminar_application",
    });
    expect(Array.isArray(contacts)).toBe(true);
    expect(contacts.every((c: any) => c.type === "seminar_application")).toBe(true);
  });

  it("should filter contacts by status", async () => {
    const contacts = await db.getFilteredContacts({
      status: "pending",
    });
    expect(Array.isArray(contacts)).toBe(true);
    expect(contacts.every((c: any) => c.status === "pending")).toBe(true);
  });

  it("should search contacts by name", async () => {
    const contacts = await db.getFilteredContacts({
      searchQuery: "テスト",
    });
    expect(Array.isArray(contacts)).toBe(true);
    expect(contacts.length).toBeGreaterThan(0);
  });

  it("should update contact status", async () => {
    const result = await db.updateContactStatus(testContactId, "in_progress");
    expect(result).toHaveProperty("id");
    expect(result.id).toBe(testContactId);

    const contact = await db.getContactById(testContactId);
    expect(contact?.status).toBe("in_progress");
  });

  it("should update contact reply", async () => {
    const result = await db.updateContactReply(
      testContactId,
      "お問い合わせありがとうございます。詳細をご連絡いたします。",
      1 // Assuming user ID 1 exists
    );
    expect(result).toHaveProperty("id");
    expect(result.id).toBe(testContactId);

    const contact = await db.getContactById(testContactId);
    expect(contact?.reply).toBe("お問い合わせありがとうございます。詳細をご連絡いたします。");
    expect(contact?.status).toBe("completed");
    expect(contact?.repliedAt).not.toBeNull();
    expect(contact?.repliedBy).toBe(1);
  });

  it("should delete contact", async () => {
    const result = await db.deleteContact(testContactId);
    expect(result).toHaveProperty("id");
    expect(result.id).toBe(testContactId);

    const contact = await db.getContactById(testContactId);
    expect(contact).toBeNull();
  });
});
