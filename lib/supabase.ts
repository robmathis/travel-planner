// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const REAL_URL  = 'https://sfeglrqwntdlalwllnrh.supabase.co';
const ANON_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmZWdscnF3bnRkbGFsd2xsbnJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MDAyODgsImV4cCI6MjA2NzQ3NjI4OH0.-9DD_ES5XVKBA0Y2ZSfNChsi-nYqGGnMTqI-3mF0vyo';  // keep your existing anon key

// When running in the browser, use the same origin (so proxy applies)
const supabaseUrl = Platform.OS === 'web'
  ? window.location.origin   // e.g. https://localhost:19006
  : REAL_URL;

export const supabase = createClient(supabaseUrl, ANON_KEY, {
  auth: {
    storage: Platform.OS === 'web'
      ? window.localStorage
      : AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
