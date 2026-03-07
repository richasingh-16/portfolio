"use client"

import { useEffect, useState } from "react"

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

      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight
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
    <div className="relative scroll-smooth min-h-screen font-sans bg-gradient-to-b from-[#fcfcfa] via-[#272b20] to-[#272b20] text-foreground">

      {/* Scroll Progress */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-[#b2c73a] z-50 transition-all duration-200"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Sidebar */}
      <div
        className={`hidden md:block fixed left-8 top-1/2 -translate-y-1/2 z-40
        transition-opacity duration-500 ease-out
        ${showSidebar ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <Sidebar activeSection={activeSection} />
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 relative z-10">

        <section id="overview" className="min-h-screen flex flex-col justify-center pt-20 pb-40">
          <div className="max-w-5xl">
            <h1 className="text-7xl md:text-9xl font-mono uppercase font-bold mb-4 tracking-tighter leading-none text-[#1a1c15]">
              Richa
              <br />
              Singh
            </h1>

            <h2 className="text-3xl md:text-5xl font-mono uppercase font-bold mb-8 text-[#8a9a2d] tracking-wider">
              Software Engineer.
            </h2>

            <p className="text-lg md:text-xl text-gray-700 max-w-2xl leading-relaxed mb-12 font-medium">
              Full-stack developer focused on building scalable web applications with strong foundations in data structures and problem-solving.
            </p>

            <div className="flex gap-4">
              <a
                href="#projects"
                className="px-8 py-4 bg-[#b2c73a] text-[#fcfcfa] font-bold font-mono tracking-widest uppercase transition-transform hover:-translate-y-1 hover:shadow-[0_10px_0_0_rgba(178,199,58,0.3)] duration-200 flex items-center justify-center"
              >
                View Projects
              </a>

              <a
                href="/resume.pdf"
                className="px-8 py-4 border-2 border-[#1a1c15] text-[#1a1c15] font-bold font-mono tracking-widest uppercase hover:bg-[#1a1c15] hover:text-[#fcfcfa] transition-colors duration-200 flex items-center justify-center"
              >
                Resume Download
              </a>
            </div>
          </div>
        </section>


        <section id="stack" className="min-h-screen flex flex-col justify-center py-20 md:pl-64">
          <div className="max-w-5xl w-full">
            <h2 className="text-6xl md:text-8xl font-mono uppercase font-bold mb-16 tracking-tighter text-white">
              Tech <span className="text-[#b2c73a]">Stack.</span>
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
                { name: "C++", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
                { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
                { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
                { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
                { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
                { name: "Tailwind CSS", icon: "/tailwind.png" },
                { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
                { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
                { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
                { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
                { name: "AWS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg" },
              ].map((tech) => (
                <div
                  key={tech.name}
                  className="bg-[#272b20] border-2 border-transparent hover:border-[#b2c73a] rounded-sm p-6 transition-all duration-300 flex flex-col items-center justify-center gap-4 text-center group cursor-default"
                >
                  <img src={tech.icon} alt={tech.name} className="w-12 h-12 object-contain grayscale group-hover:grayscale-0 transition-all duration-300" />
                  <h3 className="text-white font-mono uppercase tracking-wider text-sm font-bold group-hover:text-[#b2c73a] transition-colors">{tech.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
        <Section id="projects" title="Projects Section" />
        <Section id="education" title="Education Section" />
        <Section id="socials" title="Socials Section" />

      </div>
    </div>
  )
}

/* Sidebar */
function Sidebar({
  activeSection,
}: {
  activeSection: string
}) {
  return (
    <nav className="space-y-8 font-mono tracking-widest uppercase mix-blend-difference">
      {sections.map((id) => {
        const isActive = activeSection === id

        return (
          <a
            key={id}
            href={`#${id}`}
            className="flex items-center gap-4 group transition-all duration-300"
          >
            {/* Dash (center expand) */}
            <span className="relative flex items-center justify-center w-8">
              <span
                className={`absolute h-[2px] transition-all duration-300
                  ${isActive
                    ? "w-8 bg-[#b2c73a]"
                    : "w-4 bg-gray-500 group-hover:w-8 group-hover:bg-white"
                  }`}
              />
            </span>

            {/* Text */}
            <span
              className={`transition-all duration-200 text-sm font-bold
                ${isActive
                  ? "text-[#b2c73a]"
                  : "text-gray-400 group-hover:text-white"
                }
              `}
            >
              {id}
            </span>
          </a>
        )
      })}
    </nav>
  )
}

/* Section */
function Section({ id, title }: { id: string; title: string }) {
  return (
    <section
      id={id}
      className="min-h-screen flex items-center justify-center"
    >
      <h2 className="text-5xl md:text-7xl font-mono uppercase font-bold text-white tracking-tighter">{title}</h2>
    </section>
  )
}
