import { NextResponse } from 'next/server';
import { consultaIA } from '@/lib/ia';

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.mensaje) {
      return NextResponse.json({ error: 'Falta el campo "mensaje"' }, { status: 400 });
    }

    const respuesta = await consultaIA(body.mensaje);
    return NextResponse.json({ respuesta });
  } catch (error) {
    console.error('❌ Error en /api/consulta:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
