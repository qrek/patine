import Link from 'next/link'

const sections = [
  {
    href: '/admin/accueil',
    label: 'Page d\'accueil',
    desc: 'Hero, titre, sous-titre, texte d\'introduction',
    icon: '✦',
  },
  {
    href: '/admin/savoir-faire',
    label: 'Savoir-faire',
    desc: 'Les 3 sections narratives et leurs photos',
    icon: '◈',
  },
  {
    href: '/admin/realisations',
    label: 'Réalisations',
    desc: 'Gérer les photos de la galerie',
    icon: '⊞',
  },
  {
    href: '/admin/parametres',
    label: 'Paramètres',
    desc: 'Adresse, email, téléphone, Instagram',
    icon: '⚙',
  },
]

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">Tableau de bord</h1>
      <p className="text-sm text-gray-500 mb-10">
        Bienvenue dans le backoffice Patine. Sélectionnez une section à modifier.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group bg-white rounded-lg border border-gray-200 p-6 hover:border-[#B8A87A] hover:shadow-sm transition-all duration-200"
          >
            <div className="text-2xl mb-3 text-gray-400 group-hover:text-[#B8A87A] transition-colors duration-200">
              {s.icon}
            </div>
            <h2 className="text-sm font-medium text-gray-800 mb-1">{s.label}</h2>
            <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12 p-4 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700 max-w-2xl">
        <strong>Astuce :</strong> Vos modifications sont sauvegardées immédiatement. Visitez{' '}
        <a href="/" target="_blank" className="underline">le site public</a> pour voir le résultat.
      </div>
    </div>
  )
}
