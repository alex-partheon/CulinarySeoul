import { Mail } from 'lucide-react';

export default function StoreMarketingNewsletter() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">뉴스레터</h1>
        <p className="text-muted-foreground">매장의 뉴스레터를 관리합니다</p>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">개발 중</h2>
        <p className="text-muted-foreground">고객 대상 뉴스레터 발송, 구독자 관리 등의 기능을 제공할 예정입니다.</p>
      </div>
    </div>
  );
}