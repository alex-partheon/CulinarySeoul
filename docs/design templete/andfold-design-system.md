# &Fold™ Design System Documentation

## 개요
이 문서는 `andfold.webflow.io` 웹사이트의 완전한 디자인 시스템과 레이아웃 구조를 분석한 결과입니다. 프런트엔드 디자이너와 개발자가 동일한 수준의 웹사이트를 구현할 수 있도록 모든 필요한 정보를 포함합니다.

## 목차
1. [색상 시스템](#색상-시스템)
2. [타이포그래피](#타이포그래피)
3. [레이아웃 구조](#레이아웃-구조)
4. [컴포넌트 시스템](#컴포넌트-시스템)
5. [애니메이션 & 인터랙션](#애니메이션--인터랙션)
6. [CSS 변수](#css-변수)
7. [반응형 디자인](#반응형-디자인)
8. [페이지별 구조](#페이지별-구조)

---

## 색상 시스템

### 주요 색상 팔레트
```css
:root {
  /* Primary Colors */
  --color-black: #000000;
  --color-dark: #1e1c1a;
  --color-light: #f7f4f1;
  --color-white: #ffffff;
  
  /* Secondary Colors */
  --color-dark-secondary: #333333;
  --color-medium: #9d9287;
  --color-light-secondary: #e8e1da;
  
  /* Accent Colors */
  --accent-1: #c0846b;
  --accent-2: #a06b5b;
  --accent-3: #f5c77c;
  --accent-4: #9d9287;
  --accent-5: #867f76;
  
  /* Background Colors */
  --bg-1: #f7f4f1;
  --bg-2: #e8e1da;
  --bg-3: #5a3c2c;
  --bg-4: #3b2921;
  
  /* Opacity Variations */
  --color-dark-88: color-mix(in srgb, #1e1c1a 88%, transparent);
  --color-dark-64: color-mix(in srgb, #1e1c1a 64%, transparent);
  --color-dark-48: color-mix(in srgb, #1e1c1a 48%, transparent);
  --color-dark-32: color-mix(in srgb, #1e1c1a 32%, transparent);
  --color-dark-16: color-mix(in srgb, #1e1c1a 16%, transparent);
  --color-dark-8: color-mix(in srgb, #1e1c1a 8%, transparent);
  --color-dark-4: color-mix(in srgb, #1e1c1a 4%, transparent);
  
  --color-light-88: color-mix(in srgb, white 88%, transparent);
  --color-light-64: color-mix(in srgb, white 64%, transparent);
  --color-light-48: color-mix(in srgb, white 48%, transparent);
  --color-light-32: color-mix(in srgb, white 32%, transparent);
  --color-light-16: color-mix(in srgb, white 16%, transparent);
  --color-light-8: color-mix(in srgb, white 8%, transparent);
  --color-light-4: color-mix(in srgb, white 4%, transparent);
}
```

### 색상 사용 가이드
- **Primary Text**: `#1e1c1a` (Dark)
- **Secondary Text**: `#9d9287` (Medium)
- **Background**: `#f7f4f1` (Light)
- **Accent**: `#c0846b` (Warm Brown)
- **Links**: `#0000ee` (Blue)

---

## 타이포그래피

### 폰트 패밀리
```css
:root {
  --font-heading-serif: "LT Superior Serif", Arial, sans-serif;
  --font-heading-sans: "42 Dotsans", Arial, sans-serif;
  --font-body: "42 Dotsans", Arial, sans-serif;
  --font-ui: "42 Dotsans", Arial, sans-serif;
}
```

### 헤딩 스타일
```css
/* H1 - Main Headlines */
h1 {
  font-family: "LT Superior Serif", Arial, sans-serif;
  font-size: 72px;
  font-weight: 400;
  line-height: 68px;
  letter-spacing: -4px;
  text-transform: none;
}

/* H2 - Section Headlines */
h2 {
  font-family: "LT Superior Serif", Arial, sans-serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 56px;
  letter-spacing: -3px;
  text-transform: none;
}

/* H3 - Subsection Headlines */
h3 {
  font-family: "LT Superior Serif", Arial, sans-serif;
  font-size: 40px;
  font-weight: 400;
  line-height: 44px;
  letter-spacing: -2px;
}

/* H4 - Card Headlines */
h4 {
  font-family: "LT Superior Serif", Arial, sans-serif;
  font-size: 32px;
  font-weight: 400;
  line-height: 40px;
  letter-spacing: -1.5px;
}

/* H5 - Small Headlines */
h5 {
  font-family: "42 Dotsans", Arial, sans-serif;
  font-size: 28px;
  font-weight: 500;
  line-height: 32px;
  letter-spacing: -0.5px;
}

/* H6 - Labels */
h6 {
  font-family: "42 Dotsans", Arial, sans-serif;
  font-size: 24px;
  font-weight: 500;
  line-height: 28px;
  letter-spacing: -0.5px;
}
```

### 본문 텍스트
```css
/* Body Text */
.text-body {
  font-family: "42 Dotsans", Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0px;
}

/* Large Text */
.text-large {
  font-family: "42 Dotsans", Arial, sans-serif;
  font-size: 20px;
  font-weight: 400;
  line-height: 28px;
  letter-spacing: 0px;
}

/* Small Text */
.text-small {
  font-family: "42 Dotsans", Arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0px;
}
```

---

## 레이아웃 구조

### 컨테이너 시스템
```css
:root {
  --container-main: 1800px;
  --container-small: 900px;
  --site-padding-main: 48px;
}

/* Main Container */
.main-container {
  max-width: var(--container-main);
  padding: 0 var(--site-padding-main);
  margin: 0 auto;
  display: block;
}

/* Small Container */
.small-container {
  max-width: var(--container-small);
  padding: 0 var(--site-padding-main);
  margin: 0 auto;
}
```

### 섹션 구조
```css
/* Hero Section */
.section.hero {
  padding: 192px 0 120px;
  position: relative;
}

/* Standard Section */
.section {
  padding: 0 0 120px;
  position: relative;
}

/* Section with Top Padding */
.section.with-top-padding {
  padding: var(--spacing-top-padding) 0 120px;
}
```

### 그리드 시스템
```css
/* Offering Cards Grid */
.offering-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-24);
  padding: 0;
  margin: 0;
}
```

---

## 컴포넌트 시스템

### 네비게이션
```css
/* Master Navigation */
.master-navigation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 0;
  margin: 0;
}

/* Navigation Wrapper */
.nav-wrapper {
  display: flex;
  padding: 12px 12px 12px 20px;
  border-radius: 32px;
  background: var(--color-light-88);
  backdrop-filter: blur(20px);
}

/* Navigation Blur Background */
.nav-blur-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-light-88);
  backdrop-filter: blur(20px);
  border-radius: 32px;
}
```

### 버튼 시스템
```css
/* Button Large */
.button-large {
  font-family: var(--font-ui);
  font-size: 14px;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: 1.5px;
  border-radius: 32px;
  padding: 12px 24px;
  transition: all 0.3s ease;
}

/* Button Small */
.button-small {
  font-family: var(--font-ui);
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: 1.5px;
  border-radius: 32px;
  padding: 8px 16px;
  transition: all 0.3s ease;
}

/* Menu Button */
.menu-button {
  padding: 18px;
  border: none;
  border-radius: 0;
  background: transparent;
  display: none; /* Hidden on desktop */
}
```

### 카드 컴포넌트
```css
/* Service Card */
.service-card {
  padding: var(--spacing-48);
  border-radius: var(--radius-2);
  background: var(--bg-1);
  transition: all 0.45s ease;
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(30, 28, 26, 0.1);
}
```

---

## 애니메이션 & 인터랙션

### 기본 트랜지션
```css
:root {
  --transition-fast: 0.3s ease;
  --transition-medium: 0.45s ease;
  --transition-slow: 0.6s ease;
}

/* 공통 트랜지션 */
* {
  transition: color 0.3s, background-color 0.3s;
}

/* 호버 트랜지션 */
.hover-transition {
  transition: color 0.45s, background-color 0.45s;
}
```

### 스크롤 애니메이션
```css
/* 스크롤 시 나타나는 요소들 */
.scroll-animate {
  opacity: 0;
  transform: translateY(50px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.scroll-animate.in-view {
  opacity: 1;
  transform: translateY(0);
}

/* Sticky 요소들 */
.sticky-element {
  position: sticky;
  top: 0;
  z-index: 100;
}
```

### 주요 애니메이션 클래스
```css
/* 슬라이더 애니메이션 */
.slider-home-a {
  transform: translateX(0);
  transition: transform 0.8s ease;
}

/* 이미지 확대 효과 */
.slide-large-image {
  transform: scale(1);
  transition: transform 0.6s ease;
}

.slide-large-image:hover {
  transform: scale(1.05);
}

/* 헤드라인 애니메이션 */
.headline-home-a-slider {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
```

---

## CSS 변수

### 간격 시스템
```css
:root {
  --spacing-0: 0px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-top-padding: 192px;
}
```

### 반지름 시스템
```css
:root {
  --radius-1: 24px;
  --radius-2: 16px;
  --radius-3: 8px;
  --radius-full: 100vw;
}
```

### 폰트 두께
```css
:root {
  --font-weight-thin: 100;
  --font-weight-extra-light: 200;
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semi-bold: 600;
  --font-weight-bold: 700;
  --font-weight-extra-bold: 800;
  --font-weight-black: 900;
  
  --weight-body: 400;
  --weight-body-bold: 700;
  --weight-heading-serif: 400;
  --weight-heading-sans: 500;
  --weight-ui: 700;
}
```

---

## 반응형 디자인

### 브레이크포인트
```css
/* Mobile First Approach */
@media (max-width: 767px) {
  .main-container {
    padding: 0 24px;
  }
  
  h1 {
    font-size: 48px;
    line-height: 44px;
    letter-spacing: -2px;
  }
  
  h2 {
    font-size: 36px;
    line-height: 36px;
    letter-spacing: -1.5px;
  }
  
  .menu-button {
    display: block;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .main-container {
    padding: 0 32px;
  }
}

@media (min-width: 1024px) {
  .main-container {
    padding: 0 48px;
  }
}
```

---

## 페이지별 구조

### 홈페이지 구조
```html
<div class="master-navigation">
  <div class="nav-wrapper">
    <!-- Navigation content -->
  </div>
</div>

<main>
  <section class="section hero-home-a">
    <div class="main-container">
      <!-- Hero content -->
    </div>
  </section>
  
  <section class="section slider-home-a">
    <!-- Slider content -->
  </section>
  
  <section class="section service-cards">
    <div class="main-container">
      <!-- Service cards -->
    </div>
  </section>
</main>

<footer class="footer">
  <!-- Footer content -->
</footer>
```

### About 페이지 구조
```html
<section class="section hero-about">
  <div class="main-container">
    <!-- About hero content -->
  </div>
</section>

<section class="section about-content">
  <div class="main-container">
    <!-- About content -->
  </div>
</section>
```

### Offerings 페이지 구조
```html
<section class="section hero-offerings">
  <div class="main-container">
    <!-- Offerings hero -->
  </div>
</section>

<section class="section offerings-about-section">
  <div class="main-container">
    <!-- Offerings description -->
  </div>
</section>

<section class="section offerings-cards-section">
  <div class="main-container">
    <div class="w-layout-grid offering-cards">
      <!-- Service cards grid -->
    </div>
  </div>
</section>
```

---

## 구현 가이드

### 1. 기본 설정
1. CSS 변수를 `:root`에 정의
2. 폰트 로드 (LT Superior Serif, 42 Dotsans)
3. 기본 리셋 스타일 적용

### 2. 레이아웃 구현
1. 컨테이너 시스템 구축
2. 그리드 시스템 구현
3. 반응형 브레이크포인트 설정

### 3. 컴포넌트 구현
1. 네비게이션 컴포넌트
2. 버튼 시스템
3. 카드 컴포넌트
4. 폼 요소

### 4. 애니메이션 구현
1. CSS 트랜지션 설정
2. 스크롤 애니메이션 JavaScript
3. 호버 효과

### 5. 최적화
1. 성능 최적화
2. 접근성 고려사항
3. 브라우저 호환성

---

## 주의사항

1. **폰트 라이선스**: LT Superior Serif와 42 Dotsans 폰트의 라이선스를 확인하고 적절한 대체 폰트를 준비하세요.

2. **성능**: 많은 애니메이션과 효과가 있으므로 성능 최적화에 주의하세요.

3. **접근성**: 색상 대비, 키보드 네비게이션, 스크린 리더 지원을 고려하세요.

4. **브라우저 지원**: `color-mix()` 함수와 `backdrop-filter`의 브라우저 지원을 확인하고 폴백을 제공하세요.

---

이 문서를 기반으로 &Fold™ 웹사이트와 동일한 수준의 디자인과 기능을 구현할 수 있습니다. 각 섹션의 코드를 참고하여 단계별로 구현하시기 바랍니다.