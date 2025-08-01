// TASK-014: 인스타그램 계정 관리자

import { supabase } from '../../lib/supabase';
import { InstagramAPIClient } from './instagram-api-client';
import { InstagramAccount, InstagramAccountData } from '../../types/analytics';

export class InstagramAccountManager {
  private instagramAPI: InstagramAPIClient;

  constructor() {
    this.instagramAPI = new InstagramAPIClient();
  }

  /**
   * 인스타그램 계정 등록
   */
  async registerInstagramAccount(brandId: string, accountData: InstagramAccountData): Promise<void> {
    try {
      // 1. 인스타그램 계정 유효성 검증
      const isValid = await this.validateInstagramAccount(accountData.accessToken);
      if (!isValid) {
        throw new Error('유효하지 않은 인스타그램 계정입니다.');
      }

      // 2. 계정 정보 조회
      const accountInfo = await this.instagramAPI.getAccountInfo(accountData.accessToken);
      
      // 3. 기존 계정 확인 및 비활성화
      await this.deactivateExistingAccount(brandId);

      // 4. 새 계정 정보 저장
      await this.saveInstagramAccount({
        brandId,
        username: accountData.username || accountInfo.username,
        instagramUserId: accountInfo.id,
        accessToken: accountData.accessToken,
        refreshToken: accountData.refreshToken,
        accountType: accountData.accountType || accountInfo.account_type || 'personal',
        registeredAt: new Date()
      });

      // 5. 초기 데이터 동기화
      await this.syncInitialData(brandId);
      
      console.log(`브랜드 ${brandId}의 인스타그램 계정 등록 완료: @${accountInfo.username}`);
    } catch (error) {
      console.error('인스타그램 계정 등록 실패:', error);
      throw error;
    }
  }

  /**
   * 인스타그램 계정 정보 업데이트
   */
  async updateInstagramAccount(brandId: string, updates: Partial<InstagramAccountData>): Promise<void> {
    try {
      const { error } = await supabase
        .from('brand_instagram_accounts')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('brand_id', brandId)
        .eq('is_active', true);

      if (error) {
        throw new Error(`인스타그램 계정 업데이트 실패: ${error.message}`);
      }

      console.log(`브랜드 ${brandId}의 인스타그램 계정 정보 업데이트 완료`);
    } catch (error) {
      console.error('인스타그램 계정 업데이트 실패:', error);
      throw error;
    }
  }

  /**
   * 인스타그램 계정 삭제 (비활성화)
   */
  async removeInstagramAccount(brandId: string): Promise<void> {
    try {
      await this.deactivateExistingAccount(brandId);
      console.log(`브랜드 ${brandId}의 인스타그램 계정 삭제 완료`);
    } catch (error) {
      console.error('인스타그램 계정 삭제 실패:', error);
      throw error;
    }
  }

  /**
   * 브랜드 인스타그램 계정 조회
   */
  async getBrandInstagramAccount(brandId: string): Promise<InstagramAccount | null> {
    try {
      const { data, error } = await supabase
        .from('brand_instagram_accounts')
        .select('*')
        .eq('brand_id', brandId)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // 계정이 없음
        }
        throw error;
      }

      return data ? {
        id: data.id,
        brandId: data.brand_id,
        username: data.username,
        instagramUserId: data.instagram_user_id,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        tokenExpiresAt: data.token_expires_at,
        accountType: data.account_type,
        isActive: data.is_active,
        lastSyncAt: data.last_sync_at,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      } : null;
    } catch (error) {
      console.error('브랜드 인스타그램 계정 조회 실패:', error);
      return null;
    }
  }

  /**
   * 액세스 토큰 갱신
   */
  async refreshAccessToken(brandId: string): Promise<void> {
    try {
      const account = await this.getBrandInstagramAccount(brandId);
      if (!account) {
        throw new Error('인스타그램 계정이 등록되지 않았습니다.');
      }

      const refreshResult = await this.instagramAPI.refreshAccessToken(account.accessToken);
      
      await this.updateInstagramAccount(brandId, {
        accessToken: refreshResult.access_token,
        // 토큰 만료 시간 업데이트 (보통 60일)
      });

      console.log(`브랜드 ${brandId}의 인스타그램 액세스 토큰 갱신 완료`);
    } catch (error) {
      console.error('인스타그램 액세스 토큰 갱신 실패:', error);
      throw error;
    }
  }

  /**
   * 인스타그램 데이터 동기화
   */
  async syncInstagramData(brandId: string): Promise<void> {
    try {
      const account = await this.getBrandInstagramAccount(brandId);
      if (!account) {
        throw new Error('인스타그램 계정이 등록되지 않았습니다.');
      }

      // 최근 미디어 조회 및 저장
      const recentMedia = await this.instagramAPI.getRecentMedia(account.accessToken, 50);
      await this.saveInstagramContent(brandId, recentMedia.data);

      // 동기화 시간 업데이트
      await this.updateLastSyncTime(brandId);

      console.log(`브랜드 ${brandId}의 인스타그램 데이터 동기화 완료`);
    } catch (error) {
      console.error('인스타그램 데이터 동기화 실패:', error);
      throw error;
    }
  }

  /**
   * 인스타그램 계정 유효성 검증
   */
  private async validateInstagramAccount(accessToken: string): Promise<boolean> {
    try {
      return await this.instagramAPI.validateAccessToken(accessToken);
    } catch (error) {
      console.error('인스타그램 계정 유효성 검증 실패:', error);
      return false;
    }
  }

  /**
   * 기존 계정 비활성화
   */
  private async deactivateExistingAccount(brandId: string): Promise<void> {
    const { error } = await supabase
      .from('brand_instagram_accounts')
      .update({ is_active: false })
      .eq('brand_id', brandId);

    if (error) {
      console.error('기존 인스타그램 계정 비활성화 실패:', error);
    }
  }

  /**
   * 인스타그램 계정 정보 저장
   */
  private async saveInstagramAccount(accountData: any): Promise<void> {
    const { error } = await supabase
      .from('brand_instagram_accounts')
      .insert({
        brand_id: accountData.brandId,
        username: accountData.username,
        instagram_user_id: accountData.instagramUserId,
        access_token: accountData.accessToken,
        refresh_token: accountData.refreshToken,
        account_type: accountData.accountType,
        is_active: true,
        created_at: accountData.registeredAt.toISOString(),
        updated_at: accountData.registeredAt.toISOString()
      });

    if (error) {
      throw new Error(`인스타그램 계정 저장 실패: ${error.message}`);
    }
  }

  /**
   * 초기 데이터 동기화
   */
  private async syncInitialData(brandId: string): Promise<void> {
    try {
      await this.syncInstagramData(brandId);
    } catch (error) {
      console.warn('초기 데이터 동기화 실패:', error);
      // 초기 동기화 실패는 치명적이지 않으므로 경고만 출력
    }
  }

  /**
   * 인스타그램 컨텐츠 저장
   */
  private async saveInstagramContent(brandId: string, mediaList: any[]): Promise<void> {
    try {
      const contentData = mediaList.map(media => ({
        brand_id: brandId,
        instagram_media_id: media.id,
        media_type: media.media_type,
        caption: media.caption,
        permalink: media.permalink,
        thumbnail_url: media.thumbnail_url,
        timestamp: media.timestamp,
        like_count: media.like_count || 0,
        comments_count: media.comments_count || 0,
        engagement_rate: this.calculateEngagementRate(media.like_count || 0, media.comments_count || 0),
        tracked_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('instagram_content_tracking')
        .upsert(contentData, {
          onConflict: 'brand_id,instagram_media_id'
        });

      if (error) {
        console.error('인스타그램 컨텐츠 저장 실패:', error);
      }
    } catch (error) {
      console.error('인스타그램 컨텐츠 저장 중 오류:', error);
    }
  }

  /**
   * 마지막 동기화 시간 업데이트
   */
  private async updateLastSyncTime(brandId: string): Promise<void> {
    const { error } = await supabase
      .from('brand_instagram_accounts')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('brand_id', brandId)
      .eq('is_active', true);

    if (error) {
      console.error('마지막 동기화 시간 업데이트 실패:', error);
    }
  }

  /**
   * 참여율 계산
   */
  private calculateEngagementRate(likes: number, comments: number): number {
    // 간단한 참여도 점수 (실제로는 팔로워 수 대비 계산)
    return likes + (comments * 2); // 댓글에 더 높은 가중치
  }

  /**
   * 계정 상태 확인
   */
  async checkAccountStatus(brandId: string): Promise<{
    isConnected: boolean;
    isTokenValid: boolean;
    lastSync?: string;
    username?: string;
  }> {
    try {
      const account = await this.getBrandInstagramAccount(brandId);
      
      if (!account) {
        return { isConnected: false, isTokenValid: false };
      }

      const isTokenValid = await this.instagramAPI.validateAccessToken(account.accessToken);
      
      return {
        isConnected: true,
        isTokenValid,
        lastSync: account.lastSyncAt || undefined,
        username: account.username
      };
    } catch (error) {
      console.error('계정 상태 확인 실패:', error);
      return { isConnected: false, isTokenValid: false };
    }
  }
}