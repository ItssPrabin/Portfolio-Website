import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './styles.css'

const initialProjects = [
  {
    number: '01',
    type: 'BACKEND · 2026',
    title: 'PalmMind RAG Backend',
    description: 'Worked with FastAPI on a backend for document ingestion, chat, retrieval, and interview booking.',
    tags: ['FastAPI', 'Python'],
    artwork: 'rag',
    url: 'https://github.com/ItssPrabin/RAG-for-Interview-Booking',
  },
  {
    number: '02',
    type: 'WEB APPLICATION · 2026',
    title: 'Resume Ranking System',
    description: 'Worked with Flask, HTML, CSS, and JavaScript to build a resume ranking system.',
    tags: ['Flask', 'HTML', 'CSS', 'JavaScript'],
    artwork: 'resume',
    url: 'https://github.com/ItssPrabin/College-Minor-Project',
  },
]

function Icon({ name }) {
  const paths = {
    arrow: 'M5 12h13m-5-5 5 5-5 5',
    mail: 'M3.5 5.5h17v13h-17v-13Zm1.5 1.5 7 5 7-5',
    location: 'M12 21s5.5-5.3 5.5-10a5.5 5.5 0 1 0-11 0c0 4.7 5.5 10 5.5 10Zm0-8.5a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Z',
    phone: 'M7 3.5 9.5 3l1.5 4-2 1.6a15 15 0 0 0 6.4 6.4l1.6-2 4 1.5-.5 2.4a2 2 0 0 1-2.2 1.6A16.5 16.5 0 0 1 5.5 5.7 2 2 0 0 1 7 3.5Z',
    down: 'M5 9l7 7 7-7',
    sun: 'M12 3v2m0 14v2M5.6 5.6 7 7m10 10 1.4 1.4M3 12h2m14 0h2M5.6 18.4 7 17m10-10 1.4-1.4M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z',
    moon: 'M20 15.5A8 8 0 0 1 8.5 4a8 8 0 1 0 11.5 11.5Z',
    github: 'M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.6 2.4 1.1 3 .8.1-.7.4-1.1.6-1.3-2.2-.3-4.5-1.1-4.5-4.8 0-1.1.4-2 .9-2.7-.1-.2-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.5 9.5 0 0 1 5.1 0c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.5.1 2.7.6.7.9 1.6.9 2.7 0 3.7-2.3 4.5-4.5 4.8.4.3.7.9.7 1.8V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z',
    linkedin: 'M5 3.8a1.8 1.8 0 1 1-3.6 0A1.8 1.8 0 0 1 5 3.8ZM1.6 8h3.2v12H1.6V8Zm5.6 0h3.1v1.6h.1c.4-.9 1.5-1.9 3.3-1.9 3.5 0 4.2 2.3 4.2 5.4V20h-3.2v-6.1c0-1.5 0-3.3-2-3.3s-2.3 1.6-2.3 3.2V20H7.2V8Z',
  }
  return <svg className={`icon icon-${name}`} viewBox="0 0 24 24" aria-hidden="true"><path d={paths[name]} /></svg>
}

function App() {
  const [hasScrolled, setHasScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [projects, setProjects] = useState(initialProjects)
  const [formStatus, setFormStatus] = useState('')
  const [theme, setTheme] = useState(() => localStorage.getItem('portfolio-theme') || 'dark')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 12)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle('is-visible', entry.isIntersecting))
    }, { threshold: 0.12 })
    document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element))

    const sectionObserver = new IntersectionObserver((entries) => {
      const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (current) setActiveSection(current.target.id)
    }, { rootMargin: '-35% 0px -55%', threshold: [0, .1, .3] })
    document.querySelectorAll('section[id], footer[id]').forEach((section) => sectionObserver.observe(section))

    fetch('/api/projects')
      .then((response) => {
        if (!response.ok) throw new Error('Projects request failed')
        return response.json()
      })
      .then(setProjects)
      .catch(() => setProjects(initialProjects))

    return () => {
      window.removeEventListener('scroll', handleScroll)
      revealObserver.disconnect()
      sectionObserver.disconnect()
    }
  }, [])

  const closeMenu = () => setMenuOpen(false)

  const submitContact = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form))
    const subject = `Portfolio message from ${data.name}`
    const body = [
      `Name: ${data.name}`,
      `Contact: ${data.contact}`,
      '',
      'Message:',
      data.message,
    ].join('\n')
    window.location.href = `mailto:prabinrimal369@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setFormStatus('Your email app is opening with the message ready to send.')
  }

  return (
    <main>
      <nav className={`nav${hasScrolled ? ' is-scrolled' : ''}`} aria-label="Main navigation">
        <a className="brand" href="#home" aria-label="Home">PR<span>.</span></a>
        <div className={`nav-links${menuOpen ? ' is-open' : ''}`} id="site-menu">
          {['about', 'skills', 'work'].map((section) => (
            <a key={section} className={activeSection === section ? 'is-active' : ''} href={`#${section}`} onClick={closeMenu}>
              {section === 'skills' ? 'Toolkit' : section[0].toUpperCase() + section.slice(1)}
            </a>
          ))}
          <a className="nav-mobile-contact" href="#contact" onClick={closeMenu}>Let&apos;s connect <Icon name="arrow" /></a>
        </div>
        <div className="nav-tools">
          <div className="nav-socials">
            <a href="https://github.com/ItssPrabin" target="_blank" rel="noreferrer" aria-label="GitHub"><Icon name="github" /></a>
            <a href="https://www.linkedin.com/in/prabin-rimal-3675042a5/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Icon name="linkedin" /></a>
          </div>
          <button className="theme-toggle" type="button" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}>
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
          </button>
          <a className="nav-contact" href="#contact"><Icon name="mail" /> Let&apos;s connect <Icon name="arrow" /></a>
        </div>
        <button className={`menu-toggle${menuOpen ? ' is-open' : ''}`} type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="site-menu" onClick={() => setMenuOpen((open) => !open)}>
          <span /><span />
        </button>
      </nav>

      <section className="hero" id="home">
        <div className="hero-content">
          <div className="hero-copy">
            <div className="hero-kicker"><p className="eyebrow">AVAILABLE FOR A GOOD CHALLENGE</p></div>
            <h1 className="reveal writing">Hi, I&apos;m <em>Prabin Rimal</em></h1>
            <p className="hero-role reveal">With an interest in systems and web development, machine learning, and problem solving.</p>
            <p className="intro reveal">I am an IT engineering student from Lalitpur who likes figuring out how things work and making small ideas useful on the web.</p>
            <div className="hero-contact reveal" aria-label="Contact details">
              <span><Icon name="location" /> Lalitpur, Nepal</span>
              <a href="mailto:prabinrimal369@gmail.com"><Icon name="mail" /> prabinrimal369@gmail.com</a>
              <a href="tel:+9779702244089"><Icon name="phone" /> 9702244089</a>
            </div>
            <div className="hero-actions reveal">
              <a className="button" href="#work">Explore work <Icon name="arrow" /></a>
              <a className="button button-secondary" href="#skills">What I know so far <Icon name="arrow" /></a>
              <a className="button button-secondary" href="/resume.pdf" download="Prabin-Rimal-CV.pdf">Get CV <Icon name="arrow" /></a>
            </div>
          </div>
          <div className="hero-system reveal" aria-hidden="true">
            <div className="laptop">
              <div className="laptop-screen">
                <div className="code-toolbar"><span /><span /><span /><small>prabin.dev</small></div>
                <div className="code-editor">
                  <span className="code-line line-one"><i>const</i> project = <b>&quot;useful&quot;</b>;</span>
                  <span className="code-line line-two"><i>function</i> <em>keepGoing</em>() {'{'}</span>
                  <span className="code-line line-three">&nbsp;&nbsp;<i>return</i> project + <b>&quot;better&quot;</b>;</span>
                  <span className="code-line line-four">{'}'}</span>
                  <span className="code-line line-five"><i>keepGoing</i>();<strong className="code-cursor" /></span>
                </div>
              </div>
              <div className="laptop-base"><span /></div>
            </div>
          </div>
        </div>
        <a className="scroll-arrow" href="#about" aria-label="Scroll to About me section"><Icon name="down" /></a>
      </section>

      <section className="section about reveal" id="about">
        <p className="section-tag"><span>01</span><b>About me</b></p>
        <div className="about-copy">
          <h2 className="reveal writing">Still figuring<br /><em>things out.</em></h2>
          <div><p>I learn best by making something, getting stuck, and coming back to understand why it did not work.</p><p>Right now I am especially interested in systems, web development, machine learning, and the problem-solving that connects them.</p></div>
        </div>
      </section>

      <section className="section skills reveal" id="skills">
        <p className="section-tag"><span>02</span><b>Toolkit</b></p>
        <div className="skills-grid">
          <div><h2 className="reveal writing">What I know<br /><em>so far.</em></h2><p>Some tools I know well, and some I am still learning by using them in small projects.</p></div>
          <div className="skill-groups"><div className="skill-group"><p>STRONG FOUNDATION</p><div className="chips">{['HTML', 'CSS', 'JavaScript', 'Python'].map((skill) => <span key={skill}>{skill}</span>)}</div></div><div className="skill-group"><p>EXPOSURE &amp; LEARNING</p><div className="chips muted">{['React', 'Django', 'FastAPI', 'Flask', 'SQL', 'Git & GitHub', 'AI tools'].map((skill) => <span key={skill}>{skill}</span>)}</div></div></div>
        </div>
      </section>

      <section className="section work reveal" id="work">
        <div className="work-heading"><p className="section-tag"><span>03</span><b>My works</b></p><h2 className="reveal writing">A couple of<br /><em>projects.</em></h2></div>
        <div className="project-list">{projects.map((project) => <article className="project reveal" key={project.number}><div className="project-topline"><p className="project-number">{project.number}</p><span>Project</span></div><div className={`project-art ${project.artwork === 'rag' ? 'art-grid' : 'art-code'}`}>{project.artwork === 'rag' ? <span>RAG<br />BOOKING</span> : <code>{'{'}<br />&nbsp;match:<br />&nbsp;&nbsp;&apos;resume&apos;<br />{'}'}</code>}</div><div className="project-info"><p className="project-type">{project.type}</p><h3>{project.title}</h3><p>{project.description}</p><div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><a href={project.url} target="_blank" rel="noreferrer">View on GitHub <Icon name="arrow" /></a></div></article>)}</div>
        <p className="project-note">A small, honest record of what I have built so far - and the questions I am using each project to explore.</p>
      </section>

      <footer className="reveal" id="contact">
        <p className="section-tag"><span>04</span><b>Contact</b></p>
        <h2 className="reveal writing">Have a problem<br />worth <em>solving?</em></h2>
        <form className="contact-form" onSubmit={submitContact}><p>Drop me a message</p><div className="form-fields"><label><span>Your name</span><input name="name" type="text" placeholder="Your name" required /></label><label><span>Your contact</span><input name="contact" type="text" placeholder="Email, phone, or another way to reach you" required /></label><label className="message-field"><span>Your message</span><textarea name="message" rows="4" placeholder="Tell me what you would like to discuss." required /></label></div><div className="form-actions"><button type="submit">Send email <Icon name="arrow" /></button><a className="button button-secondary" href="/resume.pdf" download="Prabin-Rimal-CV.pdf">Get CV <Icon name="arrow" /></a></div><p className="form-status" role="status" aria-live="polite">{formStatus}</p></form>
        <div className="footer-bottom"><span>© 2026 PRABIN RIMAL</span><div className="social-links"><a href="https://github.com/ItssPrabin" target="_blank" rel="noreferrer" aria-label="GitHub"><Icon name="github" /></a><a href="https://www.linkedin.com/in/prabin-rimal-3675042a5/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Icon name="linkedin" /></a></div></div>
      </footer>
      <button className={`back-to-top${hasScrolled ? ' is-visible' : ''}`} type="button" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><Icon name="down" /></button>
      <Analytics />
    </main>
  )
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
