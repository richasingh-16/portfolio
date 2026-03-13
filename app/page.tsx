"use client"

import { useEffect, useLayoutEffect, useRef, useState, useContext, createContext } from "react"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import { Mail, Facebook, Instagram, Youtube, Linkedin, Github, ChevronRight, ChevronDown, GraduationCap, Palette, Activity, Focus, TrendingUp, BarChart2 } from "lucide-react"

import ParallaxCardGrid from "@/components/ParallaxCardGrid"
import FluidBackground from "@/components/FluidBackground"

const themes = [
  { id: "default",      name: "Terminal",      emoji: "🟢", accent: "#00e57f", bg: "#0a0a0f", surface: "#131825" },
  { id: "rose-pine",    name: "Rosé Pine",     emoji: "🌸", accent: "#eb6f92", bg: "#12101a", surface: "#191724" },
  { id: "tokyo-night",  name: "Tokyo Night",   emoji: "🌃", accent: "#7aa2f7", bg: "#1a1b26", surface: "#1f2335" },
  { id: "espresso",     name: "Espresso",      emoji: "☕", accent: "#f4c9d6", bg: "#110a09", surface: "#1c1110" },
  { id: "nord",         name: "Nord",          emoji: "❄️", accent: "#88c0d0", bg: "#2e3440", surface: "#3b4252" },
  { id: "lando",        name: "Lando Mode",    emoji: "🏎️", accent: "#ccff00", bg: "#1d2019", surface: "#2a2d24" },
]
type Theme = typeof themes[0]
const ThemeContext = createContext<Theme>(themes[0])

const sections = [
  "overview",
  "stack",
  "projects",
  "about",
  "socials",
]

export default function Home() {
  const [showSidebar, setShowSidebar] = useState(false)
  const [activeSection, setActiveSection] = useState("overview")
  const [scrollProgress, setScrollProgress] = useState(0)
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("portfolio-theme")
      return themes.find(t => t.id === saved) || themes[0]
    }
    return themes[0]
  })

  useEffect(() => {
    localStorage.setItem("portfolio-theme", theme.id)
    document.documentElement.style.setProperty("--accent", theme.accent)
    document.documentElement.style.setProperty("--bg", theme.bg)
    document.documentElement.style.setProperty("--surface", theme.surface)
  }, [theme])

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight
      setShowSidebar(window.scrollY > heroHeight * 0.6)

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress((window.scrollY / totalHeight) * 100)

      sections.forEach((id) => {
        const element = document.getElementById(id)
        if (!element) return

        const rect = element.getBoundingClientRect()
        if (rect.top <= 200 && rect.bottom >= 200) {
          setActiveSection(id)
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <ThemeContext.Provider value={theme}>
      <div className="relative text-white scroll-smooth min-h-screen font-mono" style={{ backgroundColor: theme.bg }}>
        <FluidBackground />
        <ScrollProgress progress={scrollProgress} />
        <SidebarNav show={showSidebar} activeSection={activeSection} />
        <ThemeSwitcher themes={themes} current={theme} onChange={setTheme} />

        <main className="max-w-6xl mx-auto px-6">
          <OverviewSection />
          <StackSection />
          <ProjectsSection />
          <AboutSection />
          <SocialsSection />
        </main>
      </div>
    </ThemeContext.Provider>
  )
}

function ThemeSwitcher({ themes, current, onChange }: { themes: Theme[], current: Theme, onChange: (t: Theme) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="absolute top-6 right-6 md:top-10 md:right-10 z-50">
      <button
        onClick={() => setOpen(o => !o)}
        className="group flex items-center gap-2.5 px-6 py-2.5 rounded-full border text-xs font-mono font-bold tracking-wider shadow-lg transition-all duration-300 hover:scale-105 uppercase"
        style={{
          borderColor: current.accent,
          color: current.accent,
          backgroundColor: "transparent"
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.backgroundColor = current.accent
          ;(e.currentTarget as HTMLElement).style.color = "#000"
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"
          ;(e.currentTarget as HTMLElement).style.color = current.accent
        }}
        title="Change theme"
      >
        <Palette size={16} className="group-hover:animate-pulse" />
        <span className="whitespace-nowrap">
          THEME: {current.name}
        </span>
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0 }}
          className="mt-3 rounded-xl border border-gray-700/60 overflow-hidden shadow-2xl"
          style={{ backgroundColor: "#1a1a24", minWidth: "220px", position: "absolute", right: 0 }}
        >
          <div className="px-4 py-3 border-b border-gray-700/40">
            <p className="text-gray-400 text-[10px] font-bold tracking-[0.2em]">COLOR THEME</p>
          </div>
          {themes.map(t => (
            <button
              key={t.id}
              onClick={() => { onChange(t); setOpen(false) }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left"
              style={{ borderLeft: current.id === t.id ? `2px solid ${t.accent}` : "2px solid transparent" }}
            >
              <span className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: t.accent }} />
              <span className="text-xs mr-1">{t.emoji}</span>
              <span className="text-sm" style={{ color: current.id === t.id ? t.accent : "#9ca3af" }}>{t.name}</span>
              {current.id === t.id && <span className="ml-auto text-xs" style={{ color: t.accent }}>✓</span>}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  )
}



/* =========================================
   COMPONENTS
========================================= */

function ScrollProgress({ progress }: { progress: number }) {
  const { accent } = useContext(ThemeContext)
  return (
    <div
      className="fixed top-0 left-0 h-[2px] z-50 transition-all duration-200"
      style={{ width: `${progress}%`, backgroundColor: accent }}
    />
  )
}

function SidebarNav({ show, activeSection }: { show: boolean; activeSection: string }) {
  const { accent } = useContext(ThemeContext)
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)
  return (
    <div
      className={`hidden md:block fixed left-8 top-1/2 -translate-y-1/2 transition-opacity duration-500 ease-out flex flex-col ${show ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
    >
      <nav className="space-y-10">
        {sections.map((id) => {
          const isActive = activeSection === id
          const isHovered = hoveredSection === id
          const isHighlight = isActive || isHovered

          return (
            <a
              key={id}
              href={`#${id}`}
              className="flex items-center gap-4 group transition-all duration-300"
              onMouseEnter={() => setHoveredSection(id)}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <span className="relative flex items-center justify-center w-10">
                <span
                  className="absolute h-[1px] transition-all duration-300"
                  style={{
                    width: isHighlight ? "2rem" : "1.25rem",
                    backgroundColor: isActive ? accent : "#4b5563"
                  }}
                />
              </span>
              <span
                className={`transition-all duration-300 capitalize ${
                  isHighlight ? "text-xl font-medium" : "text-lg"
                } ${isActive ? "" : "text-gray-400"}`}
                style={isActive ? { color: accent } : {}}
              >
                {id}
              </span>
            </a>
          )
        })}
      </nav>
    </div>
  )
}

function OverviewSection() {
  const { accent } = useContext(ThemeContext)
  const socials = [
    { icon: Linkedin, href: "https://www.linkedin.com/in/richa-singhxyz/" },
    { icon: Github, href: "https://github.com/richasingh-16" },
    { icon: Mail, href: "mailto:s.richaaaaxyz@example.com" }
  ]

  return (
    <section id="overview" className="relative z-10 min-h-screen flex items-center justify-center">
      {/* Matrix subtle background grid only for overview */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-80"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${accent}25 1px, transparent 2px),
            linear-gradient(to bottom, ${accent}25 1px, transparent 2px)
          `,
          backgroundSize: '120px 120px',
          maskImage: 'radial-gradient(ellipse at center, black 15%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 15%, transparent 75%)',
          filter: 'blur(1.5px)'
        }}
      />
      <div className="flex flex-col w-full relative z-10 pointer-events-none">
        <div className="flex flex-col items-start w-full md:w-[55%] tracking-wide pointer-events-auto">
          <h1 className="flex flex-col items-start mb-10 w-full">
            <span className="text-white text-[3rem] sm:text-5xl md:text-[5.5rem] leading-tight tracking-tight mb-2">
              Hello I'm
            </span>
            <span
              className="text-[3.5rem] sm:text-6xl md:text-[6.5rem] font-bold leading-none mt-2"
              style={{ color: accent, textShadow: `0 0 40px ${accent}26, 0 0 80px ${accent}0d` }}
            >
              Richa
            </span>
            <span
              className="text-[3.5rem] sm:text-6xl md:text-[6.5rem] font-bold leading-none mt-2"
              style={{ color: accent, textShadow: `0 0 40px ${accent}26, 0 0 80px ${accent}0d` }}
            >
              Singh
            </span>
          </h1>

          <div className="text-gray-300 text-xl md:text-2xl font-medium tracking-tight flex flex-col gap-2 mb-12">
            <p>Full Stack Developer • NIT Surat ECE'26</p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <a
              href="/richasingh_sde.pdf"
              download="richasingh_sde.pdf"
              className="flex items-center gap-3 px-8 py-3 rounded-full border text-sm hover:text-black transition-all duration-300 font-medium"
              style={{
                borderColor: accent,
                color: accent,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = accent
                ;(e.currentTarget as HTMLElement).style.color = "#000"
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"
                ;(e.currentTarget as HTMLElement).style.color = accent
              }}
            >
              VIEW CV
              <ChevronRight size={16} />
            </a>

            <div className="flex items-center gap-4">
              {socials.map((social, idx) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1, duration: 0.5 }}
                    className="w-10 h-10 rounded-full border flex items-center justify-center transition-all hover:scale-110"
                    style={{
                      borderColor: accent,
                      color: accent,
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.backgroundColor = accent
                      el.style.color = "#000"
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.backgroundColor = "transparent"
                      el.style.color = accent
                    }}
                  >
                    <Icon size={18} strokeWidth={1.5} />
                  </motion.a>
                )
              })}
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}

function StackSection() {
  const { accent } = useContext(ThemeContext)
  const techStack = [
    { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    { name: "C++", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
    { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Python", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg" },
    { name: "TypeScript", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" },
    { name: "Next.js", icon: "https://cdn.jsdelivr.net/npm/simple-icons@9.0.0/icons/nextdotjs.svg", invert: true },
    { name: "Tailwind CSS", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-original.svg" },
    { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
    { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
    { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
    { name: "AWS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg", invert: true },
  ]

  return (
    <section id="stack" className="min-h-screen flex flex-col justify-center py-20 md:pl-64">
      <div className="max-w-4xl">
        <h2 style={{ color: accent }} className="text-sm font-bold tracking-[0.2em] mb-10 uppercase">TECH STACK I&apos;M FAMILIAR WITH</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {techStack.map((tech) => (
            <div
              key={tech.name}
              className="group relative rounded-[20px] p-5 transition-all duration-300 flex flex-col items-center gap-3 text-center shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.36)]"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(20px)",
              }}
            >
              <img
                src={tech.icon}
                alt={tech.name}
                className={`w-10 h-10 object-contain z-10 transition-transform duration-300 group-hover:-translate-y-1 ${tech.invert ? 'filter invert brightness-0 grayscale opacity-90' : ''}`}
              />
              <h3 className="text-white font-medium text-sm z-10">{tech.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AboutSection() {
  const { accent } = useContext(ThemeContext)

  const cardBase = "group relative rounded-[20px] p-6 transition-all duration-500 shadow-[0_8px_24px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col justify-start hover:shadow-[0_20px_40px_rgba(0,0,0,0.36)]"

  const glassBorder = {
    border: "1px solid rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(20px)",
  }

  return (
    <section id="about" className="min-h-screen flex flex-col justify-center py-20 md:pl-64">
      <div className="max-w-4xl w-full">
        <h2 style={{ color: accent }} className="text-sm font-bold tracking-[0.2em] mb-10 w-full uppercase">ABOUT ME</h2>

        <div className="flex flex-col gap-4 md:gap-6 w-full h-auto md:h-[650px]">
          
          {/* TOP ROW */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full md:flex-[35] md:hover:flex-[45] transition-all duration-500">
            
            {/* Top Left Card */}
            <div 
              className={`${cardBase} md:flex-[60] md:hover:flex-[75] min-h-[220px] md:min-h-0 bg-white/5`}
              style={{ ...glassBorder }}
            >
              <div className="flex flex-col space-y-4">
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight whitespace-nowrap" style={{ color: accent }}>hey i'm richa</h3>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                  i like to code, i like music, i like making desserts, i like f1 and i like fashion<br/>
                  i also like gardening. basically i like a lot of things
                </p>
              </div>
            </div>

            {/* Top Right Card (Image) */}
            <div 
              className={`${cardBase} p-0 md:flex-[40] md:hover:flex-[55] min-h-[220px] md:min-h-0`}
              style={{ ...glassBorder }}
            >
              <div 
                className="absolute inset-0 w-full h-full transition-transform duration-700 md:group-hover:scale-105"
                style={{
                  backgroundImage: "url('/about-pic.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center 20%",
                  opacity: 0.9
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
            </div>
            
          </div>

          {/* BOTTOM ROW */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full md:flex-[65] md:hover:flex-[75] transition-all duration-500">
            
            {/* Bottom Left Column */}
            <div className="flex flex-col gap-4 md:gap-6 md:flex-[40] md:hover:flex-[50] transition-all duration-500">
              
              {/* Middle Left Card */}
              <div 
                className={`${cardBase} flex-1 md:hover:flex-[1.5] min-h-[180px] md:min-h-0 bg-gradient-to-br from-[#17171e]/60 to-[#0a0a0f]/60`}
                style={{ ...glassBorder }}
              >
                <div className="flex flex-col space-y-4">
                  <p className="text-gray-300 font-mono text-xs md:text-sm leading-relaxed">
                    Build simple systems first.<br/>
                    Optimize later.
                  </p>
                  <p className="font-mono text-xs md:text-sm font-bold" style={{ color: accent }}>
                    Readable code &gt; clever code.
                  </p>
                </div>
              </div>

              {/* Bottom Left Card */}
              <a 
                href="#socials"
                className={`${cardBase} cursor-pointer flex-1 md:hover:flex-[1.5] min-h-[180px] md:min-h-0 bg-gradient-to-br from-[#581c87]/50 to-[#1e3a8a]/50 border hover:border-white/20`}
                style={{ ...glassBorder, textDecoration: 'none' }}
              >
                <div className="flex flex-col items-center justify-center h-full opacity-80 group-hover:opacity-100 transition-opacity">
                  <span className="text-xl md:text-2xl font-bold tracking-tight text-white mb-2">let's connect</span>
                  <ChevronDown size={28} className="text-white opacity-80 animate-bounce mt-2" />
                </div>
              </a>
              
            </div>

            {/* Bottom Right Tall Card */}
            <div 
              className={`${cardBase} md:flex-[60] md:hover:flex-[75] min-h-[384px] md:min-h-0 rounded-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.2)] transition-all`}
              style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", backdropFilter: "blur(20px)" }}
            >
              <div className="flex flex-col space-y-8 mt-auto md:mt-0">
                <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                  I enjoy taking ideas and turning them into something real.<br/>
                  The process of building, breaking, and improving things<br/>
                  is where most of the learning happens.
                </p>
                
                <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                  Curiosity drives most of what I do :0<br/>
                  understanding systems, solving problems,<br/>
                  and constantly exploring new possibilities.
                </p>

                <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                  Most of what I build begins the same way -<br/>
                  with a simple question: <strong className="font-bold" style={{ color: accent }}>“What if?”</strong>
                </p>
              </div>
            </div>
            
          </div>

        </div>
      </div>
    </section>
  )
}

function SocialsSection() {
  const { accent } = useContext(ThemeContext)
  const links = [
    { icon: Mail, label: "EMAIL", sub: "s.richaaaaxyz@gmail.com", href: "mailto:s.richaaaaxyz@gmail.com", color: accent },
    { icon: Linkedin, label: "LINKEDIN", sub: "linkedin.com/in/richa-singhxyz", href: "https://www.linkedin.com/in/richa-singhxyz/", color: "#0a66c2" },
    { icon: Github, label: "GITHUB", sub: "github.com/richasingh-16", href: "https://github.com/richasingh-16", color: "#e2e8f0" },
  ]

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("sending")
    const form = e.currentTarget
    const formData = new FormData(form)
    
    // Convert formData to a JSON object
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(data),
      })
      if (res.ok) { setStatus("sent"); form.reset() }
      else setStatus("error")
    } catch { setStatus("error") }
  }

  return (
    <section id="socials" className="relative z-10 min-h-screen flex flex-col justify-center py-20 md:pl-64">
      {/* Matrix background for socials */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-80"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${accent}25 1px, transparent 2px),
            linear-gradient(to bottom, ${accent}25 1px, transparent 2px)
          `,
          backgroundSize: '120px 120px',
          maskImage: 'radial-gradient(ellipse at center, black 15%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 15%, transparent 75%)',
          filter: 'blur(1.5px)'
        }}
      />
      <div className="relative z-10 max-w-4xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Left — Find me on */}
          <div>
            <p style={{ color: accent }} className="text-sm font-bold tracking-[0.2em] mb-6 uppercase">FIND ME ON</p>
            <div className="flex flex-col gap-3">
              {links.map(({ icon: Icon, label, sub, href, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-[20px] px-5 py-4 transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.36)]"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(20px)",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: color + "18", border: `1px solid ${color}40` }}
                  >
                    <Icon size={18} style={{ color }} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold tracking-widest" style={{ color }}>{label}</p>
                    <p className="text-gray-500 text-xs mt-0.5 truncate">{sub}</p>
                  </div>
                  <ChevronRight size={14} className="text-gray-700 group-hover:text-gray-400 transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Right — Send a message */}
          <div>
            <p style={{ color: accent }} className="text-sm font-bold tracking-[0.2em] mb-6 uppercase">SEND A MESSAGE</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-gray-500 text-xs font-mono mb-1 block">Your Name <span className="text-red-500">*</span></label>
                <input
                  name="name"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-gray-300 focus:outline-none transition-all duration-300 font-mono backdrop-blur-md"
                  style={{ '--tw-border-opacity': '1' } as any}
                  onFocus={e => (e.currentTarget.style.borderColor = accent)}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}  
                />
              </div>
              <div>
                <label className="text-gray-500 text-xs font-mono mb-1 block">Your Email <span className="text-red-500">*</span></label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-gray-300 focus:outline-none transition-all duration-300 font-mono backdrop-blur-md"
                  onFocus={e => (e.currentTarget.style.borderColor = accent)}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>
              <div>
                <label className="text-gray-500 text-xs font-mono mb-1 block">Subject</label>
                <input
                  name="subject"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-gray-300 focus:outline-none transition-all duration-300 font-mono backdrop-blur-md"
                  onFocus={e => (e.currentTarget.style.borderColor = accent)}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>
              <div>
                <label className="text-gray-500 text-xs font-mono mb-1 block">Message <span className="text-red-500">*</span></label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-gray-300 focus:outline-none transition-all duration-300 font-mono resize-none backdrop-blur-md"
                  onFocus={e => (e.currentTarget.style.borderColor = accent)}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>
              <button
                type="submit"
                disabled={status === "sending" || status === "sent"}
                className="w-full py-3 rounded-lg font-mono text-sm font-bold tracking-widest transition-all duration-300 disabled:opacity-60"
                style={{ backgroundColor: accent, color: "#000" }}
              >
                {status === "idle" && "Send Message"}
                {status === "sending" && "sending..."}
                {status === "sent" && "✓ message_sent!"}
                {status === "error" && "✗ try_again()"}
              </button>
              <p className="text-gray-500 text-xs font-mono">// Powered by my secure Next.js server — lands directly in my inbox :)</p>
            </form>
          </div>

        </div>
      </div>
    </section>
  )
}

function Section({ id, title }: { id: string; title: string }) {
  return (
    <section id={id} className="min-h-screen flex items-center justify-center">
      <h2 className="text-2xl font-semibold text-gray-400">{title}</h2>
    </section>
  )
}

/* =========================================
   HORIZONTAL SCROLLER
========================================= */

function HorizontalScroller({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const sizerRef = useRef<HTMLDivElement>(null)
  const [scrollRange, setScrollRange] = useState(0)
  const [contentWidth, setContentWidth] = useState(0)

  useLayoutEffect(() => {
    if (!scrollRef.current || !sizerRef.current) return
    setScrollRange(scrollRef.current.scrollWidth)

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContentWidth(entry.contentRect.width)
        if (scrollRef.current) setScrollRange(scrollRef.current.scrollWidth)
      }
    })
    resizeObserver.observe(sizerRef.current)
    return () => resizeObserver.disconnect()
  }, [])

  const { scrollYProgress } = useScroll({ target: containerRef })
  const transform = useTransform(scrollYProgress, [0, 1], [0, -(scrollRange - contentWidth)])
  const spring = useSpring(transform, { damping: 60, mass: 1, stiffness: 500 })

  return (
    <div ref={containerRef}>
      <div style={{ position: "sticky", top: 0, overflow: "hidden", height: "100vh", display: "flex", alignItems: "center" }}>
        <motion.div
          ref={scrollRef}
          style={{ x: spring, display: "flex", gap: "2rem", paddingLeft: "1rem" }}
        >
          {children}
        </motion.div>
      </div>
      <div ref={sizerRef} aria-hidden style={{ width: "100%", height: scrollRange * 0.6 }} />
    </div>
  )
}

/* =========================================
   PROJECTS SECTION
========================================= */

const projects = [
  {
    title: "Synapse Medicare",
    description: "A personal healthcare website and comprehensive platform designed to manage patient data, appointments, and medical records securely.",
    tags: ["React", "Node.js", "MongoDB", "Express"],
    color: "#00e57f",
    href: "https://github.com/mayankified/Synapse-Medicare",
    year: "2024",
    category: "FULL-STACK · HEALTHCARE",
    icon: Activity,
  },
  {
    title: "Face Recognition System",
    description: "An advanced facial recognition system building utilizing computer vision, OpenCV and machine learning algorithms.",
    tags: ["Python", "OpenCV", "Machine Learning"],
    color: "#7c6ce4",
    href: "https://github.com/richasingh-16/facerecognisation_",
    year: "2024",
    category: "AI · COMPUTER VISION",
    icon: Focus,
  },
  {
    title: "Smart Product Pricing",
    description: "A machine learning based solution to predict and optimize product pricing strategies dynamically based on market trends.",
    tags: ["Python", "scikit-learn", "Pandas", "ML"],
    color: "#f59e0b",
    href: "https://github.com/richasingh-16/smart-product-pricing-ml",
    year: "2024",
    category: "ML · DATA SCIENCE",
    icon: TrendingUp,
  },
  {
    title: "Sorting Visualiser",
    description: "An interactive educational tool that visualizes various sorting algorithms in real-time, helping users understand their mechanics.",
    tags: ["JavaScript", "React", "Algorithms", "CSS"],
    color: "#ef4444",
    href: "https://github.com/richasingh-16/sorting-visualiser",
    year: "2023",
    category: "FRONTEND · ALGORITHMS",
    icon: BarChart2,
  },
]

function ProjectCardInner({ project }: { project: typeof projects[0] }) {
  const Icon = project.icon
  return (
    <div className="group relative flex flex-col h-full w-full p-5 md:p-6 text-left z-20">
      
      {/* Icon & GitHub Link Row */}
      <div className="flex justify-between items-start mb-4 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center opacity-90 transition-opacity group-hover:opacity-100" style={{ backgroundColor: `${project.color}15`, border: `1px solid ${project.color}30` }}>
          <Icon size={16} style={{ color: project.color }} />
        </div>
        <a href={project.href} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="px-2 py-1 text-[10px] md:text-xs text-gray-400 font-mono border border-gray-700/50 rounded hover:bg-white/5 transition-colors flex items-center gap-1.5 pointer-events-auto group-hover:bg-white/5">
          GitHub <span className="text-sm leading-none mt-[-2px]">↗</span>
        </a>
      </div>
      
      {/* Category */}
      <div className="mb-2 flex-shrink-0">
        <span className="text-[9px] md:text-[10px] font-mono font-bold tracking-[0.2em] uppercase" style={{ color: project.color }}>
          {project.category}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-white text-lg md:text-xl font-bold mb-2 tracking-tight drop-shadow-sm flex-shrink-0 leading-tight">
        {project.title}
      </h3>

      {/* Description */}
      <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-4 flex-1 overflow-hidden" style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
        {project.description}
      </p>

      {/* Tech Stack Tags */}
      <div className="flex flex-wrap gap-2 mt-auto flex-shrink-0">
        {project.tags.map(tag => (
          <span key={tag} className="text-[10px] md:text-[11px] text-gray-400 font-mono px-2.5 py-1 border border-gray-800 rounded-md bg-transparent whitespace-nowrap">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

function ProjectsSection() {
  const { accent } = useContext(ThemeContext)
  
  const mappedProjects = projects.map(p => ({
    title: p.title,
    description: p.description,
    tag: p.year,
    linkUrl: p.href,
    customContent: <ProjectCardInner project={p} />
  }))

  return (
    <section id="projects" className="md:pl-64 min-h-screen flex flex-col justify-center py-20">
      <div className="max-w-4xl w-full">
        <h2 style={{ color: accent }} className="text-sm font-bold tracking-[0.2em] mb-10 w-full uppercase">PROJECTS I&apos;VE CREATED</h2>

        <div className="w-full">
          <ParallaxCardGrid
            cards={mappedProjects}
            mobileColumns={1}
            tabletColumns={2}
            desktopColumns={3}
            gap={16}
            aspectRatio={1.1} // Preserves the same original card sizing!
            borderRadius={20}
            tiltDepth={6}
            shadowStrength={0.2}
            enableGlare={true}
            enableRevealAnimation={true}
            enableGlassmorphism={true}
            theme="dark"
            hoverVariant="cards-elevate-on-hover"
          />
        </div>
      </div>
    </section>
  )
}