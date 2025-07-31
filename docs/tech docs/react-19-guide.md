# React 19 개발자 참고 가이드

## 개요

React 19는 React의 최신 메이저 버전으로, 새로운 기능과 API 개선사항을 제공하며 일부 기존 API를 제거했습니다. 이 가이드는 React 19의 주요 기능과 마이그레이션 방법을 다룹니다.

## 주요 새 기능

### 1. Actions

React 19에서는 비동기 함수를 사용하여 데이터 변경을 처리하는 새로운 기능인 "Actions"를 도입했습니다.

```javascript
// form action 사용 예시
function ChangeName({ name, setName }) {
  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const error = await updateName(formData.get("name"));
      if (error) {
        return error;
      }
      redirect("/path");
      return null;
    },
    null,
  );

  return (
    <form action={submitAction}>
      <input type="text" name="name" />
      <button type="submit" disabled={isPending}>Update</button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

### 2. 새로운 Hooks

#### useActionState
- 폼 액션의 상태를 관리하는 새로운 훅
- 이전 상태, 액션 함수, 대기 상태를 반환

#### useOptimistic
- 낙관적 UI 업데이트를 위한 훅
- 비동기 요청 중 즉시 UI를 업데이트하고, 실패 시 자동으로 되돌림

```javascript
function ChangeName({currentName, onUpdateName}) {
  const [optimisticName, setOptimisticName] = useOptimistic(currentName);

  const submitAction = async formData => {
    const newName = formData.get("name");
    setOptimisticName(newName);
    const updatedName = await updateName(newName);
    onUpdateName(updatedName);
  };

  return (
    <form action={submitAction}>
      <p>Your name is: {optimisticName}</p>
      <p>
        <label>Change Name:</label>
        <input
          type="text"
          name="name"
          disabled={currentName !== optimisticName}
        />
      </p>
    </form>
  );
}
```

### 3. use API

`use` API는 조건부로 Context를 소비할 수 있게 해주는 새로운 기능입니다.

```javascript
import {use} from 'react';
import ThemeContext from './ThemeContext'

function Heading({children}) {
  if (children == null) {
    return null;
  }
  
  // useContext와 달리 조건부로 사용 가능
  const theme = use(ThemeContext);
  return (
    <h1 style={{color: theme.color}}>
      {children}
    </h1>
  );
}
```

### 4. 새로운 Context Provider 문법

React 19에서는 Context를 더 간단하게 사용할 수 있습니다.

```javascript
const ThemeContext = createContext('');

function App({children}) {
  return (
    <ThemeContext value="dark">
      {children}
    </ThemeContext>
  );  
}
```

## 설치 및 업그레이드

### npm 사용
```bash
npm install --save-exact react@^19.0.0 react-dom@^19.0.0
npm install --save-exact @types/react@^19.0.0 @types/react-dom@^19.0.0
```

### yarn 사용
```bash
yarn add --exact react@^19.0.0 react-dom@^19.0.0
yarn add --exact @types/react@^19.0.0 @types/react-dom@^19.0.0
```

### CDN 사용 (ESM)
```html
<script type="module">
  import React from "https://esm.sh/react@19/?dev"
  import ReactDOMClient from "https://esm.sh/react-dom@19/client?dev"
  // ...
</script>
```

## 마이그레이션 가이드

### 자동 마이그레이션 도구

React 19는 자동 마이그레이션을 위한 codemod를 제공합니다.

```bash
# 전체 마이그레이션 레시피 실행
npx codemod@latest react/19/migration-recipe

# ReactDOM.render 마이그레이션
npx codemod@latest react/19/replace-reactdom-render

# TypeScript 타입 마이그레이션
npx types-react-codemod@latest preset-19 ./path-to-app

# PropTypes를 TypeScript로 변환
npx codemod@latest react/prop-types-typescript
```

### 주요 API 변경사항

#### 1. ReactDOM.render → createRoot
```javascript
// 이전
import {render} from 'react-dom';
render(<App />, document.getElementById('root'));

// 이후
import {createRoot} from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

#### 2. ReactDOM.hydrate → hydrateRoot
```javascript
// 이전
import {hydrate} from 'react-dom';
hydrate(<App />, document.getElementById('root'));

// 이후
import {hydrateRoot} from 'react-dom/client';
hydrateRoot(document.getElementById('root'), <App />);
```

#### 3. unmountComponentAtNode → root.unmount()
```javascript
// 이전
unmountComponentAtNode(document.getElementById('root'));

// 이후
root.unmount();
```

#### 4. act import 변경
```diff
- import {act} from 'react-dom/test-utils'
+ import {act} from 'react';
```

### TypeScript 관련 변경사항

#### 1. useRef 타입 개선
```typescript
// React 19에서는 모든 ref가 mutable
interface RefObject<T> {
  current: T
}

declare function useRef<T>: RefObject<T>
```

#### 2. useReducer 타입 추론 개선
```typescript
// 이전
- useReducer<React.Reducer<State, Action>>(reducer)
// 이후
+ useReducer(reducer)
```

#### 3. ref 콜백 반환값 처리
```diff
- <div ref={current => (instance = current)} />
+ <div ref={current => {instance = current}} />
```

#### 4. useRef와 createContext 인수 필수화
```typescript
// 에러 발생
useRef(); // @ts-expect-error: Expected 1 argument but saw none
createContext(); // @ts-expect-error: Expected 1 argument but saw none

// 올바른 사용법
useRef(undefined);
createContext(undefined);
```

## 제거된 API

### React DOM에서 제거된 API
- `findDOMNode` - DOM 노드 접근 대안 사용
- `hydrate` - `hydrateRoot` 사용
- `render` - `createRoot` 사용
- `unmountComponentAtNode` - `root.unmount()` 사용
- `renderToNodeStream` - `react-dom/server` API 사용
- `renderToStaticNodeStream` - `react-dom/server` API 사용

### React에서 제거된 API
- `createFactory`
- 클래스 컴포넌트의 정적 속성들
- `PropTypes` (별도 패키지로 이동)

## React Compiler

React 19는 React Compiler를 지원합니다.

### 기본 설정
```javascript
// babel.config.js
module.exports = {
  plugins: [
    'babel-plugin-react-compiler'
  ]
};
```

### 타겟 버전 설정
```javascript
// babel.config.js
const ReactCompilerConfig = {
  target: '19' // '17' | '18' | '19'
};

module.exports = function () {
  return {
    plugins: [
      ['babel-plugin-react-compiler', ReactCompilerConfig]
    ]
  };
};
```

## 성능 개선사항

React 19에는 다음과 같은 성능 개선사항이 포함되어 있습니다:

- 동기, 기본, 연속 레인 배치 처리
- 일시 중단된 컴포넌트의 형제 요소 사전 렌더링 방지
- 렌더 단계 업데이트로 인한 무한 업데이트 루프 감지
- Popstate에서의 전환이 동기화됨
- SSR 중 레이아웃 효과 경고 제거

## 모범 사례

### 1. Actions 사용
- 폼 제출과 데이터 변경에 Actions 사용
- `useActionState`로 상태 관리
- 에러 처리와 로딩 상태 관리

### 2. 낙관적 업데이트
- `useOptimistic`을 사용하여 사용자 경험 개선
- 실패 시 자동 롤백 활용

### 3. Context 사용
- 새로운 Context Provider 문법 사용
- 조건부 Context 소비에 `use` API 활용

### 4. 타입 안전성
- TypeScript와 함께 사용 시 새로운 타입 정의 활용
- 자동 타입 추론 기능 활용

## 문제 해결

### 일반적인 마이그레이션 문제

1. **hydration 불일치**: SSR 설정 확인
2. **타입 에러**: TypeScript 타입 정의 업데이트
3. **ref 콜백 에러**: 명시적 블록 문법 사용
4. **Context Provider 에러**: 새로운 문법으로 업데이트

### 디버깅 팁

- React DevTools 최신 버전 사용
- 콘솔 경고 메시지 확인
- codemod 도구 활용하여 자동 마이그레이션

## 참고 자료

- [React 19 공식 문서](https://react.dev/blog/2024/12/05/react-19)
- [React 19 업그레이드 가이드](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [React Compiler 문서](https://react.dev/learn/react-compiler)
- [Codemod 도구](https://github.com/reactjs/react-codemod)

---

*이 문서는 React 19.0.0 기준으로 작성되었습니다. 최신 정보는 공식 문서를 참조하세요.*