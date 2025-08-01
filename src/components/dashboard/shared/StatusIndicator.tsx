import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { 
  Wifi, 
  WifiOff, 
  Server, 
  Database, 
  Activity,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';

interface SystemStatus {
  name: string;
  status: 'online' | 'offline' | 'warning' | 'error';
  latency?: number;
  uptime?: number;
  description?: string;
}

interface StatusIndicatorProps {
  connectionStatus: 'online' | 'offline' | 'connecting';
  systemStatuses?: SystemStatus[];
  showDetails?: boolean;
  variant?: 'compact' | 'detailed';
  onRefresh?: () => void;
}

export function StatusIndicator({
  connectionStatus,
  systemStatuses = [],
  showDetails = true,
  variant = 'detailed',
  onRefresh
}: StatusIndicatorProps) {
  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'online':
        return <Wifi className="h-4 w-4" />;
      case 'offline':
        return <WifiOff className="h-4 w-4" />;
      case 'connecting':
        return <RefreshCw className="h-4 w-4 animate-spin" />;
    }
  };

  const getConnectionColor = () => {
    switch (connectionStatus) {
      case 'online':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'offline':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'connecting':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const getConnectionText = () => {
    switch (connectionStatus) {
      case 'online':
        return '온라인';
      case 'offline':
        return '오프라인';
      case 'connecting':
        return '연결 중...';
    }
  };

  const getStatusIcon = (status: SystemStatus['status']) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'offline':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getSystemIcon = (name: string) => {
    if (name.toLowerCase().includes('server')) return Server;
    if (name.toLowerCase().includes('database')) return Database;
    return Activity;
  };

  const calculateOverallHealth = () => {
    if (systemStatuses.length === 0) return 100;
    const onlineCount = systemStatuses.filter(s => s.status === 'online').length;
    return Math.round((onlineCount / systemStatuses.length) * 100);
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3">
        <Badge
          variant="outline"
          className={cn("flex items-center gap-1.5", getConnectionColor())}
        >
          {getConnectionIcon()}
          {getConnectionText()}
        </Badge>
        {showDetails && systemStatuses.length > 0 && (
          <Badge variant="secondary" className="text-xs">
            시스템 상태: {calculateOverallHealth()}%
          </Badge>
        )}
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <RefreshCw className="h-3 w-3 text-gray-600" />
          </button>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-full",
                connectionStatus === 'online' ? "bg-green-100" :
                connectionStatus === 'offline' ? "bg-red-100" :
                "bg-yellow-100"
              )}>
                {getConnectionIcon()}
              </div>
              <div>
                <p className="text-sm font-medium">네트워크 연결</p>
                <p className="text-xs text-gray-600">{getConnectionText()}</p>
              </div>
            </div>
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RefreshCw className="h-4 w-4 text-gray-600" />
              </button>
            )}
          </div>

          {/* System Health */}
          {showDetails && systemStatuses.length > 0 && (
            <>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">시스템 상태</p>
                  <span className="text-sm text-gray-600">
                    {calculateOverallHealth()}% 정상
                  </span>
                </div>
                <Progress value={calculateOverallHealth()} className="h-2 mb-4" />
                
                <div className="space-y-2">
                  {systemStatuses.map((system, index) => {
                    const SystemIcon = getSystemIcon(system.name);
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded-lg bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <SystemIcon className="h-4 w-4 text-gray-600" />
                          <div>
                            <p className="text-xs font-medium">{system.name}</p>
                            {system.description && (
                              <p className="text-xs text-gray-500">{system.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {system.latency && (
                            <span className="text-xs text-gray-500">
                              {system.latency}ms
                            </span>
                          )}
                          {getStatusIcon(system.status)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}