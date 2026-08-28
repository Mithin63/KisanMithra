"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://dvllgekdtbhjjvznybcb.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_vtxHK1_FHzJMo8cOatQs-w_Hd3wCAav';
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey);
exports.default = exports.supabase;
