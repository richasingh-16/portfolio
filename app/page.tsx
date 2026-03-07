"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import { Mail, Facebook, Instagram, Youtube, Linkedin, Github, ChevronRight, GraduationCap } from "lucide-react"

import ParallaxCardGrid from "@/components/ParallaxCardGrid"

const sections = [
  "overview",
  "stack",
  "projects",
  "education",
  "socials",
]

export default function Home() {
  const [showSidebar, setShowSidebar] = useState(false)
  const [activeSection, setActiveSection] = useState("overview")
  const [scrollProgress, setScrollProgress] = useState(0)

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
        // Determine active section based on scroll position in viewport
        if (rect.top <= 200 && rect.bottom >= 200) {
          setActiveSection(id)
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="relative bg-[#0a0a0f] text-white scroll-smooth min-h-screen font-mono">
      <ScrollProgress progress={scrollProgress} />
      <SidebarNav show={showSidebar} activeSection={activeSection} />

      <main className="max-w-6xl mx-auto px-6">
        <OverviewSection />
        <StackSection />
        <ProjectsSection />
        <EducationSection />
        <Section id="socials" title="Socials Section" />
      </main>
    </div>
  )
}

/* =========================================
   COMPONENTS
========================================= */

function ScrollProgress({ progress }: { progress: number }) {
  return (
    <div
      className="fixed top-0 left-0 h-[2px] bg-emerald-400 z-50 transition-all duration-200"
      style={{ width: `${progress}%` }}
    />
  )
}

function SidebarNav({ show, activeSection }: { show: boolean; activeSection: string }) {
  return (
    <div
      className={`hidden md:block fixed left-8 top-1/2 -translate-y-1/2 transition-opacity duration-500 ease-out flex flex-col ${show ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
    >
      <nav className="space-y-10">
        {sections.map((id) => {
          const isActive = activeSection === id

          return (
            <a
              key={id}
              href={`#${id}`}
              className="flex items-center gap-4 group transition-all duration-300"
            >
              <span className="relative flex items-center justify-center w-10">
                <span
                  className={`absolute h-[1px] transition-all duration-300 ${isActive ? "w-8 bg-emerald-400" : "w-5 bg-gray-600 group-hover:w-8"
                    }`}
                />
              </span>
              <span
                className={`transition-all duration-300 capitalize ${isActive
                  ? "text-emerald-400 text-xl font-medium"
                  : "text-gray-400 text-lg group-hover:text-gray-400 group-hover:text-xl"
                  }`}
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
  const socials = [
    { icon: Linkedin, href: "#" },
    { icon: Github, href: "#" },
    { icon: Mail, href: "mailto:your.email@example.com" }
  ]

  return (
    <section id="overview" className="relative z-10 min-h-screen flex items-center justify-center">
      {/* Matrix subtle background grid only for overview */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 229, 127, 0.25) 1px, transparent 2px),
            linear-gradient(to bottom, rgba(0, 229, 127, 0.25) 1px, transparent 2px)
          `,
          backgroundSize: '120px 120px',
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)',
          filter: 'blur(1.5px)'
        }}
      />
      <div className="flex flex-col w-full relative z-10">
        <div className="flex flex-col items-start w-full tracking-wide">
          <h1 className="flex flex-col items-start mb-10 w-full">
            <span className="text-white text-[3rem] sm:text-5xl md:text-[5.5rem] leading-tight tracking-tight mb-2">
              Hello I'm
            </span>
            <span 
              className="text-[#00e57f] text-[3.5rem] sm:text-6xl md:text-[6.5rem] font-bold leading-none mt-2"
              style={{ textShadow: "0 0 40px rgba(0, 229, 127, 0.15), 0 0 80px rgba(0, 229, 127, 0.05)" }}
            >
              Richa
            </span>
            <span 
              className="text-[#00e57f] text-[3.5rem] sm:text-6xl md:text-[6.5rem] font-bold leading-none mt-2"
              style={{ textShadow: "0 0 40px rgba(0, 229, 127, 0.15), 0 0 80px rgba(0, 229, 127, 0.05)" }}
            >
              Singh
            </span>
          </h1>

          <div className="text-gray-400 text-sm md:text-base flex flex-col gap-2 mb-12">
            <p>Full Stack Developer</p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <a
              href="/resume.pdf"
              className="flex items-center gap-3 px-8 py-3 rounded-full border border-[#00e57f] text-[#00e57f] text-sm hover:bg-[#00e57f] hover:text-black hover:shadow-[0_0_20px_rgba(0,229,127,0.15)] transition-all duration-300 font-medium"
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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1, duration: 0.5 }}
                    className="w-10 h-10 rounded-full border border-gray-700/50 flex items-center justify-center text-gray-400 hover:text-[#00e57f] hover:border-[#00e57f] hover:bg-[#00e57f]/10 transition-all hover:scale-110 hover:shadow-[0_0_15px_rgba(0,229,127,0.1)]"
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
        <h2 className="text-4xl font-semibold mb-10">Stack</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {techStack.map((tech) => (
            <div
              key={tech.name}
              className="group relative bg-[#131825] border border-gray-700/40 rounded-lg p-5 hover:border-gray-500/60 transition-colors duration-300 flex flex-col items-center gap-3 text-center overflow-hidden"
            >
              {/* Green bottom line on hover */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#00e57f] transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100 shadow-[0_-2px_10px_rgba(0,229,127,0.5)]" />
              
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

function EducationSection() {
  const educationData = [
    {
      degree: "Bachelors of Technology, \n Electronics and Communications Engineering",
      school: "Sardar Vallabhbhai National Institute of Technology, NIT Surat.",
      year: "2022 - 2026"
    }
  ]

  return (
    <section id="education" className="min-h-screen flex flex-col justify-center py-20 md:pl-64">
      <div className="max-w-4xl w-full">
        <h2 className="text-4xl font-semibold mb-10 w-full">Education</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {educationData.map((edu, idx) => (
            <div
              key={idx}
              className="bg-[#0f1115] hover:bg-[#00e57f]/10 border border-gray-800 hover:border-[#00e57f]/40 transition-all duration-500 rounded-3xl p-8 flex flex-col w-full max-w-[380px] cursor-pointer"
            >
              <h3 className="text-white text-lg font-bold leading-relaxed mb-4 whitespace-pre-line">
                {edu.degree}
              </h3>

              <div className="flex items-end border-b border-transparent pb-10">
                <span className="text-gray-300 text-sm">
                  {edu.year}
                </span>
              </div>

              <div className="text-gray-400 text-sm leading-relaxed mt-4 whitespace-pre-line">
                {edu.school}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Section({ id, title }: { id: string; title: string }) {
  return (
    <section id={id} className="min-h-screen flex items-center justify-center">
      <h2 className="text-4xl font-medium">{title}</h2>
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
    title: "DevConnect",
    description: "A real-time collaboration platform for developers with live code sharing, video calls, and integrated Git workflows.",
    tags: ["Next.js", "WebSockets", "PostgreSQL", "Redis"],
    color: "#00e57f",
    href: "#",
    year: "2024",
  },
  {
    title: "NeuralBoard",
    description: "An AI-powered Kanban board that auto-prioritizes tasks using NLP and predicts sprint completion timelines.",
    tags: ["React", "Python", "OpenAI API", "MongoDB"],
    color: "#7c6ce4",
    href: "#",
    year: "2024",
  },
  {
    title: "TradeFlux",
    description: "A stock portfolio tracker with live market data, algorithmic alerts, and beautiful chart visualisations.",
    tags: ["TypeScript", "Node.js", "WebSockets", "D3.js"],
    color: "#f59e0b",
    href: "#",
    year: "2023",
  },
  {
    title: "EchoStore",
    description: "A full-stack e-commerce platform with Stripe payments, inventory management, and an admin dashboard.",
    tags: ["Next.js", "Prisma", "PostgreSQL", "Stripe"],
    color: "#ef4444",
    href: "#",
    year: "2023",
  },
  {
    title: "CloudPulse",
    description: "A server health monitoring tool with real-time metrics, anomaly detection, and Slack/email alerting.",
    tags: ["Docker", "AWS", "Node.js", "Grafana"],
    color: "#06b6d4",
    href: "#",
    year: "2023",
  },
]

function ProjectCard({ project }: { project: typeof projects[0] }) {
  return (
    <a
      href={project.href}
      className="group flex-shrink-0 w-[340px] md:w-[400px] bg-[#0f1115] border border-gray-800 rounded-3xl p-8 flex flex-col justify-between"
      style={{
        transition: "border-color 0.4s, background 0.4s",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = project.color + "66"
          ; (e.currentTarget as HTMLElement).style.background = project.color + "0d"
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = ""
          ; (e.currentTarget as HTMLElement).style.background = ""
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-6">
        <span className="text-xs text-gray-500 font-mono">{project.year}</span>
        <span
          className="w-3 h-3 rounded-full"
          style={{ background: project.color, boxShadow: `0 0 8px ${project.color}` }}
        />
      </div>

      {/* Title */}
      <h3 className="text-white text-2xl font-bold mb-3 group-hover:text-white transition-colors">
        {project.title}
      </h3>

      {/* Description */}
      <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-1">
        {project.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {project.tags.map(tag => (
          <span
            key={tag}
            className="text-xs px-3 py-1 rounded-full border border-gray-700 text-gray-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </a>
  )
}

function ProjectsSection() {
  const mappedProjects = projects.map(p => ({
    title: p.title,
    description: p.description,
    tag: p.year,
    linkLabel: "View Project",
    linkUrl: p.href,
    linkIcon: "→",
    image: { 
      // Placeholders since current projects don't have images
      src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop", 
      alt: p.title 
    }
  }))

  return (
    <section id="projects" className="md:pl-64 min-h-screen flex flex-col justify-center py-20">
      <div className="max-w-4xl w-full">
        <h2 className="text-4xl font-semibold mb-10 w-full">Projects</h2>
      
        <div className="w-full">
          <ParallaxCardGrid
            cards={mappedProjects}
            mobileColumns={1}
            tabletColumns={2}
            desktopColumns={3}
            gap={16}
            aspectRatio={1.1}
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