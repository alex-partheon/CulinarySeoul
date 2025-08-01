import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ReportGenerator, ReportSchedule, ReportTemplate } from '@/domains/analytics/profitability/reportGenerator';
import type { ProfitabilityFilter } from '@/domains/analytics/profitability/types';
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar as CalendarIcon, Download, Send, Clock, FileText, FileSpreadsheet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { ReportPreview } from './ReportPreview';

interface ReportGeneratorPanelProps {
  className?: string;
}

interface PresetPeriod {
  label: string;
  getValue: () => { startDate: Date; endDate: Date };
}

const presetPeriods: PresetPeriod[] = [
  {
    label: '이번 달',
    getValue: () => ({ startDate: startOfMonth(new Date()), endDate: endOfMonth(new Date()) }),
  },
  {
    label: '지난 달',
    getValue: () => {
      const lastMonth = subMonths(new Date(), 1);
      return { startDate: startOfMonth(lastMonth), endDate: endOfMonth(lastMonth) };
    },
  },
  {
    label: '최근 3개월',
    getValue: () => ({ startDate: subMonths(new Date(), 3), endDate: new Date() }),
  },
  {
    label: '올해',
    getValue: () => ({ startDate: startOfYear(new Date()), endDate: endOfYear(new Date()) }),
  },
];

export function ReportGeneratorPanel({ className }: ReportGeneratorPanelProps) {
  const [activeTab, setActiveTab] = useState<'instant' | 'schedule'>('instant');
  const [filters, setFilters] = useState<ProfitabilityFilter>({
    startDate: startOfMonth(new Date()).toISOString(),
    endDate: endOfMonth(new Date()).toISOString(),
  });
  const [format, setFormat] = useState<'pdf' | 'excel' | 'both'>('pdf');
  const [template, setTemplate] = useState<string>('executive');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewData, setPreviewData] = useState<{ pdf?: Blob; excel?: Blob } | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Schedule state
  const [schedule, setSchedule] = useState<ReportSchedule>({
    frequency: 'monthly',
    time: '09:00',
    format: 'pdf',
    template: 'executive',
  });
  const [recipients, setRecipients] = useState<string>('');
  const [scheduleEnabled, setScheduleEnabled] = useState(false);

  const reportGenerator = new ReportGenerator();
  const templates = reportGenerator.getReportTemplates();

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const reports = await reportGenerator.generatePLReport(filters, format);
      setPreviewData(reports);
      setShowPreview(true);
      toast.success('보고서가 생성되었습니다.');
    } catch (error) {
      console.error('Failed to generate report:', error);
      toast.error('보고서 생성에 실패했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleScheduleReport = async () => {
    if (!recipients.trim()) {
      toast.error('수신자 이메일을 입력해주세요.');
      return;
    }

    const scheduleConfig: ReportSchedule = {
      ...schedule,
      recipients: recipients.split(',').map(email => email.trim()),
    };

    try {
      const scheduleId = await reportGenerator.scheduleReportGeneration(scheduleConfig);
      toast.success('보고서 예약이 설정되었습니다.');
      setScheduleEnabled(true);
    } catch (error) {
      console.error('Failed to schedule report:', error);
      toast.error('보고서 예약 설정에 실패했습니다.');
    }
  };

  const handlePresetPeriod = (preset: PresetPeriod) => {
    const { startDate, endDate } = preset.getValue();
    setFilters({
      ...filters,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
  };

  const selectedTemplate = templates.find(t => t.id === template);

  return (
    <>
      <Card className={className}>
        <CardHeader>
          <CardTitle>손익 보고서 생성</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'instant' | 'schedule')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="instant">즉시 생성</TabsTrigger>
              <TabsTrigger value="schedule">예약 생성</TabsTrigger>
            </TabsList>

            <TabsContent value="instant" className="space-y-4">
              {/* Period Selection */}
              <div className="space-y-2">
                <Label>기간 선택</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {presetPeriods.map((preset) => (
                    <Button
                      key={preset.label}
                      variant="outline"
                      size="sm"
                      onClick={() => handlePresetPeriod(preset)}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !filters.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.startDate
                          ? format(new Date(filters.startDate), 'yyyy-MM-dd')
                          : '시작일'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filters.startDate ? new Date(filters.startDate) : undefined}
                        onSelect={(date) => date && setFilters({ ...filters, startDate: date.toISOString() })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !filters.endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.endDate
                          ? format(new Date(filters.endDate), 'yyyy-MM-dd')
                          : '종료일'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filters.endDate ? new Date(filters.endDate) : undefined}
                        onSelect={(date) => date && setFilters({ ...filters, endDate: date.toISOString() })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Report Type Selection */}
              <div className="space-y-2">
                <Label>보고서 템플릿</Label>
                <Select value={template} onValueChange={setTemplate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span>{t.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTemplate && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {selectedTemplate.sections.length}개 섹션 포함
                  </div>
                )}
              </div>

              {/* Format Selection */}
              <div className="space-y-2">
                <Label>파일 형식</Label>
                <Select value={format} onValueChange={(v) => setFormat(v as 'pdf' | 'excel' | 'both')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>PDF</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="excel">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4" />
                        <span>Excel</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="both">
                      <div className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        <span>PDF + Excel</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>브랜드 필터</Label>
                  <Select
                    value={filters.brandId || 'all'}
                    onValueChange={(v) => setFilters({ ...filters, brandId: v === 'all' ? undefined : v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체 브랜드</SelectItem>
                      <SelectItem value="brand1">밀랍</SelectItem>
                      <SelectItem value="brand2">숙성방</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>매장 필터</Label>
                  <Select
                    value={filters.storeId || 'all'}
                    onValueChange={(v) => setFilters({ ...filters, storeId: v === 'all' ? undefined : v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체 매장</SelectItem>
                      <SelectItem value="store1">성수점</SelectItem>
                      <SelectItem value="store2">강남점</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Generate Button */}
              <Button
                className="w-full"
                onClick={handleGenerateReport}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    생성 중...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    보고서 생성
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4">
              {/* Schedule Frequency */}
              <div className="space-y-2">
                <Label>생성 주기</Label>
                <Select
                  value={schedule.frequency}
                  onValueChange={(v) => setSchedule({ ...schedule, frequency: v as 'daily' | 'weekly' | 'monthly' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">매일</SelectItem>
                    <SelectItem value="weekly">매주</SelectItem>
                    <SelectItem value="monthly">매월</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Schedule Time */}
              <div className="space-y-2">
                <Label>생성 시간</Label>
                <Input
                  type="time"
                  value={schedule.time}
                  onChange={(e) => setSchedule({ ...schedule, time: e.target.value })}
                />
              </div>

              {/* Day Selection for Weekly/Monthly */}
              {schedule.frequency === 'weekly' && (
                <div className="space-y-2">
                  <Label>요일 선택</Label>
                  <Select
                    value={schedule.dayOfWeek?.toString() || '1'}
                    onValueChange={(v) => setSchedule({ ...schedule, dayOfWeek: parseInt(v) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">일요일</SelectItem>
                      <SelectItem value="1">월요일</SelectItem>
                      <SelectItem value="2">화요일</SelectItem>
                      <SelectItem value="3">수요일</SelectItem>
                      <SelectItem value="4">목요일</SelectItem>
                      <SelectItem value="5">금요일</SelectItem>
                      <SelectItem value="6">토요일</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {schedule.frequency === 'monthly' && (
                <div className="space-y-2">
                  <Label>날짜 선택</Label>
                  <Select
                    value={schedule.dayOfMonth?.toString() || '1'}
                    onValueChange={(v) => setSchedule({ ...schedule, dayOfMonth: parseInt(v) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                        <SelectItem key={day} value={day.toString()}>
                          {day}일
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Template and Format */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>템플릿</Label>
                  <Select
                    value={schedule.template}
                    onValueChange={(v) => setSchedule({ ...schedule, template: v as 'executive' | 'detailed' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>파일 형식</Label>
                  <Select
                    value={schedule.format}
                    onValueChange={(v) => setSchedule({ ...schedule, format: v as 'pdf' | 'excel' | 'both' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="both">PDF + Excel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Recipients */}
              <div className="space-y-2">
                <Label>수신자 이메일</Label>
                <Textarea
                  placeholder="example@company.com, manager@company.com"
                  value={recipients}
                  onChange={(e) => setRecipients(e.target.value)}
                  rows={3}
                />
                <p className="text-sm text-muted-foreground">
                  쉼표로 구분하여 여러 이메일을 입력할 수 있습니다.
                </p>
              </div>

              {/* Enable Schedule */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="schedule-enabled"
                  checked={scheduleEnabled}
                  onCheckedChange={setScheduleEnabled}
                />
                <Label htmlFor="schedule-enabled">예약 활성화</Label>
              </div>

              {/* Schedule Button */}
              <Button
                className="w-full"
                onClick={handleScheduleReport}
                disabled={!scheduleEnabled || !recipients.trim()}
              >
                <Send className="mr-2 h-4 w-4" />
                예약 설정
              </Button>

              {scheduleEnabled && (
                <div className="rounded-lg bg-muted p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">예약 설정 완료</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {schedule.frequency === 'daily' && '매일'}
                    {schedule.frequency === 'weekly' && `매주 ${['일', '월', '화', '수', '목', '금', '토'][schedule.dayOfWeek || 1]}요일`}
                    {schedule.frequency === 'monthly' && `매월 ${schedule.dayOfMonth || 1}일`}
                    &nbsp;{schedule.time}에 보고서가 생성되어 이메일로 발송됩니다.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Report Preview Dialog */}
      {showPreview && previewData && (
        <ReportPreview
          data={previewData}
          format={format}
          onClose={() => {
            setShowPreview(false);
            setPreviewData(null);
          }}
        />
      )}
    </>
  );
}