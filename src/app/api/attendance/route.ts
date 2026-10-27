import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { attendanceData } = body;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const today = new Date().toISOString().split('T')[0];

    // Preparar los datos adjuntando la fecha de hoy
    const payload = attendanceData.map((item: any) => ({
      student_id: item.student_id,
      status: item.status,
      date: today,
    }));

    // Usar upsert para insertar o actualizar en la misma fecha
    const { error } = await supabase
      .from('attendance')
      .upsert(payload, { onConflict: 'student_id,date' });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}