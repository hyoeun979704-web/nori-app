-- Phase 2b seed: developmental play activities
--
-- Sources (public institutions only):
--   * CDC — "Positive Parenting Tips" (Child Development) and
--     "Learn the Signs. Act Early." milestone pages, "What you can do"
--     sections for the given age window. Content summarised in Korean.
--   * WHO — "Care for Child Development" package (public training material)
--     for general responsive-care activities.
--
-- `interests_match` values correspond to the 9 fixed interests defined in
-- lib/interests.ts:
--   "블록 · 만들기" / "그림 · 색칠" / "책 · 이야기" / "역할놀이" /
--   "음악 · 율동" / "몸놀이 · 바깥" / "촉감 · 물놀이" / "과학 · 탐구" /
--   "요리 · 생활"
--
-- Age windows map onto our checkpoints (2, 4, 6, 9, 12, 15, 18, 24, 30,
-- 36, 48, 60, 72, 84 months). A single activity typically covers 2–3
-- adjacent checkpoints.
--
-- NOTE: Like dev_milestones, this table is INTERNAL reference data. It is
-- joined on the child's current age in Phase 4 Edge Function to feed the
-- Gemini prompt with age-appropriate inspirations; it is never rendered
-- directly to the parent-facing UI.

-- 2-4 months
insert into public.dev_play_activities
  (age_months_min, age_months_max, domains, interests_match, title_ko, summary_ko, materials, source_code, source_url) values
  (2, 4, '{social_emotional, language}'::dev_domain[], '{"책 · 이야기","음악 · 율동"}', '얼굴을 맞대고 이야기하기',
   '아이 얼굴 20~30cm 앞에서 눈을 맞추며 천천히 이야기하고, 아이가 소리 내면 기다렸다가 똑같이 따라 해 주세요. 사회적 상호작용과 초기 언어의 기초가 돼요.',
   '{}', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-2mo.html'),
  (2, 6, '{gross_motor, cognitive}'::dev_domain[], '{"몸놀이 · 바깥","촉감 · 물놀이"}', '엎드려 놀기(Tummy Time)',
   '깨어 있을 때 엎드린 자세로 하루 몇 차례 짧게 놀게 해 주세요. 목·어깨 근육을 키우고 주변을 탐색하는 자극이 돼요.',
   '{담요, 흥미로운 장난감}', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-4mo.html');

-- 4-9 months
insert into public.dev_play_activities
  (age_months_min, age_months_max, domains, interests_match, title_ko, summary_ko, materials, source_code, source_url) values
  (4, 9, '{cognitive, fine_motor}'::dev_domain[], '{"과학 · 탐구","촉감 · 물놀이"}', '손에 잡히는 다양한 감촉 탐색',
   '부드러운 천·딸랑이·실리콘 장난감처럼 안전한 감촉의 물건을 번갈아 쥐어 주세요. 손 근육과 감각 탐색을 함께 키워요.',
   '{딸랑이, 천 블록, 실리콘 치발기}', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-6mo.html'),
  (4, 12, '{language, social_emotional}'::dev_domain[], '{"음악 · 율동","책 · 이야기"}', '노래와 리듬 주고받기',
   '짧은 자장가·손유희 노래를 천천히 불러 주고 아이가 소리 내면 기다렸다가 이어 주세요. 주고받는 리듬이 의사소통의 기초가 돼요.',
   '{}', 'WHO', 'https://www.who.int/teams/maternal-newborn-child-adolescent-health-and-ageing/child-health/care-for-child-development');

-- 6-12 months
insert into public.dev_play_activities
  (age_months_min, age_months_max, domains, interests_match, title_ko, summary_ko, materials, source_code, source_url) values
  (6, 12, '{cognitive, language}'::dev_domain[], '{"역할놀이","책 · 이야기"}', '까꿍 놀이',
   '손이나 수건으로 얼굴을 가렸다가 "까꿍!" 하며 보여 주세요. 보이지 않아도 존재한다는 대상 영속성을 자연스럽게 익혀요.',
   '{얇은 수건}', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-9mo.html'),
  (6, 15, '{fine_motor, cognitive}'::dev_domain[], '{"블록 · 만들기","과학 · 탐구"}', '통에 넣고 꺼내기',
   '작은 통에 안전한 크기의 블록을 넣었다 꺼내게 해 주세요. 손가락 조절과 "안/밖" 개념을 함께 키워요.',
   '{플라스틱 통, 큰 블록}', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-1yr.html');

-- 9-18 months
insert into public.dev_play_activities
  (age_months_min, age_months_max, domains, interests_match, title_ko, summary_ko, materials, source_code, source_url) values
  (9, 18, '{language, cognitive}'::dev_domain[], '{"책 · 이야기"}', '그림책 같이 보기',
   '두꺼운 보드북을 무릎에 앉혀 함께 넘기며 "이게 뭐지?"라고 물어보세요. 아이가 가리키는 그림의 이름을 천천히 말해 주면 어휘가 늘어요.',
   '{보드북}', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-15mo.html'),
  (9, 18, '{gross_motor}'::dev_domain[], '{"몸놀이 · 바깥"}', '밀고 끌며 걷기',
   '손잡이가 있는 밀고 끄는 장난감을 제공해 주세요. 균형 잡기와 걷기 연습이 자연스럽게 돼요.',
   '{밀고 끄는 장난감}', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-15mo.html');

-- 12-24 months
insert into public.dev_play_activities
  (age_months_min, age_months_max, domains, interests_match, title_ko, summary_ko, materials, source_code, source_url) values
  (12, 24, '{fine_motor, cognitive}'::dev_domain[], '{"블록 · 만들기"}', '블록 쌓고 무너뜨리기',
   '부드러운 블록을 2~4개 쌓고 함께 무너뜨려 보세요. 손 조절과 인과관계 이해가 함께 자라요.',
   '{부드러운 블록}', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-18mo.html'),
  (12, 30, '{social_emotional, language}'::dev_domain[], '{"역할놀이"}', '인형에게 먹여주기',
   '인형이나 봉제 동물에게 "맘마" 하고 먹이는 흉내를 같이 내요. 상상 놀이는 공감과 서사 능력을 키워요.',
   '{인형, 장난감 그릇·숟가락}', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-18mo.html');

-- 15-30 months
insert into public.dev_play_activities
  (age_months_min, age_months_max, domains, interests_match, title_ko, summary_ko, materials, source_code, source_url) values
  (15, 30, '{fine_motor, cognitive}'::dev_domain[], '{"그림 · 색칠"}', '큰 종이에 자유 낙서',
   '크레용이나 굵은 마커로 큰 종이에 마음대로 선을 그리게 해 주세요. 소근육과 시각 표현의 시작이에요.',
   '{큰 도화지, 크레용}', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-2yr.html'),
  (18, 36, '{language, cognitive}'::dev_domain[], '{"책 · 이야기"}', '책 읽고 이름 말하기',
   '익숙한 그림책을 읽으며 "자동차 어디 있지?" 같이 물어보세요. 아이가 가리키거나 이름을 말하면 반복해서 칭찬해 주세요.',
   '{그림책}', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-2yr.html');

-- 24-48 months
insert into public.dev_play_activities
  (age_months_min, age_months_max, domains, interests_match, title_ko, summary_ko, materials, source_code, source_url) values
  (24, 36, '{gross_motor}'::dev_domain[], '{"몸놀이 · 바깥"}', '줄 따라 걷기 / 뛰기',
   '바닥에 테이프나 줄로 길을 만들어 따라 걷고 뛰어 넘어보세요. 균형과 대근육을 동시에 써요.',
   '{마스킹 테이프, 베개}', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-30mo.html'),
  (24, 48, '{cognitive, fine_motor}'::dev_domain[], '{"과학 · 탐구","블록 · 만들기"}', '모양·색 분류 놀이',
   '여러 색·모양의 블록을 접시에 나눠 담게 해 주세요. 공통점을 찾는 사고와 손 조작이 자라요.',
   '{색깔 블록, 접시 2~3개}', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-3yr.html'),
  (24, 48, '{social_emotional, language}'::dev_domain[], '{"역할놀이"}', '가게 주인 놀이',
   '장바구니와 장난감 과일로 "사고 팔기" 놀이를 해 보세요. 차례 지키기와 짧은 대화가 자연스럽게 연습돼요.',
   '{장난감 과일, 바구니}', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-3yr.html');

-- 30-60 months
insert into public.dev_play_activities
  (age_months_min, age_months_max, domains, interests_match, title_ko, summary_ko, materials, source_code, source_url) values
  (30, 48, '{fine_motor, cognitive}'::dev_domain[], '{"그림 · 색칠"}', '동그라미·네모 그리기',
   '양육자가 먼저 동그라미·네모를 천천히 그리고 아이가 따라 그리게 해 보세요. 손 조절과 모양 인식을 같이 키워요.',
   '{종이, 크레용}', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-3yr.html'),
  (36, 60, '{cognitive, social_emotional}'::dev_domain[], '{"요리 · 생활"}', '간단 요리 돕기',
   '계란 깨기·채소 씻기처럼 안전한 단계를 맡겨 보세요. 순서 이해와 자기 효능감이 함께 자라요.',
   '{계란, 채소, 작은 그릇}', 'CDC', 'https://www.cdc.gov/ncbddd/childdevelopment/positiveparenting/preschoolers.html'),
  (36, 60, '{language, cognitive}'::dev_domain[], '{"책 · 이야기"}', '이야기 이어서 만들기',
   '아는 동화의 한 장면을 "그 다음에 어떻게 됐을까?" 하고 아이가 상상해서 이어 말하게 해 보세요. 서사 구성과 어휘가 늘어요.',
   '{그림책}', 'CDC', 'https://www.cdc.gov/ncbddd/childdevelopment/positiveparenting/preschoolers.html');

-- 36-60 months (sensory/science)
insert into public.dev_play_activities
  (age_months_min, age_months_max, domains, interests_match, title_ko, summary_ko, materials, source_code, source_url) values
  (36, 60, '{cognitive, fine_motor}'::dev_domain[], '{"촉감 · 물놀이","과학 · 탐구"}', '뜨는 것 가라앉는 것 실험',
   '세숫대야 물에 다양한 물건을 넣어 뜨는지 가라앉는지 예측하고 확인해 보세요. 가설과 관찰의 첫 경험이에요.',
   '{세숫대야, 물, 플라스틱·나무 소품}', 'CDC', 'https://www.cdc.gov/ncbddd/childdevelopment/positiveparenting/preschoolers.html'),
  (36, 60, '{gross_motor, social_emotional}'::dev_domain[], '{"음악 · 율동","몸놀이 · 바깥"}', '음악 듣고 자유 춤',
   '다양한 빠르기의 음악을 틀고 느낌대로 움직여 보세요. 리듬 감각과 감정 표현이 함께 자라요.',
   '{음악}', 'CDC', 'https://www.cdc.gov/ncbddd/childdevelopment/positiveparenting/preschoolers.html');

-- 48-72 months
insert into public.dev_play_activities
  (age_months_min, age_months_max, domains, interests_match, title_ko, summary_ko, materials, source_code, source_url) values
  (48, 72, '{cognitive, social_emotional}'::dev_domain[], '{"책 · 이야기","역할놀이"}', '간단한 보드게임',
   '차례 지키기와 규칙이 있는 짧은 보드게임을 함께 해 보세요. 지거나 이길 때의 감정을 다루는 연습도 돼요.',
   '{규칙이 단순한 보드게임}', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-5yr.html'),
  (48, 84, '{gross_motor}'::dev_domain[], '{"몸놀이 · 바깥"}', '장애물 달리기 코스',
   '집 안·마당에 쿠션·의자로 장애물 코스를 만들어 통과하게 해 보세요. 민첩성과 공간 인지를 함께 써요.',
   '{쿠션, 의자}', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-5yr.html'),
  (48, 72, '{fine_motor, cognitive}'::dev_domain[], '{"블록 · 만들기","과학 · 탐구"}', '재활용품으로 로봇 만들기',
   '휴지심·종이컵을 붙여 상상한 로봇·동물을 만들어 보세요. 설계·계획·소근육이 함께 자라요.',
   '{휴지심, 종이컵, 테이프}', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-5yr.html');

-- 60-84 months
insert into public.dev_play_activities
  (age_months_min, age_months_max, domains, interests_match, title_ko, summary_ko, materials, source_code, source_url) values
  (60, 84, '{cognitive, language}'::dev_domain[], '{"과학 · 탐구","요리 · 생활"}', '계량하며 간식 만들기',
   '계량컵으로 재료를 재면서 단위와 수 개념을 함께 이야기해 주세요. 수학적 사고와 요리 성취감이 같이 와요.',
   '{계량컵, 간단한 재료}', 'CDC', 'https://www.cdc.gov/ncbddd/childdevelopment/positiveparenting/middle.html'),
  (60, 84, '{social_emotional, language}'::dev_domain[], '{"역할놀이","책 · 이야기"}', '가족 연극 꾸미기',
   '짧은 이야기를 정해 역할을 나눠 가족 연극을 해 보세요. 협력과 서사 표현력이 함께 자라요.',
   '{간단한 소품}', 'CDC', 'https://www.cdc.gov/ncbddd/childdevelopment/positiveparenting/middle.html'),
  (60, 84, '{fine_motor, cognitive}'::dev_domain[], '{"그림 · 색칠","과학 · 탐구"}', '지도 그리기',
   '집·놀이터 같은 익숙한 공간을 기억해 종이에 그려 보게 하세요. 공간 지각과 상징화 능력이 자라요.',
   '{종이, 색연필}', 'CDC', 'https://www.cdc.gov/ncbddd/childdevelopment/positiveparenting/middle.html');
