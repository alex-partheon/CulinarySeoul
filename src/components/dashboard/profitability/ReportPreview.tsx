import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, FileText, FileSpreadsheet, Share2, Mail, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ReportPreviewProps {
  data: {
    pdf?: Blob;
    excel?: Blob;
  };
  format: 'pdf' | 'excel' | 'both';
  onClose: () => void;
}

export function ReportPreview({ data, format, onClose }: ReportPreviewProps) {
  const [activeTab, setActiveTab] = useState<'pdf' | 'excel'>(
    format === 'excel' ? 'excel' : 'pdf'
  );
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    // Create object URL for PDF preview
    if (data.pdf) {
      const url = URL.createObjectURL(data.pdf);
      setPdfUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [data.pdf]);

  const handleDownload = (type: 'pdf' | 'excel') => {
    const blob = type === 'pdf' ? data.pdf : data.excel;
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `손익보고서_${new Date().toISOString().split('T')[0]}.${type === 'pdf' ? 'pdf' : 'xlsx'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`${type.toUpperCase()} 파일이 다운로드되었습니다.`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const files: File[] = [];
        if (data.pdf) {
          files.push(new File([data.pdf], `손익보고서_${new Date().toISOString().split('T')[0]}.pdf`, { type: 'application/pdf' }));
        }
        if (data.excel) {
          files.push(new File([data.excel], `손익보고서_${new Date().toISOString().split('T')[0]}.xlsx`, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
        }

        await navigator.share({
          title: '손익 분석 보고서',
          text: '손익 분석 보고서를 공유합니다.',
          files,
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      toast.error('이 브라우저는 공유 기능을 지원하지 않습니다.');
    }
  };

  const handleEmail = () => {
    // In a real application, this would open an email composer
    // or trigger a backend email service
    toast.success('이메일 발송 기능은 공 중입니다.');
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>보고서 미리보기</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {format === 'both' ? (
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'pdf' | 'excel')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pdf">
                  <FileText className="mr-2 h-4 w-4" />
                  PDF
                </TabsTrigger>
                <TabsTrigger value="excel">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Excel
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pdf" className="h-full mt-4">
                <div className="h-[calc(80vh-200px)] rounded-lg border bg-muted/50 overflow-hidden">
                  {pdfUrl ? (
                    <iframe
                      src={pdfUrl}
                      className="w-full h-full"
                      title="PDF Preview"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      PDF 미리보기를 사용할 수 없습니다.
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="excel" className="h-full mt-4">
                <div className="h-[calc(80vh-200px)] rounded-lg border bg-muted/50 flex items-center justify-center">
                  <div className="text-center">
                    <FileSpreadsheet className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Excel 파일은 미리보기가 지원되지 않습니다.
                    </p>
                    <Button onClick={() => handleDownload('excel')}>
                      <Download className="mr-2 h-4 w-4" />
                      Excel 다운로드
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          ) : format === 'pdf' && pdfUrl ? (
            <div className="h-[calc(80vh-160px)] rounded-lg border bg-muted/50 overflow-hidden">
              <iframe
                src={pdfUrl}
                className="w-full h-full"
                title="PDF Preview"
              />
            </div>
          ) : format === 'excel' ? (
            <div className="h-[calc(80vh-160px)] rounded-lg border bg-muted/50 flex items-center justify-center">
              <div className="text-center">
                <FileSpreadsheet className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Excel 파일은 미리보기가 지원되지 않습니다.
                </p>
                <Button onClick={() => handleDownload('excel')}>
                  <Download className="mr-2 h-4 w-4" />
                  Excel 다운로듌
                </Button>
              </div>
            </div>
          ) : null}
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div className="flex gap-2">
            {data.pdf && (
              <Button variant="outline" onClick={() => handleDownload('pdf')}>
                <FileText className="mr-2 h-4 w-4" />
                PDF 다운로드
              </Button>
            )}
            {data.excel && (
              <Button variant="outline" onClick={() => handleDownload('excel')}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Excel 다운로드
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              공유
            </Button>
            <Button variant="outline" onClick={handleEmail}>
              <Mail className="mr-2 h-4 w-4" />
              이메일 발송
            </Button>
            <Button variant="ghost" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}