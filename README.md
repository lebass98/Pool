# LeBass (르바스) - 프리미엄 당구 스코어보드 앱 🎱✨

**LeBass**는 React Native 및 Expo(v57) 기반으로 구축된 최첨단 **디지털 당구 스코어보드 애플리케이션**입니다.  
VisionOS 및 Spatial UI 스타일의 미학적 글래스모피즘(Glassmorphic) UI/UX를 적용하여 미래지향적이고 고급스러운 경기 스코어링 경험을 제공합니다.

---

## 🌟 주요 특징 (Key Features)

- **💎 VisionOS / Spatial UI 글래스모피즘 디자인**
  - 모던하고 세련된 반투명 아크릴 유리에 빛과 그라데이션을 결합한 스파셜 인터페이스.
  - 몰입감을 높여주는 시각적 조명 애니메이션 효과 및 그라데이션 백드롭.

- **🎞️ 실시간 플립 카드 애니메이션 (Flip Digit Animation)**
  - 숫자가 넘어가는 실물 스코어판 느낌을 재현한 3D 롤링/플립 애니메이션.
  - 점수 증감 시 시각적인 손맛을 선사하는 플립 카드 효과 적용.

- **🎮 맞춤형 당구 경기 모드 지원**
  - 3구 / 4구 / 포켓볼 등 경기 종목에 따른 점수판 세팅 지원.
  - 플레이어별 목표 점수(핸디), 이닝 타이머, 제한 시간 관리 기능.
  - 턴 전환 및 공격/수비 이닝 실시간 추적.

- **⏸️ 턴 & 일시정지 오버레이 및 제어**
  - 경기 일시정지 시 화면 중앙에 시각적인 일시정지(PAUSED) 오버레이 표시.
  - 점수 리셋, 선공 변경, 턴 넘기기, 이닝 취소/되돌리기 등 직관적인 하단 컨트롤 바.

- **👥 플레이어 관리 및 세팅 모달**
  - 선수 등록/선택 및 닉네임, 프로필, 핸디 점수 손쉬운 변경.
  - 경기 목표 점수 및 타이머 설정을 커스텀할 수 있는 경기 설정 모달 제공.

---

## 🛠️ 기술 스택 (Tech Stack)

- **Framework**: React Native 0.86.0, Expo v57.0.8 (Expo Router v57)
- **UI & Animations**: `react-native-reanimated` 4.5.0, `expo-blur`, `expo-glass-effect`, `react-native-gesture-handler`
- **Language**: TypeScript 6.0
- **Styling**: React Native StyleSheet, Custom Glassmorphism UI Components

---

## 📁 프로젝트 구조 (Project Structure)

```text
lebass/
├── src/
│   ├── app/                    # Expo Router 페이지 엔트리
│   │   ├── _layout.tsx         # 루트 레이아웃 설정
│   │   └── index.tsx           # 메인 스코어보드 화면
│   ├── components/
│   │   └── scoreboard/         # 스코어보드 핵심 UI 컴포넌트
│   │       ├── FlipDigitCard.tsx          # 3D 플립 카드 숫자 컴포넌트
│   │       ├── FlipScoreCard.tsx          # 스코어 표시 영역
│   │       ├── PlayerCard.tsx             # 플레이어 정보 및 점수판
│   │       ├── GameControlBar.tsx         # 하단 경기 제어 바
│   │       ├── GameSettingsModal.tsx      # 경기 규칙/타이머 설정 모달
│   │       ├── PlayerManagementModal.tsx  # 선수 선택 및 관리 모달
│   │       └── StartLandingScreen.tsx     # 초기 경기 시작 랜딩 스크린
│   ├── constants/              # 색상, 레이아웃 등 스타일 상수
│   ├── hooks/                  # 커스텀 훅 모음
│   └── types/                  # TypeScript 타입 정의
├── assets/                     # 이미지, 폰트 등 정적 자원
├── app.json                    # Expo 앱 설정 파일
└── package.json                # 프로젝트 의존성 및 스크립트
```

---

## 🚀 시작하기 (Getting Started)

### 1. 의존성 패키지 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
# Expo 개발 서버 시작
npx expo start
```

### 3. 플랫폼별 실행 방법

- **iOS Simulator**: 터미널에서 `i` 키 입력 또는 `npm run ios`
- **Android Emulator**: 터미널에서 `a` 키 입력 또는 `npm run android`
- **Web Browser**: 터미널에서 `w` 키 입력 또는 `npm run web`

---

## 📱 빌드 및 배포 (Build)

Android APK 또는 iOS 앱을 빌드하는 명령:

```bash
# Android 로컬 빌드 예시
npm run android
```

---

## 📄 라이선스 (License)

이 프로젝트는 [MIT License](file:///Users/ijaegwang/wordncode/App/lebass/LICENSE)를 따릅니다.
