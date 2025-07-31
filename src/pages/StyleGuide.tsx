import { useState, useEffect } from 'react'
import { StyleGuideNavigation } from '../components/ui/navigation'
import { StyleGuideFooter } from '../components/common/Footer'
import { ColorPalette } from '../components/styleguide/ColorPalette'
import { TypographyShowcase } from '../components/styleguide/TypographyShowcase'
import { SpacingVisualizer } from '../components/styleguide/SpacingVisualizer'
import { ComponentShowcase } from '../components/styleguide/ComponentShowcase'
import { ChartShowcase } from '../components/styleguide/ChartShowcase'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'

export function StyleGuide() {
  const [activeSection, setActiveSection] = useState('colors')

  // Smooth scroll to section when activeSection changes
  useEffect(() => {
    const element = document.getElementById(activeSection)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [activeSection])

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-secondary/3 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--accent)/0.05),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--secondary)/0.05),transparent)] pointer-events-none" />

      {/* Navigation with Glass Effect */}
      <div className="relative z-40">
        <StyleGuideNavigation 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </div>

      {/* Hero Section with Glassmorphism */}
      <section className="relative z-30 backdrop-blur-md bg-gradient-to-r from-card/40 via-card/60 to-card/40 border-b border-border/20">
        <div className="container mx-auto px-4 py-24 lg:py-32">
          <div className="text-center space-y-10 max-w-5xl mx-auto">
            <div className="space-y-6">
              <div className="inline-block">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent tracking-tight leading-none animate-in fade-in-0 slide-in-from-bottom-4 duration-1000">
                  CulinarySeoul
                </h1>
              </div>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-medium text-foreground/90 tracking-wide animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 delay-200">
                디자인 시스템 가이드
              </h2>
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 delay-400">
              한국의 아름다운 음식 문화를 담은 현대적인 디자인 시스템입니다. 
              일관되고 접근 가능한 사용자 경험을 제공하기 위한 포괄적인 가이드입니다.
            </p>
            <div className="flex flex-wrap justify-center gap-8 pt-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 delay-600">
              <Button 
                onClick={() => setActiveSection('colors')}
                size="lg"
                className="bg-primary/90 backdrop-blur-sm text-primary-foreground hover:bg-primary hover:scale-105 transition-all duration-300 px-10 py-4 text-xl font-medium shadow-lg hover:shadow-xl border border-primary/20"
              >
                시작하기
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 bg-background relative z-20">
        <div className="container mx-auto px-4 py-20">
          {/* Colors Section */}
          <section id="colors" className="scroll-mt-20 mb-32">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl blur-2xl group-hover:blur-xl transition-all duration-500" />
              <div className="relative backdrop-blur-sm bg-card/80 rounded-2xl p-10 shadow-xl border border-border/20 hover:border-border/40 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
                <ColorPalette />
              </div>
            </div>
          </section>

          {/* Typography Section */}
          <section id="typography" className="scroll-mt-20 mb-32">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-accent/5 rounded-2xl blur-2xl group-hover:blur-xl transition-all duration-500" />
              <div className="relative backdrop-blur-sm bg-card/80 rounded-2xl p-10 shadow-xl border border-border/20 hover:border-border/40 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
                <TypographyShowcase />
              </div>
            </div>
          </section>

          {/* Spacing Section */}
          <section id="spacing" className="scroll-mt-20 mb-32">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-primary/5 rounded-2xl blur-2xl group-hover:blur-xl transition-all duration-500" />
              <div className="relative backdrop-blur-sm bg-card/80 rounded-2xl p-10 shadow-xl border border-border/20 hover:border-border/40 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
                <SpacingVisualizer />
              </div>
            </div>
          </section>

          {/* Components Section */}
          <section id="components" className="scroll-mt-20 mb-32">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-2xl blur-2xl group-hover:blur-xl transition-all duration-500" />
              <div className="relative backdrop-blur-sm bg-card/80 rounded-2xl p-10 shadow-xl border border-border/20 hover:border-border/40 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
                <ComponentShowcase />
              </div>
            </div>
          </section>

          {/* Charts Section */}
          <section id="charts" className="scroll-mt-20 mb-32">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-primary/5 rounded-2xl blur-2xl group-hover:blur-xl transition-all duration-500" />
              <div className="relative backdrop-blur-sm bg-card/80 rounded-2xl p-10 shadow-xl border border-border/20 hover:border-border/40 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
                <ChartShowcase />
              </div>
            </div>
          </section>

          {/* Layout Section */}
          <section id="layout" className="scroll-mt-20 mb-32">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-primary/5 to-secondary/5 rounded-2xl blur-2xl group-hover:blur-xl transition-all duration-500" />
              <div className="relative backdrop-blur-sm bg-card/80 rounded-2xl p-10 shadow-xl border border-border/20 hover:border-border/40 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 space-y-12">
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">레이아웃 시스템</h2>
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    반응형 레이아웃과 컨테이너 시스템을 위한 현대적인 가이드입니다.
                  </p>
                </div>

                {/* Container Sizes */}
                <div className="space-y-8">
                  <h3 className="text-2xl font-semibold text-foreground/90 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-sm" />
                    </div>
                    컨테이너 크기
                  </h3>
                  <div className="grid gap-8">
                    <Card className="group/card relative overflow-hidden border-border/30 bg-card/50 backdrop-blur-sm hover:border-border/60 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                      <div className="relative p-8">
                        <h4 className="text-lg font-semibold mb-6 text-foreground/90">기본 컨테이너</h4>
                        <div className="bg-gradient-to-r from-muted/30 to-muted/60 p-6 rounded-xl">
                          <div className="container mx-auto bg-card/80 backdrop-blur-sm p-6 rounded-lg border-2 border-dashed border-primary/60 hover:border-primary transition-colors duration-300">
                            <p className="text-sm text-center font-medium text-foreground/80">
                              container mx-auto (max-width: 1400px on 2xl+ screens)
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>

                    <Card className="group/card relative overflow-hidden border-border/30 bg-card/50 backdrop-blur-sm hover:border-border/60 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                      <div className="relative p-8">
                        <h4 className="text-lg font-semibold mb-6 text-foreground/90">고정 너비 컨테이너</h4>
                        <div className="bg-gradient-to-r from-muted/30 to-muted/60 p-6 rounded-xl space-y-4">
                          <div className="max-w-sm mx-auto bg-card/80 backdrop-blur-sm p-4 rounded-lg border border-secondary/40 text-center hover:border-secondary hover:shadow-lg transition-all duration-300">
                            <span className="text-sm font-mono text-foreground/80">max-w-sm (384px)</span>
                          </div>
                          <div className="max-w-md mx-auto bg-card/80 backdrop-blur-sm p-4 rounded-lg border border-secondary/40 text-center hover:border-secondary hover:shadow-lg transition-all duration-300">
                            <span className="text-sm font-mono text-foreground/80">max-w-md (448px)</span>
                          </div>
                          <div className="max-w-lg mx-auto bg-card/80 backdrop-blur-sm p-4 rounded-lg border border-secondary/40 text-center hover:border-secondary hover:shadow-lg transition-all duration-300">
                            <span className="text-sm font-mono text-foreground/80">max-w-lg (512px)</span>
                          </div>
                          <div className="max-w-xl mx-auto bg-card/80 backdrop-blur-sm p-4 rounded-lg border border-secondary/40 text-center hover:border-secondary hover:shadow-lg transition-all duration-300">
                            <span className="text-sm font-mono text-foreground/80">max-w-xl (576px)</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Grid System */}
                <div className="space-y-8">
                  <h3 className="text-2xl font-semibold text-foreground/90 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-secondary to-accent flex items-center justify-center">
                      <div className="grid grid-cols-2 gap-0.5 w-3 h-3">
                        <div className="bg-white rounded-sm" />
                        <div className="bg-white rounded-sm" />
                        <div className="bg-white rounded-sm" />
                        <div className="bg-white rounded-sm" />
                      </div>
                    </div>
                    그리드 시스템
                  </h3>
                  <div className="grid gap-8">
                    {/* Basic Grids */}
                    <Card className="group/card relative overflow-hidden border-border/30 bg-card/50 backdrop-blur-sm hover:border-border/60 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                      <div className="relative p-8">
                        <h4 className="text-lg font-semibold mb-6 text-foreground/90">기본 그리드</h4>
                        <div className="space-y-8">
                          <div>
                            <p className="text-sm font-medium mb-4 text-muted-foreground">2 컬럼 그리드</p>
                            <div className="grid grid-cols-2 gap-6">
                              <div className="bg-gradient-to-r from-primary/20 to-primary/10 backdrop-blur-sm p-6 rounded-xl text-center border border-primary/20 hover:border-primary/40 transition-colors duration-300">
                                <span className="text-sm font-mono text-foreground/80">col-span-1</span>
                              </div>
                              <div className="bg-gradient-to-r from-primary/20 to-primary/10 backdrop-blur-sm p-6 rounded-xl text-center border border-primary/20 hover:border-primary/40 transition-colors duration-300">
                                <span className="text-sm font-mono text-foreground/80">col-span-1</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium mb-4 text-muted-foreground">4 컬럼 그리드</p>
                            <div className="grid grid-cols-4 gap-4">
                              <div className="bg-gradient-to-r from-secondary/20 to-secondary/10 backdrop-blur-sm p-4 rounded-lg text-center border border-secondary/20 hover:border-secondary/40 transition-all duration-300 hover:scale-105">
                                <span className="text-sm font-mono text-foreground/80">1</span>
                              </div>
                              <div className="bg-gradient-to-r from-secondary/20 to-secondary/10 backdrop-blur-sm p-4 rounded-lg text-center border border-secondary/20 hover:border-secondary/40 transition-all duration-300 hover:scale-105">
                                <span className="text-sm font-mono text-foreground/80">2</span>
                              </div>
                              <div className="bg-gradient-to-r from-secondary/20 to-secondary/10 backdrop-blur-sm p-4 rounded-lg text-center border border-secondary/20 hover:border-secondary/40 transition-all duration-300 hover:scale-105">
                                <span className="text-sm font-mono text-foreground/80">3</span>
                              </div>
                              <div className="bg-gradient-to-r from-secondary/20 to-secondary/10 backdrop-blur-sm p-4 rounded-lg text-center border border-secondary/20 hover:border-secondary/40 transition-all duration-300 hover:scale-105">
                                <span className="text-sm font-mono text-foreground/80">4</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Responsive Grid */}
                    <Card className="group/card relative overflow-hidden border-border/30 bg-card/50 backdrop-blur-sm hover:border-border/60 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                      <div className="relative p-8">
                        <h4 className="text-lg font-semibold mb-6 text-foreground/90">반응형 그리드</h4>
                        <div className="space-y-6">
                          <div>
                            <p className="text-sm font-medium mb-4 text-muted-foreground">grid-cols-1 sm:grid-cols-2 lg:grid-cols-4</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                              <div className="bg-gradient-to-br from-accent/20 to-accent/10 backdrop-blur-sm p-6 rounded-xl text-center border border-accent/20 hover:border-accent/40 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                <span className="text-sm font-semibold text-foreground/80">카드 1</span>
                              </div>
                              <div className="bg-gradient-to-br from-accent/20 to-accent/10 backdrop-blur-sm p-6 rounded-xl text-center border border-accent/20 hover:border-accent/40 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                <span className="text-sm font-semibold text-foreground/80">카드 2</span>
                              </div>
                              <div className="bg-gradient-to-br from-accent/20 to-accent/10 backdrop-blur-sm p-6 rounded-xl text-center border border-accent/20 hover:border-accent/40 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                <span className="text-sm font-semibold text-foreground/80">카드 3</span>
                              </div>
                              <div className="bg-gradient-to-br from-accent/20 to-accent/10 backdrop-blur-sm p-6 rounded-xl text-center border border-accent/20 hover:border-accent/40 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                <span className="text-sm font-semibold text-foreground/80">카드 4</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Complex Grid Layout */}
                    <Card className="group/card relative overflow-hidden border-border/30 bg-card/50 backdrop-blur-sm hover:border-border/60 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                      <div className="relative p-8">
                        <h4 className="text-lg font-semibold mb-6 text-foreground/90">복합 그리드 레이아웃</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="md:col-span-2 bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm p-8 rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
                            <h5 className="text-lg font-semibold mb-3 text-foreground/90">메인 콘텐츠 영역</h5>
                            <p className="text-sm text-muted-foreground">col-span-2 (2/3 너비)</p>
                          </div>
                          <div className="bg-gradient-to-br from-secondary/20 to-secondary/10 backdrop-blur-sm p-8 rounded-xl border border-secondary/20 hover:border-secondary/40 transition-all duration-300 hover:shadow-lg">
                            <h5 className="text-lg font-semibold mb-3 text-foreground/90">사이드바</h5>
                            <p className="text-sm text-muted-foreground">col-span-1 (1/3 너비)</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Flexbox Examples */}
                <div className="space-y-8">
                  <h3 className="text-2xl font-semibold text-foreground/90 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-accent to-primary flex items-center justify-center">
                      <div className="flex gap-0.5 w-3 h-3">
                        <div className="bg-white rounded-full w-1 h-1" />
                        <div className="bg-white rounded-full w-1 h-1" />
                        <div className="bg-white rounded-full w-1 h-1" />
                      </div>
                    </div>
                    플렉스박스 레이아웃
                  </h3>
                  <Card className="group/card relative overflow-hidden border-border/30 bg-card/50 backdrop-blur-sm hover:border-border/60 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                    <div className="relative p-8">
                      <h4 className="text-lg font-semibold mb-6 text-foreground/90">플렉스 패턴</h4>
                      <div className="space-y-8">
                        <div>
                          <p className="text-sm font-medium mb-4 text-muted-foreground">justify-between (양쪽 정렬)</p>
                          <div className="flex justify-between items-center bg-gradient-to-r from-muted/30 to-muted/60 p-6 rounded-xl">
                            <div className="bg-gradient-to-r from-primary/30 to-primary/20 backdrop-blur-sm px-6 py-3 rounded-lg border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105">
                              <span className="text-sm font-semibold text-foreground/80">왼쪽</span>
                            </div>
                            <div className="bg-gradient-to-r from-secondary/30 to-secondary/20 backdrop-blur-sm px-6 py-3 rounded-lg border border-secondary/20 hover:border-secondary/40 transition-all duration-300 hover:scale-105">
                              <span className="text-sm font-semibold text-foreground/80">오른쪽</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium mb-4 text-muted-foreground">justify-center (중앙 정렬)</p>
                          <div className="flex justify-center items-center bg-gradient-to-r from-muted/30 to-muted/60 p-6 rounded-xl">
                            <div className="bg-gradient-to-r from-accent/30 to-accent/20 backdrop-blur-sm px-6 py-3 rounded-lg border border-accent/20 hover:border-accent/40 transition-all duration-300 hover:scale-105">
                              <span className="text-sm font-semibold text-foreground/80">중앙</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium mb-4 text-muted-foreground">flex-wrap gap-4 (플렉스 랩)</p>
                          <div className="flex flex-wrap gap-4 bg-gradient-to-r from-muted/30 to-muted/60 p-6 rounded-xl">
                            <div className="bg-gradient-to-r from-primary/30 to-primary/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105">
                              <span className="text-sm font-semibold text-foreground/80">항목 1</span>
                            </div>
                            <div className="bg-gradient-to-r from-secondary/30 to-secondary/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-secondary/20 hover:border-secondary/40 transition-all duration-300 hover:scale-105">
                              <span className="text-sm font-semibold text-foreground/80">항목 2</span>
                            </div>
                            <div className="bg-gradient-to-r from-accent/30 to-accent/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-accent/20 hover:border-accent/40 transition-all duration-300 hover:scale-105">
                              <span className="text-sm font-semibold text-foreground/80">항목 3</span>
                            </div>
                            <div className="bg-gradient-to-r from-primary/30 to-primary/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105">
                              <span className="text-sm font-semibold text-foreground/80">항목 4</span>
                            </div>
                            <div className="bg-gradient-to-r from-secondary/30 to-secondary/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-secondary/20 hover:border-secondary/40 transition-all duration-300 hover:scale-105">
                              <span className="text-sm font-semibold text-foreground/80">항목 5</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Usage Guidelines */}
                <div className="space-y-8">
                  <h3 className="text-2xl font-semibold text-foreground/90 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-sm" />
                    </div>
                    사용 가이드라인
                  </h3>
                  <Card className="group/card relative overflow-hidden border-border/30 bg-gradient-to-br from-muted/20 to-muted/30 backdrop-blur-sm hover:border-border/60 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                    <CardHeader className="relative">
                      <CardTitle className="text-2xl text-foreground/90">레이아웃 사용 가이드</CardTitle>
                    </CardHeader>
                    <CardContent className="relative space-y-8">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-foreground/90 flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full" />
                            그리드 vs 플렉스박스
                          </h4>
                          <ul className="space-y-3 text-muted-foreground">
                            <li className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                              <span>그리드: 2차원 레이아웃 (카드 그리드, 복잡한 레이아웃)</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 shrink-0" />
                              <span>플렉스박스: 1차원 레이아웃 (내비게이션, 버튼 그룹)</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 shrink-0" />
                              <span>반응형: 모바일 우선으로 설계</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                              <span>간격: gap 유틸리티 사용 (gap-4, gap-6 등)</span>
                            </li>
                          </ul>
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-foreground/90 flex items-center gap-2">
                            <div className="w-2 h-2 bg-secondary rounded-full" />
                            브레이크포인트
                          </h4>
                          <ul className="space-y-3 text-muted-foreground">
                            <li className="flex items-center gap-3">
                              <code className="bg-muted/50 px-2 py-1 rounded text-xs font-mono">sm</code>
                              <span>640px+ (태블릿)</span>
                            </li>
                            <li className="flex items-center gap-3">
                              <code className="bg-muted/50 px-2 py-1 rounded text-xs font-mono">md</code>
                              <span>768px+ (작은 데스크톱)</span>
                            </li>
                            <li className="flex items-center gap-3">
                              <code className="bg-muted/50 px-2 py-1 rounded text-xs font-mono">lg</code>
                              <span>1024px+ (큰 데스크톱)</span>
                            </li>
                            <li className="flex items-center gap-3">
                              <code className="bg-muted/50 px-2 py-1 rounded text-xs font-mono">xl</code>
                              <span>1280px+ (매우 큰 화면)</span>
                            </li>
                            <li className="flex items-center gap-3">
                              <code className="bg-muted/50 px-2 py-1 rounded text-xs font-mono">2xl</code>
                              <span>1536px+ (초대형 화면)</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-border/20">
                        <h4 className="text-lg font-semibold mb-4 text-foreground/90 flex items-center gap-2">
                          <div className="w-2 h-2 bg-accent rounded-full" />
                          접근성 고려사항
                        </h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-muted-foreground">
                          <li className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 shrink-0" />
                            <span>충분한 클릭 영역 확보 (최소 44x44px)</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 shrink-0" />
                            <span>키보드 내비게이션 지원</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 shrink-0" />
                            <span>스크린 리더를 위한 의미있는 HTML 구조</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 shrink-0" />
                            <span>색상에만 의존하지 않는 정보 전달</span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <div className="relative z-10">
        <StyleGuideFooter onSectionChange={setActiveSection} />
      </div>
    </div>
  )
}