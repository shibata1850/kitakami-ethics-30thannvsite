/**
 * Base44 API Client
 *
 * Base44をデータソースとして使用するためのAPIクライアント
 */

const BASE44_APP_ID = '6943944870829f16b01dab30';
const BASE44_API_KEY = process.env.BASE44_API_KEY || '8834846fdeeb4fa2aad4038a3117ccbc';
const BASE44_BASE_URL = `https://app.base44.com/api/apps/${BASE44_APP_ID}/entities`;
// バックエンド関数用のサブドメインURL
const BASE44_FUNCTIONS_URL = 'https://app-99436250-11d4-4bc6-89e5-c095cdd845ed.base44.app/api/functions';

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

  console.log(`[Base44 Request] ${method} ${url}`);
  if (body) {
    console.log('[Base44 Request] Body:', JSON.stringify(body, null, 2));
  }

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
    console.error(`[Base44 Request] Error (${response.status}):`, errorText);
    throw new Error(`Base44 API error (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  console.log(`[Base44 Request] Response:`, JSON.stringify(result, null, 2).substring(0, 500));
  return result;
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

// ============================================
// Form API - 出欠確認フォーム
// ============================================

// Form エンティティ
export interface Base44Form extends Base44Entity {
  title: string;
  event_id?: string;
  event_date?: string;
  deadline?: string;
  questions?: Base44FormQuestion[];
  status?: 'draft' | 'active' | 'closed';
}

// Form質問
export interface Base44FormQuestion {
  id: string;
  question: string;
  type: 'text' | 'radio' | 'checkbox' | 'textarea' | 'select';
  options?: string[];
  required?: boolean;
}

// FormResponse エンティティ
export interface Base44FormResponse extends Base44Entity {
  form_id: string;
  user_id?: string;
  user_name?: string;
  user_email?: string;
  attendance: 'attend' | 'absent' | 'undecided';
  guest_count?: number;
  comment?: string;
  answers?: Record<string, any>;
}

// Event エンティティ（既存）
export interface Base44Event extends Base44Entity {
  title?: string;
  event_type?: string;
  event_date?: string;
  start_time?: string;
  end_time?: string;
  venue?: string;
  venue_address?: string;
  description?: string;
  status?: string;
}

export const formApi = {
  /**
   * 全フォーム取得
   */
  async list(): Promise<Base44Form[]> {
    try {
      const data = await base44Request<Base44Form[]>('Form');
      return data.sort((a, b) =>
        new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
      );
    } catch (error) {
      console.error('[Base44] Failed to list forms:', error);
      return [];
    }
  },

  /**
   * アクティブなフォーム取得（出欠登録可能なもの）
   */
  async getActiveForms(): Promise<Base44Form[]> {
    const forms = await this.list();
    const now = new Date();
    return forms.filter(f => {
      if (f.status === 'closed') return false;
      if (f.deadline && new Date(f.deadline) < now) return false;
      return true;
    });
  },

  /**
   * フォーム詳細取得
   */
  async getById(id: string): Promise<Base44Form | null> {
    try {
      return await base44Request<Base44Form>('Form', 'GET', id);
    } catch (error) {
      console.error(`[Base44] Failed to get form ${id}:`, error);
      return null;
    }
  },

  /**
   * フォーム定義取得（関連イベント情報付き）
   */
  async getFormDefinition(formId: string): Promise<{
    form: Base44Form;
    event: Base44Event | null;
  } | null> {
    try {
      const form = await this.getById(formId);
      if (!form) return null;

      let event: Base44Event | null = null;
      if (form.event_id) {
        try {
          event = await base44Request<Base44Event>('Event', 'GET', form.event_id);
        } catch (e) {
          console.warn(`[Base44] Event ${form.event_id} not found for form ${formId}`);
        }
      }

      return { form, event };
    } catch (error) {
      console.error(`[Base44] Failed to get form definition ${formId}:`, error);
      return null;
    }
  },
};

export const formResponseApi = {
  /**
   * フォームへの回答を取得
   */
  async getByFormId(formId: string): Promise<Base44FormResponse[]> {
    try {
      const allResponses = await base44Request<Base44FormResponse[]>('FormResponse');
      return allResponses.filter(r => r.form_id === formId);
    } catch (error) {
      console.error(`[Base44] Failed to get responses for form ${formId}:`, error);
      return [];
    }
  },

  /**
   * ユーザーの回答を取得
   */
  async getByUserEmail(email: string): Promise<Base44FormResponse[]> {
    try {
      const allResponses = await base44Request<Base44FormResponse[]>('FormResponse');
      return allResponses.filter(r => r.user_email === email);
    } catch (error) {
      console.error(`[Base44] Failed to get responses for user ${email}:`, error);
      return [];
    }
  },

  /**
   * 特定フォームへのユーザーの回答を取得
   */
  async getUserResponseForForm(formId: string, userEmail: string): Promise<Base44FormResponse | null> {
    try {
      const responses = await this.getByFormId(formId);
      return responses.find(r => r.user_email === userEmail) || null;
    } catch (error) {
      console.error(`[Base44] Failed to get user response:`, error);
      return null;
    }
  },

  /**
   * 出欠回答を作成/更新（Base44バックエンド関数経由）
   */
  async submitResponse(data: {
    form_id: string;
    user_name: string;
    user_email: string;
    attendance: 'attend' | 'absent' | 'undecided';
    guest_count?: number;
    comment?: string;
    answers?: Record<string, any>;
  }): Promise<Base44FormResponse> {
    console.log('[Base44] submitResponse called with data:', JSON.stringify(data, null, 2));

    try {
      // Base44のバックエンド関数 updateAttendanceFromExternalSite を呼び出す（サブドメイン経由）
      const functionUrl = `${BASE44_FUNCTIONS_URL}/updateAttendanceFromExternalSite`;
      console.log('[Base44] Calling backend function:', functionUrl);

      const requestBody = {
        form_id: data.form_id,
        user_email: data.user_email,
        attendance: data.attendance,
        guest_count: data.guest_count,
        comment: data.comment,
        answers: data.answers,
        api_key: BASE44_API_KEY,
      };
      console.log('[Base44] Request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'api_key': BASE44_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Base44] Backend function error (${response.status}):`, errorText);
        throw new Error(`Base44 API error (${response.status}): ${errorText}`);
      }

      const result = await response.json();
      console.log('[Base44] Backend function response:', JSON.stringify(result, null, 2));
      return result;
    } catch (error: any) {
      console.error('[Base44] Failed to submit response:', {
        error: error,
        message: error?.message,
        stack: error?.stack,
      });
      throw error;
    }
  },
};
