import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Activity
} from 'lucide-react';
import { ConnectionStatus, SyncStatus } from '@/types/dashboard';
import { cn } from '@/lib/utils';

interface CompanyConnectionStatusProps {
  brandId: string;
  className?: string;
}

export const CompanyConnectionStatus: React.FC<CompanyConnectionStatusProps> = ({ 
  brandId, 
  className 
}) => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    status: 'connected',
    quality: 'excellent',
    lastSync: new Date(),
    message: '본사와 연결됨'
  });
  
  const [syncStatuses, setSyncStatuses] = useState<SyncStatus[]>([
    {
      module: '재고 관리',
      status: 'synced',
      lastSync: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      itemsToSync: 0
    },
    {
      module: '주문 관리',
      status: 'syncing',
      lastSync: new Date(Date.now() - 10 * 60 * 1000),
      itemsToSync: 3,
      progress: 66
    },
    {
      module: '고객 정보',
      status: 'synced',
      lastSync: new Date(Date.now() - 15 * 60 * 1000),
      itemsToSync: 0
    },
    {
      module: '매출 데이터',
      status: 'pending',
      lastSync: new Date(Date.now() - 30 * 60 * 1000),
      itemsToSync: 12
    }
  ]);
  
  const [syncing, setSyncing] = useState(false);
  
  // Simulate connection quality changes
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate occasional connection quality changes
      const random = Math.random();
      if (random > 0.95) {
        setConnectionStatus(prev => ({
          ...prev,
          quality: 'poor',
          message: '연결 상태 불안정'
        }));
      } else if (random > 0.85) {
        setConnectionStatus(prev => ({
          ...prev,
          quality: 'good',
          message: '연결 상태 양호'
        }));
      } else {
        setConnectionStatus(prev => ({
          ...prev,
          quality: 'excellent',
          message: '연결 상태 최상'
        }));
      }
    }, 10000); // Check every 10 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  const handleSync = async () => {
    setSyncing(true);
    setConnectionStatus(prev => ({
      ...prev,
      status: 'syncing',
      message: '동기화 중...'
    }));
    
    // Simulate sync process
    setTimeout(() => {
      setSyncStatuses(prev => prev.map(status => ({
        ...status,
        status: 'synced',
        lastSync: new Date(),
        itemsToSync: 0,
        progress: 100
      })));
      
      setConnectionStatus({
        status: 'connected',
        quality: 'excellent',
        lastSync: new Date(),
        message: '동기화 완료'
      });
      
      setSyncing(false);
    }, 3000);
  };
  
  const getStatusIcon = () => {
    switch (connectionStatus.status) {
      case 'connected':
        return <Wifi className="h-5 w-5" />;
      case 'disconnected':
        return <WifiOff className="h-5 w-5" />;
      case 'syncing':
        return <RefreshCw className="h-5 w-5 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-5 w-5" />;
    }
  };
  
  const getStatusColor = () => {
    switch (connectionStatus.quality) {
      case 'excellent':
        return 'text-green-600 bg-green-50';
      case 'good':
        return 'text-blue-600 bg-blue-50';
      case 'poor':
        return 'text-yellow-600 bg-yellow-50';
      case 'offline':
        return 'text-red-600 bg-red-50';
    }
  };
  
  const getQualityIndicator = () => {
    switch (connectionStatus.quality) {
      case 'excellent':
        return (
          <div className="flex space-x-0.5">
            <div className="w-1 h-3 bg-green-600 rounded-full" />
            <div className="w-1 h-3 bg-green-600 rounded-full" />
            <div className="w-1 h-3 bg-green-600 rounded-full" />
            <div className="w-1 h-3 bg-green-600 rounded-full" />
          </div>
        );
      case 'good':
        return (
          <div className="flex space-x-0.5">
            <div className="w-1 h-3 bg-blue-600 rounded-full" />
            <div className="w-1 h-3 bg-blue-600 rounded-full" />
            <div className="w-1 h-3 bg-blue-600 rounded-full" />
            <div className="w-1 h-3 bg-gray-300 rounded-full" />
          </div>
        );
      case 'poor':
        return (
          <div className="flex space-x-0.5">
            <div className="w-1 h-3 bg-yellow-600 rounded-full" />
            <div className="w-1 h-3 bg-yellow-600 rounded-full" />
            <div className="w-1 h-3 bg-gray-300 rounded-full" />
            <div className="w-1 h-3 bg-gray-300 rounded-full" />
          </div>
        );
      case 'offline':
        return (
          <div className="flex space-x-0.5">
            <div className="w-1 h-3 bg-red-600 rounded-full" />
            <div className="w-1 h-3 bg-gray-300 rounded-full" />
            <div className="w-1 h-3 bg-gray-300 rounded-full" />
            <div className="w-1 h-3 bg-gray-300 rounded-full" />
          </div>
        );
    }
  };
  
  const formatTime = (date: Date | null) => {
    if (!date) return '알 수 없음';
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}일 전`;
    if (hours > 0) return `${hours}시간 전`;
    if (minutes > 0) return `${minutes}분 전`;
    return '방금 전';
  };
  
  return (
    <div className={cn("bg-white border border-gray-200 rounded-lg shadow-sm", className)}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn("p-2 rounded-lg", getStatusColor())}>
              {getStatusIcon()}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">본사 연결 상태</h3>
              <p className="text-xs text-gray-500">{connectionStatus.message}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {getQualityIndicator()}
            <button
              onClick={handleSync}
              disabled={syncing}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {syncing ? (
                <>
                  <RefreshCw className="inline-block w-3 h-3 mr-1 animate-spin" />
                  동기화 중
                </>
              ) : (
                <>
                  <RefreshCw className="inline-block w-3 h-3 mr-1" />
                  동기화
                </>
              )}
            </button>
          </div>
        </div>
        
        {connectionStatus.lastSync && (
          <div className="mt-2 flex items-center text-xs text-gray-500">
            <Clock className="w-3 h-3 mr-1" />
            마지막 동기화: {formatTime(connectionStatus.lastSync)}
          </div>
        )}
      </div>
      
      {/* Sync Status List */}
      <div className="p-4">
        <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wider mb-3">
          모듈별 동기화 상태
        </h4>
        <div className="space-y-3">
          {syncStatuses.map((syncStatus) => (
            <div key={syncStatus.module} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  syncStatus.status === 'synced' ? 'bg-green-100' :
                  syncStatus.status === 'syncing' ? 'bg-blue-100' :
                  syncStatus.status === 'error' ? 'bg-red-100' : 'bg-gray-100'
                )}>
                  {syncStatus.status === 'synced' ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : syncStatus.status === 'syncing' ? (
                    <Activity className="w-4 h-4 text-blue-600 animate-pulse" />
                  ) : syncStatus.status === 'error' ? (
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{syncStatus.module}</p>
                  <p className="text-xs text-gray-500">
                    {syncStatus.itemsToSync && syncStatus.itemsToSync > 0 
                      ? `${syncStatus.itemsToSync}개 항목 대기 중` 
                      : formatTime(syncStatus.lastSync)}
                  </p>
                </div>
              </div>
              
              {syncStatus.status === 'syncing' && syncStatus.progress && (
                <div className="w-20">
                  <div className="bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${syncStatus.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-right">{syncStatus.progress}%</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};