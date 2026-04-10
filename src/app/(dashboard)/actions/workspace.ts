'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createWorkspace(formData: FormData) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('Unauthorized');
  }

  const name = formData.get('name') as string;
  const industry = formData.get('type') as string;
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.random().toString(36).substring(2, 7);

  // 1. Create Workspace
  const { data: workspace, error: wsError } = await supabase
    .from('workspaces')
    .insert([
      { 
        name, 
        slug,
        owner_id: user.id
      }
    ])
    .select()
    .single();

  if (wsError) {
    console.error('Error creating workspace:', wsError);
    throw new Error('Failed to create workspace');
  }

  // 2. Add as Owner in workspace_members
  const { error: memberError } = await supabase
    .from('workspace_members')
    .insert([
      {
        workspace_id: workspace.id,
        user_id: user.id,
        role: 'owner'
      }
    ]);

  if (memberError) {
    console.error('Error adding workspace member:', memberError);
    // Note: In production, you might want to rollback the workspace creation here
    throw new Error('Failed to add workspace member');
  }

  // 3. Create a legacy 'business' record for compatibility if needed, 
  // or just migrate the app to use workspaces entirely.
  // For now, let's just focus on the new SaaS structure.

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
