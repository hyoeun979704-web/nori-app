-- Phase 6: recipe row integrity.
--
-- Previously both `recipes.materials/steps` (Phase 5) and
-- `chat_messages.recipe` jsonb (Phase 4) accepted empty/malformed payloads.
-- A Gemini response that narrowly missed validation could slip through and
-- render as a broken card. Tighten at the database level so the invariant
-- holds even if a future code path forgets.

alter table public.recipes
  drop constraint if exists recipes_steps_nonempty;
alter table public.recipes
  add constraint recipes_steps_nonempty
  check (coalesce(array_length(steps, 1), 0) >= 1);

alter table public.recipes
  drop constraint if exists recipes_materials_nonempty;
alter table public.recipes
  add constraint recipes_materials_nonempty
  check (coalesce(array_length(materials, 1), 0) >= 1);

alter table public.recipes
  drop constraint if exists recipes_age_range_nonempty;
alter table public.recipes
  add constraint recipes_age_range_nonempty
  check (char_length(age_range) > 0);

-- chat_messages with kind='recipe' must carry a recipe payload that at
-- minimum has the required keys as non-empty strings/arrays.
alter table public.chat_messages
  drop constraint if exists chat_messages_recipe_shape;
alter table public.chat_messages
  add constraint chat_messages_recipe_shape
  check (
    kind <> 'recipe' or (
      recipe ? 'title'
      and recipe ? 'age_range'
      and recipe ? 'materials'
      and recipe ? 'steps'
      and recipe ? 'tip'
      and recipe ? 'safety_note'
      and jsonb_typeof(recipe -> 'materials') = 'array'
      and jsonb_typeof(recipe -> 'steps') = 'array'
      and jsonb_array_length(recipe -> 'steps') >= 1
      and jsonb_array_length(recipe -> 'materials') >= 1
    )
  );
