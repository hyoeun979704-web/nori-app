import type { Recipe } from "@/types/recipe";

const SAMPLES: Recipe[] = [
  {
    title: "종이컵 탑 쌓고 무너뜨리기",
    age_range: "18~36개월",
    materials: ["종이컵 10개", "스티커(선택)"],
    steps: [
      "종이컵을 거꾸로 놓고 3단 피라미드처럼 쌓아 올려요.",
      "아이가 좋아하는 스티커로 꾸며 주면 애정이 생겨요.",
      "부드러운 공을 굴려 탑을 무너뜨려요. 박수와 환호를 잊지 마세요!",
    ],
    tip: "단수를 1단→2단→3단으로 늘리면 성취감이 커져요.",
    safety_note: "종이컵 입구가 날카롭지 않은지 만져서 확인해 주세요.",
  },
  {
    title: "색깔별 보물찾기",
    age_range: "24~48개월",
    materials: ["색종이 4~5장", "작은 장난감 10개"],
    steps: [
      "거실 바닥에 색종이를 띄엄띄엄 깔아요.",
      "같은 색 장난감을 방 여기저기에 숨겨 놓아요.",
      "아이에게 색 하나를 알려주고, 그 색과 같은 장난감을 찾아 해당 색종이 위에 올리게 해요.",
    ],
    tip: "색 이름을 말하며 찾으면 어휘가 자연스럽게 늘어요.",
    safety_note: "삼킬 수 있는 작은 부품은 제외해 주세요.",
  },
  {
    title: "밀가루 반죽 감촉 놀이",
    age_range: "30~60개월",
    materials: ["밀가루 2컵", "물 반 컵", "식용색소(선택)"],
    steps: [
      "큰 그릇에 밀가루를 붓고 물을 조금씩 넣으며 반죽해요.",
      "아이 손에 살짝 묻혀 말랑한 느낌을 함께 이야기해요.",
      "모양 찍기, 공 굴리기, 길게 늘이기 같은 자유 놀이를 해요.",
    ],
    tip: "색소를 조금 넣으면 두 가지 색을 섞는 실험도 돼요.",
    safety_note: "글루텐 알레르기가 있으면 쌀가루로 대체하고, 입에 넣지 않도록 지켜봐 주세요.",
  },
];

function hashCode(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return h;
}

export async function getDummyRecipe(prompt: string): Promise<Recipe> {
  await new Promise<void>((resolve) => setTimeout(resolve, 900));
  const idx = Math.abs(hashCode(prompt)) % SAMPLES.length;
  const picked = SAMPLES[idx] ?? SAMPLES[0];
  if (!picked) throw new Error("No dummy recipe available");
  return picked;
}
