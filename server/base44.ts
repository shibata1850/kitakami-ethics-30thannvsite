/**
 * Base44 API Client
 *
 * Base44をデータソースとして使用するためのAPIクライアント
 */

const BASE44_APP_ID = '6943944870829f16b01dab30';
const BASE44_API_KEY = process.env.BASE44_API_KEY || '8834846fdeeb4fa2aad4038a3117ccbc';
const BASE44_BASE_URL = `https://app.base44.com/api/apps/${BASE44_APP_ID}/entities`;

// Base44 エンティティ共通フィールド
interface Base44Entity {
  id: string;
  created_date: string;
  updated_date: string;
  created_by: string;
}

// Member エンティティ
export interface Base44Member extends Base44Entity {
  name: string;
  companyName: string;
  title: string;
  message: string;
  photoUrl?: string;
  category: string;
  committee?: string;
  websiteUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
  instagramUrl?: string;
  lineUrl?: string;
  services?: string;
  achievements?: string;
  sortOrder?: number;
}

// Officer エンティティ
export interface Base44Officer extends Base44Entity {
  name: string;
  companyName: string;
  position: string;
  committee?: string;
  message?: string;
  photoUrl?: string;
  sortOrder?: number;
}

// Inquiry エンティティ
export interface Base44Inquiry extends Base44Entity {
  type: 'contact' | 'seminar_application';
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  message: string;
  status?: 'pending' | 'in_progress' | 'completed';
  reply?: string;
  repliedAt?: string;
  repliedBy?: string;
}

/**
 * Base44 API共通リクエスト関数
 */
async function base44Request<T>(
  entityName: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  id?: string,
  body?: object
): Promise<T> {
  const url = id
    ? `${BASE44_BASE_URL}/${entityName}/${id}`
    : `${BASE44_BASE_URL}/${entityName}`;

  const options: RequestInit = {
    method,
    headers: {
      'api_key': BASE44_API_KEY,
      'Content-Type': 'application/json',
    },
  };

  if (body && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Base44 API error (${response.status}): ${errorText}`);
  }

  return response.json();
}

// ============================================
// Member API
// ============================================

export const memberApi = {
  /**
   * 全メンバー取得
   */
  async list(): Promise<Base44Member[]> {
    const data = await base44Request<Base44Member[]>('Member');
    // sortOrderでソート
    return data.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  },

  /**
   * メンバー詳細取得
   */
  async getById(id: string): Promise<Base44Member | null> {
    try {
      return await base44Request<Base44Member>('Member', 'GET', id);
    } catch (error) {
      console.error(`[Base44] Failed to get member ${id}:`, error);
      return null;
    }
  },

  /**
   * メンバー作成
   */
  async create(data: Omit<Base44Member, keyof Base44Entity>): Promise<Base44Member> {
    return base44Request<Base44Member>('Member', 'POST', undefined, data);
  },

  /**
   * メンバー更新
   */
  async update(id: string, data: Partial<Omit<Base44Member, keyof Base44Entity>>): Promise<Base44Member> {
    return base44Request<Base44Member>('Member', 'PUT', id, data);
  },

  /**
   * メンバー削除
   */
  async delete(id: string): Promise<void> {
    await base44Request<void>('Member', 'DELETE', id);
  },

  /**
   * フィルタリング付きメンバー取得
   */
  async getFiltered(options: {
    categories?: string[];
    committees?: string[];
    searchQuery?: string;
  }): Promise<Base44Member[]> {
    let members = await this.list();

    // カテゴリーフィルター
    if (options.categories && options.categories.length > 0) {
      members = members.filter(m => options.categories!.includes(m.category));
    }

    // 委員会フィルター
    if (options.committees && options.committees.length > 0) {
      members = members.filter(m => m.committee && options.committees!.includes(m.committee));
    }

    // 検索クエリ
    if (options.searchQuery && options.searchQuery.trim()) {
      const query = options.searchQuery.toLowerCase();
      members = members.filter(m =>
        m.name.toLowerCase().includes(query) ||
        m.companyName.toLowerCase().includes(query)
      );
    }

    return members;
  },

  /**
   * 関連メンバー取得（同じカテゴリー）
   */
  async getRelated(id: string, limit: number = 4): Promise<Base44Member[]> {
    const member = await this.getById(id);
    if (!member) return [];

    const allMembers = await this.list();
    return allMembers
      .filter(m => m.id !== id && m.category === member.category)
      .slice(0, limit);
  },
};

// ============================================
// Officer API
// ============================================

export const officerApi = {
  /**
   * 全役員取得
   */
  async list(): Promise<Base44Officer[]> {
    const data = await base44Request<Base44Officer[]>('Officer');
    return data.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  },

  /**
   * 役員詳細取得
   */
  async getById(id: string): Promise<Base44Officer | null> {
    try {
      return await base44Request<Base44Officer>('Officer', 'GET', id);
    } catch (error) {
      console.error(`[Base44] Failed to get officer ${id}:`, error);
      return null;
    }
  },

  /**
   * 役員作成
   */
  async create(data: Omit<Base44Officer, keyof Base44Entity>): Promise<Base44Officer> {
    return base44Request<Base44Officer>('Officer', 'POST', undefined, data);
  },

  /**
   * 役員更新
   */
  async update(id: string, data: Partial<Omit<Base44Officer, keyof Base44Entity>>): Promise<Base44Officer> {
    return base44Request<Base44Officer>('Officer', 'PUT', id, data);
  },

  /**
   * 役員削除
   */
  async delete(id: string): Promise<void> {
    await base44Request<void>('Officer', 'DELETE', id);
  },
};

// ============================================
// Inquiry API
// ============================================

export const inquiryApi = {
  /**
   * 全問い合わせ取得
   */
  async list(): Promise<Base44Inquiry[]> {
    const data = await base44Request<Base44Inquiry[]>('Inquiry');
    // 作成日時の降順でソート
    return data.sort((a, b) =>
      new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
    );
  },

  /**
   * 問い合わせ詳細取得
   */
  async getById(id: string): Promise<Base44Inquiry | null> {
    try {
      return await base44Request<Base44Inquiry>('Inquiry', 'GET', id);
    } catch (error) {
      console.error(`[Base44] Failed to get inquiry ${id}:`, error);
      return null;
    }
  },

  /**
   * 問い合わせ作成
   */
  async create(data: {
    type: 'contact' | 'seminar_application';
    name: string;
    email: string;
    phone?: string;
    companyName?: string;
    message: string;
  }): Promise<Base44Inquiry> {
    return base44Request<Base44Inquiry>('Inquiry', 'POST', undefined, {
      ...data,
      status: 'pending',
    });
  },

  /**
   * 問い合わせ更新（ステータス変更、返信など）
   */
  async update(id: string, data: Partial<Omit<Base44Inquiry, keyof Base44Entity>>): Promise<Base44Inquiry> {
    return base44Request<Base44Inquiry>('Inquiry', 'PUT', id, data);
  },

  /**
   * 問い合わせ削除
   */
  async delete(id: string): Promise<void> {
    await base44Request<void>('Inquiry', 'DELETE', id);
  },

  /**
   * フィルタリング付き問い合わせ取得
   */
  async getFiltered(options: {
    type?: 'contact' | 'seminar_application';
    status?: 'pending' | 'in_progress' | 'completed';
    searchQuery?: string;
  }): Promise<Base44Inquiry[]> {
    let inquiries = await this.list();

    if (options.type) {
      inquiries = inquiries.filter(i => i.type === options.type);
    }

    if (options.status) {
      inquiries = inquiries.filter(i => i.status === options.status);
    }

    if (options.searchQuery && options.searchQuery.trim()) {
      const query = options.searchQuery.toLowerCase();
      inquiries = inquiries.filter(i =>
        i.name.toLowerCase().includes(query) ||
        i.email.toLowerCase().includes(query) ||
        (i.companyName && i.companyName.toLowerCase().includes(query)) ||
        i.message.toLowerCase().includes(query)
      );
    }

    return inquiries;
  },
};

// デフォルトエクスポート
export const base44 = {
  member: memberApi,
  officer: officerApi,
  inquiry: inquiryApi,
};

export default base44;
