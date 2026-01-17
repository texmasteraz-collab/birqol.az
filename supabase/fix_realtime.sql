-- Enable Realtime for Messages
-- This allows the ChatWindow to receive new messages instantly.
begin;
-- Add messages table to the realtime publication
alter publication supabase_realtime
add table messages;
commit;