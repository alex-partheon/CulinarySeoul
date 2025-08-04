import { Webhook } from 'svix'
import { supabase } from '../lib/supabase'

// Clerk 웹훅 이벤트 타입
interface ClerkWebhookEvent {
  type: string
  data: {
    id: string
    email_addresses: Array<{
      email_address: string
      id: string
    }>
    first_name?: string
    last_name?: string
    image_url?: string
    public_metadata?: Record<string, any>
    private_metadata?: Record<string, any>
    unsafe_metadata?: Record<string, any>
    created_at: number
    updated_at: number
  }
}

// 사용자 프로필 동기화 함수
export async function syncUserProfile(clerkUser: ClerkWebhookEvent['data']) {
  try {
    const email = clerkUser.email_addresses[0]?.email_address
    if (!email) {
      throw new Error('이메일 주소가 없습니다')
    }

    const fullName = clerkUser.first_name && clerkUser.last_name 
      ? `${clerkUser.first_name} ${clerkUser.last_name}`
      : clerkUser.first_name || clerkUser.last_name || ''

    const profileData = {
      clerk_user_id: clerkUser.id,
      email,
      full_name: fullName,
      avatar_url: clerkUser.image_url,
      user_type: clerkUser.public_metadata?.userType || 'BRAND_MANAGER',
      onboarding_completed: clerkUser.public_metadata?.onboardingCompleted || false,
      created_at: new Date(clerkUser.created_at).toISOString(),
      updated_at: new Date(clerkUser.updated_at).toISOString()
    }

    // 기존 프로필 확인
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('clerk_user_id', clerkUser.id)
      .single()

    if (existingProfile) {
      // 기존 프로필 업데이트
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('clerk_user_id', clerkUser.id)

      if (error) {
        throw error
      }
    } else {
      // 새 프로필 생성
      const { error } = await supabase
        .from('profiles')
        .insert(profileData)

      if (error) {
        throw error
      }

      // 기본 권한 설정 (BRAND_MANAGER)
      await supabase
        .from('user_permissions')
        .insert({
          clerk_user_id: clerkUser.id,
          permission_type: 'BRAND_MANAGER',
          granted_by: clerkUser.id, // 자기 자신이 부여
          granted_at: new Date().toISOString()
        })
    }

    return { success: true }
  } catch (error) {
    console.error('사용자 프로필 동기화 실패:', error)
    throw error
  }
}

// 사용자 프로필 삭제 함수
export async function deleteUserProfile(clerkUserId: string) {
  try {
    // 권한 삭제
    await supabase
      .from('user_permissions')
      .delete()
      .eq('clerk_user_id', clerkUserId)

    // 프로필 삭제
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('clerk_user_id', clerkUserId)

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error('사용자 프로필 삭제 실패:', error)
    throw error
  }
}

// Clerk 웹훅 처리 함수
export async function handleClerkWebhook(
  payload: string,
  headers: Record<string, string>
) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
  
  if (!WEBHOOK_SECRET) {
    throw new Error('CLERK_WEBHOOK_SECRET이 설정되지 않았습니다')
  }

  try {
    const wh = new Webhook(WEBHOOK_SECRET)
    const evt = wh.verify(payload, headers) as ClerkWebhookEvent

    switch (evt.type) {
      case 'user.created':
        console.log('사용자 생성:', evt.data.id)
        await syncUserProfile(evt.data)
        break

      case 'user.updated':
        console.log('사용자 업데이트:', evt.data.id)
        await syncUserProfile(evt.data)
        break

      case 'user.deleted':
        console.log('사용자 삭제:', evt.data.id)
        await deleteUserProfile(evt.data.id)
        break

      case 'session.created':
        console.log('세션 생성:', evt.data.id)
        // 필요시 세션 로깅 로직 추가
        break

      case 'session.ended':
        console.log('세션 종료:', evt.data.id)
        // 필요시 세션 로깅 로직 추가
        break

      default:
        console.log('처리되지 않은 웹훅 이벤트:', evt.type)
    }

    return { success: true }
  } catch (error) {
    console.error('Clerk 웹훅 처리 실패:', error)
    throw error
  }
}

// Express.js 또는 Next.js API 라우트에서 사용할 수 있는 핸들러
export async function clerkWebhookHandler(req: any, res: any) {
  try {
    const payload = JSON.stringify(req.body)
    const headers = {
      'svix-id': req.headers['svix-id'],
      'svix-timestamp': req.headers['svix-timestamp'],
      'svix-signature': req.headers['svix-signature']
    }

    await handleClerkWebhook(payload, headers)
    
    res.status(200).json({ success: true })
  } catch (error) {
    console.error('웹훅 핸들러 오류:', error)
    res.status(400).json({ error: '웹훅 처리 실패' })
  }
}