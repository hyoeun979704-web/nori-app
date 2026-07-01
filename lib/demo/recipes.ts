// 시연용 샘플 놀이 데이터 (Wizard of Oz — 실제 AI 호출 없이 미리 작성한 결과물)
// 발달 단계 기반으로 작성. 추후 실제 AI 생성으로 대체 예정.

export type AgeKey = '0-1' | '1-2' | '3-4' | '5+'
export type ItemKey = 'none' | 'towel' | 'cup' | 'sock' | 'tube' | 'box' | 'clip'

export const AGES: { key: AgeKey; label: string }[] = [
  { key: '0-1', label: '돌 전' },
  { key: '1-2', label: '1~2세' },
  { key: '3-4', label: '3~4세' },
  { key: '5+', label: '5세+' },
]

export const ITEMS: { key: ItemKey; label: string; emoji: string }[] = [
  { key: 'none', label: '맨몸으로', emoji: '🤲' },
  { key: 'towel', label: '수건', emoji: '🧺' },
  { key: 'cup', label: '종이컵', emoji: '🥤' },
  { key: 'sock', label: '양말', emoji: '🧦' },
  { key: 'tube', label: '휴지심', emoji: '🧻' },
  { key: 'box', label: '박스', emoji: '📦' },
  { key: 'clip', label: '빨래집게', emoji: '🧷' },
]

export type Recipe = {
  emoji: string
  title: string
  prep: string
  steps: string[] // 순서 (보통 3단계)
  talk: string // 부모가 건네는 말 (언어 자극)
  grow: string // 발달 포인트
  safety: string // 안전 고지
}

type RecipeEntry = Recipe & { item: ItemKey; ages: AgeKey[] }

// 핵심 조합을 커버하는 큐레이션 세트
const RECIPES: RecipeEntry[] = [
  {
    item: 'towel', ages: ['0-1'],
    emoji: '🧺', title: '수건 까꿍 — 어디 숨었지?',
    prep: '수건 1장',
    steps: [
      '수건으로 엄마 아빠 얼굴을 가렸다가 "까꿍!" 하고 나타나요.',
      '이번엔 아이가 좋아하는 인형을 수건 밑에 숨겨요.',
      '"어? 어디 갔지?" 하고 아이가 직접 수건을 걷어 찾게 해요.',
    ],
    talk: '"없네? … 있다! 우와, 우리 아기가 찾았네!"',
    grow: '숨은 것이 사라지지 않고 그대로 있다는 걸 배우는 대상영속성. 돌 전 아기의 핵심 인지 발달이에요.',
    safety: '작은 부품은 쓰지 않았어요. 수건이 얼굴을 오래 덮지 않도록 곁에서 지켜봐 주세요.',
  },
  {
    item: 'towel', ages: ['1-2', '3-4'],
    emoji: '🧺', title: '수건 위 보물 찾기',
    prep: '수건 1장, 작은 장난감 2~3개',
    steps: [
      '수건을 펼치고 그 위에 장난감을 올린 뒤 수건째 덮어요.',
      '"무엇이 숨었을까?" 하고 아이가 수건을 들춰 찾게 해요.',
      '찾은 물건의 이름과 색깔을 함께 말해봐요.',
    ],
    talk: '"이번엔 빨간 자동차가 숨었네! 다음은 뭐가 나올까?"',
    grow: '기억과 호기심, 사물의 이름·색을 익히는 언어 발달.',
    safety: '입에 들어갈 만큼 작은 물건은 빼고, 큰 장난감으로 해주세요.',
  },
  {
    item: 'cup', ages: ['1-2'],
    emoji: '🥤', title: '종이컵 쿵쿵 탑 쌓기',
    prep: '종이컵 4~5개',
    steps: [
      '종이컵을 하나씩 위로 쌓아 탑을 만들어요.',
      '"하나, 둘, 셋… 쿵!" 하며 손으로 무너뜨려요.',
      '아이가 직접 쌓고 무너뜨리기를 반복하게 해요.',
    ],
    talk: '"우와~ 다 무너졌다! 또 쌓을까?"',
    grow: '쌓고 무너뜨리는 손동작(소근육), 그리고 "내가 하면 무너진다"는 인과관계 인지.',
    safety: '종이컵 가장자리에 입을 베이지 않도록 부드러운 컵으로, 곁에서 지켜봐 주세요.',
  },
  {
    item: 'cup', ages: ['3-4', '5+'],
    emoji: '🥤', title: '종이컵 볼링장',
    prep: '종이컵 6개, 양말을 뭉친 공',
    steps: [
      '종이컵을 삼각형으로 세워 볼링핀을 만들어요.',
      '양말 공을 굴려 컵을 쓰러뜨려요.',
      '몇 개 쓰러졌는지 함께 세어보고, 번갈아 차례를 가져요.',
    ],
    talk: '"세 개나 쓰러뜨렸네! 이번엔 아빠 차례야."',
    grow: '겨냥하는 대근육 조절, 수 세기, 차례를 지키는 사회성.',
    safety: '딱딱한 공 대신 양말 공으로. 컵을 던지지 않도록 알려주세요.',
  },
  {
    item: 'sock', ages: ['0-1'],
    emoji: '🧦', title: '말랑말랑 양말 인형 까꿍',
    prep: '깨끗한 양말 1짝',
    steps: [
      '양말을 손에 끼워 "안녕~" 하고 인사하는 인형을 만들어요.',
      '아이 볼이나 손을 양말 인형으로 살살 간지럽혀요.',
      '"어디 갔지?" 하고 등 뒤로 숨겼다 다시 나타나요.',
    ],
    talk: '"안녕 아기야~ 나는 양말이야. 까꿍!"',
    grow: '부드러운 촉감 자극과 눈맞춤, 주고받는 상호작용으로 자라는 애착.',
    safety: '양말을 아이 입 가까이 두지 말고, 곁에서 지켜봐 주세요.',
  },
  {
    item: 'sock', ages: ['1-2', '3-4'],
    emoji: '🧦', title: '양말 공룡 인형극',
    prep: '깨끗한 양말 1짝',
    steps: [
      '양말에 손을 넣어 입을 뻐끔거리는 "양말 공룡"을 만들어요.',
      '"어흥~ 나는 공룡이다!" 하며 천천히 다가가요.',
      '공룡이 아이에게 인사하고, 아이가 먹이(블록·인형)를 주게 해요.',
    ],
    talk: '"공룡이 배고프대. 우리 아이가 밥 줄까? 냠냠!"',
    grow: '상상 놀이와 역할 이해, 그리고 대화를 주고받으며 자라는 언어 표현력.',
    safety: '양말은 깨끗한 것으로. 작은 먹이 소품은 삼키지 않게 큰 것으로 해주세요.',
  },
  {
    item: 'tube', ages: ['1-2', '3-4'],
    emoji: '🧻', title: '휴지심 자동차 경주',
    prep: '휴지심 2개, 작은 공이나 구슬 대신 뭉친 종이',
    steps: [
      '휴지심을 비스듬히 기울여 "미끄럼틀 길"을 만들어요.',
      '뭉친 종이공을 위에서 굴려 누가 멀리 가나 해봐요.',
      '아이가 직접 공을 넣고 굴리게 해요.',
    ],
    talk: '"준비~ 출발! 우와, 데구르르 굴러간다!"',
    grow: '굴러가는 움직임을 눈으로 따라가는 집중력, 손으로 넣는 소근육.',
    safety: '구슬·작은 공 대신 뭉친 종이로. 삼킬 수 있는 작은 물건은 쓰지 마세요.',
  },
  {
    item: 'box', ages: ['1-2', '3-4'],
    emoji: '📦', title: '우리만의 박스 동굴',
    prep: '아이가 들어갈 만한 박스 1개',
    steps: [
      '박스를 눕혀 "비밀 동굴"을 만들어요.',
      '아이가 들어가면 "안에 누가 있지?" 하고 까꿍 인사해요.',
      '동굴 안에서 좋아하는 책을 함께 보거나 손전등을 비춰요.',
    ],
    talk: '"여기는 우리만의 동굴이야. 아늑하지?"',
    grow: '아늑한 공간에서 느끼는 정서적 안정, 공간을 탐색하는 인지.',
    safety: '박스 모서리에 긁히지 않게 테이프로 감싸고, 머리 위로 덮이지 않게 해주세요.',
  },
  {
    item: 'clip', ages: ['3-4'],
    emoji: '🧷', title: '빨래집게 주차장',
    prep: '입구가 넓은 빨래집게 5~6개, 종이컵',
    steps: [
      '종이컵을 눕혀 "자동차 차고"를 만들어요.',
      '빨래집게를 "자동차"라고 하고, 손가락으로 집어 차고에 주차해요.',
      '"빨간 차 먼저, 다음은 파란 차!" 색과 순서를 말하며 넣어요.',
    ],
    talk: '"집게 자동차가 부릉부릉~ 주차 완료!"',
    grow: '집게를 집는 손가락 힘(소근육), 색과 순서를 익히는 인지.',
    safety: '손가락이 세게 끼지 않게 입구 넓은 큰 집게로. 입에 넣지 않게 지켜봐 주세요.',
  },
  {
    item: 'none', ages: ['0-1'],
    emoji: '🤲', title: '무릎 비행기 까꿍',
    prep: '준비물 없음',
    steps: [
      '누워서 아이를 정강이 위에 올리고 두 손을 꼭 잡아요.',
      '"슝~" 하며 좌우로 부드럽게 흔들어요.',
      '"착륙!" 하며 살며시 내려 안아줘요.',
    ],
    talk: '"비행기 출발합니다~ 슝슝! 우리 아기 즐겁지?"',
    grow: '균형을 느끼는 전정감각과 눈맞춤, 안겨서 자라는 애착.',
    safety: '아이를 꼭 붙잡고 천천히. 식사 직후는 피해주세요.',
  },
  {
    item: 'none', ages: ['1-2'],
    emoji: '🤲', title: '거실 동물 흉내 놀이',
    prep: '준비물 없음',
    steps: [
      '"우리 토끼처럼 깡충깡충!" 하며 함께 뛰어요.',
      '"이번엔 고양이 야옹~" 하고 기어가요.',
      '아이가 좋아하는 동물을 고르게 하고 같이 따라 해요.',
    ],
    talk: '"다음은 무슨 동물 할까? 우리 아이가 골라봐!"',
    grow: '온몸을 쓰는 대근육, 동물 이름과 소리를 익히는 언어.',
    safety: '주변 모서리나 미끄러운 바닥을 치우고 넓은 곳에서 해주세요.',
  },
  {
    item: 'none', ages: ['3-4', '5+'],
    emoji: '🤲', title: '그림자 따라잡기',
    prep: '준비물 없음 (햇빛이나 불빛)',
    steps: [
      '벽이나 바닥에 생긴 서로의 그림자를 찾아봐요.',
      '"엄마 그림자 잡아봐!" 하며 그림자를 밟는 놀이를 해요.',
      '손으로 토끼·새 모양 그림자를 만들어봐요.',
    ],
    talk: '"어? 그림자가 도망간다! 잡을 수 있을까?"',
    grow: '빛과 그림자의 원리를 경험하는 인지, 뛰며 자라는 대근육.',
    safety: '뛰다 부딪히지 않게 공간을 확보하고, 직사광선은 오래 보지 않게 해주세요.',
  },
]

// 연령대별 일반 폴백 (조합이 없을 때)
function fallback(age: AgeKey, item: ItemKey): Recipe {
  const itemLabel = ITEMS.find((i) => i.key === item)?.label ?? '집에 있는 물건'
  const byAge: Record<AgeKey, Recipe> = {
    '0-1': {
      emoji: '🤲', title: `${itemLabel}로 까꿍 놀이`,
      prep: itemLabel,
      steps: [
        `${itemLabel}을(를) 아이에게 보여주며 이름을 말해줘요.`,
        `${itemLabel} 뒤로 얼굴을 숨겼다가 "까꿍!" 하고 나타나요.`,
        '아이의 반응을 따라 하며 함께 웃어요.',
      ],
      talk: '"우리 아기 여기 봐~ 까꿍!"',
      grow: '눈맞춤과 주고받는 반응으로 자라는 애착, 대상영속성.',
      safety: '작은 부품은 입에 들어가지 않게 큰 물건으로, 곁에서 지켜봐 주세요.',
    },
    '1-2': {
      emoji: '✨', title: `${itemLabel} 탐험 놀이`,
      prep: itemLabel,
      steps: [
        `${itemLabel}을(를) 만지고 두드리며 소리와 촉감을 느껴봐요.`,
        '아이가 하는 행동을 똑같이 따라 해줘요.',
        '"또 해볼까?" 하며 아이가 주도하게 둬요.',
      ],
      talk: '"우와, 이렇게 하니까 소리가 나네! 신기하다."',
      grow: '오감 탐색과 따라 하기, 주도성.',
      safety: '삼킬 수 있는 작은 물건은 피하고 곁에서 지켜봐 주세요.',
    },
    '3-4': {
      emoji: '✨', title: `${itemLabel} 상상 놀이`,
      prep: itemLabel,
      steps: [
        `${itemLabel}이(가) "무엇처럼 보이는지" 아이에게 물어봐요.`,
        '아이가 말한 것으로 함께 짧은 이야기를 만들어요.',
        '역할을 나눠 흉내 내며 놀아요.',
      ],
      talk: '"이게 뭐로 보여? 오, 그럼 우리 그걸로 놀아볼까?"',
      grow: '상상력과 이야기 구성, 언어 표현.',
      safety: '가위 등 도구를 쓸 땐 보호자가 곁에서 함께해 주세요.',
    },
    '5+': {
      emoji: '✨', title: `${itemLabel} 도전 놀이`,
      prep: itemLabel,
      steps: [
        `${itemLabel}로 할 수 있는 규칙을 아이와 함께 정해요.`,
        '번갈아 차례를 가지며 도전해요.',
        '누가 잘했는지 이야기하고 다시 해봐요.',
      ],
      talk: '"이번엔 어떤 규칙으로 해볼까? 네가 정해봐."',
      grow: '규칙 이해와 차례 지키기, 문제 해결력.',
      safety: '활동 공간을 넓게 확보하고 안전하게 즐겨주세요.',
    },
  }
  return byAge[age]
}

// 음성/자유 텍스트에서 물건 추정 (키 없을 때 샘플 폴백용)
export function inferItem(text: string): ItemKey {
  const t = text.replace(/\s/g, '')
  const map: [string[], ItemKey][] = [
    [['수건', '타월'], 'towel'],
    [['종이컵', '컵'], 'cup'],
    [['양말'], 'sock'],
    [['휴지심', '휴지', '심지'], 'tube'],
    [['박스', '상자'], 'box'],
    [['빨래집게', '집게'], 'clip'],
    [['맨몸', '아무것도', '없어', '없다'], 'none'],
  ]
  for (const [keys, item] of map) {
    if (keys.some((k) => t.includes(k))) return item
  }
  return 'none'
}

// 같은 연령대의 다른 놀이 하나 (breadth 시연용 — "다른 놀이" 버튼)
export function anyRecipeForAge(age: AgeKey, excludeTitle?: string): Recipe {
  const pool = RECIPES.filter(
    (r) => r.ages.includes(age) && r.title !== excludeTitle,
  )
  const pick = pool[Math.floor(Math.random() * pool.length)]
  return pick ?? fallback(age, 'none')
}

// 매칭: (물건+나이) 정확 매칭 → 물건만 매칭 → 폴백
export function matchRecipes(age: AgeKey, item: ItemKey): Recipe[] {
  const exact = RECIPES.filter((r) => r.item === item && r.ages.includes(age))
  if (exact.length > 0) return exact
  const itemOnly = RECIPES.filter((r) => r.item === item)
  if (itemOnly.length > 0) return itemOnly
  return [fallback(age, item)]
}
