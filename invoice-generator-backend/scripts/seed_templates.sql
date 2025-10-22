-- Seed default invoice templates
-- First, we need to get a user ID. This assumes you have at least one user in the system.

-- Insert default templates (you'll need to replace USER_ID_HERE with an actual user ID)
-- For now, we'll create global templates that can be used by any user

INSERT INTO templates (id, user_id, name, language, background_url, logo_url, content, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    id,
    'Classic Professional',
    'HTML',
    NULL,
    NULL,
    '<html><body><h1>Invoice</h1></body></html>',
    NOW(),
    NOW()
FROM users
WHERE email = 'a@a.aa'
ON CONFLICT DO NOTHING;

INSERT INTO templates (id, user_id, name, language, background_url, logo_url, content, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    id,
    'Modern Minimalist',
    'HTML',
    NULL,
    NULL,
    '<html><body style="font-family: Arial, sans-serif;"><h1>Invoice</h1></body></html>',
    NOW(),
    NOW()
FROM users
WHERE email = 'a@a.aa'
ON CONFLICT DO NOTHING;

INSERT INTO templates (id, user_id, name, language, background_url, logo_url, content, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    id,
    'Elegant Business',
    'HTML',
    NULL,
    NULL,
    '<html><body style="font-family: Georgia, serif;"><h1>Invoice</h1></body></html>',
    NOW(),
    NOW()
FROM users
WHERE email = 'a@a.aa'
ON CONFLICT DO NOTHING;
