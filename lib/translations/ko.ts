export const ko = {
  nav: {
    applications: '애플리케이션',
    templates: '템플릿',
    resources: '리소스',
    company: '회사',
    pricing: '가격',
    blog: '블로그',
    docs: '문서',
    aboutUs: '회사 소개',
    trySandbox: '샌드박스 사용해보기',
    getApiKey: 'API 키 받기',
    aiOgSpecialist: 'AI O&G 전문가',
    aiOgDescription: '현장과 사무실 간 워크플로우를 향상시킵니다.',
    aiHr: 'AI HR',
    aiHrDescription: '반복적인 HR 워크플로우를 처리합니다.',
    aiDataScientist: 'AI 데이터 과학자',
    aiDataDescription: '대규모 데이터 워크플로우를 가속화합니다',
    securityWhitepaper: '보안 백서',
    securityDescription: '포괄적인 보안 및 규정 준수 가이드.',
    deploymentOverview: '배포 개요',
    deploymentDescription: '엔터프라이즈 배포 요구사항.',
    awsDeployment: 'AWS 배포',
    awsDescription: 'AWS VM 배포 가이드.',
    azureDeployment: 'Azure 배포',
    azureDescription: 'Azure VM 배포 가이드.',
  },
  common: {
    language: '언어',
    english: '영어',
    spanish: '스페인어',
    french: '프랑스어',
    chinese: '중국어',
    getStarted: '시작하기',
    learnMore: '더 알아보기',
    contactUs: '문의하기',
    readMore: '더 읽기',
  },
  homepage: {
    hero: {
      title: 'AnyParser: 문서 파싱을 위한 Vision LLM',
      subtitle: 'PDF, PPT, Word, 이미지 등을 몇 번의 클릭으로 구성 가능한 옵션으로 파싱!',
      description:
        'OCR 사용자의 80%가 글루 코드를 유지하는 데 지쳤습니다. 탁월한 정확도, 완전한 프라이버시, 구성 가능한 옵션으로 시간을 절약하세요:',
      features: ['개인 정보 식별 정보 제거,', '표와 차트 추출,', '각주와 헤더 유지,'],
      moreFeatures: '그리고 더 많은 기능!',
      tryFree: '무료로 사용해보기',
      getApi: 'API 액세스 받기',
      bookDemo: '데모 예약',
      noCreditCard: '신용카드가 필요 없습니다',
    },
    capabilities: {
      title: 'AnyParser의 기능',
      items: [
        '프라이버시 보호: "개인 정보 제거" 기능을 활성화하면 AnyParser가 문서 추출 중 자동으로 P.I.I.를 삭제합니다.',
        '모델에 페이지 번호, 헤더, 푸터, 그림, 차트 등을 포함하거나 생략하도록 지시할 수 있습니다.',
        'AnyParser는 텍스트와 표를 추출하는 것뿐만 아니라 중요한 정보를 포함한 그림, 차트, 각주를 2배 빠르고 5배 더 비용 효율적으로 가져옵니다.',
        '전통적인 OCR 기반 모델이 겪는 혼란스러운 표와 레이아웃 문제를 2배 더 정확하고 2.5배 더 높은 재현율로 해결합니다.',
      ],
    },
    howItWorks: {
      title: 'AnyParser 작동 방식',
      subtitle: '직관적인 사용자 인터페이스로 모든 문서에서 데이터를 파싱',
      tryFree: '무료로 사용해보기',
      steps: [
        {
          title: '01',
          subtitle: '문서를 드래그 앤 드롭',
          description:
            "문서를 파싱하려면 '파일 업로드'를 클릭하여 문서를 드래그 앤 드롭하거나 클립보드에서 스크린샷을 붙여넣으세요. 시작을 돕기 위한 샘플 문서도 제공됩니다.",
        },
        {
          title: '02',
          subtitle: '파싱 및 프라이버시 설정 편집',
          description:
            'AnyParser는 PII(개인 식별 정보), 각주, 표 등 다양한 정보를 자동으로 분류합니다. 필요한 데이터를 간단히 내보내세요!',
        },
        {
          title: '03',
          subtitle: '결과를 시스템에 내보내기',
          description:
            'HTML, Excel, JSON 또는 비즈니스 워크플로우에 맞춘 데이터베이스 스키마 등 선호하는 형식으로 데이터를 다운로드하세요.',
        },
      ],
    },
    banners: [
      {
        title: '정확한 데이터 파싱',
        description:
          'AnyParser 플레이그라운드는 직관적이고 빠르며 간단합니다. 지금 인터페이스를 사용해보고 하루를 여유롭게 보내세요.',
        actionLabel: '무료로 사용해보기',
      },
      {
        title: 'AnyParser로 구축하기',
        description:
          'AnyParser 플레이그라운드는 직관적이고 빠르며 정말 간단합니다. 지금 인터페이스를 사용해보고 하루를 여유롭게 보내세요.',
        actionLabel: 'API 액세스 받기',
      },
    ],
  },
  reviews: {
    title: '리뷰',
    testimonials: [
      {
        text: '"모든 PDF 추출 도구를 시도해봤지만 AnyParser가 가장 정확한 결과를 제공했습니다."',
        author: '리처드 송',
        position: 'CEO - Epsilla',
      },
      {
        text: '"AnyParser는 벤치마크에서 10개 이상의 다른 파서를 능가하며, 최고의 이력서 파싱 정확도를 제공하는 가장 빠른 멀티 모델 LLM 솔루션을 유지하면서도 뛰어난 성능을 보여줍니다."',
        author: '에단 정',
        position: 'CTO - Jobright',
      },
      {
        text: '"AnyParser의 고급 멀티모달 AI는 다른 접근 방식이 실패하는 곳에서 성공합니다. 복잡한 문서는 이러한 시각과 언어의 융합이 필요합니다."',
        author: '존 콘라트',
        position: '수석 과학자 - AWS',
      },
      {
        text: '"AI 교육자로서, 저는 ML 실무자 학생들을 위해 최첨단 솔루션을 찾습니다. AnyParser는 문서 파싱에서 검색 정확도를 향상시키면서 보안, 비용, 효율성을 균형 있게 제공합니다. 모든 파이프라인에 적합한 혁신적인 도구입니다!"',
        author: '캐스',
        position: '수석 과학자 - AWS',
      },
      {
        text: '"AI 및 LLM 분야에서 AnyParser의 혁신에 깊은 인상을 받았습니다. 합성 데이터 생성, RAG에서의 검색 모델 미세 조정, 그리고 이러한 혁신에서 나온 오픈 소스 제품의 독창적인 방법론을 포함합니다."',
        author: '펠릭스 바이',
        position: '수석 솔루션 아키텍트 - AWS',
      },
      {
        text: '"AnyParser의 품질이 Langchain / Unstructured와 같은 전통적인 OCR 도구를 훨씬 능가한다는 것을 확인했습니다. 향후 프로젝트에서 이를 사용하는 것이 기대됩니다."',
        author: '스티브 쿠퍼',
        position: '공동 창업자 - ai ticker chat',
      },
      {
        text: '"다른 도구보다 훨씬 낫습니다! 우리 데이터 분석가들은 출력량을 세 배로 늘릴 수 있었습니다."',
        author: '자말',
        position: 'CEO - xtrategise',
      },
    ],
  },
  company: {
    whoWeAre: {
      title: '우리는 누구인가',
      description: [
        'Energent.ai는 AWS와 테슬라의 전 ML 과학자 및 엔지니어들로 구성된 팀으로, 다양한 산업에서 R&D를 가속화하기 위해 AI를 활용하는 데 열정을 가지고 있습니다.',
        '우리 팀의 머신 러닝 전문성과 산업별 통찰력의 조합은 최첨단 기술뿐만 아니라 고객의 요구에 깊이 맞춘 기술을 창조할 수 있게 합니다.',
      ],
    },
    whatWeOffer: {
      title: '우리가 제공하는 것',
      description: [
        'Energent.ai는 PDF, HTML, 이미지와 같은 혼합 형식에서 비정형 데이터를 정밀하게 추출하는 LLM 기반 데이터 강화 도구를 제공합니다.',
        'Energent.ai를 통해 ML 과학자와 R&D 엔지니어는 데이터 정리에 80%의 시간을 소비하거나 정보 손실을 걱정하지 않고 정확한 정보를 추출할 수 있습니다. 사용자는 복잡한 연구 질문을 하고 여러 데이터 소스에서 의미론적 트렌드를 식별하며, 심층적인 해석을 통해 LLM 출력을 이해하여 R&D 프로세스를 가속화할 수 있습니다.',
      ],
    },
    foundingTeam: {
      title: '창립 팀',
    },
    investors: {
      title: '우리의 투자자들',
    },
    getStarted: {
      title: '시작할 준비가 되었나요?',
      description: 'Energent.ai를 통해 R&D 프로세스를 가속화하는 수천 명의 연구자와 엔지니어에 합류하세요.',
      buttonText: '시작하기',
      docsButtonText: '문서 읽기',
    },
  },
  pricing: {
    billing: {
      monthly: '월간',
      annually: '연간',
      perMonth: '/월',
      perYear: '/년',
    },
    realTimeApi: {
      title: '실시간 API 가격',
      description: '페이지당 0.5~5초의 실시간 응답 속도를 갖춘 가장 빠른 비전 언어 모델.',
    },
    plans: {
      starter: {
        name: '스타터',
        monthlyPrice: '499',
        annualPrice: '5000',
        description: '실시간 문서 처리 및 데이터 추출을 시작하려는 기업을 위한 플랜.',
        features: [
          '전체 텍스트를 Markdown으로 추출하거나 PDF/이미지에서 표를 CSV로 추출',
          '월 20,000 크레딧, 이후 크레딧당 $0.025',
          '키 값 쌍을 JSON으로 추출',
          '사용하지 않은 크레딧은 다음 달로 이월',
          '숨겨진 비용 없음',
          '30일 환불 보장',
        ],
      },
      silver: {
        name: '실버',
        monthlyPrice: '1500',
        annualPrice: '15000',
        description: '확장된 지원 및 기능으로 문서 처리를 확장하려는 팀을 위한 플랜.',
        features: [
          '스타터 플랜의 모든 기능',
          '월 100,000 크레딧, 이후 크레딧당 $0.015',
          '맞춤형 클라이언트 온보딩',
          '사용하지 않은 크레딧은 다음 달로 이월',
          '숨겨진 비용 없음',
          '30일 환불 보장',
        ],
      },
      gold: {
        name: '골드',
        monthlyPrice: '4500',
        annualPrice: '45000',
        description: '고급 기능, 프라이빗 호스팅, 프리미엄 지원이 필요한 기업을 위한 플랜.',
        features: [
          '실버 플랜의 모든 기능',
          '월 500,000 크레딧, 이후 크레딧당 $0.009',
          '프라이빗 모델 호스팅(온프레미스 또는 클라우드)',
          '맞춤화 서비스 제공',
          '사용하지 않은 크레딧은 다음 달로 이월',
          '숨겨진 비용 없음',
          '30일 환불 보장',
        ],
      },
      enterprise: {
        name: '엔터프라이즈',
        price: '문의하기',
        description: '맞춤형 솔루션, 전담 지원, 엔터프라이즈급 보안을 필요로 하는 대규모 조직을 위한 플랜.',
        features: [
          '골드 플랜의 모든 기능',
          '맞춤형 모델 트레이닝',
          '사용자 정의 통합 및 API 응답',
          '개인 맞춤형 1-1 팀 교육',
          '전담 계정 관리자',
          '우선 지원',
        ],
      },
    },
    disclaimers: {
      noHiddenFees: '* 숨겨진 요금 없음; 월별 사용료; 30일 환불 보장.',
      tokenExplanation: '** 500 토큰을 초과하는 페이지는 추가 500 토큰마다 추가 크레딧이 발생합니다.',
    },
    specialOffer: {
      title: '🎉 스타트업 및 비영리 단체를 위한 특별 혜택! 🎉',
      getStart: '받기',
      highlight: '3개월 무료',
      forText: '스타트업 대상',
      startupDetails: '(10명 이하)',
      orText: '또는',
      nonprofitText: '비영리 단체.',
      emailText: '이메일',
      emailLink: 'info@cambioml.com',
      redeemText: '크레딧을 사용하려면 이메일을 보내세요!',
    },
  },
  playground: {
    title: 'AnyParser 샌드박스',
    description: 'PDF*, PPT 및 이미지**에서 전체 콘텐츠를 빠르고 정확하게 추출하는 최초의 LLM.',
    tabs: {
      plainText: '전체 콘텐츠',
      table: '테이블만',
      keyValuePair: '키-값 쌍 추출',
    },
    disclaimers: {
      pageLimit: '*업로드된 파일마다 처음 10페이지만 처리하여 더 나은 가용성을 제공합니다.',
      fileSize:
        '**최대 파일 크기는 10MB입니다. 이 페이지를 새로 고치면 모든 파일과 처리된 데이터가 삭제됩니다. 우리는 데이터를 저장하지 않습니다.',
      privacyPolicy: 'AnyParser 개인정보 보호정책 보기.',
    },
    feedback: {
      button: '피드백',
      title: '샌드박스 피드백',
      nameLabel: '이름',
      emailLabel: '이메일',
      messageLabel: '메시지',
      submitButton: '제출',
      successMessage: '전송 완료!',
      errorMessage: '연락 실패. 다시 시도해주세요.',
    },
    files: {
      title: '파일',
      uploadFile: '파일 업로드',
      pleaseUploadFile: '파일을 업로드하세요.',
      noFilesUploaded: '업로드된 파일 없음',
    },
    quota: {
      title: '할당량',
      pages: '페이지',
      limitReached: '페이지 추출 한도에 도달했습니다.',
      contactForMore: '추가 페이지 할당량을 얻으려면 저희에게 연락하세요.',
      contactEmail: 'info@cambioml.com',
    },
    upload: {
      dragAndDrop: '여기에 파일을 드래그 앤 드롭하거나 클릭하여 파일을 선택하세요',
      dropFiles: '파일을 여기에 드롭하세요',
      filesOnly: '파일만',
      maxSize: '최대 크기 10MB',
      noSensitiveInfo: '민감한 정보를 업로드하지 마세요.',
      fileTypeNotSupported: '지원되지 않는 파일 유형입니다.',
      sizeLimitExceeded: '크기가 {limit}MB 한도를 초과했습니다. 다시 시도해주세요.',
    },
    uploadModal: {
      or: '또는',
      pasteScreenshot: '스크린샷 붙여넣기',
      uploading: '업로드 중',
    },
    keyValue: {
      keyNamePlaceholder: '키 이름',
      keyDescriptionPlaceholder: '(선택 사항) 키를 정의하여 AnyParser의 정확도를 향상시키세요',
      keyNameRequired: '키 이름은 필수입니다',
      addKeyValuePair: '키-값 쌍 추가',
      removeKeyValuePair: '키-값 쌍 제거',
      expandKeyDescription: '키 설명 확장',
      extract: '추출',
      extracting: '추출 중...',
      extractKeyValue: '키-값 추출',
      extractKeyValuePairs: '키-값 쌍 추출',
      yourKeys: '당신의 키',
      inputRemoved: '입력 제거됨',
      undo: '실행 취소',
      maxInputsAllowed: '최대 10개의 입력만 허용됩니다',
      newInputAdded: '새 입력 추가됨',
      removeUndone: '제거 실행 취소됨',
    },
    info: {
      plainText: {
        title: '전체 콘텐츠 추출',
        description: 'AnyParser를 사용하면 PDF, TXT 및 HTML 파일과 같은 원시 비구조화 데이터를 추출할 수 있습니다.',
        howTo:
          "파일을 업로드하고 선택한 후 'Plain Text' 흐름을 실행하면 파일의 콘텐츠를 추출하여 Markdown 형식으로 반환합니다.",
        nextSteps: '다음 단계',
        nextStepsDescription:
          '추출된 테이블에서 원시 Markdown을 텍스트 파일로 다운로드하거나 JSON을 다운로드할 수 있습니다.',
      },
      table: {
        title: '테이블만 추출',
        description:
          'AnyParser를 사용하면 파일에서 테이블을 추출하고 특정 키를 추출하여 데이터베이스 스키마에 매핑할 수 있습니다.',
        step1: '1. 테이블 추출',
        step1Description:
          '먼저 파일에서 테이블을 추출해야 합니다. AnyParser는 모든 테이블을 HTML 형식으로 추출합니다.\n\n추출 후 원시 HTML을 다운로드하거나 모든 테이블을 Excel 파일로 다운로드할 수 있습니다.',
        step2: '2. 매핑할 테이블 선택',
        step2Description:
          '테이블 추출을 실행한 후 데이터를 추출하려는 테이블을 선택하세요.\n\n이 섹션에서는 각 테이블의 HTML을 미리 볼 수 있는 기능도 제공합니다.',
        step3: '3. 스키마 매핑',
        step3Description:
          "테이블을 추출하고 선택한 후 추출하려는 키를 추가할 수 있습니다. 매핑된 키를 제거하려면 상자에서 (X)를 클릭하세요. 입력 키를 제거하려면 상자에서 (X) 아이콘을 클릭할 수 있습니다.\n\n키를 추가한 후 스키마 매핑 기능을 실행할 수 있습니다. 매핑 후에는 편집 연필 아이콘을 클릭하여 매핑된 키를 편집할 수 있습니다.\n\n'스키마 매핑'을 다시 클릭하면 매핑된 키 없이 입력 키만 다시 실행됩니다. 새 매핑된 키를 생성하려면 먼저 매핑된 키를 제거한 후 X를 클릭하세요.",
        nextSteps: '다음 단계',
        nextStepsDescription:
          '출력에 만족하면 CSV 또는 JSON을 다운로드할 수 있습니다. 이는 최소한 하나의 입력 키에 비어 있지 않은 매핑된 키가 있는 경우에만 활성화됩니다.',
      },
      keyValuePair: {
        title: '키-값 쌍 추출',
        description:
          'AnyParser를 사용하면 송장, 계약서 또는 양식과 같은 원시 비구조화 데이터에서 구조화된 키-값 쌍을 식별하고 추출할 수 있습니다.',
        howTo:
          "파일을 업로드하고 선택한 후 'Key-Value Pair' 흐름을 실행하면 파일을 분석하고 주요 필드를 식별하며 해당 값을 구조화된 JSON 형식으로 추출합니다.",
        nextSteps: '다음 단계',
        nextStepsDescription:
          '추출된 키-값 쌍을 JSON 파일로 다운로드하거나 API를 통해 워크플로우와 직접 통합하여 추가 처리를 자동화할 수 있습니다.',
      },
    },
    comingSoon: '곧 출시 예정',
  },
  solutionPages: {
    compliance: {
      title: 'ComplianceAI',
      description: 'LLM으로 자동 준수',
      section: {
        title: 'AI 평가자를 사용하여 준수 프로세스를 자동화하세요',
        paragraph:
          '개인 LLM의 준수 또는 위험이 걱정되십니까? 우리는 규제 준수 및 위험 관리를 위한 전문 준수 LLM을 제공합니다. 이 시스템은 규제 변경 사항을 자동으로 모니터링하고 내부 정책 및 통제와 일치시켜 중요한 규정 및 요구 사항에 대한 적시 추적, 대응 및 보고를 보장합니다.',
      },
      useCases: [
        {
          title: '준수 사용 사례 1',
          description: '준수를 위해 uniflow를 사용하세요.',
        },
      ],
      button: 'AutoRater 시작하기',
      autorater: {
        title: 'AutoRater',
        description: 'LLM으로 자동 준수',
        section: {
          title: 'AI 평가자를 사용하여 AutoRater 프로세스를 자동화하세요',
          paragraph:
            '개인 LLM의 AutoRater 또는 위험이 걱정되십니까? 우리는 규제 AutoRater 및 위험 관리를 위한 전문 AutoRater LLM을 제공합니다. 이 시스템은 규제 변경 사항을 자동으로 모니터링하고 내부 정책 및 통제와 일치시켜 중요한 규정 및 요구 사항에 대한 적시 추적, 대응 및 보고를 보장합니다.',
        },
      },
    },
    finance: {
      title: '통찰력을 발견하기 위한 맞춤형 AI 비서',
      description:
        '잘못 가격이 책정된 주식을 더 빠르게 찾으세요.\n실제 데이터를 사용하여 투자 결정을 설명하세요.\n자신의 독점 AI 에이전트를 완전히 소유하고 제어하세요.',
      iconSection: {
        title: 'LLM을 사용하여 포트폴리오 성과를 향상시키는 데 관심이 있으신가요?',
        points: [
          '비구조화된 데이터에서 거래 신호를 10배 더 빠르게 추출하고 싶으신가요?',
          '거래 신호를 해석하기 위한 맞춤형 AI 설명자가 필요하신가요?',
          '공공 LLM API를 사용하는 정보 유출이 걱정되십니까?',
        ],
      },
      features: [
        {
          title: '다중 소스 데이터에서 알 수 없는 통찰력에 접근',
          text: '데이터 정리에 소요되는 시간을 최대 90% 줄이세요\n\n다중 소스에서 10배 더 많은 금융 통찰력을 얻으세요\n\n자신의 독점 AI 에이전트를 완전히 소유하고 제어하세요',
        },
        {
          title: '증거를 사용하여 투자 결정을 해석하세요',
          text: '자신의 투자 결정을 실제 데이터로 뒷받침하세요\n\n자신의 스타일로 경제학자 관점을 작성하세요\n\n자신의 독점 AI 에이전트를 완전히 소유하고 제어하세요',
        },
        {
          title: '사용 사례',
        },
      ],
    },
    researchDevelopment: {
      title: 'R&D에서 알려진 것을 접근하고\n알려지지 않은 것을 발견하세요',
      description:
        '데이터 정리에 소요되는 시간을 최대 90% 줄이세요\n최신 연구를 최신 상태로 유지하세요\nR&D에서 알려지지 않은 것을 쉽게 발견하세요',
      features: [
        {
          title: '다중 소스 데이터에서 알 수 없는 통찰력에 접근',
          text: '• 데이터 정리에 소요되는 시간을 최대 90% 줄이세요\n• R&D에서 알려지지 않은 것을 쉽게 발견하세요\n• 자신의 독점 AI 에이전트를 완전히 소유하고 제어하세요',
        },
        {
          title: '최신 연구를 증명하기 위해 연구 보고서를 작성하세요',
          text: '• 실제 데이터를 사용하여 연구의 참신성을 뒷받침하세요\n• 최신 연구와 쉽게 비교하세요\n• 자신의 독점 AI 에이전트를 완전히 소유하고 제어하세요',
        },
        {
          title: '사용 사례',
        },
      ],
    },
  },
  footer: {
    copyright: 'Cambio Corp',
    libraries: {
      title: '라이브러리',
      anyParser: 'AnyParser',
    },
    solutions: {
      title: '솔루션',
      finance: '금융',
      blog: '블로그',
    },
    sandbox: {
      title: '샌드박스',
      launchSandbox: '샌드박스 실행',
      account: '계정',
    },
    company: {
      title: '회사',
      aboutUs: '회사 소개',
    },
    resources: {
      title: '리소스',
      anyParserDocs: 'AnyParser 문서',
      privacyPolicy: '개인정보 보호정책',
      termsOfService: '서비스 이용약관',
    },
  },
  account: {
    title: '계정',
    profile: {
      title: '프로필',
      errorLoading: '사용자 프로필 로드 오류',
      pleaseLogin: '로그인해주세요.',
      welcome: '환영합니다',
    },
    apiKey: {
      title: 'AnyParser API 키',
      gettingStarted: 'AnyParser 시작하기',
      limitedTime: '한정된 시간!',
      freePages: '각 API는 최대 100페이지를 무료로 추출할 수 있습니다!',
      note: '참고:',
      limitations: [
        '무료 API 키는 API 호출당 최대 10개의 추출 페이지로 제한됩니다.',
        'AnyParser는 절대 사용자의 데이터를 저장하거나 학습하지 않습니다.',
      ],
      verifyEmail: 'API 키를 생성하고 복사하려면 이메일을 확인해주세요.',
      resendVerification: '확인 이메일 다시 보내기',
      sendingVerification: '확인 이메일 보내는 중...',
      maxKeysGenerated: '최대 API 키를 생성했습니다',
      generateNew: '새 API 키 생성',
      generating: '생성 중...',
    },
    subscriptions: {
      title: '구독',
      description: '제품을 확인하거나 구독을 수정하세요.',
      viewProducts: '제품 보기',
    },
    documentation: 'AnyParser 문서를 확인하세요',
  },
  auth: {
    login: '로그인',
    logout: '로그아웃',
  },
  blog: {
    noPosts: '아직 블로그 게시물이 없습니다.',
    checkBackSoon: '곧 업데이트를 확인하세요!',
    backTo: '돌아가기',
  },
  bookDemo: {
    title: '데모 예약',
    pageTitle: '🗓️ 데모 예약',
    pageDescription: '데이터 추출을 최대화하는 방법을 보여드리겠습니다',
    formTitle: '데모 요청 폼',
    submitted: {
      title: '데모 요청이 제출되었습니다!',
      subtitle: '검토 후 곧 연락드리겠습니다',
      goHomeButton: '홈페이지로 이동',
    },
    form: {
      name: '이름',
      email: '이메일',
      company: '회사',
      linkedin: 'LinkedIn',
      message: '메시지',
      helpMessage: '어떻게 도와드릴까요?',
      submit: '제출',
      emailValidation: '유효한 이메일 주소를 입력해주세요.',
    },
    calendly: {
      submitFormMessage: '데모 요청 폼을 제출해주세요',
      backToPreview: '미리보기로 돌아가기',
    },
    sent: '보냈습니다!',
    error: '연락 실패. 다시 시도해주세요.',
  },
  notFound: {
    title: '404',
    subtitle: '이런! 이 페이지는 존재하지 않습니다',
    goHome: '홈페이지로 이동',
  },
  messages: {
    success: {
      sent: '보냈습니다!',
      subscriptionSuccessful: '구독이 성공적으로 완료되었습니다!',
      apiKeyCopied: 'API 키가 클립보드에 복사되었습니다!',
      verificationResent: '확인 이메일이 다시 발송되었습니다!',
      fileUploaded: '파일이 성공적으로 업로드되었습니다!',
      resultCopied: '결과가 클립보드에 복사되었습니다',
      extractionComplete: '추출이 완료되었습니다!',
      newInputAdded: '새 입력이 추가되었습니다',
      removeUndone: '제거 취소됨',
      generatingFor: '요약을 생성 중',
      summariesGenerated: '요약이 생성되었습니다',
      downloadingSummaries: '요약을 다운로드 중',
      tablesGenerated: '테이블이 생성되었습니다',
      schemaMapGenerated: '스키마 맵이 생성되었습니다',
      extracted: '추출 완료!',
    },
    error: {
      contactFailed: '연락 실패. 다시 시도해주세요.',
      pleaseSignIn: '구독을 관리하려면 로그인해주세요',
      errorFetchingApiKeys: 'API 키를 가져오는 중 오류 발생',
      errorResendingEmail: '확인 이메일 다시 보내기 오류',
      failedAccessToken: '액세스 토큰 가져오기 실패',
      fileTypeNotSupported: '파일 형식이 지원되지 않습니다.',
      maxFileSize: '최대 파일 크기는 10MB입니다.',
      loadingStarterFile: '시작 파일 로드 오류. 다시 시도해주세요.',
      undefinedResult: '정의되지 않은 결과를 받았습니다. 다시 시도해주세요.',
      parameterInvalid: '매개변수가 유효하지 않습니다. 다시 시도해주세요.',
      jobNotFound: '작업을 찾을 수 없습니다. 다시 시도해주세요.',
      pageLimitReached: '페이지 추출 한도에 도달했습니다.',
      jobFailed: '작업이 실패했습니다. 다시 시도해주세요.',
      extractionError: '추출 오류. 다시 시도해주세요.',
      requestTimeout: '요청 시간이 초과되었습니다. 다시 시도해주세요.',
      invalidModelType: '유효하지 않은 모델 유형입니다. 다시 시도해주세요.',
      uploadError: '업로드 오류. 다시 시도해주세요.',
      noTablesFound: 'Excel로 내보낼 테이블이 없습니다',
      noValidTables: 'Excel로 내보낼 유효한 테이블이 없습니다',
      maxInputsReached: '최대 10개의 입력이 허용됩니다',
      extractLimitReached: '추출 한도에 도달했습니다.',
      extractionFailed: '추출 실패. 다시 시도해주세요.',
      errorDuringExtraction: '추출 중 오류 발생. 다시 시도해주세요.',
      selectFileFirst: '먼저 파일을 선택해주세요',
      noFileSelected: '선택된 파일이 없습니다',
      missingFormData: '폼 데이터가 누락되었습니다. 다시 시도해주세요.',
      schemaExtractionError: '스키마 추출 오류. 다시 시도해주세요.',
      undefinedMarkdown: '정의되지 않은 마크다운을 받았습니다. 다시 시도해주세요.',
      errorMapping: '스키마 매핑 오류 발생. 다시 시도해주세요.',
    },
  },
} as const;
