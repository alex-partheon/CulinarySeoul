// TASK-014: 브랜드 API 라우터

import type { NextApiRequest, NextApiResponse } from 'next';

interface BrandRouterRequest extends NextApiRequest {
  query: {
    brandId: string;
    [key: string]: string | string[];
  };
}

export default async function handler(
  req: BrandRouterRequest,
  res: NextApiResponse
) {
  const { brandId } = req.query;

  if (!brandId || typeof brandId !== 'string') {
    return res.status(400).json({ error: 'Brand ID is required' });
  }

  try {
    switch (req.method) {
      case 'GET':
        return handleGet(req, res);
      case 'POST':
        return handlePost(req, res);
      case 'PUT':
        return handlePut(req, res);
      case 'DELETE':
        return handleDelete(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error: any) {
    console.error('Error in brand router:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleGet(
  req: BrandRouterRequest,
  res: NextApiResponse
) {
  const { brandId } = req.query;
  
  try {
    // 브랜드 정보 조회 로직
    // 실제 구현에서는 데이터베이스에서 브랜드 정보를 가져옴
    const brandData = {
      id: brandId,
      name: 'Sample Brand',
      description: 'Sample brand description',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return res.status(200).json({
      success: true,
      data: brandData
    });
  } catch (error: any) {
    console.error('Error fetching brand:', error);
    return res.status(500).json({ error: 'Failed to fetch brand' });
  }
}

async function handlePost(
  req: BrandRouterRequest,
  res: NextApiResponse
) {
  const { brandId } = req.query;
  const { name, description } = req.body;

  try {
    // 브랜드 생성 로직
    // 실제 구현에서는 데이터베이스에 브랜드를 생성
    const newBrand = {
      id: brandId,
      name,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return res.status(201).json({
      success: true,
      data: newBrand
    });
  } catch (error: any) {
    console.error('Error creating brand:', error);
    return res.status(500).json({ error: 'Failed to create brand' });
  }
}

async function handlePut(
  req: BrandRouterRequest,
  res: NextApiResponse
) {
  const { brandId } = req.query;
  const { name, description } = req.body;

  try {
    // 브랜드 업데이트 로직
    // 실제 구현에서는 데이터베이스에서 브랜드를 업데이트
    const updatedBrand = {
      id: brandId,
      name,
      description,
      updatedAt: new Date().toISOString()
    };

    return res.status(200).json({
      success: true,
      data: updatedBrand
    });
  } catch (error: any) {
    console.error('Error updating brand:', error);
    return res.status(500).json({ error: 'Failed to update brand' });
  }
}

async function handleDelete(
  req: BrandRouterRequest,
  res: NextApiResponse
) {
  const { brandId } = req.query;

  try {
    // 브랜드 삭제 로직
    // 실제 구현에서는 데이터베이스에서 브랜드를 삭제
    
    return res.status(200).json({
      success: true,
      message: `Brand ${brandId} deleted successfully`
    });
  } catch (error: any) {
    console.error('Error deleting brand:', error);
    return res.status(500).json({ error: 'Failed to delete brand' });
  }
}