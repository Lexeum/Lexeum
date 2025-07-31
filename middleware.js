// middleware.js
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/login', // Redirige si no hay sesión
  },
});

export const config = {
  matcher: ['/dashboard/:path*', '/asistente-ia/:path*'], // protege rutas
};
