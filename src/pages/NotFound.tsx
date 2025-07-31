import { useNavigate } from 'react-router'
import { Button } from '../components/ui/button'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold mt-4 mb-2">페이지를 찾을 수 없습니다</h2>
        <p className="text-muted-foreground mb-8">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <div className="flex gap-4 justify-center">
          <Button 
            onClick={() => navigate(-1)}
            variant="outline"
          >
            이전 페이지로
          </Button>
          <Button 
            onClick={() => navigate('/')}
          >
            홈으로 이동
          </Button>
        </div>
      </div>
    </div>
  )
}