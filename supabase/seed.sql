-- 1. Create Auth Users
-- We must insert into auth.users first. 
-- Note: 'id' must be a valid UUID.
INSERT INTO
  auth.users (id, email, raw_user_meta_data)
VALUES
  (
    'a1111111-1111-1111-1111-111111111111',
    'alice@example.com',
    '{"full_name": "Alice Admin"}'
  ),
  (
    'b2222222-2222-2222-2222-222222222222',
    'bob@example.com',
    '{"full_name": "Bob Builder"}'
  );

-- NOTE: Your trigger 'on_auth_user_created' will automatically 
-- create rows in public.profiles for these users.
-- 2. Create Groups
-- 'admin_user_id' must match an ID from auth.users above.
INSERT INTO
  public.groups (group_id, name, admin_user_id)
VALUES
  (
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    'CS Study Group',
    'a1111111-1111-1111-1111-111111111111'
  );

-- 3. Create Group Members
-- Adding both Alice and Bob to the group.
INSERT INTO
  public.group_members (group_id, user_id, approved, nickname)
VALUES
  (
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    'a1111111-1111-1111-1111-111111111111',
    true,
    'The Boss'
  ),
  (
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    'b2222222-2222-2222-2222-222222222222',
    false,
    'Newbie'
  );
