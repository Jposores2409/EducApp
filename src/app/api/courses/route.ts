import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
}

// CREAR CURSO O MATERIAL
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, payload } = body;
    const supabase = getSupabase();

    if (action === 'create_course') {
      const { error } = await supabase.from('courses').insert([payload]);
      if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    } else if (action === 'create_material') {
      const { error } = await supabase.from('materials').insert([payload]);
      if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// ELIMINAR CURSO O MATERIAL
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const id = searchParams.get('id');
    const supabase = getSupabase();

    if (!id) return NextResponse.json({ success: false, error: 'ID requerido' }, { status: 400 });

    if (action === 'delete_course') {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    } else if (action === 'delete_material') {
      const { error } = await supabase.from('materials').delete().eq('id', id);
      if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}