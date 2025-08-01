// TASK-014: 브랜드 인스타그램 계정 관리 API 라우트

import type { NextApiRequest, NextApiResponse } from 'next';
import { InstagramAccountManager } from '../../../../lib/analytics/instagram-account-manager';
import { supabase } from '../../../../lib/supabase';
import type { BrandInstagramAccount, InstagramAccountData } from '../../../../types/brand-analytics';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { brandId } = req.query as { brandId: string };
  
  if (!brandId) {
    return res.status(400).json({ error: '브랜드 ID가 필요합니다.' });
  }

  try {
    switch (req.method) {
      case 'GET':
        return await handleGetInstagramAccounts(req, res, brandId);
      case 'POST':
        return await handleAddInstagramAccount(req, res, brandId);
      case 'PUT':
        return await handleUpdateInstagramAccount(req, res, brandId);
      case 'DELETE':
        return await handleDeleteInstagramAccount(req, res, brandId);
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ error: '허용되지 않는 메서드입니다.' });
    }
  } catch (error: any) {
    console.error('Instagram API 오류:', error);
    return res.status(500).json({ 
      error: '인스타그램 계정 처리 중 오류가 발생했습니다.',
      details: error instanceof Error ? error.message : '알 수 없는 오류'
    });
  }
}

async function handleGetInstagramAccounts(
  req: NextApiRequest,
  res: NextApiResponse,
  brandId: string
) {
  const instagramManager = new InstagramAccountManager();

  try {
    // 브랜드 존재 확인
    const { data: brand, error: brandError } = await supabase
      .from('brands')
      .select('id, name')
      .eq('id', brandId)
      .single();

    if (brandError || !brand) {
      return res.status(404).json({ error: '브랜드를 찾을 수 없습니다.' });
    }

    // 인스타그램 계정 목록 조회
    const accounts = await instagramManager.getAccountsByBrand(brandId);
    
    // 각 계정의 상태 확인
    const accountsWithStatus = await Promise.all(
      accounts.map(async (account) => {
        try {
          const status = await instagramManager.checkAccountStatus(brandId, account.id);
          return {
            ...account,
            status: {
              isConnected: status.isConnected,
              isTokenValid: status.isTokenValid,
              lastSyncAt: status.lastSyncAt,
              error: status.error
            }
          };
        } catch (error) {
          return {
            ...account,
            status: {
              isConnected: false,
              isTokenValid: false,
              error: error instanceof Error ? error.message : '상태 확인 실패'
            }
          };
        }
      })
    );

    return res.status(200).json({
      success: true,
      data: {
        brandId,
        brandName: brand.name,
        accounts: accountsWithStatus,
        totalAccounts: accountsWithStatus.length,
        activeAccounts: accountsWithStatus.filter(acc => acc.is_active).length
      }
    });

  } catch (error) {
    console.error('인스타그램 계정 조회 오류:', error);
    return res.status(500).json({
      error: '인스타그램 계정을 조회하는 중 오류가 발생했습니다.',
      details: error instanceof Error ? error.message : '알 수 없는 오류'
    });
  }
}

async function handleAddInstagramAccount(
  req: NextApiRequest,
  res: NextApiResponse,
  brandId: string
) {
  const { username, accessToken, accountType = 'personal' } = req.body as InstagramAccountData;

  if (!username || !accessToken) {
    return res.status(400).json({ 
      error: '사용자명과 액세스 토큰이 필요합니다.' 
    });
  }

  const instagramManager = new InstagramAccountManager();

  try {
    // 브랜드 존재 확인
    const { data: brand, error: brandError } = await supabase
      .from('brands')
      .select('id, name')
      .eq('id', brandId)
      .single();

    if (brandError || !brand) {
      return res.status(404).json({ error: '브랜드를 찾을 수 없습니다.' });
    }

    // 인스타그램 계정 등록
    const result = await instagramManager.addAccount({
      brandId,
      username,
      accessToken,
      accountType
    });

    return res.status(201).json({
      success: true,
      message: '인스타그램 계정이 성공적으로 등록되었습니다.',
      data: {
        accountId: result.accountId,
        username: result.username,
        accountType: result.accountType,
        syncedAt: result.syncedAt,
        initialDataCount: result.initialDataCount
      }
    });

  } catch (error: any) {
    console.error('인스타그램 계정 등록 오류:', error);
    
    // 특정 오류 메시지 처리
    if (error instanceof Error) {
      if (error.message.includes('이미 등록된')) {
        return res.status(409).json({ error: error.message });
      }
      if (error.message.includes('유효하지 않은')) {
        return res.status(400).json({ error: error.message });
      }
    }

    return res.status(500).json({
      error: '인스타그램 계정 등록 중 오류가 발생했습니다.',
      details: error instanceof Error ? error.message : '알 수 없는 오류'
    });
  }
}

async function handleUpdateInstagramAccount(
  req: NextApiRequest,
  res: NextApiResponse,
  brandId: string
) {
  const { accountId, accessToken, isActive } = req.body;

  if (!accountId) {
    return res.status(400).json({ error: '계정 ID가 필요합니다.' });
  }

  const instagramManager = new InstagramAccountManager();

  try {
    // 계정 업데이트
    const result = await instagramManager.updateAccount(accountId, {
      accessToken,
      isActive
    });

    return res.status(200).json({
      success: true,
      message: '인스타그램 계정이 성공적으로 업데이트되었습니다.',
      data: result
    });

  } catch (error: any) {
    console.error('인스타그램 계정 업데이트 오류:', error);
    return res.status(500).json({
      error: '인스타그램 계정 업데이트 중 오류가 발생했습니다.',
      details: error instanceof Error ? error.message : '알 수 없는 오류'
    });
  }
}

async function handleDeleteInstagramAccount(
  req: NextApiRequest,
  res: NextApiResponse,
  brandId: string
) {
  const { accountId } = req.body;

  if (!accountId) {
    return res.status(400).json({ error: '계정 ID가 필요합니다.' });
  }

  const instagramManager = new InstagramAccountManager();

  try {
    // 계정 삭제 (비활성화)
    await instagramManager.removeAccount(accountId);

    return res.status(200).json({
      success: true,
      message: '인스타그램 계정이 성공적으로 제거되었습니다.'
    });

  } catch (error: any) {
    console.error('인스타그램 계정 삭제 오류:', error);
    return res.status(500).json({
      error: '인스타그램 계정 삭제 중 오류가 발생했습니다.',
      details: error instanceof Error ? error.message : '알 수 없는 오류'
    });
  }
}