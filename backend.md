# バックエンドAPI仕様書

## プロフィール管理API

### プロフィール取得
```typescript
GET /api/profile?userId=xxx
```

#### リクエスト
- 認証必須: No

#### レスポンス
```typescript
type ProfileResponse = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
}
```

#### エラーレスポンス
- 401: 未認証
- 404: プロフィールが存在しない
- 500: サーバーエラー

### プロフィール更新
```typescript
PUT /api/profile/update
```

#### リクエスト
- 認証必須: Yes
- ヘッダー:
  - `Authorization`: Bearer token (Supabaseセッション)
- ボディ:
```typescript
type UpdateProfileRequest = {
  display_name?: string;
  avatar_url?: string;
}
```

#### レスポンス
```typescript
type ProfileResponse = {
  success: boolean
}
```

#### エラーレスポンス
- 401: 未認証
- 404: プロフィールが存在しない
- 422: バリデーションエラー
- 500: サーバーエラー
