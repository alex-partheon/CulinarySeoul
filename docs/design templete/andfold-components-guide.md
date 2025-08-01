# &Fold™ 컴포넌트 구현 가이드

## 개요
이 문서는 &Fold™ 웹사이트의 주요 컴포넌트들을 실제로 구현하기 위한 상세한 가이드입니다. HTML 구조, CSS 스타일, JavaScript 인터랙션을 포함합니다.

## 목차
1. [네비게이션 컴포넌트](#네비게이션-컴포넌트)
2. [히어로 섹션](#히어로-섹션)
3. [서비스 카드](#서비스-카드)
4. [슬라이더 컴포넌트](#슬라이더-컴포넌트)
5. [스크롤 애니메이션](#스크롤-애니메이션)
6. [모달 & 오버레이](#모달--오버레이)
7. [폼 컴포넌트](#폼-컴포넌트)
8. [JavaScript 인터랙션](#javascript-인터랙션)

---

## 네비게이션 컴포넌트

### HTML 구조
```html
<nav class="master-navigation" id="masterNav">
  <div class="nav-blur-bg"></div>
  <div class="nav-wrapper">
    <div class="nav-brand">
      <a href="/" class="brand-link">
        <img src="logo.svg" alt="&Fold" class="brand-logo">
      </a>
    </div>
    
    <div class="nav-menu" id="navMenu">
      <a href="/about" class="nav-link">About</a>
      <a href="/offerings" class="nav-link">Offerings</a>
      <a href="/journal" class="nav-link">Journal</a>
      <a href="/contact" class="nav-link">Contact</a>
    </div>
    
    <button class="menu-button" id="menuButton" aria-label="Toggle menu">
      <span class="menu-icon"></span>
      <span class="menu-icon"></span>
      <span class="menu-icon"></span>
    </button>
  </div>
</nav>
```

### CSS 스타일
```css
.master-navigation {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: calc(100% - 40px);
  max-width: 1200px;
  transition: all 0.3s ease;
}

.nav-blur-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(247, 244, 241, 0.88);
  backdrop-filter: blur(20px);
  border-radius: 32px;
  border: 1px solid rgba(30, 28, 26, 0.08);
}

.nav-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-radius: 32px;
}

.nav-brand {
  z-index: 2;
}

.brand-logo {
  height: 32px;
  width: auto;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 32px;
  z-index: 2;
}

.nav-link {
  font-family: var(--font-ui);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-dark);
  text-decoration: none;
  transition: color 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: var(--accent-1);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--accent-1);
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

.menu-button {
  display: none;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 2;
}

.menu-icon {
  width: 20px;
  height: 2px;
  background: var(--color-dark);
  transition: all 0.3s ease;
}

/* 스크롤 시 네비게이션 변화 */
.master-navigation.scrolled {
  top: 10px;
  width: calc(100% - 20px);
}

.master-navigation.scrolled .nav-blur-bg {
  background: rgba(247, 244, 241, 0.95);
  backdrop-filter: blur(30px);
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .nav-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(247, 244, 241, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 0 0 24px 24px;
    flex-direction: column;
    padding: 20px;
    gap: 16px;
    transform: translateY(-10px);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }
  
  .nav-menu.active {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
  
  .menu-button {
    display: flex;
  }
  
  .menu-button.active .menu-icon:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }
  
  .menu-button.active .menu-icon:nth-child(2) {
    opacity: 0;
  }
  
  .menu-button.active .menu-icon:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -6px);
  }
}
```

### JavaScript 인터랙션
```javascript
class Navigation {
  constructor() {
    this.nav = document.getElementById('masterNav');
    this.menuButton = document.getElementById('menuButton');
    this.navMenu = document.getElementById('navMenu');
    this.isMenuOpen = false;
    
    this.init();
  }
  
  init() {
    this.handleScroll();
    this.handleMobileMenu();
    window.addEventListener('scroll', () => this.handleScroll());
  }
  
  handleScroll() {
    const scrollY = window.scrollY;
    
    if (scrollY > 100) {
      this.nav.classList.add('scrolled');
    } else {
      this.nav.classList.remove('scrolled');
    }
  }
  
  handleMobileMenu() {
    this.menuButton.addEventListener('click', () => {
      this.isMenuOpen = !this.isMenuOpen;
      
      if (this.isMenuOpen) {
        this.menuButton.classList.add('active');
        this.navMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
      } else {
        this.menuButton.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
    
    // 메뉴 외부 클릭 시 닫기
    document.addEventListener('click', (e) => {
      if (!this.nav.contains(e.target) && this.isMenuOpen) {
        this.closeMenu();
      }
    });
  }
  
  closeMenu() {
    this.isMenuOpen = false;
    this.menuButton.classList.remove('active');
    this.navMenu.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// 초기화
new Navigation();
```

---

## 히어로 섹션

### HTML 구조
```html
<section class="section hero-home-a">
  <div class="main-container">
    <div class="hero-content">
      <div class="hero-text">
        <h1 class="hero-headline animate-on-scroll">BRAND AS BODY</h1>
        <p class="hero-subtext animate-on-scroll" data-delay="200">
          Transforming brands through embodied design thinking
        </p>
        <div class="hero-cta animate-on-scroll" data-delay="400">
          <a href="/offerings" class="button-large">Explore Services</a>
        </div>
      </div>
      <div class="hero-visual">
        <div class="hero-image-container animate-on-scroll" data-delay="300">
          <img src="hero-image.jpg" alt="Brand as Body" class="hero-image">
        </div>
      </div>
    </div>
  </div>
</section>
```

### CSS 스타일
```css
.hero-home-a {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 192px 0 120px;
  background: linear-gradient(135deg, #f7f4f1 0%, #e8e1da 100%);
  position: relative;
  overflow: hidden;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  width: 100%;
}

.hero-text {
  max-width: 600px;
}

.hero-headline {
  margin-bottom: 24px;
  background: linear-gradient(135deg, #1e1c1a 0%, #c0846b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtext {
  font-size: 20px;
  line-height: 1.4;
  color: var(--color-dark-64);
  margin-bottom: 40px;
}

.hero-cta {
  display: flex;
  gap: 16px;
}

.hero-visual {
  position: relative;
}

.hero-image-container {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(30, 28, 26, 0.1);
}

.hero-image {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.6s ease;
}

.hero-image-container:hover .hero-image {
  transform: scale(1.05);
}

/* 배경 장식 요소 */
.hero-home-a::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(192, 132, 107, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 0;
}

.hero-content {
  position: relative;
  z-index: 1;
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
  
  .hero-headline {
    font-size: 48px;
    line-height: 44px;
  }
  
  .hero-subtext {
    font-size: 18px;
  }
}
```

---

## 서비스 카드

### HTML 구조
```html
<div class="service-card animate-on-scroll">
  <div class="service-card-header">
    <div class="service-icon">
      <svg class="icon" viewBox="0 0 24 24">
        <!-- SVG 아이콘 -->
      </svg>
    </div>
    <h3 class="service-title">Coaching Sessions</h3>
  </div>
  
  <div class="service-content">
    <p class="service-description">
      Personal guidance for brand development and strategic thinking.
    </p>
    
    <div class="service-features">
      <ul class="feature-list">
        <li>1-on-1 sessions</li>
        <li>Strategic planning</li>
        <li>Brand positioning</li>
      </ul>
    </div>
    
    <div class="service-footer">
      <div class="service-price">
        <span class="price-label">Starting from</span>
        <span class="price-value">$200</span>
      </div>
      <a href="/contact" class="service-cta button-small">Get Started</a>
    </div>
  </div>
</div>
```

### CSS 스타일
```css
.service-card {
  background: var(--bg-1);
  border-radius: var(--radius-2);
  padding: 48px;
  transition: all 0.45s ease;
  border: 1px solid rgba(30, 28, 26, 0.08);
  position: relative;
  overflow: hidden;
}

.service-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--accent-1), var(--accent-2));
  transform: scaleX(0);
  transition: transform 0.45s ease;
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(30, 28, 26, 0.1);
}

.service-card:hover::before {
  transform: scaleX(1);
}

.service-card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.service-icon {
  width: 48px;
  height: 48px;
  background: var(--accent-1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.service-card:hover .service-icon {
  background: var(--accent-2);
  transform: rotate(5deg);
}

.icon {
  width: 24px;
  height: 24px;
  fill: white;
}

.service-title {
  margin: 0;
  color: var(--color-dark);
}

.service-description {
  color: var(--color-dark-64);
  margin-bottom: 24px;
  line-height: 1.6;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0 0 32px 0;
}

.feature-list li {
  padding: 8px 0;
  color: var(--color-dark-64);
  position: relative;
  padding-left: 20px;
}

.feature-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--accent-1);
  font-weight: bold;
}

.service-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 24px;
  border-top: 1px solid rgba(30, 28, 26, 0.08);
}

.service-price {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.price-label {
  font-size: 12px;
  color: var(--color-dark-48);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.price-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-dark);
}

.service-cta {
  background: var(--accent-1);
  color: white;
  border: none;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.service-cta:hover {
  background: var(--accent-2);
  transform: translateY(-2px);
}

/* 그리드 레이아웃 */
.offering-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 32px;
  margin-top: 64px;
}

@media (max-width: 768px) {
  .offering-cards {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .service-card {
    padding: 32px 24px;
  }
}
```

---

## 스크롤 애니메이션

### JavaScript 구현
```javascript
class ScrollAnimations {
  constructor() {
    this.elements = document.querySelectorAll('.animate-on-scroll');
    this.observer = null;
    
    this.init();
  }
  
  init() {
    this.createObserver();
    this.observeElements();
  }
  
  createObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
        }
      });
    }, options);
  }
  
  observeElements() {
    this.elements.forEach(element => {
      this.observer.observe(element);
    });
  }
  
  animateElement(element) {
    const delay = element.dataset.delay || 0;
    
    setTimeout(() => {
      element.classList.add('animate-in');
    }, delay);
    
    // 한 번 애니메이션된 요소는 관찰 중단
    this.observer.unobserve(element);
  }
}

// CSS 애니메이션 클래스
const animationCSS = `
.animate-on-scroll {
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.animate-on-scroll.animate-in {
  opacity: 1;
  transform: translateY(0);
}

/* 다양한 애니메이션 타입 */
.animate-fade {
  opacity: 0;
  transition: opacity 0.8s ease;
}

.animate-fade.animate-in {
  opacity: 1;
}

.animate-slide-left {
  opacity: 0;
  transform: translateX(-50px);
  transition: all 0.8s ease;
}

.animate-slide-left.animate-in {
  opacity: 1;
  transform: translateX(0);
}

.animate-slide-right {
  opacity: 0;
  transform: translateX(50px);
  transition: all 0.8s ease;
}

.animate-slide-right.animate-in {
  opacity: 1;
  transform: translateX(0);
}

.animate-scale {
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.8s ease;
}

.animate-scale.animate-in {
  opacity: 1;
  transform: scale(1);
}
`;

// CSS 스타일 추가
const style = document.createElement('style');
style.textContent = animationCSS;
document.head.appendChild(style);

// 초기화
new ScrollAnimations();
```

---

## 슬라이더 컴포넌트

### HTML 구조
```html
<section class="section slider-home-a">
  <div class="slider-container">
    <div class="slider-track" id="sliderTrack">
      <div class="slide active">
        <div class="slide-content">
          <div class="slide-image">
            <img src="slide1.jpg" alt="Slide 1">
          </div>
          <div class="slide-text">
            <h3>Brand Strategy</h3>
            <p>Developing comprehensive brand strategies that resonate.</p>
          </div>
        </div>
      </div>
      
      <div class="slide">
        <div class="slide-content">
          <div class="slide-image">
            <img src="slide2.jpg" alt="Slide 2">
          </div>
          <div class="slide-text">
            <h3>Visual Identity</h3>
            <p>Creating distinctive visual languages for brands.</p>
          </div>
        </div>
      </div>
      
      <div class="slide">
        <div class="slide-content">
          <div class="slide-image">
            <img src="slide3.jpg" alt="Slide 3">
          </div>
          <div class="slide-text">
            <h3>Digital Experience</h3>
            <p>Designing seamless digital brand experiences.</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="slider-controls">
      <button class="slider-btn prev" id="prevBtn">
        <svg viewBox="0 0 24 24">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      
      <div class="slider-dots" id="sliderDots">
        <button class="dot active" data-slide="0"></button>
        <button class="dot" data-slide="1"></button>
        <button class="dot" data-slide="2"></button>
      </div>
      
      <button class="slider-btn next" id="nextBtn">
        <svg viewBox="0 0 24 24">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>
    </div>
  </div>
</section>
```

### CSS 스타일
```css
.slider-home-a {
  padding: 120px 0;
  background: var(--bg-2);
  overflow: hidden;
}

.slider-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 48px;
  position: relative;
}

.slider-track {
  display: flex;
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  width: 300%;
}

.slide {
  width: 33.333%;
  flex-shrink: 0;
  padding: 0 16px;
}

.slide-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
  background: white;
  border-radius: 24px;
  padding: 64px;
  box-shadow: 0 20px 60px rgba(30, 28, 26, 0.08);
}

.slide-image {
  border-radius: 16px;
  overflow: hidden;
}

.slide-image img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.slide.active .slide-image img {
  transform: scale(1.02);
}

.slide-text h3 {
  margin-bottom: 16px;
  color: var(--color-dark);
}

.slide-text p {
  color: var(--color-dark-64);
  line-height: 1.6;
}

.slider-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  margin-top: 48px;
}

.slider-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid rgba(30, 28, 26, 0.16);
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.slider-btn:hover {
  background: var(--accent-1);
  border-color: var(--accent-1);
  transform: scale(1.1);
}

.slider-btn svg {
  width: 20px;
  height: 20px;
  stroke: var(--color-dark);
  stroke-width: 2;
  fill: none;
  transition: stroke 0.3s ease;
}

.slider-btn:hover svg {
  stroke: white;
}

.slider-dots {
  display: flex;
  gap: 12px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: rgba(30, 28, 26, 0.24);
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background: var(--accent-1);
  transform: scale(1.2);
}

@media (max-width: 768px) {
  .slide-content {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 32px;
  }
  
  .slide-image img {
    height: 250px;
  }
}
```

### JavaScript 구현
```javascript
class Slider {
  constructor(container) {
    this.container = container;
    this.track = container.querySelector('#sliderTrack');
    this.slides = container.querySelectorAll('.slide');
    this.dots = container.querySelectorAll('.dot');
    this.prevBtn = container.querySelector('#prevBtn');
    this.nextBtn = container.querySelector('#nextBtn');
    
    this.currentSlide = 0;
    this.totalSlides = this.slides.length;
    this.autoplayInterval = null;
    this.autoplayDelay = 5000;
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.startAutoplay();
  }
  
  bindEvents() {
    this.prevBtn.addEventListener('click', () => this.prevSlide());
    this.nextBtn.addEventListener('click', () => this.nextSlide());
    
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });
    
    // 마우스 호버 시 자동재생 일시정지
    this.container.addEventListener('mouseenter', () => this.stopAutoplay());
    this.container.addEventListener('mouseleave', () => this.startAutoplay());
  }
  
  goToSlide(index) {
    this.currentSlide = index;
    this.updateSlider();
  }
  
  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.updateSlider();
  }
  
  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.updateSlider();
  }
  
  updateSlider() {
    // 슬라이드 이동
    const translateX = -this.currentSlide * (100 / this.totalSlides);
    this.track.style.transform = `translateX(${translateX}%)`;
    
    // 활성 슬라이드 업데이트
    this.slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === this.currentSlide);
    });
    
    // 도트 업데이트
    this.dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentSlide);
    });
  }
  
  startAutoplay() {
    this.stopAutoplay();
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoplayDelay);
  }
  
  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
  const sliderContainer = document.querySelector('.slider-home-a');
  if (sliderContainer) {
    new Slider(sliderContainer);
  }
});
```

---

## 전체 초기화 스크립트

### main.js
```javascript
// 전체 애플리케이션 초기화
class App {
  constructor() {
    this.init();
  }
  
  init() {
    // DOM이 로드된 후 실행
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initComponents());
    } else {
      this.initComponents();
    }
  }
  
  initComponents() {
    // 네비게이션 초기화
    new Navigation();
    
    // 스크롤 애니메이션 초기화
    new ScrollAnimations();
    
    // 슬라이더 초기화
    const sliderContainer = document.querySelector('.slider-home-a');
    if (sliderContainer) {
      new Slider(sliderContainer);
    }
    
    // 기타 초기화
    this.initSmoothScroll();
    this.initLazyLoading();
  }
  
  initSmoothScroll() {
    // 부드러운 스크롤 구현
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
  
  initLazyLoading() {
    // 이미지 지연 로딩
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
}

// 앱 시작
new App();
```

---

이 가이드를 통해 &Fold™ 웹사이트의 모든 주요 컴포넌트를 구현할 수 있습니다. 각 컴포넌트는 독립적으로 작동하며, 필요에 따라 수정하여 사용할 수 있습니다.