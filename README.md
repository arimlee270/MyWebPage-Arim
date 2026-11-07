# Arim Lee | 개인 포트폴리오

전북대학교 컴퓨터공학 및 인공지능 전공 학부생 이아림의 개인 포트폴리오 웹사이트입니다. Home, About Me, Portfolio 섹션으로 구성되어 있으며, 포트폴리오 카드에서 활동별 상세 내용을 확인할 수 있습니다.

- **배포 사이트:** [https://arimlee270.github.io/MyWebPage-Arim/](https://arimlee270.github.io/MyWebPage-Arim/)
- **GitHub 저장소:** [https://github.com/arimlee270/MyWebPage-Arim](https://github.com/arimlee270/MyWebPage-Arim)

## 웹사이트 구성

- **Home:** 이름, 전공 분야와 배경 이미지를 보여주는 첫 화면
- **About Me:** 소개, 연구 관심 분야, BCI에 관심을 갖게 된 이유, 학습 목표
- **Portfolio:** 활동 카드를 가로로 넘겨 보고, 카드를 선택해 상세 설명을 펼쳐 볼 수 있습니다. `All`, `Projects`, `Research`, `Competitions` 필터로 활동을 분류합니다.
  - **TastyTrip:** 외국인 관광객을 위한 AI 기반 음식 정보 및 식당 추천 서비스. `Projects`와 `Competitions`에 표시되며 GitHub 저장소와 라이브 데모 링크를 제공합니다.
  - **RAI Lab:** 전북대학교 RAI Lab 학부연구생 활동. `Research`에 표시됩니다.
  - **오픈소스 SW 아이디어 해커톤 캠프:** LLM 기반 감정 해소 서비스 기획 활동. `Competitions`에 표시됩니다.
  - **제주대학교 부트캠프:** 지도 기반 장소 검색·저장 및 채팅 앱 팀 프로젝트. `Projects`에 표시됩니다.
  - **Coming Soon:** 준비 중인 프로젝트 안내. `All`에서 확인할 수 있습니다.
- **화면 및 키보드 조작:** 다크 모드 전환과 운영체제의 동작 줄이기 설정을 지원합니다. 마우스를 카드에 올리거나 Tab·좌우 화살표 키로 프로젝트 카드를 선택하고 Enter 또는 Space로 상세 내용을 엽니다. 닫기 버튼 또는 Esc로 닫으면 포커스가 열었던 카드로 돌아갑니다. 메뉴, 카드, 버튼에 키보드 포커스 표시가 있습니다.
- **Footer:** GitHub, 뉴스레터, 이메일 주소 복사

## 사용 기술

- **정적 사이트 생성:** Hugo. GitHub Actions 배포 워크플로는 Hugo Extended `0.167.0`을 설치합니다.
- **템플릿 및 콘텐츠:** Hugo Go 템플릿, YAML (`site/data/content.yml`)
- **스타일 및 상호작용:** CSS, JavaScript, `prefers-reduced-motion` 설정 대응
- **프런트엔드 라이브러리 및 외부 자산:** Bootstrap 4.5.2, jQuery 3.5.1, Waypoints 4.0.1, Font Awesome 5.10, Hover.css 2.1, Rubik 웹 폰트
- **배포:** GitHub Actions와 GitHub Pages

## 로컬에서 실행하기

### 도구 설치

macOS에서는 Homebrew로 Hugo를 설치할 수 있습니다. 다른 운영체제의 설치 방법은 [Hugo 공식 설치 안내](https://gohugo.io/installation/)를 참고합니다.

```bash
brew install hugo
hugo version
```

`hugo version`에 `extended`가 포함된 Hugo Extended가 필요합니다. GitHub Actions는 Hugo Extended `0.167.0`을 사용하고, 로컬에서 검증한 버전은 `0.169.0+extended`입니다. 새 버전으로도 아래 빌드를 확인했습니다. Dart Sass와 배포용 도구는 GitHub Actions 워크플로가 버전을 지정해 준비합니다.

### 로컬 미리보기

저장소 루트에서 실행합니다.

```bash
cd site
hugo server
```

터미널에 표시되는 로컬 주소(이 설정의 기본 경로는 `http://localhost:1313/MyWebPage-Arim/`)를 브라우저에서 엽니다. 서버를 종료하려면 터미널에서 `Ctrl+C`를 누릅니다.

정적 파일을 직접 빌드하려면 저장소 루트에서 실행합니다.

```bash
cd site
hugo --minify --destination ../public
```

빌드 결과는 저장소 루트의 `public/`에 생성됩니다. 생성물은 Git에서 추적하지 않습니다.

## 주요 폴더 및 파일

```text
.
├── .github/
│   ├── pages_build.py                 # GitHub Pages 빌드 준비 및 경로 보정 스크립트
│   └── workflows/hugo-pages.yml       # Pages 빌드·배포 워크플로
├── site/
│   ├── hugo.toml                      # 사이트 주소, 메뉴, 플러그인 및 소셜 링크 설정
│   ├── data/content.yml               # Home, About Me, Portfolio 콘텐츠
│   ├── assets/images/portfolio/       # Portfolio 카드 이미지
│   ├── static/images/                 # 프로필, 배경, 로고 등 정적 이미지
│   └── themes/template/
│       ├── layouts/                   # 페이지 및 공통 레이아웃 템플릿
│       │   ├── index.html             # 메인 페이지 구성
│       │   └── partials/scripts.html  # JavaScript 자산 로드
│       ├── assets/
│       │   ├── css/style.css          # 공통 사이트 스타일
│       │   ├── css/portfolio-cards.css # 포트폴리오 카드 스타일
│       │   ├── css/reduced-motion.css # 동작 줄이기 설정 대응
│       │   └── js/script.js, hugrid.custom.js # 공통 동작 및 카드 기능
│       └── static/plugins/            # Hugrid 및 텍스트 애니메이션 파일
├── LICENSE                            # MIT 라이선스
└── README.md
```

## 파일 수정 후 배포

- 소개와 프로젝트 설명·분류: `site/data/content.yml`
- 메뉴, 사이트 주소, 외부 링크: `site/hugo.toml`
- 페이지 구조: `site/themes/template/layouts/`
- 스타일과 동작: `site/themes/template/assets/css/`, `site/themes/template/assets/js/`

수정한 뒤 저장소 루트에서 변경 파일을 커밋하고 `main`에 push합니다. `main` push가 `Deploy Hugo to GitHub Pages` 워크플로를 자동 실행하므로 저장소의 **Actions** 탭에서 build와 deploy 성공을 확인한 다음 [배포 사이트](https://arimlee270.github.io/MyWebPage-Arim/)를 새로고침합니다. 생성물 `site/public/`은 Git에 올리지 않습니다.

## GitHub Pages 배포

`.github/workflows/hugo-pages.yml`은 `main` 브랜치에 push할 때 자동 실행되며, GitHub Actions에서 수동 실행할 수도 있습니다.

1. 워크플로가 Hugo Extended와 Dart Sass를 준비하고 `.github/pages_build.py`로 빌드 의존성을 구성합니다.
2. GitHub Pages의 사이트 주소를 사용해 `site/`를 Hugo로 빌드하고, 프로젝트 경로에 맞게 생성 파일의 주소를 보정합니다.
3. 빌드 결과를 Pages 아티팩트로 업로드한 뒤 GitHub Pages에 배포합니다.

저장소의 **Settings → Pages → Build and deployment → Source**가 **GitHub Actions**로 설정되어 있어야 합니다. 배포 성공 여부는 저장소의 **Actions** 탭에서 `Deploy Hugo to GitHub Pages` 실행 결과로 확인할 수 있습니다.

## 원본 테마 및 라이선스

이 사이트는 [Port-Hugo 테마](https://github.com/tylersayshi/port-hugo)를 바탕으로 수정했습니다. 원본 테마의 README는 디자인의 출발점으로 [Somrat](https://github.com/somratpro/somrat)과 포트폴리오 그리드인 [Hugrid](https://github.com/aerohub/hugrid)을 명시하고 있습니다.

저장소의 [`LICENSE`](LICENSE) 및 테마의 [`LICENSE`](site/themes/template/LICENSE)는 MIT License이며, 원본 저작권 표기는 `Copyright (c) 2021 port-hugo`입니다. 원본 테마 안내와 크레딧은 [`site/themes/template/README.md`](site/themes/template/README.md)에서 확인할 수 있습니다.
