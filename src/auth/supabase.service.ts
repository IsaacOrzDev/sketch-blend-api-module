import { Injectable } from '@nestjs/common';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient<any, 'public', any>;

  constructor() {
    this.supabase = createClient('', '');
  }

  public signIn() {
    return this.supabase.auth.signInWithOAuth({
      provider: 'github',
    });
  }
}
