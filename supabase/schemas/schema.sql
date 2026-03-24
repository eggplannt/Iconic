CREATE TABLE "profiles" (
  "user_id" UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "default_profile_picture_url" TEXT,
  "default_name" TEXT,
  "created_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;

CREATE TABLE "groups" (
  "group_id" UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  "name" TEXT NOT NULL,
  "admin_user_id" UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  "created_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE "groups" ENABLE ROW LEVEL SECURITY;

CREATE TABLE "group_members" (
  "group_id" UUID REFERENCES groups ON DELETE CASCADE NOT NULL,
  "user_id" UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  "approved" BOOLEAN DEFAULT FALSE NOT NULL,
  "profile_picture_url" TEXT,
  "nickname" TEXT,
  "joined_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (group_id, user_id)
);

CREATE INDEX idx_group_members_user_id ON group_members (user_id);

ALTER TABLE "group_members" ENABLE ROW LEVEL SECURITY;

-- Functions/Triggers
create or replace function public.handle_new_user () returns trigger language plpgsql security definer
set
  search_path = public as $$
begin
  insert into public.profiles (user_id, email, default_name)
  values ( new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users for each row
execute procedure public.handle_new_user ();

create or replace function get_groups () returns setof uuid language sql security definer
set
  search_path = public as $$
  SELECT group_id 
  FROM group_members 
  WHERE user_id = auth.uid();
$$;

-- Policies
CREATE POLICY "Users can view own profile" ON profiles FOR
SELECT
  to authenticated USING (auth.uid () = user_id);

CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE
  to authenticated
WITH
  CHECK (user_id = auth.uid ());

CREATE POLICY "Users can create groups" ON groups FOR INSERT to authenticated
WITH
  CHECK (admin_user_id = auth.uid ());

CREATE POLICY "Group members can view group details" ON groups FOR
SELECT
  to authenticated USING (
    group_id in (
      SELECT
        get_groups ()
    )
  );

CREATE POLICY "Group members can view fellow members" ON group_members FOR
SELECT
  to authenticated USING (
    group_id IN (
      SELECT
        get_groups ()
    )
  );

CREATE POLICY "Group Members can update own group membership" ON group_members
FOR UPDATE
  to authenticated USING (auth.uid () = user_id)
WITH
  CHECK (
    group_id IN (
      SELECT
        get_groups ()
    )
  );
