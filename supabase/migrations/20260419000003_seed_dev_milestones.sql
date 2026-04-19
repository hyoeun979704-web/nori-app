-- Phase 2b seed: developmental milestones
--
-- Sources (public institutions only, per product decision):
--   * CDC — U.S. Centers for Disease Control and Prevention, "Learn the
--     Signs. Act Early." 2022-revised milestones, one checkpoint page per
--     age. Content summarised and translated to Korean. Neutral framing:
--     "이 시기 아이들이 보이곤 해요" rather than developmental judgements.
--   * WHO — World Health Organization, "Motor Development Milestones"
--     from the Multicentre Growth Reference Study (Acta Paediatrica
--     Suppl. 450, 2006). Windows and medians.
--
-- Age checkpoints: 2, 4, 6, 9, 12, 15, 18, 24, 30, 36, 48, 60, 72, 84 months.
-- 72mo and 84mo use the CDC "Middle Childhood 6-8 Years" Child Development
-- page, which is not a formal milestone checklist; rows reflect common
-- observations described there and are intentionally fewer.
--
-- NOTE: This table is INTERNAL reference data. Rows must never be rendered
-- directly to the parent-facing UI. Phase 4 Edge Function will join on the
-- child's age and surface age-appropriate ideas only as gently framed
-- suggestions, never as comparative assessments.

-- 2 months (CDC)
insert into public.dev_milestones (age_months, domain, description_ko, source_code, source_url) values
  (2, 'social_emotional', '양육자의 얼굴을 바라보며 차분해져요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-2mo.html'),
  (2, 'social_emotional', '누군가를 보고 미소를 지어요 (사회적 미소).', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-2mo.html'),
  (2, 'language', '울음 외에 "우우", "아아" 같은 소리를 내요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-2mo.html'),
  (2, 'language', '큰 소리에 반응해서 움직임을 멈추거나 놀라요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-2mo.html'),
  (2, 'cognitive', '사람이나 움직이는 물체를 눈으로 잠깐 쫓아봐요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-2mo.html'),
  (2, 'gross_motor', '엎드린 자세에서 머리를 잠깐 들어 올려요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-2mo.html'),
  (2, 'fine_motor', '손을 폈다 오므렸다 해요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-2mo.html');

-- 4 months (CDC)
insert into public.dev_milestones (age_months, domain, description_ko, source_code, source_url) values
  (4, 'social_emotional', '소리 내어 웃어요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-4mo.html'),
  (4, 'social_emotional', '관심을 끌기 위해 양육자를 바라봐요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-4mo.html'),
  (4, 'language', '양육자와 번갈아 소리를 주고받아요 ("대화").', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-4mo.html'),
  (4, 'language', '배고픔·졸림·불편함을 서로 다른 울음소리로 표현해요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-4mo.html'),
  (4, 'cognitive', '자신의 손을 관찰하고 입으로 가져가요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-4mo.html'),
  (4, 'gross_motor', '엎드린 자세에서 팔로 지탱하며 머리를 곧게 들어요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-4mo.html'),
  (4, 'fine_motor', '관심 있는 물건을 향해 손을 뻗어요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-4mo.html');

-- 6 months (CDC + WHO)
insert into public.dev_milestones (age_months, domain, description_ko, source_code, source_url) values
  (6, 'social_emotional', '친숙한 사람을 알아보고 반응해요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-6mo.html'),
  (6, 'social_emotional', '거울 속 자기 모습을 보고 웃거나 즐거워해요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-6mo.html'),
  (6, 'language', '입술 소리("바", "마")를 내며 옹알이를 시작해요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-6mo.html'),
  (6, 'cognitive', '가까이 있는 물건을 입으로 가져가 탐색해요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-6mo.html'),
  (6, 'gross_motor', '도움 없이 앉기를 이 무렵(중앙값 약 6개월) 시작하는 아이들이 많아요.', 'WHO', 'https://www.who.int/tools/child-growth-standards/standards/motor-development-milestones'),
  (6, 'fine_motor', '한 손에서 다른 손으로 물건을 옮겨요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-6mo.html');

-- 9 months (CDC + WHO)
insert into public.dev_milestones (age_months, domain, description_ko, source_code, source_url) values
  (9, 'social_emotional', '낯선 사람에게 수줍거나 경계하는 반응을 보여요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-9mo.html'),
  (9, 'social_emotional', '양육자의 기쁨·화난 표정에 반응해요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-9mo.html'),
  (9, 'language', '여러 소리를 연이어 옹알이해요 ("마마마", "다다다").', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-9mo.html'),
  (9, 'cognitive', '눈앞에서 숨긴 장난감을 찾으려 해요 (대상 영속성).', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-9mo.html'),
  (9, 'gross_motor', '네 발로 기는 동작(중앙값 약 8.5개월)이 이 무렵 흔히 나타나요.', 'WHO', 'https://www.who.int/tools/child-growth-standards/standards/motor-development-milestones'),
  (9, 'fine_motor', '엄지와 검지를 써서 작은 물건을 집어요 (pincer grasp).', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-9mo.html');

-- 12 months (CDC + WHO)
insert into public.dev_milestones (age_months, domain, description_ko, source_code, source_url) values
  (12, 'social_emotional', '양육자와의 분리에 민감해지고 낯가림이 뚜렷해져요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-1yr.html'),
  (12, 'language', '"엄마", "아빠" 같은 한두 단어를 의미 있게 사용해요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-1yr.html'),
  (12, 'language', '"안 돼" 같은 짧은 말에 반응해요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-1yr.html'),
  (12, 'cognitive', '물건을 통에 넣거나 꺼내는 놀이를 반복해요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-1yr.html'),
  (12, 'gross_motor', '혼자 걷기 시작하는 아이들이 늘어나요 (중앙값 약 12개월).', 'WHO', 'https://www.who.int/tools/child-growth-standards/standards/motor-development-milestones'),
  (12, 'fine_motor', '엄지와 검지로 작은 물건을 능숙하게 집어요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-1yr.html');

-- 15 months (CDC)
insert into public.dev_milestones (age_months, domain, description_ko, source_code, source_url) values
  (15, 'social_emotional', '양육자가 곁에 있으면 새로운 활동을 시도해요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-15mo.html'),
  (15, 'social_emotional', '손뼉 치기·손 흔들기 같은 사회적 몸짓을 따라 해요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-15mo.html'),
  (15, 'language', '"엄마·아빠" 외에 한두 단어를 더 사용해요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-15mo.html'),
  (15, 'cognitive', '원하는 것을 손가락으로 가리키거나 양육자를 당겨서 요청해요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-15mo.html'),
  (15, 'gross_motor', '도움 없이 몇 걸음을 걸어요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-15mo.html'),
  (15, 'fine_motor', '두 손으로 컵을 잡고 마시려고 시도해요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-15mo.html');

-- 18 months (CDC)
insert into public.dev_milestones (age_months, domain, description_ko, source_code, source_url) values
  (18, 'social_emotional', '무언가를 보여주며 양육자의 반응을 확인해요 (joint attention).', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-18mo.html'),
  (18, 'language', '한 단어짜리 말을 세 개 이상 사용해요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-18mo.html'),
  (18, 'language', '"코가 어디 있어?" 같은 단순 질문에 신체 부위를 가리켜요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-18mo.html'),
  (18, 'cognitive', '가상 놀이를 시작해요 (전화기 흉내, 인형에게 먹이기).', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-18mo.html'),
  (18, 'gross_motor', '안정적으로 걷고 장난감을 끌며 걸어요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-18mo.html'),
  (18, 'fine_motor', '종이에 자유로운 선을 끄적거려요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-18mo.html');

-- 24 months (CDC)
insert into public.dev_milestones (age_months, domain, description_ko, source_code, source_url) values
  (24, 'social_emotional', '또래에게 관심을 보이고 옆에서 놀아요 (평행 놀이).', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-2yr.html'),
  (24, 'language', '두 단어를 이어 짧은 문장을 만들어요 ("엄마 물").', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-2yr.html'),
  (24, 'language', '친숙한 물건·사람의 이름을 말해요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-2yr.html'),
  (24, 'cognitive', '2~4조각 모양 맞추기 퍼즐을 해내요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-2yr.html'),
  (24, 'gross_motor', '달리고 낮은 계단을 오르내려요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-2yr.html'),
  (24, 'fine_motor', '블록을 4개 이상 쌓거나 선을 따라 그려요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-2yr.html');

-- 30 months (CDC)
insert into public.dev_milestones (age_months, domain, description_ko, source_code, source_url) values
  (30, 'social_emotional', '때때로 다른 아이들과 장난감을 나누거나 차례를 지켜요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-30mo.html'),
  (30, 'language', '3단어 문장을 자주 사용해요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-30mo.html'),
  (30, 'language', '자신의 이름을 말해요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-30mo.html'),
  (30, 'cognitive', '같은 색·모양의 물건을 짝지어요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-30mo.html'),
  (30, 'gross_motor', '두 발로 점프하고 한 발로 잠깐 서려고 해요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-30mo.html'),
  (30, 'fine_motor', '가위로 종이 가장자리를 잘라보려 해요 (도움 필요).', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-30mo.html');

-- 36 months (CDC)
insert into public.dev_milestones (age_months, domain, description_ko, source_code, source_url) values
  (36, 'social_emotional', '간단한 역할놀이에 즐겁게 참여해요 (엄마·의사 놀이).', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-3yr.html'),
  (36, 'social_emotional', '헤어질 때 속상해하지만 곧 마음을 추슬러요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-3yr.html'),
  (36, 'language', '3~4단어 문장을 일관되게 사용해요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-3yr.html'),
  (36, 'cognitive', '"크다/작다", "많다/적다" 같은 개념을 이해해요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-3yr.html'),
  (36, 'gross_motor', '세발자전거를 타고 한 발로 잠깐 서요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-3yr.html'),
  (36, 'fine_motor', '원을 그리고 옷 단추를 혼자 풀거나 끼워봐요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-3yr.html');

-- 48 months (CDC)
insert into public.dev_milestones (age_months, domain, description_ko, source_code, source_url) values
  (48, 'social_emotional', '상상 친구나 역할놀이를 활발하게 해요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-4yr.html'),
  (48, 'social_emotional', '친구의 기분을 알아차리고 관심을 보여요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-4yr.html'),
  (48, 'language', '4단어 이상의 문장을 사용하고 과거 일을 이야기해요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-4yr.html'),
  (48, 'cognitive', '규칙이 있는 단순 보드게임·카드게임을 해요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-4yr.html'),
  (48, 'gross_motor', '한 발로 2초 이상 서고 낮은 장애물을 뛰어넘어요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-4yr.html'),
  (48, 'fine_motor', '사람을 2~4개의 부분으로 그려요; 가위로 모양을 따라 잘라요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-4yr.html');

-- 60 months (CDC)
insert into public.dev_milestones (age_months, domain, description_ko, source_code, source_url) values
  (60, 'social_emotional', '규칙을 지키려 노력하고 친구와 역할을 정해요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-5yr.html'),
  (60, 'language', '완전한 문장으로 대화하고 과거·미래를 이야기해요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-5yr.html'),
  (60, 'language', '10까지 수를 세고 몇 가지 수·글자를 알아봐요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-5yr.html'),
  (60, 'cognitive', '일정한 순서로 일을 해요 (아침 준비 등).', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-5yr.html'),
  (60, 'gross_motor', '한 발로 오래 서고 깡충깡충 뛰어요 (hop).', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-5yr.html'),
  (60, 'fine_motor', '자기 이름의 일부 글자를 따라 써요.', 'CDC', 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-5yr.html');

-- 72 months (CDC Middle Childhood 6-8)
insert into public.dev_milestones (age_months, domain, description_ko, source_code, source_url) values
  (72, 'social_emotional', '또래 관계를 점점 중요하게 여기고 친구의 입장을 이해하기 시작해요.', 'CDC', 'https://www.cdc.gov/ncbddd/childdevelopment/positiveparenting/middle.html'),
  (72, 'social_emotional', '공정함·차례·규칙에 민감해져요.', 'CDC', 'https://www.cdc.gov/ncbddd/childdevelopment/positiveparenting/middle.html'),
  (72, 'language', '문법이 거의 성인 수준에 가까워지고 이야기의 흐름을 논리적으로 전해요.', 'CDC', 'https://www.cdc.gov/ncbddd/childdevelopment/positiveparenting/middle.html'),
  (72, 'cognitive', '시간·공간·인과관계를 이해하고 단순한 계산을 해요.', 'CDC', 'https://www.cdc.gov/ncbddd/childdevelopment/positiveparenting/middle.html'),
  (72, 'gross_motor', '줄넘기·자전거 등 복합 운동 기술을 익히는 시기예요.', 'CDC', 'https://www.cdc.gov/ncbddd/childdevelopment/positiveparenting/middle.html'),
  (72, 'fine_motor', '글자와 숫자를 또렷하게 써요.', 'CDC', 'https://www.cdc.gov/ncbddd/childdevelopment/positiveparenting/middle.html');

-- 84 months (CDC Middle Childhood 6-8)
insert into public.dev_milestones (age_months, domain, description_ko, source_code, source_url) values
  (84, 'social_emotional', '성취감과 자부심이 커지고 또래의 의견에 민감해져요.', 'CDC', 'https://www.cdc.gov/ncbddd/childdevelopment/positiveparenting/middle.html'),
  (84, 'social_emotional', '규칙이 있는 집단 놀이·간단한 스포츠에 적극적으로 참여해요.', 'CDC', 'https://www.cdc.gov/ncbddd/childdevelopment/positiveparenting/middle.html'),
  (84, 'language', '긴 이야기를 읽거나 듣고 요약하거나 의견을 말할 수 있어요.', 'CDC', 'https://www.cdc.gov/ncbddd/childdevelopment/positiveparenting/middle.html'),
  (84, 'cognitive', '읽기·쓰기·수 감각이 학교 학습과 자연스럽게 연결돼요.', 'CDC', 'https://www.cdc.gov/ncbddd/childdevelopment/positiveparenting/middle.html'),
  (84, 'gross_motor', '민첩성과 균형감이 좋아져 팀 스포츠를 즐겨요.', 'CDC', 'https://www.cdc.gov/ncbddd/childdevelopment/positiveparenting/middle.html'),
  (84, 'fine_motor', '연필·가위·자 같은 도구를 정확하게 다뤄요.', 'CDC', 'https://www.cdc.gov/ncbddd/childdevelopment/positiveparenting/middle.html');
