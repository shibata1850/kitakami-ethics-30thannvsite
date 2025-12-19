import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createMember, getAllMembers, deleteMember } from "../server/db";

describe("CSV Import/Export Functionality", () => {
  let testMemberIds: number[] = [];

  beforeAll(async () => {
    // Create test members
    const testMembers = [
      {
        name: "テスト太郎",
        companyName: "株式会社テスト",
        title: "テストタイトル1",
        message: "テストメッセージ1",
        photoUrl: "https://example.com/photo1.jpg",
        category: "製造・ものづくり",
        committee: "会員拡大委員会",
        sortOrder: 1,
      },
      {
        name: "テスト花子",
        companyName: "テスト商事株式会社",
        title: "テストタイトル2",
        message: "テストメッセージ2",
        photoUrl: "https://example.com/photo2.jpg",
        category: "専門サービス（士業,保険,デザイン,議員等）",
        committee: "広報委員会",
        sortOrder: 2,
      },
    ];

    for (const member of testMembers) {
      await createMember(member);
    }

    const allMembers = await getAllMembers();
    testMemberIds = allMembers
      .filter(m => m.name.startsWith("テスト"))
      .map(m => m.id);
  });

  it("should export members to CSV format", async () => {
    const members = await getAllMembers();
    
    // CSV header
    const header = "氏名,会社名,タイトル,メッセージ,写真URL,カテゴリー,所属委員会,表示順序";
    
    // CSV rows
    const rows = members.map(member => {
      const escapeCsv = (str: string | null | undefined) => {
        if (!str) return "";
        if (str.includes(",") || str.includes("\n") || str.includes('"')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };
      
      return [
        escapeCsv(member.name),
        escapeCsv(member.companyName),
        escapeCsv(member.title),
        escapeCsv(member.message),
        escapeCsv(member.photoUrl || ""),
        escapeCsv(member.category),
        escapeCsv(member.committee || ""),
        member.sortOrder.toString(),
      ].join(",");
    });
    
    const csv = [header, ...rows].join("\n");
    
    expect(csv).toContain(header);
    expect(csv).toContain("テスト太郎");
    expect(csv).toContain("株式会社テスト");
    expect(csv.split("\n").length).toBeGreaterThan(1);
  });

  it("should parse CSV line correctly", () => {
    const parseCsvLine = (line: string): string[] => {
      const result: string[] = [];
      let current = "";
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];
        
        if (char === '"' && inQuotes && nextChar === '"') {
          current += '"';
          i++;
        } else if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          result.push(current);
          current = "";
        } else {
          current += char;
        }
      }
      result.push(current);
      return result;
    };

    // Test simple CSV line
    const simpleLine = "太郎,株式会社テスト,タイトル,メッセージ,url,カテゴリー,委員会,1";
    const simpleResult = parseCsvLine(simpleLine);
    expect(simpleResult).toHaveLength(8);
    expect(simpleResult[0]).toBe("太郎");
    expect(simpleResult[1]).toBe("株式会社テスト");

    // Test CSV line with quotes
    const quotedLine = '"太郎","株式会社テスト","タイトル","メッセージ, 改行あり","url","カテゴリー","委員会","1"';
    const quotedResult = parseCsvLine(quotedLine);
    expect(quotedResult).toHaveLength(8);
    expect(quotedResult[3]).toBe("メッセージ, 改行あり");

    // Test CSV line with escaped quotes
    const escapedLine = '"太郎","株式会社""テスト""","タイトル","メッセージ","url","カテゴリー","委員会","1"';
    const escapedResult = parseCsvLine(escapedLine);
    expect(escapedResult[1]).toBe('株式会社"テスト"');
  });

  it("should handle CSV with comma in field", () => {
    const escapeCsv = (str: string) => {
      if (str.includes(",") || str.includes("\n") || str.includes('"')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const textWithComma = "メッセージ, カンマあり";
    const escaped = escapeCsv(textWithComma);
    expect(escaped).toBe('"メッセージ, カンマあり"');
  });

  it("should handle CSV with newline in field", () => {
    const escapeCsv = (str: string) => {
      if (str.includes(",") || str.includes("\n") || str.includes('"')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const textWithNewline = "メッセージ\n改行あり";
    const escaped = escapeCsv(textWithNewline);
    expect(escaped).toBe('"メッセージ\n改行あり"');
  });

  it("should handle CSV with quotes in field", () => {
    const escapeCsv = (str: string) => {
      if (str.includes(",") || str.includes("\n") || str.includes('"')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const textWithQuote = '会社名"テスト"';
    const escaped = escapeCsv(textWithQuote);
    expect(escaped).toBe('"会社名""テスト"""');
  });

  // Cleanup
  afterAll(async () => {
    for (const id of testMemberIds) {
      await deleteMember(id);
    }
  });
});
