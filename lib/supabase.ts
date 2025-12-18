import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  unit: string;
  image_url: string | null;
  // features: string[];
  in_stock: boolean;
  display_order: number;
  created_at: string;
};

export type Testimonial = {
  id: string;
  customer_name: string;
  customer_role: string;
  content: string;
  rating: number;
  location: string;
  is_featured: boolean;
  created_at: string;
};

export type GalleryItem = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  is_featured: boolean;
  display_order: number;
  created_at: string;
};

export type FarmStat = {
  id: string;
  stat_name: string;
  stat_value: number;
  stat_label: string;
  stat_suffix: string;
  icon: string;
  display_order: number;
  updated_at: string;
};
