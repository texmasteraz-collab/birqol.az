-- Enable Cascading Deletes for Matches
-- This ensures that when a match is deleted, all associated requests and messages are also deleted.
-- 1. Fix match_requests
ALTER TABLE match_requests DROP CONSTRAINT IF EXISTS match_requests_match_id_fkey;
ALTER TABLE match_requests
ADD CONSTRAINT match_requests_match_id_fkey FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE;
-- 2. Fix messages (Chat)
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_match_id_fkey;
ALTER TABLE messages
ADD CONSTRAINT messages_match_id_fkey FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE;
-- 3. Fix ratings (if applicable)
ALTER TABLE ratings DROP CONSTRAINT IF EXISTS ratings_match_id_fkey;
ALTER TABLE ratings
ADD CONSTRAINT ratings_match_id_fkey FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE;