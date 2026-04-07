/**
 * Hpeerage Global Configuration
 * 로컬 개발 및 운영 환경 전환을 관리합니다.
 */

const CONFIG = {
    // 현재 환경 설정 ('LOCAL' 또는 'PRODUCTION')
    ENV: 'PRODUCTION',

    // 기본 URL 설정 (로컬 환경에서는 현재 상대 경로 기반)
    BASE_URL: window.location.origin + window.location.pathname.split('/').slice(0, -1).join('/') + '/',

    // GitHub API 설정 (운영 환경용)
    GITHUB: {
        OWNER: 'hpeerage',
        REPO: 'hpeerage',
        BRANCH: 'main',
        BASE_API: 'https://api.github.com/repos/hpeerage/hpeerage/contents/',
        RAW_URL: 'https://raw.githubusercontent.com/hpeerage/hpeerage/main/web/'
    },

    // 로컬 개발 모드 옵션
    LOCAL_FIRST: {
        PUSH_ENABLED: false, // 로컬 모드에서 GitHub 자동 푸시 비활성화
        SAVE_VIA_DOWNLOAD: true, // 저장 요청 시 JSON 파일 다운로드 제공
        INQUIRY_DB: 'data/temp_inquiry.json' // 로컬 문의 저장 경로
    },

    // 구글 스크립트 이메일 연동 주소
    // 발급받은 웹 앱 URL을 여기에 붙여넣으세요.
    GAS_URL: 'https://script.google.com/macros/s/AKfycbxgZWV7XciGEXIeKQgDJTs_CF8MwcVm-yNIXfm82YAjJyY1W9zQDg-elne4wWeVs2yc/exec',

    // 상대 경로 기반 동적 매핑 유틸리티
    getAssetPath(path) {
        if (path.startsWith('http')) return path;
        // 경로가 '/'로 시작하지 않도록 정규화 후 리턴
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        return this.BASE_URL + cleanPath;
    }
};

// 전역 변수로 노출 (스크립트 태그로 로드 시 사용)
window.hConfig = CONFIG;
