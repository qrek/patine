import Link from 'next/link'

const sections = [
  { href: '/admin/accueil',      label: 'Accueil',      desc: 'Hero, titre, texte d\'introduction' },
  { href: '/admin/savoir-faire', label: 'Savoir-faire', desc: '3 sections narratives et photos'    },
  { href: '/admin/realisations', label: 'Réalisations', desc: 'Galerie photos, ordre, légendes'    },
  { href: '/admin/parametres',   label: 'Paramètres',   desc: 'Adresse, email, téléphone, Instagram' },
]

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-10 pb-8 border-b border-gray-200">
        <h1 className="text-lg font-medium text-gray-900">Tableau de bord</h1>
        <p className="text-[13px] text-gray-400 mt-1">Sélectionnez une section à modifier.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {sections.map(s => (
          <Link
            key={s.href}
            href={s.href}
            className="group p-5 bg-white rounded-lg border border-gray-200 hover:border-gray-400 transition-colors duration-150"
          >
            <p className="text-[13px] font-medium text-gray-800 mb-1">{s.label}</p>
            <p className="text-[12px] text-gray-400">{s.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-lg">
        <p className="text-[12px] text-amber-700">
          <strong className="font-medium">Rappel :</strong> en production, le contenu est stocké dans Vercel KV.
          Configurez le store KV dans votre dashboard Vercel si ce n'est pas encore fait.
        </p>
      </div>
    </div>
  )
}
