import { ProfitabilityService } from './profitabilityService';
import type { ProfitabilityFilter, ProfitabilityReport } from './types';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { ko } from 'date-fns/locale';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Chart } from 'chart.js/auto';

// Extend jsPDF type for autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => void;
  }
}

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string; // HH:mm format
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  recipients?: string[];
  format: 'pdf' | 'excel' | 'both';
  template: 'executive' | 'detailed' | 'custom';
}

export interface ReportTemplate {
  id: string;
  name: string;
  sections: ReportSection[];
  style: ReportStyle;
}

export interface ReportSection {
  type: 'summary' | 'chart' | 'table' | 'analysis' | 'comparison';
  title: string;
  config: any;
}

export interface ReportStyle {
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
  logoUrl?: string;
}

export class ReportGenerator {
  private profitabilityService: ProfitabilityService;
  private schedules: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.profitabilityService = new ProfitabilityService();
  }

  async generatePLReport(
    filters: ProfitabilityFilter,
    format: 'pdf' | 'excel' | 'both'
  ): Promise<{ pdf?: Blob; excel?: Blob }> {
    const data = await this.profitabilityService.getProfitabilityReport(filters);
    const result: { pdf?: Blob; excel?: Blob } = {};

    if (format === 'pdf' || format === 'both') {
      result.pdf = await this.exportToPDF(data);
    }

    if (format === 'excel' || format === 'both') {
      result.excel = await this.exportToExcel(data);
    }

    return result;
  }

  generateExecutiveSummary(data: ProfitabilityReport): string {
    const { summary, trends, recommendations } = data;
    const profitMargin = ((summary.netProfit / summary.totalRevenue) * 100).toFixed(1);
    const revenueGrowth = trends.revenue[trends.revenue.length - 1]?.growth?.toFixed(1) || '0';

    return `
경영진 요약 보고서
==================

기간: ${format(new Date(data.filters.startDate), 'yyyy년 MM월 dd일', { locale: ko })} - ${format(new Date(data.filters.endDate), 'yyyy년 MM월 dd일', { locale: ko })}

주요 성과 지표:
- 총 매출: ₩${summary.totalRevenue.toLocaleString('ko-KR')}
- 순이익: ₩${summary.netProfit.toLocaleString('ko-KR')}
- 이익률: ${profitMargin}%
- 매출 성장률: ${revenueGrowth}%

주요 인사이트:
${recommendations.slice(0, 3).map((r, i) => `${i + 1}. ${r}`).join('\n')}

상위 수익 제품:
${data.topProducts.slice(0, 5).map((p, i) => 
  `${i + 1}. ${p.name}: ₩${p.revenue.toLocaleString('ko-KR')} (이익률: ${p.profitMargin.toFixed(1)}%)`
).join('\n')}
    `.trim();
  }

  generateDetailedAnalysis(data: ProfitabilityReport): string {
    const { summary, breakdown, trends, recommendations } = data;

    return `
상세 손익 분석 보고서
====================

1. 수익 구조 분석
-----------------
총 매출: ₩${summary.totalRevenue.toLocaleString('ko-KR')}
- 제품 판매: ₩${breakdown.revenue.productSales.toLocaleString('ko-KR')}
- 배달 수수료: ₩${breakdown.revenue.deliveryFees.toLocaleString('ko-KR')}
- 기타 수익: ₩${breakdown.revenue.otherIncome.toLocaleString('ko-KR')}

2. 비용 구조 분석
-----------------
총 비용: ₩${summary.totalCosts.toLocaleString('ko-KR')}
- 원재료비: ₩${breakdown.costs.ingredients.toLocaleString('ko-KR')} (${((breakdown.costs.ingredients / summary.totalCosts) * 100).toFixed(1)}%)
- 인건비: ₩${breakdown.costs.labor.toLocaleString('ko-KR')} (${((breakdown.costs.labor / summary.totalCosts) * 100).toFixed(1)}%)
- 임대료: ₩${breakdown.costs.rent.toLocaleString('ko-KR')} (${((breakdown.costs.rent / summary.totalCosts) * 100).toFixed(1)}%)
- 운영비: ₩${breakdown.costs.operations.toLocaleString('ko-KR')} (${((breakdown.costs.operations / summary.totalCosts) * 100).toFixed(1)}%)
- 마케팅: ₩${breakdown.costs.marketing.toLocaleString('ko-KR')} (${((breakdown.costs.marketing / summary.totalCosts) * 100).toFixed(1)}%)
- 기타: ₩${breakdown.costs.other.toLocaleString('ko-KR')} (${((breakdown.costs.other / summary.totalCosts) * 100).toFixed(1)}%)

3. 수익성 지표
--------------
- 매출총이익: ₩${summary.grossProfit.toLocaleString('ko-KR')}
- 매출총이익률: ${summary.grossMargin.toFixed(1)}%
- 영업이익: ₩${summary.operatingProfit.toLocaleString('ko-KR')}
- 영업이익률: ${summary.operatingMargin.toFixed(1)}%
- 순이익: ₩${summary.netProfit.toLocaleString('ko-KR')}
- 순이익률: ${summary.netMargin.toFixed(1)}%

4. 추세 분석
------------
${trends.revenue.slice(-5).map(t => 
  `${format(new Date(t.date), 'MM/dd')}: ₩${t.amount.toLocaleString('ko-KR')} (${t.growth > 0 ? '+' : ''}${t.growth.toFixed(1)}%)`
).join('\n')}

5. 개선 권장사항
----------------
${recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}
    `.trim();
  }

  async scheduleReportGeneration(schedule: ReportSchedule): Promise<string> {
    const scheduleId = `schedule_${Date.now()}`;
    
    // Clear existing schedule if any
    if (this.schedules.has(scheduleId)) {
      clearInterval(this.schedules.get(scheduleId)!);
    }

    const executeReport = async () => {
      const now = new Date();
      let startDate: Date;
      let endDate: Date;

      switch (schedule.frequency) {
        case 'daily':
          startDate = startOfDay(now);
          endDate = endOfDay(now);
          break;
        case 'weekly':
          startDate = startOfWeek(now, { locale: ko });
          endDate = endOfWeek(now, { locale: ko });
          break;
        case 'monthly':
          startDate = startOfMonth(now);
          endDate = endOfMonth(now);
          break;
      }

      const filters: ProfitabilityFilter = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      const reports = await this.generatePLReport(filters, schedule.format);
      
      // Here you would implement email delivery
      // For now, we'll just log
      console.log('Report generated:', {
        scheduleId,
        format: schedule.format,
        recipients: schedule.recipients,
        reports
      });
    };

    // Calculate interval based on frequency
    let interval: number;
    switch (schedule.frequency) {
      case 'daily':
        interval = 24 * 60 * 60 * 1000; // 24 hours
        break;
      case 'weekly':
        interval = 7 * 24 * 60 * 60 * 1000; // 7 days
        break;
      case 'monthly':
        interval = 30 * 24 * 60 * 60 * 1000; // 30 days
        break;
    }

    const timeout = setInterval(executeReport, interval);
    this.schedules.set(scheduleId, timeout);

    // Execute immediately if needed
    await executeReport();

    return scheduleId;
  }

  cancelSchedule(scheduleId: string): void {
    if (this.schedules.has(scheduleId)) {
      clearInterval(this.schedules.get(scheduleId)!);
      this.schedules.delete(scheduleId);
    }
  }

  async exportToExcel(data: ProfitabilityReport): Promise<Blob> {
    const workbook = XLSX.utils.book_new();

    // Summary Sheet
    const summaryData = [
      ['손익 요약 보고서'],
      ['기간', `${format(new Date(data.filters.startDate), 'yyyy-MM-dd')} ~ ${format(new Date(data.filters.endDate), 'yyyy-MM-dd')}`],
      [],
      ['항목', '금액 (₩)', '비율 (%)'],
      ['총 매출', data.summary.totalRevenue, '100.0'],
      ['총 비용', data.summary.totalCosts, ((data.summary.totalCosts / data.summary.totalRevenue) * 100).toFixed(1)],
      ['매출총이익', data.summary.grossProfit, data.summary.grossMargin.toFixed(1)],
      ['영업이익', data.summary.operatingProfit, data.summary.operatingMargin.toFixed(1)],
      ['순이익', data.summary.netProfit, data.summary.netMargin.toFixed(1)],
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, '요약');

    // Revenue Breakdown Sheet
    const revenueData = [
      ['수익 상세'],
      [],
      ['구분', '금액 (₩)', '비율 (%)'],
      ['제품 판매', data.breakdown.revenue.productSales, ((data.breakdown.revenue.productSales / data.summary.totalRevenue) * 100).toFixed(1)],
      ['배달 수수료', data.breakdown.revenue.deliveryFees, ((data.breakdown.revenue.deliveryFees / data.summary.totalRevenue) * 100).toFixed(1)],
      ['기타 수익', data.breakdown.revenue.otherIncome, ((data.breakdown.revenue.otherIncome / data.summary.totalRevenue) * 100).toFixed(1)],
    ];
    const revenueSheet = XLSX.utils.aoa_to_sheet(revenueData);
    XLSX.utils.book_append_sheet(workbook, revenueSheet, '수익');

    // Cost Breakdown Sheet
    const costData = [
      ['비용 상세'],
      [],
      ['구분', '금액 (₩)', '비율 (%)'],
      ['원재료비', data.breakdown.costs.ingredients, ((data.breakdown.costs.ingredients / data.summary.totalCosts) * 100).toFixed(1)],
      ['인건비', data.breakdown.costs.labor, ((data.breakdown.costs.labor / data.summary.totalCosts) * 100).toFixed(1)],
      ['임대료', data.breakdown.costs.rent, ((data.breakdown.costs.rent / data.summary.totalCosts) * 100).toFixed(1)],
      ['운영비', data.breakdown.costs.operations, ((data.breakdown.costs.operations / data.summary.totalCosts) * 100).toFixed(1)],
      ['마케팅', data.breakdown.costs.marketing, ((data.breakdown.costs.marketing / data.summary.totalCosts) * 100).toFixed(1)],
      ['기타', data.breakdown.costs.other, ((data.breakdown.costs.other / data.summary.totalCosts) * 100).toFixed(1)],
    ];
    const costSheet = XLSX.utils.aoa_to_sheet(costData);
    XLSX.utils.book_append_sheet(workbook, costSheet, '비용');

    // Top Products Sheet
    const productData = [
      ['상위 수익 제품'],
      [],
      ['제품명', '판매량', '매출 (₩)', '비용 (₩)', '이익 (₩)', '이익률 (%)'],
      ...data.topProducts.map(p => [
        p.name,
        p.quantity,
        p.revenue,
        p.costs,
        p.profit,
        p.profitMargin.toFixed(1)
      ])
    ];
    const productSheet = XLSX.utils.aoa_to_sheet(productData);
    XLSX.utils.book_append_sheet(workbook, productSheet, '제품별');

    // Trends Sheet
    const trendData = [
      ['추세 분석'],
      [],
      ['날짜', '매출 (₩)', '비용 (₩)', '이익 (₩)', '성장률 (%)'],
      ...data.trends.revenue.map((t, i) => [
        format(new Date(t.date), 'yyyy-MM-dd'),
        t.amount,
        data.trends.costs[i]?.amount || 0,
        data.trends.profit[i]?.amount || 0,
        t.growth.toFixed(1)
      ])
    ];
    const trendSheet = XLSX.utils.aoa_to_sheet(trendData);
    XLSX.utils.book_append_sheet(workbook, trendSheet, '추세');

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  async exportToPDF(data: ProfitabilityReport): Promise<Blob> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPos = 20;

    // Add custom font for Korean support
    // In production, you would load a Korean font file
    // pdf.addFont('NotoSansKR-Regular.ttf', 'NotoSansKR', 'normal');
    // pdf.setFont('NotoSansKR');

    // Title
    pdf.setFontSize(20);
    pdf.text('손익 분석 보고서', pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    // Period
    pdf.setFontSize(12);
    pdf.text(
      `기간: ${format(new Date(data.filters.startDate), 'yyyy년 MM월 dd일')} - ${format(new Date(data.filters.endDate), 'yyyy년 MM월 dd일')}`,
      pageWidth / 2,
      yPos,
      { align: 'center' }
    );
    yPos += 20;

    // Summary Table
    pdf.setFontSize(14);
    pdf.text('요약', 14, yPos);
    yPos += 10;

    const summaryTableData = [
      ['항목', '금액', '비율'],
      ['총 매출', `₩${data.summary.totalRevenue.toLocaleString('ko-KR')}`, '100.0%'],
      ['총 비용', `₩${data.summary.totalCosts.toLocaleString('ko-KR')}`, `${((data.summary.totalCosts / data.summary.totalRevenue) * 100).toFixed(1)}%`],
      ['매출총이익', `₩${data.summary.grossProfit.toLocaleString('ko-KR')}`, `${data.summary.grossMargin.toFixed(1)}%`],
      ['영업이익', `₩${data.summary.operatingProfit.toLocaleString('ko-KR')}`, `${data.summary.operatingMargin.toFixed(1)}%`],
      ['순이익', `₩${data.summary.netProfit.toLocaleString('ko-KR')}`, `${data.summary.netMargin.toFixed(1)}%`],
    ];

    pdf.autoTable({
      startY: yPos,
      head: [summaryTableData[0]],
      body: summaryTableData.slice(1),
      theme: 'grid',
      styles: { font: 'helvetica', fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    yPos = (pdf as any).lastAutoTable.finalY + 20;

    // Check if we need a new page
    if (yPos > pageHeight - 50) {
      pdf.addPage();
      yPos = 20;
    }

    // Cost Breakdown
    pdf.setFontSize(14);
    pdf.text('비용 구조', 14, yPos);
    yPos += 10;

    const costTableData = [
      ['구분', '금액', '비율'],
      ['원재료비', `₩${data.breakdown.costs.ingredients.toLocaleString('ko-KR')}`, `${((data.breakdown.costs.ingredients / data.summary.totalCosts) * 100).toFixed(1)}%`],
      ['인건비', `₩${data.breakdown.costs.labor.toLocaleString('ko-KR')}`, `${((data.breakdown.costs.labor / data.summary.totalCosts) * 100).toFixed(1)}%`],
      ['임대료', `₩${data.breakdown.costs.rent.toLocaleString('ko-KR')}`, `${((data.breakdown.costs.rent / data.summary.totalCosts) * 100).toFixed(1)}%`],
      ['운영비', `₩${data.breakdown.costs.operations.toLocaleString('ko-KR')}`, `${((data.breakdown.costs.operations / data.summary.totalCosts) * 100).toFixed(1)}%`],
      ['마케팅', `₩${data.breakdown.costs.marketing.toLocaleString('ko-KR')}`, `${((data.breakdown.costs.marketing / data.summary.totalCosts) * 100).toFixed(1)}%`],
      ['기타', `₩${data.breakdown.costs.other.toLocaleString('ko-KR')}`, `${((data.breakdown.costs.other / data.summary.totalCosts) * 100).toFixed(1)}%`],
    ];

    pdf.autoTable({
      startY: yPos,
      head: [costTableData[0]],
      body: costTableData.slice(1),
      theme: 'grid',
      styles: { font: 'helvetica', fontSize: 10 },
      headStyles: { fillColor: [231, 76, 60] },
    });

    yPos = (pdf as any).lastAutoTable.finalY + 20;

    // Check if we need a new page
    if (yPos > pageHeight - 80) {
      pdf.addPage();
      yPos = 20;
    }

    // Top Products
    pdf.setFontSize(14);
    pdf.text('상위 수익 제품', 14, yPos);
    yPos += 10;

    const productTableData = [
      ['제품명', '매출', '이익', '이익률'],
      ...data.topProducts.slice(0, 10).map(p => [
        p.name,
        `₩${p.revenue.toLocaleString('ko-KR')}`,
        `₩${p.profit.toLocaleString('ko-KR')}`,
        `${p.profitMargin.toFixed(1)}%`
      ])
    ];

    pdf.autoTable({
      startY: yPos,
      head: [productTableData[0]],
      body: productTableData.slice(1),
      theme: 'grid',
      styles: { font: 'helvetica', fontSize: 10 },
      headStyles: { fillColor: [46, 204, 113] },
    });

    // Add recommendations on new page
    pdf.addPage();
    yPos = 20;

    pdf.setFontSize(14);
    pdf.text('개선 권장사항', 14, yPos);
    yPos += 10;

    pdf.setFontSize(10);
    data.recommendations.forEach((rec, index) => {
      const lines = pdf.splitTextToSize(`${index + 1}. ${rec}`, pageWidth - 28);
      pdf.text(lines, 14, yPos);
      yPos += lines.length * 5 + 5;

      if (yPos > pageHeight - 20) {
        pdf.addPage();
        yPos = 20;
      }
    });

    // Generate PDF blob
    return pdf.output('blob');
  }

  // Helper method to create charts for PDF
  private async createChartImage(chartConfig: any): Promise<string> {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 400;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to create canvas context');

    const chart = new Chart(ctx, chartConfig);
    
    // Wait for chart to render
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const imageData = canvas.toDataURL('image/png');
    chart.destroy();
    
    return imageData;
  }

  // Get available report templates
  getReportTemplates(): ReportTemplate[] {
    return [
      {
        id: 'executive',
        name: '경영진 요약',
        sections: [
          { type: 'summary', title: '핵심 지표', config: { metrics: ['revenue', 'profit', 'margin'] } },
          { type: 'chart', title: '추세 차트', config: { chartType: 'line', period: 'monthly' } },
          { type: 'analysis', title: '주요 인사이트', config: { count: 3 } },
        ],
        style: {
          primaryColor: '#2563eb',
          accentColor: '#3b82f6',
          fontFamily: 'Noto Sans KR',
        },
      },
      {
        id: 'detailed',
        name: '상세 분석',
        sections: [
          { type: 'summary', title: '손익 요약', config: { metrics: 'all' } },
          { type: 'table', title: '수익 구조', config: { breakdown: 'revenue' } },
          { type: 'table', title: '비용 구조', config: { breakdown: 'costs' } },
          { type: 'chart', title: '추세 분석', config: { chartType: 'combo', metrics: ['revenue', 'costs', 'profit'] } },
          { type: 'table', title: '제품별 수익성', config: { limit: 20 } },
          { type: 'comparison', title: '전기 대비', config: { periods: 2 } },
          { type: 'analysis', title: '개선 사항', config: { detailed: true } },
        ],
        style: {
          primaryColor: '#1e40af',
          accentColor: '#2563eb',
          fontFamily: 'Noto Sans KR',
        },
      },
    ];
  }
}