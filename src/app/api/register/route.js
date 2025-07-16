import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(request) {
  const { name, email, password } = await request.json();

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return new Response(JSON.stringify({ message: 'El usuario ya existe' }), { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  return new Response(JSON.stringify({ message: 'Usuario creado', userId: user.id }), { status: 201 });
}
