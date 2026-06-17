import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCode,
  faHeart,
  faPeopleGroup,
  faArrowLeft,
  faLayerGroup,
  faCheckCircle,
  faRocket,
  faCalendarDays,
  faUsers,
  faGraduationCap,
  faCalendar,
} from '@fortawesome/free-solid-svg-icons';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import Link from 'next/link';

const impactStats = [
  { value: '500+', label: 'Developers Enrolled', icon: faUsers, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10' },
  { value: '3', label: 'Learning Tracks', icon: faGraduationCap, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
  { value: 'Weekly', label: 'Live Sessions', icon: faCalendar, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' },
  { value: '% Rev', label: 'Funds Charity', icon: faHeart, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-500/10' },
];

const whatYouGet = [
  'Structured Frontend, Backend & Fullstack tracks',
  'Weekly live coding sessions with mentors',
  'Private Discord community of active learners',
  'Personalised roadmap sent to your inbox',
  'Real project builds — not just tutorial clones',
  'Accountability check-ins to keep you on track',
];

export default function About() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 relative overflow-hidden transition-colors">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="absolute top-6 left-6 sm:left-8 flex items-center gap-2 z-20">
        <div className="w-5 h-5 flex items-center justify-center">
          <FontAwesomeIcon icon={faCode} className="text-blue-600 dark:text-blue-400" style={{ fontSize: '1.1rem' }} />
        </div>
        <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">CoreAcademy</span>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-24 pb-20 sm:pt-28">

        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-10">
          <div className="w-3 h-3 flex items-center justify-center">
            <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '0.7rem' }} />
          </div>
          Back to Home
        </Link>

        {/* Hero */}
        <div className="mb-10">
          <span className="inline-block text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full mb-4 tracking-wider uppercase">
            Our Story
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-5">
            Built by devs,<br />
            <span className="text-blue-600 dark:text-blue-400">for devs.</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed max-w-2xl">
            CoreAcademy was born out of real struggles — the confusion, lack of structure, and
            loneliness that come with being self-taught.{' '}
            <span className="text-blue-600 dark:text-blue-400 font-semibold">We&apos;re here to change that.</span>
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {impactStats.map((s) => (
            <div key={s.label} className="bg-black/[0.03] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4 flex flex-col items-center text-center hover:bg-black/[0.06] dark:hover:bg-white/[0.08] transition-colors">
              <div className={`w-9 h-9 ${s.bg} rounded-lg flex items-center justify-center mb-3 flex-shrink-0`}>
                <FontAwesomeIcon icon={s.icon} className={s.color} style={{ fontSize: '0.9rem' }} />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white leading-none">{s.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-tight">{s.label}</div>
            </div>
          ))}
        </div>

        {/* What you get */}
        <div className="bg-black/[0.03] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 mb-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <FontAwesomeIcon icon={faLayerGroup} className="text-blue-600 dark:text-blue-400" style={{ fontSize: '0.9rem' }} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">What you get</h2>
          </div>
          <ul className="space-y-3 sm:grid sm:grid-cols-2 sm:gap-3 sm:space-y-0">
            {whatYouGet.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-blue-600 dark:text-blue-400" style={{ fontSize: '0.85rem' }} />
                </div>
                <span className="text-gray-600 dark:text-gray-300 text-sm leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Mission + Purpose */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-black/[0.03] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon icon={faPeopleGroup} className="text-blue-600 dark:text-blue-400" style={{ fontSize: '0.9rem' }} />
              </div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Our Mission</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Structured learning paths, live sessions, and community — designed to help you grow
              with clarity. No more wandering through tutorials without knowing why.
            </p>
          </div>
          <div className="bg-black/[0.03] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon icon={faHeart} className="text-red-600 dark:text-red-400" style={{ fontSize: '0.9rem' }} />
              </div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Built with Purpose</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              A percentage of every payment funds{' '}
              <span className="text-blue-600 dark:text-blue-400 font-semibold">CoreFoundation</span> — our outreach
              initiative focused on feeding the poor and supporting the needy.
            </p>
          </div>
        </div>

        {/* Discord strip */}
        <div className="bg-indigo-600/20 border border-indigo-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-gray-900 dark:text-white font-semibold text-sm mb-0.5">Already part of the community?</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs">Jump back into the Discord and keep building.</p>
          </div>
          <a
            href="https://discord.gg/eqQhNkcCm9"
            className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-sm transition-all"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <FontAwesomeIcon icon={faDiscord} style={{ fontSize: '1rem' }} />
            </div>
            Open Discord
          </a>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl p-8 text-center">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faRocket} className="text-white" style={{ fontSize: '1.25rem' }} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Ready to start?</h3>
          <p className="text-blue-100 text-sm mb-6 max-w-sm mx-auto">
            Join hundreds of devs already on the path. Pick your track and start building today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/payment"
              className="w-full sm:w-auto px-6 py-3 bg-white text-blue-700 hover:bg-blue-50 rounded-xl font-bold text-sm transition-all shadow-lg"
            >
              Enroll Now
            </Link>
            <Link
              href="/bookings"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl font-semibold text-sm transition-all"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <FontAwesomeIcon icon={faCalendarDays} style={{ fontSize: '0.85rem' }} />
              </div>
              Book a Free Session
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
