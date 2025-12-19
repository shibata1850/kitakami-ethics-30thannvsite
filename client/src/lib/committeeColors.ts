// 委員会ごとのカラーマッピング
export const COMMITTEE_COLORS: Record<string, string> = {
  "会員拡大委員会": "bg-blue-500 text-white",
  "活力朝礼委員会": "bg-green-500 text-white",
  "広報委員会": "bg-purple-500 text-white",
  "研修委員会": "bg-orange-500 text-white",
  "地域貢献委員会": "bg-pink-500 text-white",
};

export function getCommitteeColor(committee: string | null | undefined): string {
  if (!committee) return "bg-gray-500 text-white";
  return COMMITTEE_COLORS[committee] || "bg-gray-500 text-white";
}
