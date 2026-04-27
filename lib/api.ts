/**
 * 后端 API 客户端
 * 所有接口调用都通过此文件
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ─── Token 管理 ───────────────────────────────────────────────────────────────

export function getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
}

export function getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("refresh_token");
}

export function setTokens(access: string, refresh: string) {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
}

export function clearTokens() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
}

// ─── 请求工具 ─────────────────────────────────────────────────────────────────

async function request<T>(
    path: string,
    options: RequestInit = {},
    withAuth = false
): Promise<T> {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
    };

    if (withAuth) {
        const token = getAccessToken();
        if (token) headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

    if (!res.ok) {
        let detail = `HTTP ${res.status}`;
        try {
            const body = await res.json();
            detail = body.detail || detail;
        } catch (_) { }
        throw new Error(detail);
    }

    if (res.status === 204) return undefined as T;
    return res.json();
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface CaptchaResponse {
    captcha_id: string;
    image_base64: string;
}

export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
}

export interface UserInfo {
    id: string;
    phone: string;
    nickname: string | null;
    level: string;
    rank: number;
    has_password: boolean;
    created_at: string;
}

export async function getCaptcha(): Promise<CaptchaResponse> {
    return request<CaptchaResponse>("/auth/captcha");
}

export type SmsScene = "login" | "change_phone" | "reset_password";

export async function sendSms(
    phone: string,
    captcha_id: string,
    captcha_text: string,
    scene: SmsScene = "login"
): Promise<void> {
    await request("/auth/send_sms", {
        method: "POST",
        body: JSON.stringify({ phone, captcha_id, captcha_text, scene }),
    });
}

export async function loginWithPassword(
    phone: string,
    password: string,
    captcha_id: string,
    captcha_text: string
): Promise<TokenResponse> {
    return request<TokenResponse>("/auth/login/password", {
        method: "POST",
        body: JSON.stringify({ phone, password, captcha_id, captcha_text }),
    });
}

export async function resetPassword(
    phone: string,
    sms_code: string,
    new_password: string
): Promise<void> {
    await request("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ phone, sms_code, new_password }),
    });
}

export async function changePhone(new_phone: string, sms_code: string): Promise<void> {
    await request("/auth/change-phone", {
        method: "POST",
        body: JSON.stringify({ new_phone, sms_code }),
    });
}

export async function login(phone: string, sms_code: string): Promise<TokenResponse> {
    return request<TokenResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ phone, sms_code }),
    });
}

export async function refreshToken(refresh_token: string): Promise<TokenResponse> {
    return request<TokenResponse>("/auth/refresh", {
        method: "POST",
        body: JSON.stringify({ refresh_token }),
    });
}

export async function getMe(): Promise<UserInfo> {
    return request<UserInfo>("/auth/me", {}, true);
}

export async function updateNickname(nickname: string): Promise<UserInfo> {
    return request<UserInfo>("/auth/me/nickname", {
        method: "PATCH",
        body: JSON.stringify({ nickname }),
    }, true);
}

// ─── STS ──────────────────────────────────────────────────────────────────────

export interface STSCredentials {
    access_key_id: string;
    access_key_secret: string;
    security_token: string;
    expiration: string;
    upload_dir: string;
    upload_id: string;
    bucket: string;
    endpoint: string;
}

export async function getStsCredentials(): Promise<STSCredentials> {
    return request<STSCredentials>("/sts", {}, true);
}

// ─── Datasets ─────────────────────────────────────────────────────────────────

export interface DatasetListItem {
    id: string;
    name: string;
    description: string | null;
    tags: string | null;
    is_public: boolean;
    version: string;
    total_episodes: number | null;
    total_frames: number | null;
    size_bytes: number | null;
    robot: string | null;
    license: string;
    has_preview: boolean;
    created_at: string;
    owner_phone: string | null;
}

export interface DatasetDetail extends DatasetListItem {
    preview_path: string | null;
    oss_path: string | null;
}

export async function listDatasets(params?: {
    search?: string;
    tag?: string;
    skip?: number;
    limit?: number;
}): Promise<DatasetListItem[]> {
    const q = new URLSearchParams();
    if (params?.search) q.set("search", params.search);
    if (params?.tag) q.set("tag", params.tag);
    if (params?.skip != null) q.set("skip", String(params.skip));
    if (params?.limit != null) q.set("limit", String(params.limit));
    return request<DatasetListItem[]>(`/datasets?${q.toString()}`);
}

export async function getDataset(id: string): Promise<DatasetDetail> {
    return request<DatasetDetail>(`/datasets/${id}`, {}, true);
}

export async function getMyDatasets(): Promise<DatasetListItem[]> {
    return request<DatasetListItem[]>("/datasets/my/datasets", {}, true);
}

export async function updateDataset(
    id: string,
    body: { description?: string; tags?: string; is_public?: boolean; robot?: string; license?: string }
): Promise<DatasetDetail> {
    return request<DatasetDetail>(`/datasets/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
    }, true);
}

export interface UploadCompleteRequest {
    upload_id: string;
    dataset_name: string;
    oss_path: string;
    description?: string;
    tags?: string;   // JSON 序列化后的 TagsData 字符串
}

export interface UploadStatusResponse {
    upload_id: string;
    status: string;
    error_message?: string;
    dataset_id?: string;
    detected_version?: string;
}

export async function completeUpload(body: UploadCompleteRequest): Promise<UploadStatusResponse> {
    return request<UploadStatusResponse>("/datasets/upload/complete", {
        method: "POST",
        body: JSON.stringify(body),
    }, true);
}

export async function getUploadStatus(uploadId: string): Promise<UploadStatusResponse> {
    return request<UploadStatusResponse>(`/datasets/upload/${uploadId}/status`, {}, true);
}

export async function getDownloadUrl(datasetId: string, file: string): Promise<{ url: string; expires_in: number }> {
    return request<{ url: string; expires_in: number }>(
        `/datasets/${datasetId}/download-url?file=${encodeURIComponent(file)}`,
        {},
        true
    );
}

export async function adminListAllDatasets(params?: {
    search?: string;
    skip?: number;
    limit?: number;
}): Promise<DatasetListItem[]> {
    const q = new URLSearchParams();
    if (params?.search) q.set("search", params.search);
    if (params?.skip != null) q.set("skip", String(params.skip));
    if (params?.limit != null) q.set("limit", String(params.limit));
    return request<DatasetListItem[]>(`/datasets/admin/all?${q.toString()}`, {}, true);
}

// ─── 格式化工具 ───────────────────────────────────────────────────────────────

export function formatBytes(bytes: number | null): string {
    if (!bytes) return "Unknown";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
    return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}
