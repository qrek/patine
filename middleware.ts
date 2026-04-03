export { default } from 'next-auth/middleware'

export const config = {
  // Protège toutes les routes /admin sauf /admin/login
  matcher: ['/admin/((?!login).*)'],
}
