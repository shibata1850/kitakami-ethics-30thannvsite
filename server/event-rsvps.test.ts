import { describe, it, expect, beforeAll } from "vitest";
import * as db from "./db";

describe("Event RSVPs", () => {
  let testRsvpId: number;

  beforeAll(async () => {
    // Ensure database is available
    const database = await db.getDb();
    expect(database).toBeTruthy();
  });

  it("should create a new event RSVP", async () => {
    const rsvpData = {
      attendance: "attend" as const,
      affiliation: "北上市倫理法人会",
      position: "会長",
      lastName: "テスト",
      firstName: "太郎",
      email: "test@example.com",
      message: "楽しみにしております。",
    };

    const result = await db.createEventRsvp(rsvpData);
    expect(result).toBeTruthy();
    
    // Store the ID for later tests
    if (result && typeof result === 'object' && 'insertId' in result) {
      testRsvpId = result.insertId as number;
    }
  });

  it("should get all event RSVPs", async () => {
    const rsvps = await db.getFilteredEventRsvps({});
    expect(Array.isArray(rsvps)).toBe(true);
    expect(rsvps.length).toBeGreaterThan(0);
  });

  it("should filter event RSVPs by attendance", async () => {
    const attendRsvps = await db.getFilteredEventRsvps({ attendance: "attend" });
    expect(Array.isArray(attendRsvps)).toBe(true);
    
    if (attendRsvps.length > 0) {
      attendRsvps.forEach((rsvp: any) => {
        expect(rsvp.attendance).toBe("attend");
      });
    }
  });

  it("should filter event RSVPs by affiliation", async () => {
    const rsvps = await db.getFilteredEventRsvps({ affiliation: "北上市倫理法人会" });
    expect(Array.isArray(rsvps)).toBe(true);
    
    if (rsvps.length > 0) {
      rsvps.forEach((rsvp: any) => {
        expect(rsvp.affiliation).toBe("北上市倫理法人会");
      });
    }
  });

  it("should search event RSVPs by name", async () => {
    const rsvps = await db.getFilteredEventRsvps({ search: "テスト" });
    expect(Array.isArray(rsvps)).toBe(true);
  });

  it("should get event RSVP statistics", async () => {
    const stats = await db.getEventRsvpStats();
    expect(stats).toBeTruthy();
    expect(typeof stats.total).toBe("number");
    expect(typeof stats.attendCount).toBe("number");
    expect(typeof stats.declineCount).toBe("number");
    expect(stats.affiliationCounts).toBeTruthy();
    expect(typeof stats.affiliationCounts).toBe("object");
  });

  it("should get unique affiliations", async () => {
    const affiliations = await db.getEventRsvpAffiliations();
    expect(Array.isArray(affiliations)).toBe(true);
    
    if (affiliations.length > 0) {
      expect(affiliations).toContain("北上市倫理法人会");
    }
  });

  it("should delete an event RSVP", async () => {
    if (testRsvpId) {
      const result = await db.deleteEventRsvp(testRsvpId);
      expect(result).toBeTruthy();
      expect(result.success).toBe(true);
    }
  });
});
