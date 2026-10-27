import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
}

// CREAR TRABAJO PRÁCTICO O ENVIAR DEVOLUCIÓN
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, payload } = body;
    const supabase = getSupabase();

    if (action === 'create_assignment') {
      const { error } = await supabase.from('assignments').insert([payload]);
      if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    } else if (action === 'grade_submission') {
      const { id, grade, feedback } = payload;
      const { error } = await supabase
        .from('assignments')
        .update({ grade, feedback, status: 'graded' })
        .eq('id', id);
        
      if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// ELIMINAR TRABAJO PRÁCTICO
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const supabase = getSupabase();

    if (!id) return NextResponse.json({ success: false, error: 'ID requerido' }, { status: 400 });

    const { error } = await supabase.from('assignments').delete().eq('id', id);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}