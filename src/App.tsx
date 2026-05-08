import { useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  Facebook,
  FileCheck2,
  GraduationCap,
  Globe2,
  HeartHandshake,
  Home,
  Instagram,
  Linkedin,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Plane,
  School,
  Shield,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
  Utensils,
  X,
  Youtube,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RegistrationForm } from './components/RegistrationForm';

const HELPLINE = '18002701015';
const WHATSAPP_NUMBER = '9118002701015';
const whatsappText = encodeURIComponent('Hi, I want to register for the free Mega MBBS Seminar 2026.');
const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`;

function scrollToRegistration() {
  document.getElementById('registration-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function MedicalEmblem({ className = '' }: { className?: string }) {
  return (
    <div className={`emblem ${className}`} aria-label="Medical education emblem">
      <Shield className="emblem-shield" strokeWidth={1.8} />
      <BookOpen className="emblem-book" strokeWidth={2} />
      <span className="emblem-cross">+</span>
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const navLinks = ['Home', 'Speakers', 'Why Join', 'Cities', 'Agenda', 'FAQ', 'Contact'];

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="header-logo" href="#home" aria-label="Mega MBBS Seminar 2026 home">
          <MedicalEmblem />
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <a key={link} href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}>
              {link}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <a className="btn btn-outline btn-small" href={`tel:${HELPLINE}`}>
            <Phone size={16} />
            Call Now
          </a>
          <button className="btn btn-gold btn-small" onClick={scrollToRegistration}>
            Register Free
          </button>
        </div>

        <button className="mobile-menu-button" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            className="mobile-nav"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.18 }}
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => (
              <a key={link} href={`#${link.toLowerCase().replace(/\s+/g, '-')}`} onClick={() => setOpen(false)}>
                {link}
              </a>
            ))}
            <div className="mobile-nav-actions">
              <a className="btn btn-outline" href={`tel:${HELPLINE}`}>Call Now</a>
              <button className="btn btn-gold" onClick={scrollToRegistration}>Register Free</button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function HeroSection() {
  const eventBadges = ['Free Entry', 'Multiple Cities', 'Expert Guidance', 'Parent Counselling'];
  const trustItems = [
    { icon: Users, label: 'Meet Top Experts' },
    { icon: HeartHandshake, label: 'One-to-One Counselling' },
    { icon: BadgeCheck, label: 'Scholarship Guidance' },
    { icon: School, label: 'University Selection Support' },
  ];

  return (
    <section id="home" className="hero-section">
      <div className="container hero-grid">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <h1>
            <span>Mega MBBS</span>
            <strong>Seminar 2026</strong>
          </h1>
          <h2>Free MBBS Guidance Seminar<br />for NEET Aspirants & Parents</h2>
          <p>
            Meet India’s leading experts, university representatives, and alumni. Understand MBBS options,
            admission process, fees, scholarships, hostel, safety, and career roadmap — all under one roof.
          </p>

          <div className="badge-row">
            {eventBadges.map((badge) => (
              <span key={badge}><CheckCircle2 size={15} /> {badge}</span>
            ))}
          </div>

          <div className="hero-buttons">
            <button className="btn btn-gold btn-large" onClick={scrollToRegistration}>
              Register Free <ArrowRight size={18} />
            </button>
            <a className="btn btn-whatsapp btn-large" href={whatsappUrl} target="_blank" rel="noreferrer">
              <MessageCircle size={18} /> Chat on WhatsApp
            </a>
          </div>

          <div className="trust-row">
            {trustItems.map(({ icon: Icon, label }) => (
              <div key={label}>
                <Icon size={20} />
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div className="hero-skyline" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </motion.div>

        <motion.div
          id="registration-section"
          className="hero-form-card"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.12 }}
        >
          <div className="form-card-top">
            <MedicalEmblem className="emblem-on-dark" />
            <div className="event-points">
              {['Free Entry', 'Expert Guidance', 'Parent Counselling', 'Limited Seats', 'Multiple Cities'].map((item) => (
                <span key={item}><CheckCircle2 size={13} /> {item}</span>
              ))}
            </div>
            <div className="gold-arc" />
            <img
              src="/images/hero-medical-students.png"
              alt="Medical students studying"
              fetchPriority="high"
            />
          </div>
          <RegistrationForm variant="dark" />
        </motion.div>
      </div>
    </section>
  );
}

function SectionTitle({ children, gold }: { children: string; gold: string }) {
  const parts = children.split(gold);
  return (
    <div className="section-title">
      <h2>
        {parts[0]}<span>{gold}</span>{parts[1]}
      </h2>
    </div>
  );
}

function BenefitCards() {
  const benefits = [
    { icon: Globe2, title: 'NRI MBBS Seat Options' },
    { icon: Building2, title: 'Best Universities Selection & Fees' },
    { icon: CircleDollarSign, title: 'Scholarship & Financial Guidance' },
    { icon: ClipboardCheck, title: 'NEET Eligibility & Admission Process' },
    { icon: Plane, title: 'Visa, Documentation & Travel Support' },
    { icon: Home, title: 'Hostel, Safety, Food & Student Life' },
    { icon: Stethoscope, title: 'MBBS in India vs Abroad' },
    { icon: Users, title: 'Parent Counselling & Career Roadmap' },
  ];

  return (
    <section id="why-join" className="section benefits-section">
      <div className="container">
        <SectionTitle gold="Free Seminar">What You Will Learn in This Free Seminar</SectionTitle>
        <div className="benefits-grid">
          {benefits.map(({ icon: Icon, title }) => (
            <motion.div className="benefit-card" key={title} whileHover={{ y: -5 }}>
              <Icon size={34} />
              <h3>{title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyAttend() {
  const points = [
    { icon: FileCheck2, text: 'Complete information in one place' },
    { icon: Users, text: 'Interact with university representatives' },
    { icon: ShieldCheck, text: 'Avoid costly admission mistakes' },
    { icon: Globe2, text: 'Find the best country for your budget' },
    { icon: Sparkles, text: 'Secure future with global opportunities' },
    { icon: Clock3, text: 'Save time and make the right decision' },
  ];

  return (
    <section className="why-section">
      <div className="container">
        <div className="why-card">
          <h2>Before You Choose Any MBBS University,<br />Attend This <span>Free Seminar</span></h2>
          <div className="why-points">
            {points.map(({ icon: Icon, text }) => (
              <div key={text} className="why-point">
                <Icon size={25} />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function DoctorProfiles() {
  const doctors = [
    { name: 'Dr. Karan Jadon', country: 'USA', role: 'General Medicine PG Doctor', img: '/images/dr-karan-jadon.jpeg', flag: '🇺🇸' },
    { name: 'Dr. Komal R', country: 'UK', role: 'General Medicine PG Doctor', img: '/images/dr-komal-r.jpeg', flag: '🇬🇧' },
    { name: 'Dr. Piyush', country: 'Australia', role: 'Graduated & Practicing Doctor', img: '/images/dr-piyush.jpeg', flag: '🇦🇺' },
    { name: 'Dr. Gurpreet K', country: 'Canada', role: 'General Medicine PG Doctor', img: '/images/dr-gurpreet-k.jpeg', flag: '🇨🇦' },
    { name: 'Dr. Isha Jadon', country: 'Germany', role: 'Graduated & Practicing Doctor', img: '/images/dr-isha-jadon.jpeg', flag: '🇩🇪' },
  ];

  return (
    <section id="speakers" className="section doctors-section">
      <div className="container">
        <SectionTitle gold="Graduated Doctors">Meet Our Graduated Doctors</SectionTitle>
        <div className="title-ornament"><span /> <Sparkles size={16} /> <span /></div>
        <div className="doctor-row">
          {doctors.map((doctor) => (
            <motion.article className="doctor-card" key={doctor.name} whileHover={{ y: -5 }}>
              <div className="doctor-image"><img src={doctor.img} alt={doctor.name} loading="lazy" /></div>
              <h3>{doctor.name}</h3>
              <div className="country"><span>{doctor.flag}</span>{doctor.country}</div>
              <p>{doctor.role}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function VenueCards() {
  const venues = [
    { city: 'Davanagere', venue: 'Athani PU College', address: 'SS Layout A Block, Davanagere', date: 'Sun, 10th May', time: '10:00 AM – 03:00 PM', img: '/images/venue-davanagere-athani-college.png' },
    { city: 'Hubballi', venue: 'Medha PU Science College', address: 'Empire Square, Shirur Park, Hubballi', date: 'Sun, 10th May', time: '10:00 AM – 03:00 PM', img: '/images/venue-hubballi-medha-college.png' },
    { city: 'Kalaburagi', venue: 'Shree Vidya PU College', address: 'SB Temple Road, Kalaburagi', date: 'Sun, 10th May', time: '10:00 AM – 03:00 PM', img: '/images/venue-kalaburagi-shree-vidya.png' },
    { city: 'Vijayapura', venue: 'Chetana PU College', address: 'Gangapuram Colony, Vijayapura', date: 'Sun, 10th May', time: '10:00 AM – 03:00 PM', img: '/images/venue-vijayapura-chetana-college.png' },
  ];

  return (
    <section id="cities" className="section venues-section">
      <div className="container">
        <SectionTitle gold="Seminar City">Choose Your Seminar City</SectionTitle>
        <div className="venue-grid">
          {venues.map((venue) => (
            <article className="venue-card" key={venue.city}>
              <div className="venue-image">
                <img src={venue.img} alt={`${venue.city} seminar venue`} loading="lazy" />
                <span>{venue.city}</span>
              </div>
              <div className="venue-content">
                <h3>{venue.venue}</h3>
                <p><MapPin size={14} /> {venue.address}</p>
                <p><CalendarDays size={14} /> {venue.date}</p>
                <p><Clock3 size={14} /> {venue.time}</p>
                <button className="btn btn-gold venue-btn" onClick={scrollToRegistration}>Register for {venue.city}</button>
                <a className="btn btn-map venue-btn" href={`https://maps.google.com/?q=${encodeURIComponent(`${venue.venue} ${venue.city}`)}`} target="_blank" rel="noreferrer">
                  <MapPin size={14} /> Open Map
                </a>
                <strong>Open for NEET 2026 / NEET 2027</strong>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PosterSection() {
  const posters = [
    { city: 'Davanagere', img: '/images/poster-davanagere.jpeg', description: 'Join us at Athani PU College for comprehensive MBBS guidance.' },
    { city: 'Hubballi', img: '/images/poster-hubballi.jpeg', description: 'Expert counselling session at Medha PU Science College.' },
    { city: 'Kalaburagi', img: '/images/poster-kalaburagi.jpeg', description: 'Explore global medical careers at Shree Vidya PU College.' },
    { city: 'Vijayapura', img: '/images/poster-vijayapura.jpeg', description: 'Secure your medical future at Chetana PU College.' },
  ];

  return (
    <section className="section posters-section">
      <div className="container">
        <SectionTitle gold="Seminar Posters">Official Seminar Posters</SectionTitle>
        <div className="poster-grid">
          {posters.map((poster) => (
            <motion.div className="poster-card" key={poster.city} whileHover={{ scale: 1.02 }}>
              <div className="poster-image">
                <img src={poster.img} alt={`MBBS Seminar Poster ${poster.city}`} loading="lazy" />
              </div>
              <div className="poster-info">
                <h3>{poster.city} Seminar</h3>
                <p>{poster.description}</p>
                <button className="btn btn-gold btn-small" onClick={scrollToRegistration}>Book Free Pass</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FreeGuidanceCTA() {
  return (
    <section className="free-guidance-section">
      <div className="container">
        <div className="guidance-banner">
          <div className="guidance-icon">
            <GraduationCap size={32} />
            <Globe2 size={36} />
          </div>
          <div>
            <h2>Get Free MBBS Admission Guidance Anytime</h2>
            <p>Book your free counselling slot and understand your MBBS options with expert guidance.</p>
            <small>Guidance is free. Final admission depends on eligibility, documentation, university rules, and seat availability.</small>
          </div>
          <button className="btn btn-gold btn-large" onClick={scrollToRegistration}>
            Book Free Counselling <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}

function AgendaTimeline() {
  const items = [
    { icon: ClipboardCheck, label: 'Welcome & Registration' },
    { icon: Stethoscope, label: 'MBBS in India vs Abroad' },
    { icon: School, label: 'Top Universities Guide' },
    { icon: CircleDollarSign, label: 'Education Loan & Scholarship Options' },
    { icon: Plane, label: 'Abroad MBBS Process Explained' },
    { icon: Users, label: 'Meet University Experts' },
    { icon: MessageCircle, label: 'Q&A Session' },
    { icon: HeartHandshake, label: 'Free Counselling Support' },
  ];

  return (
    <section id="agenda" className="section agenda-section">
      <div className="container">
        <div className="divider-title"><span /> <h2>Seminar Agenda</h2> <span /></div>
        <div className="timeline">
          {items.map(({ icon: Icon, label }) => (
            <div className="timeline-item" key={label}>
              <div className="timeline-icon"><Icon size={22} /></div>
              <p>{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQAccordion() {
  const faqs = [
    ['Is the seminar free?', 'Yes, the seminar is completely free for students and parents.'],
    ['Who should attend this seminar?', 'NEET aspirants, students planning MBBS, and parents seeking clear admission guidance.'],
    ['Are parents allowed?', 'Yes, parents are encouraged to attend.'],
    ['Will scholarship options be explained?', 'Yes, scholarship, education loan, and budget planning options will be explained.'],
    ['Can I register on WhatsApp?', 'Yes, you can register easily through WhatsApp.'],
    ['Is admission guaranteed?', 'No. Guidance is provided, but admission depends on eligibility, documentation, university rules, and seat availability.'],
  ];
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="section faq-section">
      <div className="container">
        <div className="divider-title"><span /> <h2>Frequently Asked Questions</h2> <span /></div>
        <div className="faq-grid">
          {faqs.map(([question, answer], index) => {
            const open = openIndex === index;
            return (
              <div className="faq-item" key={question}>
                <button 
                  onClick={() => setOpenIndex(open ? -1 : index)}
                  aria-expanded={open}
                >
                  {question}
                  <ChevronDown size={18} className={open ? 'rotate' : ''} />
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      {answer}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section id="contact" className="final-cta-section">
      <div className="container final-cta">
        <div>
          <h2>Ready to Take the First Step<br />Toward <span>Becoming a Doctor?</span></h2>
          <div className="final-buttons">
            <button className="btn btn-gold btn-large" onClick={scrollToRegistration}>
              Book a Free Pass <ArrowRight size={17} />
            </button>
            <a className="btn btn-whatsapp btn-large" href={whatsappUrl} target="_blank" rel="noreferrer">
              <MessageCircle size={18} /> Chat on WhatsApp
            </a>
            <a className="btn btn-white btn-large" href={`tel:${HELPLINE}`}>
              <Phone size={18} /> Call Now
            </a>
          </div>
        </div>
        <div className="final-doctors">
          <img src="/images/dr-komal-r.jpeg" alt="Dr. Komal R" loading="lazy" />
          <img src="/images/dr-isha-jadon.jpeg" alt="Dr. Isha Jadon" loading="lazy" />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const quickLinks = ['Home', 'Speakers', 'Why Join', 'Cities', 'Agenda', 'FAQ'];
  const services = ['MBBS Admission Guidance', 'University Shortlisting', 'Visa & Travel Support', 'Scholarship Assistance', 'Education Loan Support'];

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <MedicalEmblem className="emblem-on-dark" />
          <p className="footer-disclaimer">
            <strong>Disclaimer:</strong> This seminar is for education counselling only. We do not provide direct medical advice or guarantee admissions. Final admission depends on student eligibility, NEET scores, documentation, university rules, and seat availability in India or Abroad.
          </p>
        </div>
        <div>
          <h3>Quick Links</h3>
          {quickLinks.map((link) => <a key={link} href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}>{link}</a>)}
        </div>
        <div>
          <h3>Our Services</h3>
          {services.map((service) => <a key={service} href="#home">{service}</a>)}
        </div>
        <div>
          <h3>Stay Connected</h3>
          <div className="socials">
            {[Facebook, Instagram, Youtube, MessageCircle, Linkedin].map((Icon, index) => (
              <a key={index} href={index === 3 ? whatsappUrl : '#home'} aria-label="Social link">
                <Icon size={17} />
              </a>
            ))}
          </div>
        </div>
      </div>
      
      <div className="container footer-compliance">
        <div className="compliance-text">
          <p>
            <strong>Data Privacy & Ad Disclosure:</strong> We use cookies and tracking technologies (Google Analytics & Meta Pixel) to improve your experience and show relevant ads. By using this site or submitting the form, you agree to our collection of data as per our Privacy Policy. You can opt-out of interest-based advertising via your browser settings or <a href="https://www.aboutads.info/choices" target="_blank" rel="noreferrer">AdChoices</a>.
          </p>
          <p>
            This site is not a part of the Meta website or Meta Platforms, Inc. Additionally, this site is NOT endorsed by Meta in any way. FACEBOOK is a trademark of META Platforms, Inc.
          </p>
        </div>
      </div>

      <div className="container footer-bottom">
        <div className="footer-copyright">
          © 2026 Mega MBBS Seminar. All Rights Reserved.
        </div>
        <div className="footer-legal">
          <a href="#home">Privacy Policy</a>
          <span className="sep">|</span>
          <a href="#home">Terms & Conditions</a>
          <span className="sep">|</span>
          <a href="#home">Cookie Policy</a>
          <span className="sep">|</span>
          <a href="#home">Disclaimer</a>
        </div>
      </div>
    </footer>
  );
}

function StickyWhatsAppButton() {
  return (
    <a className="sticky-whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
      <MessageCircle size={24} />
    </a>
  );
}

function MobileBottomCTA() {
  return (
    <div className="mobile-bottom-cta">
      <a href={`tel:${HELPLINE}`}><Phone size={17} /> Call</a>
      <a href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={17} /> WhatsApp</a>
      <button onClick={scrollToRegistration}><ArrowRight size={17} /> Register</button>
    </div>
  );
}

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <main>
        <HeroSection />
        <BenefitCards />
        <WhyAttend />
        <DoctorProfiles />
        <PosterSection />
        <VenueCards />
        <FreeGuidanceCTA />
        <AgendaTimeline />
        <FAQAccordion />
        <FinalCTA />
      </main>
      <Footer />
      <StickyWhatsAppButton />
      <MobileBottomCTA />
    </div>
  );
}
