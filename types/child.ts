export type Child = {
  id: string;
  user_id: string;
  nickname: string;
  birth_date: string;
  interests: string[];
  created_at: string;
};

export type ChildSurvey = {
  child_id: string;
  allergies: string[];
  sensitivities: string[];
  notes: string;
  updated_at: string;
};
