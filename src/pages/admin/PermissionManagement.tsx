import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { permissionService } from '../../services/permissionService';
import { PermissionGuard } from '../../components/auth/PermissionGuard';
import { DashboardSwitcher } from '../../components/dashboard/DashboardSwitcher';
import { 
  Users, 
  Shield, 
  Settings, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { UserPermissions, DashboardSession, PermissionAuditLog } from '../../types/database';

interface UserPermissionData {
  userId: string;
  email: string;
  name: string;
  permissions: UserPermissions;
  lastActivity: string;
  status: 'active' | 'inactive' | 'suspended';
}

export function PermissionManagement() {
  const { user, userPermissions } = useAuth();
  const [users, setUsers] = useState<UserPermissionData[]>([]);
  const [auditLogs, setAuditLogs] = useState<PermissionAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserPermissionData | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');
  const [activeTab, setActiveTab] = useState<'users' | 'audit'>('users');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // 실제 구현에서는 API 호출
      // const usersData = await permissionService.getAllUserPermissions();
      // const auditData = await permissionService.getAuditLogs();
      
      // 임시 데이터
      setUsers([
        {
          userId: '1',
          email: 'admin@culinaryseoul.com',
          name: '관리자',
          permissions: {
            canAccessCompanyDashboard: true,
            canAccessBrandDashboard: true,
            companyDashboardPermissions: {
              role: 'admin',
              permissions: ['read', 'write', 'delete', 'admin']
            },
            brandDashboardPermissions: {
              'millab': {
                role: 'admin',
                permissions: ['read', 'write', 'delete', 'admin']
              }
            },
            crossPlatformAccess: {
              allowedBrands: ['millab'],
              restrictions: []
            },
            hybridPermissions: {
              canSwitchDashboards: true,
              brandSwitchingEnabled: true,
              sessionTimeout: 3600,
              auditLoggingEnabled: true,
              permissionCacheEnabled: true
            }
          },
          lastActivity: new Date().toISOString(),
          status: 'active'
        }
      ]);

      setAuditLogs([
        {
          id: '1',
          userId: '1',
          action: 'dashboard_switch',
          fromDashboard: 'company',
          toDashboard: 'brand',
          brandContext: 'millab',
          reason: '사용자 요청',
          timestamp: new Date().toISOString(),
          ipAddress: '192.168.1.1',
          userAgent: 'Mozilla/5.0...',
          sessionId: 'session_123'
        }
      ]);
    } catch (error) {
      console.error('데이터 로드 오류:', error);
      toast.error('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleEditUser = (user: UserPermissionData) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('정말로 이 사용자의 권한을 삭제하시겠습니까?')) {
      return;
    }

    try {
      // await permissionService.deleteUserPermissions(userId);
      toast.success('사용자 권한이 삭제되었습니다.');
      loadData();
    } catch (error) {
      console.error('사용자 삭제 오류:', error);
      toast.error('사용자 삭제 중 오류가 발생했습니다.');
    }
  };

  const exportAuditLogs = () => {
    const csv = [
      ['시간', '사용자', '액션', '이전 대시보드', '이후 대시보드', '브랜드', '사유', 'IP 주소'].join(','),
      ...auditLogs.map(log => [
        new Date(log.timestamp).toLocaleString(),
        log.userId,
        log.action,
        log.fromDashboard || '',
        log.toDashboard || '',
        log.brandContext || '',
        log.reason || '',
        log.ipAddress || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <PermissionGuard
      requiredPermissions={['admin']}
      dashboardType="company"
      showError={true}
    >
      <div className="min-h-screen bg-gray-50">
        {/* 헤더 */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Shield className="w-8 h-8 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900">권한 관리</h1>
              </div>
              <DashboardSwitcher />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 탭 네비게이션 */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('users')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'users'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Users className="w-4 h-4 inline mr-2" />
                  사용자 권한
                </button>
                <button
                  onClick={() => setActiveTab('audit')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'audit'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Eye className="w-4 h-4 inline mr-2" />
                  감사 로그
                </button>
              </nav>
            </div>
          </div>

          {/* 사용자 권한 탭 */}
          {activeTab === 'users' && (
            <div>
              {/* 검색 및 필터 */}
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="사용자 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">모든 상태</option>
                    <option value="active">활성</option>
                    <option value="inactive">비활성</option>
                    <option value="suspended">정지</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={loadData}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>새로고침</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUser(null);
                      setShowUserModal(true);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>사용자 추가</span>
                  </button>
                </div>
              </div>

              {/* 사용자 목록 */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        사용자
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        권한
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        상태
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        마지막 활동
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        작업
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.userId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {user.permissions.canAccessCompanyDashboard && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                회사
                              </span>
                            )}
                            {user.permissions.canAccessBrandDashboard && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                브랜드
                              </span>
                            )}
                            {user.permissions.companyDashboardPermissions?.role === 'admin' && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                관리자
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.status === 'active' ? 'bg-green-100 text-green-800' :
                            user.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {user.status === 'active' ? '활성' :
                             user.status === 'inactive' ? '비활성' : '정지'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.lastActivity).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.userId)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 감사 로그 탭 */}
          {activeTab === 'audit' && (
            <div>
              {/* 액션 버튼 */}
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">권한 변경 이력</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={loadData}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>새로고침</span>
                  </button>
                  <button
                    onClick={exportAuditLogs}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>CSV 내보내기</span>
                  </button>
                </div>
              </div>

              {/* 감사 로그 목록 */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        시간
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        사용자
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        액션
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        변경 내용
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        사유
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IP 주소
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {log.userId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            log.action === 'dashboard_switch' ? 'bg-blue-100 text-blue-800' :
                            log.action === 'permission_change' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {log.action === 'dashboard_switch' ? '대시보드 전환' :
                             log.action === 'permission_change' ? '권한 변경' : log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {log.fromDashboard && log.toDashboard ? (
                            <span>
                              {log.fromDashboard} → {log.toDashboard}
                              {log.brandContext && ` (${log.brandContext})`}
                            </span>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {log.reason || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {log.ipAddress || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </PermissionGuard>
  );
}

export default PermissionManagement;