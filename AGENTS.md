# Expo 버전 규칙

코드 작성 전 Expo 버전 문서(SDK 54)를 명확히 확인하세요: https://docs.expo.dev/versions/v54.0.0/

# 테마 작업 규칙 (Theme Modification Rules)

1. 사용자가 특정 테마 작업을 명시할 때(예: "테마3 작업이야"), 해당 전용 테마(예: `themeColors.ts`의 `theme3Neon` 또는 테마3 전용 로직)에만 시각적 스타일 수정을 적용하고, 타 테마의 색상, 위치, 컴포넌트 레이아웃에는 영향을 주지 마세요.
2. 사용자가 명시적으로 타 테마 함께 적용을 지시할 때만(예: "테마1, 테마2도 함께 적용해줘") 공통 컴포넌트 위치/레이아웃 수정 또는 모든 테마(테마1, 테마2, 테마3)를 동시에 업데이트하세요.

# 용어 정의 규칙 (Terminology Rules)

- 경기 진행 화면 하단 제어바(일시정지, 경기 종료, 되돌리기, 테마 변경, 경기 설정, 경기 리셋 등) 영역 내의 버튼 모음을 앞으로 **독 버튼 (Dock Buttons / GameControlBar)**으로 칭합니다.

# 깃 커밋 메시지 규칙 (Git Commit Rules)

- 깃 커밋(Git Commit) 시 커밋 메시지 본문 및 요약은 반드시 **한글(한국어)**로 작성하여 커밋 및 푸시하세요.

# 코드 검증 규칙 (Code Verification Rules)

- 모든 코드 작성 및 수정 후에는 커밋/응답 전 반드시 Expo 검증 명령어(`npx expo export --platform web`)를 수행하여 문법(Syntax) 또는 모듈 파싱 오류가 없는지 사전 체킹하세요.

