import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nvnozshsrhfdsbfaxnyl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52bm96c2hzcmhmZHNiZmF4bnlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5MDM4MDYsImV4cCI6MjA5NDQ3OTgwNn0.HDMXy19XUkRH8d6l0d-mgPDpe_AT2Y0PuP_9lP84jqY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
