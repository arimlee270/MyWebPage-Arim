# Arim Lee | 개인 포트폴리오

전북대학교 컴퓨터공학 및 인공지능 전공 학부생 이아림의 개인 포트폴리오 웹사이트입니다. Home, About Me, Portfolio 섹션으로 구성되어 있으며, 프로젝트 카드를 선택하면 상세 내용을 볼 수 있습니다.

- **배포 사이트:** [https://arimlee270.github.io/MyWebPage-Arim/](https://arimlee270.github.io/MyWebPage-Arim/)
- **GitHub 저장소:** [https://github.com/arimlee270/MyWebPage-Arim](https://github.com/arimlee270/MyWebPage-Arim)

## 웹사이트 구성

- **Home:** 이름, 전공 분야와 배경 이미지를 보여주는 첫 화면
- **About Me:** 소개, 연구 관심 분야, BCI에 관심을 갖게 된 이유, 학습 목표
- **Portfolio:** 프로젝트 카드 및 상세 설명
  - **TastyTrip:** 외국인 관광객을 위한 AI 기반 음식 정보 및 식당 추천 서비스. GitHub 저장소와 라이브 데모 링크 제공
  - **RAI Lab:** 전북대학교 RAI Lab 학부연구생 활동
  - **Coming Soon:** 준비 중인 프로젝트 안내
- **Footer:** GitHub, 뉴스레터, 이메일 주소 복사

## 사용 기술

- **정적 사이트 생성:** Hugo. GitHub Actions 배포 워크플로는 Hugo Extended `0.167.0`을 설치합니다.
- **템플릿 및 콘텐츠:** Hugo Go 템플릿, YAML (`site/data/content.yml`)
- **스타일 및 상호작용:** CSS, JavaScript
- **프런트엔드 라이브러리 및 외부 자산:** Bootstrap 4.5.2, jQuery 3.5.1, Waypoints 4.0.1, Font Awesome 5.10, Hover.css 2.1, Rubik 웹 폰트
- **배포:** GitHub Actions와 GitHub Pages

## 로컬에서 실행하기

먼저 Hugo Extended를 설치합니다. 이 저장소의 GitHub Actions 워크플로는 Hugo Extended `0.167.0`을 사용합니다. 설치 후 저장소 루트에서 아래 명령을 실행합니다.

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
│       ├── assets/css/style.css       # 사이트 스타일
│       ├── assets/js/                 # 메뉴 및 프로젝트 상세보기 동작
│       └── static/plugins/            # Hugrid 및 텍스트 애니메이션 파일
├── LICENSE                            # MIT 라이선스
└── README.md
```

## GitHub Pages 배포

`.github/workflows/hugo-pages.yml`은 `main` 브랜치에 push할 때 자동 실행되며, GitHub Actions에서 수동 실행할 수도 있습니다.

1. 워크플로가 Hugo Extended와 Dart Sass를 준비하고 `.github/pages_build.py`로 빌드 의존성을 구성합니다.
2. GitHub Pages의 사이트 주소를 사용해 `site/`를 Hugo로 빌드하고, 프로젝트 경로에 맞게 생성 파일의 주소를 보정합니다.
3. 빌드 결과를 Pages 아티팩트로 업로드한 뒤 GitHub Pages에 배포합니다.

저장소의 **Settings → Pages → Build and deployment → Source**가 **GitHub Actions**로 설정되어 있어야 합니다. 배포 성공 여부는 저장소의 **Actions** 탭에서 `Deploy Hugo to GitHub Pages` 실행 결과로 확인할 수 있습니다.

## 원본 테마 및 라이선스

이 사이트는 [Port-Hugo 테마](https://github.com/tylersayshi/port-hugo)를 바탕으로 수정했습니다. 원본 테마의 README는 디자인의 출발점으로 [Somrat](https://github.com/somratpro/somrat)과 포트폴리오 그리드인 [Hugrid](https://github.com/aerohub/hugrid)을 명시하고 있습니다.

저장소의 [`LICENSE`](LICENSE) 및 테마의 [`LICENSE`](site/themes/template/LICENSE)는 MIT License이며, 원본 저작권 표기는 `Copyright (c) 2021 port-hugo`입니다. 원본 테마 안내와 크레딧은 [`site/themes/template/README.md`](site/themes/template/README.md)에서 확인할 수 있습니다.
