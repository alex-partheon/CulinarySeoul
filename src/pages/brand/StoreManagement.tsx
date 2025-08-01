import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { 
  Store as StoreIcon,
  Plus,
  Download,
  RefreshCw,
  BarChart3,
  TrendingUp,
  Package,
  Users
} from 'lucide-react'
import { BrandDashboardLayout } from '@/components/dashboard/brand/BrandDashboardLayout'
import { StoreManagementPanel } from '@/components/dashboard/brand/StoreManagementPanel'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { toast } from 'react-hot-toast'
import { StoreService } from '@/domains/store/storeService'
import type { Store, CreateStoreRequest, UpdateStoreRequest } from '@/domains/store/types'

// Mock brand metrics data
const mockBrandMetrics = {
  totalStores: 8,
  activeStores: 7,
  monthlyGrowth: 12.5,
  averageSales: 3250000,
  totalStaff: 32,
  inventoryTurnover: 4.2
}

export default function StoreManagement() {
  const { brandId } = useParams()
  const [stores, setStores] = useState<Store[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    store_type: 'direct' as const,
    address: {
      street: '',
      city: '',
      state: '',
      postal_code: ''
    },
    contact_info: {
      phone: '',
      email: '',
      manager: {
        name: '',
        phone: '',
        email: ''
      }
    },
    is_active: true
  })

  // Load stores
  useEffect(() => {
    loadStores()
  }, [brandId])

  const loadStores = async () => {
    try {
      setIsLoading(true)
      const data = await StoreService.getStoresByBrand(brandId || '')
      setStores(data)
    } catch (error) {
      console.error('Failed to load stores:', error)
      toast.error('매장 목록을 불러오는데 실패했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadStores()
    setTimeout(() => {
      setIsRefreshing(false)
      toast.success('매장 데이터가 업데이트되었습니다')
    }, 1000)
  }

  const handleAddStore = () => {
    setFormData({
      name: '',
      code: '',
      store_type: 'direct',
      address: {
        street: '',
        city: '',
        state: '',
        postal_code: ''
      },
      contact_info: {
        phone: '',
        email: '',
        manager: {
          name: '',
          phone: '',
          email: ''
        }
      },
      is_active: true
    })
    setIsAddModalOpen(true)
  }

  const handleEditStore = (store: Store) => {
    setSelectedStore(store)
    setFormData({
      name: store.name,
      code: store.code,
      store_type: store.store_type,
      address: store.address || {
        street: '',
        city: '',
        state: '',
        postal_code: ''
      },
      contact_info: store.contact_info || {
        phone: '',
        email: '',
        manager: {
          name: '',
          phone: '',
          email: ''
        }
      },
      is_active: store.is_active
    })
    setIsEditModalOpen(true)
  }

  const handleToggleStoreStatus = async (store: Store) => {
    try {
      await StoreService.toggleStoreStatus(store.id, !store.is_active)
      toast.success(`${store.name}이(가) ${!store.is_active ? '활성화' : '비활성화'}되었습니다`)
      loadStores()
    } catch (error) {
      console.error('Failed to toggle store status:', error)
      toast.error('매장 상태 변경에 실패했습니다')
    }
  }

  const handleViewStoreDetails = (store: Store) => {
    // Navigate to store details page
    window.location.href = `/brand/${brandId}/stores/${store.id}`
  }

  const handleSubmitAdd = async () => {
    try {
      const request: CreateStoreRequest = {
        brand_id: brandId || '',
        ...formData
      }
      await StoreService.createStore(request)
      toast.success('새 매장이 추가되었습니다')
      setIsAddModalOpen(false)
      loadStores()
    } catch (error) {
      console.error('Failed to create store:', error)
      toast.error('매장 추가에 실패했습니다')
    }
  }

  const handleSubmitEdit = async () => {
    if (!selectedStore) return
    
    try {
      const request: UpdateStoreRequest = formData
      await StoreService.updateStore(selectedStore.id, request)
      toast.success('매장 정보가 수정되었습니다')
      setIsEditModalOpen(false)
      loadStores()
    } catch (error) {
      console.error('Failed to update store:', error)
      toast.error('매장 수정에 실패했습니다')
    }
  }

  const handleExport = () => {
    toast.success('매장 목록을 내보내는 중...')
    // Implement export functionality
  }

  return (
    <BrandDashboardLayout
      title="매장 관리"
      subtitle="브랜드 매장 현황 및 관리"
    >
      <div className="p-6 space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              새로고침
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              내보내기
            </Button>
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="전체 매장"
            value={mockBrandMetrics.totalStores.toString()}
            change={mockBrandMetrics.monthlyGrowth}
            changeLabel="이번 달"
            icon={<StoreIcon className="h-5 w-5" />}
            status="success"
          />
          <MetricCard
            title="평균 매출"
            value={`₩${(mockBrandMetrics.averageSales / 1000000).toFixed(1)}M`}
            change={8.3}
            changeLabel="전월 대비"
            icon={<TrendingUp className="h-5 w-5" />}
            status="success"
          />
          <MetricCard
            title="총 직원 수"
            value={mockBrandMetrics.totalStaff.toString()}
            icon={<Users className="h-5 w-5" />}
            status="info"
            description="전체 매장"
          />
          <MetricCard
            title="재고 회전율"
            value={mockBrandMetrics.inventoryTurnover.toFixed(1)}
            icon={<Package className="h-5 w-5" />}
            status="warning"
            description="월 평균"
          />
        </div>

        {/* Store Management Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">전체 매장</TabsTrigger>
            <TabsTrigger value="analytics">매장 분석</TabsTrigger>
            <TabsTrigger value="performance">실적 비교</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <StoreManagementPanel
              stores={stores}
              isLoading={isLoading}
              onAddStore={handleAddStore}
              onEditStore={handleEditStore}
              onToggleStoreStatus={handleToggleStoreStatus}
              onViewStoreDetails={handleViewStoreDetails}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="text-center py-12 text-muted-foreground">
              매장 분석 기능 (개발 예정)
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="text-center py-12 text-muted-foreground">
              매장별 실적 비교 기능 (개발 예정)
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Store Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>새 매장 추가</DialogTitle>
            <DialogDescription>
              브랜드에 새로운 매장을 추가합니다
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">매장명</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="예: 강남점"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">매장 코드</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="예: gangnam"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="store_type">매장 유형</Label>
              <Select 
                value={formData.store_type} 
                onValueChange={(value: any) => setFormData({ ...formData, store_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="direct">직영</SelectItem>
                  <SelectItem value="franchise">가맹</SelectItem>
                  <SelectItem value="partner">파트너</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>주소</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="시/도"
                  value={formData.address.city}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, city: e.target.value }
                  })}
                />
                <Input
                  placeholder="우편번호"
                  value={formData.address.postal_code}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, postal_code: e.target.value }
                  })}
                />
              </div>
              <Input
                placeholder="상세 주소"
                value={formData.address.street}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, street: e.target.value }
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>연락처</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="전화번호"
                  value={formData.contact_info.phone}
                  onChange={(e) => setFormData({
                    ...formData,
                    contact_info: { ...formData.contact_info, phone: e.target.value }
                  })}
                />
                <Input
                  placeholder="이메일"
                  type="email"
                  value={formData.contact_info.email}
                  onChange={(e) => setFormData({
                    ...formData,
                    contact_info: { ...formData.contact_info, email: e.target.value }
                  })}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">매장 활성화</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              취소
            </Button>
            <Button onClick={handleSubmitAdd}>
              추가
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Store Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>매장 정보 수정</DialogTitle>
            <DialogDescription>
              {selectedStore?.name} 매장 정보를 수정합니다
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">매장명</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-code">매장 코드</Label>
                <Input
                  id="edit-code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-store_type">매장 유형</Label>
              <Select 
                value={formData.store_type} 
                onValueChange={(value: any) => setFormData({ ...formData, store_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="direct">직영</SelectItem>
                  <SelectItem value="franchise">가맹</SelectItem>
                  <SelectItem value="partner">파트너</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>주소</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="시/도"
                  value={formData.address.city}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, city: e.target.value }
                  })}
                />
                <Input
                  placeholder="우편번호"
                  value={formData.address.postal_code}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, postal_code: e.target.value }
                  })}
                />
              </div>
              <Input
                placeholder="상세 주소"
                value={formData.address.street}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, street: e.target.value }
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>연락처</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="전화번호"
                  value={formData.contact_info.phone}
                  onChange={(e) => setFormData({
                    ...formData,
                    contact_info: { ...formData.contact_info, phone: e.target.value }
                  })}
                />
                <Input
                  placeholder="이메일"
                  type="email"
                  value={formData.contact_info.email}
                  onChange={(e) => setFormData({
                    ...formData,
                    contact_info: { ...formData.contact_info, email: e.target.value }
                  })}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="edit-is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="edit-is_active">매장 활성화</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              취소
            </Button>
            <Button onClick={handleSubmitEdit}>
              수정
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </BrandDashboardLayout>
  )
}