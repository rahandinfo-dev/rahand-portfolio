"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { portfolio, type Project } from "@/content/portfolio";
import { ContactForm } from "./contact-form";
import {
  ArrowIcon,
  CloseIcon,
  ExternalIcon,
  PlusIcon,
  SocialIcon,
} from "./icons";

function SectionHeading({
  number,
  eyebrow,
  title,
}: {
  number: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="section-heading">
      <div className="section-kicker">
        <span>{number}</span>
        <span>{eyebrow}</span>
      </div>
      <h2>{title}</h2>
    </div>
  );
}

function ProjectDialog({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  const requestClose = () => {
    const dialog = dialogRef.current;
    if (!dialog?.open || isClosing) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      dialog.close();
      return;
    }

    setIsClosing(true);
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="project-dialog"
      id={`project-dialog-${project.slug}`}
      aria-labelledby={`project-title-${project.slug}`}
      aria-describedby={`project-description-${project.slug}`}
      aria-modal="true"
      data-closing={isClosing ? "true" : undefined}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
      onAnimationEnd={(event) => {
        if (
          isClosing &&
          event.target === event.currentTarget &&
          event.animationName === "project-dialog-close"
        ) {
          dialogRef.current?.close();
        }
      }}
    >
      <div className="project-dialog-inner">
        <div className="dialog-topbar">
          <span className="dialog-index">پرۆژە / {project.number}</span>
          <button
            type="button"
            className="icon-button dialog-close"
            aria-label="داخستنی وردەکاریی پرۆژە"
            onClick={requestClose}
            autoFocus
          >
            <CloseIcon />
          </button>
        </div>

        <div className="dialog-hero">
          <div>
            <p className="project-category">{project.category}</p>
            <h2 id={`project-title-${project.slug}`}>{project.title}</h2>
          </div>
          <p id={`project-description-${project.slug}`}>
            {project.description}
          </p>
        </div>

        <div className="dialog-cover image-frame">
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            width={project.cover.width}
            height={project.cover.height}
            quality={90}
            sizes="(max-width: 800px) calc(100vw - 3rem), 1100px"
          />
        </div>

        <div className="project-detail-grid">
          <dl className="project-facts">
            <div>
              <dt>کڕیار</dt>
              <dd>{project.client}</dd>
            </div>
            <div>
              <dt>ماوە</dt>
              <dd>١٤ ڕۆژ</dd>
            </div>
            <div>
              <dt>ڕۆڵ</dt>
              <dd>{project.role}</dd>
            </div>
            <div>
              <dt>ساڵ</dt>
              <dd>{project.year}</dd>
            </div>
          </dl>

          <div className="project-story">
            <article>
              <span>کێشەکە</span>
              <h3>{project.challenge}</h3>
            </article>
            <article>
              <span>چارەسەرەکە</span>
              <h3>{project.solution}</h3>
            </article>
          </div>
        </div>

        <div className="project-stack-grid">
          <div>
            <span className="detail-label">خزمەتگوزاری</span>
            <ul className="tag-list">
              {project.services.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </div>
          <div>
            <span className="detail-label">تەکنەلۆژیا</span>
            <ul className="tag-list">
              {project.technologies.map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="project-gallery">
          {project.gallery.map((image) => (
            <div className="image-frame" key={image.src}>
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                quality={90}
                sizes="(max-width: 800px) calc(100vw - 3rem), 1100px"
              />
            </div>
          ))}
        </div>

        <div className="dialog-footer">
          {project.projectUrl ? (
            <a
              className="button button-lime"
              href={project.projectUrl}
              target="_blank"
              rel="noreferrer"
            >
              <span>بینینی پرۆژە</span>
              <ExternalIcon className="button-icon" />
            </a>
          ) : (
            <span className="dialog-note">
              RAHAND M. JAFF
            </span>
          )}
          <button
            className="text-button"
            type="button"
            onClick={requestClose}
          >
            داخستن
          </button>
        </div>
      </div>
    </dialog>
  );
}

export function PortfolioSite() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const menuDialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const shouldLock = menuOpen || Boolean(selectedProject);
    const previousOverflow = document.body.style.overflow;
    if (shouldLock) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen, selectedProject]);

  useEffect(() => {
    if (menuOpen && menuDialogRef.current && !menuDialogRef.current.open) {
      menuDialogRef.current.showModal();
    }
  }, [menuOpen]);

  return (
    <>
      <a className="skip-link" href="#main-content">
        بازدان بۆ ناوەڕۆکی سەرەکی
      </a>

      <header className="site-header">
        <a className="brand" href="#home" aria-label="گەڕانەوە بۆ سەرەتا">
          <span className="brand-mark">{portfolio.owner.monogram}</span>
          <span className="brand-name" dir="ltr">
            {portfolio.owner.latinName}
          </span>
        </a>

        <div className="header-status" aria-label={portfolio.owner.availability}>
          <span className="status-dot" />
          <span>{portfolio.owner.availability}</span>
        </div>

        <button
          type="button"
          className="menu-trigger"
          aria-label="کردنەوەی مێنوو"
          aria-expanded={menuOpen}
          aria-controls="main-menu"
          onClick={() => setMenuOpen(true)}
        >
          <span>مێنوو</span>
          <span className="menu-lines" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </button>
      </header>

      {menuOpen ? (
        <dialog
          ref={menuDialogRef}
          className="menu-overlay"
          id="main-menu"
          aria-label="مێنووی سەرەکی"
          onCancel={(event) => {
            event.preventDefault();
            menuDialogRef.current?.close();
          }}
          onClose={() => setMenuOpen(false)}
        >
          <div className="menu-topbar">
            <span className="brand-mark brand-mark-light">{portfolio.owner.monogram}</span>
            <button
              type="button"
              className="icon-button menu-close"
              aria-label="داخستنی مێنوو"
              onClick={() => menuDialogRef.current?.close()}
              autoFocus
            >
              <CloseIcon />
            </button>
          </div>

          <nav className="overlay-nav" aria-label="مێنووی سەرەکی">
            {portfolio.menu.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => menuDialogRef.current?.close()}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.label}</strong>
                <ArrowIcon />
              </a>
            ))}
          </nav>

          <div className="menu-bottom">
            <span>{portfolio.owner.location}</span>
            <div className="menu-socials">
              {portfolio.socials.slice(0, 4).map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {social.shortLabel}
                </a>
              ))}
            </div>
          </div>
        </dialog>
      ) : null}

      <main id="main-content">
        <section className="hero" id="home">
          <div className="hero-copy">
            <p className="eyebrow animate-in">{portfolio.owner.eyebrow}</p>
            <h1 className="animate-in animate-delay-1">
              <span>بیرۆکە</span>
              <span className="headline-accent">دەگۆڕم</span>
              <span>بۆ بەرهەم.</span>
            </h1>
            <div className="hero-bottom animate-in animate-delay-2">
              <p>{portfolio.owner.introduction}</p>
              <a className="round-link" href="#projects" aria-label="بینینی پرۆژەکان">
                <ArrowIcon />
              </a>
            </div>
          </div>

          <div className="hero-visual animate-in animate-delay-2">
            <div className="hero-image image-frame">
              <Image
                src={portfolio.media.hero}
                alt={portfolio.media.heroAlt}
                width={1000}
                height={1200}
                priority
                sizes="(max-width: 800px) 94vw, 42vw"
              />
            </div>
            <div className="hero-stamp" aria-hidden="true">
              <span>ڕەهەند</span>
              <span>٢٠٢٦</span>
            </div>
            <div className="hero-caption">
              <span>{portfolio.owner.role}</span>
              <span>{portfolio.owner.location}</span>
            </div>
          </div>
        </section>

        <div className="ticker" aria-label="بوارەکانی کار">
          <div className="ticker-track">
            {[...portfolio.ticker, ...portfolio.ticker].map((item, index) => (
              <span key={`${item}-${index}`}>
                {item}
                <i aria-hidden="true">✦</i>
              </span>
            ))}
          </div>
        </div>

        <section className="section section-about" id="about">
          <SectionHeading number="٠١" eyebrow="دەربارە" title={portfolio.about.title} />

          <div className="about-layout">
            <div className="about-image image-frame">
              <Image
                src={portfolio.media.about}
                alt={portfolio.media.aboutAlt}
                width={900}
                height={1100}
                sizes="(max-width: 800px) 94vw, 38vw"
              />
              <span className="image-note">RAHAND M. JAFF</span>
            </div>

            <div className="about-copy">
              {portfolio.about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <a className="text-link" href="#contact">
                <span>با قسە بکەین</span>
                <ArrowIcon />
              </a>
            </div>
          </div>

          <dl className="fact-grid">
            {portfolio.about.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="section section-dark" id="services">
          <SectionHeading
            number="٠٢"
            eyebrow="توانا و خزمەتگوزاری"
            title="لە بیرۆکەوە تا بەرهەمێکی کارا."
          />

          <div className="service-list">
            {portfolio.services.map((service) => (
              <article key={service.number} className="service-item">
                <span>{service.number}</span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <PlusIcon />
              </article>
            ))}
          </div>
        </section>

        <section className="section section-projects" id="projects">
          <SectionHeading
            number="٠٣"
            eyebrow="کارە هەڵبژێردراوەکان"
            title="هەر پرۆژەیەک چیرۆکێکی تەواوی هەیە."
          />

          <div className="project-grid">
            {portfolio.projects.map((project) => (
              <article
                key={project.slug}
                className="project-card project-card-1"
              >
                <button
                  type="button"
                  className="project-card-button"
                  aria-haspopup="dialog"
                  aria-controls={`project-dialog-${project.slug}`}
                  aria-expanded={selectedProject?.slug === project.slug}
                  aria-describedby={`project-summary-${project.slug}`}
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="project-image image-frame">
                    <Image
                      src={project.cover.src}
                      alt={project.cover.alt}
                      width={project.cover.width}
                      height={project.cover.height}
                      quality={90}
                      sizes="(max-width: 800px) calc(100vw - 2.4rem), 92vw"
                    />
                    <span className="project-open" aria-hidden="true">
                      <PlusIcon />
                    </span>
                  </div>
                  <div className="project-card-copy">
                    <div>
                      <span>{project.category}</span>
                      <span>{project.year}</span>
                    </div>
                    <h3>{project.title}</h3>
                    <p id={`project-summary-${project.slug}`}>
                      {project.summary}
                    </p>
                  </div>
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="section section-notes" id="notes">
          <SectionHeading
            number="٠٤"
            eyebrow="تێبینی و بیرۆکە"
            title="ئەو شتانەی لە کاتی کارکردندا فێریان دەبم."
          />

          <div className="notes-grid">
            {portfolio.notes.map((note, index) => (
              <article className="note-card" key={note.title}>
                <div className="note-meta">
                  <span>{note.tag}</span>
                  <time>{note.date}</time>
                </div>
                <span className="note-index">0{index + 1}</span>
                <h3>{note.title}</h3>
                <p>{note.excerpt}</p>
                <span className="note-line" aria-hidden="true" />
              </article>
            ))}
          </div>
        </section>

        <section className="principles" aria-label="بنەماکانی کار">
          <p className="principles-title">بنەمای کارکردنم</p>
          <div className="principles-grid">
            {portfolio.principles.map((principle) => (
              <article key={principle.number}>
                <span>{principle.number}</span>
                <h3>{principle.title}</h3>
                <p>{principle.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section section-contact" id="contact">
          <div className="contact-intro">
            <div>
              <span className="contact-number">٠٥ / پەیوەندی</span>
              <h2>بیرۆکەیەکت هەیە؟ با پێکەوە دروستی بکەین.</h2>
            </div>
            <p>
              بۆ پرۆژە، هاوکاری یان تەنها گفتوگۆیەکی خۆش پەیامێکم بۆ بنێرە.
              پەیامەکەت ڕاستەوخۆ دەگاتە ئیمەیڵەکەم.
            </p>
          </div>

          <div className="contact-layout">
            <div className="contact-details">
              <a className="contact-email" href={`mailto:${portfolio.owner.email}`}>
                <span>ئیمەیڵ</span>
                <strong dir="ltr">{portfolio.owner.email}</strong>
                <ArrowIcon />
              </a>

              <a className="contact-phone" href={portfolio.owner.phoneHref}>
                <span>ژمارەی مۆبایل</span>
                <strong dir="ltr">{portfolio.owner.phoneLabel}</strong>
              </a>

              <div className="social-icon-grid" aria-label="تۆڕە کۆمەڵایەتییەکان">
                {portfolio.socials.map((social) => {
                  const external = social.href.startsWith("http");
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noreferrer" : undefined}
                      aria-label={social.label}
                      title={social.label}
                    >
                      <SocialIcon name={social.icon} />
                    </a>
                  );
                })}
              </div>
            </div>

            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="footer-brand" href="#home" dir="ltr">
          {portfolio.owner.latinName}
        </a>
        <p>© ٢٠٢٦ — هەموو مافەکان پارێزراون.</p>
        <a className="back-to-top" href="#home">
          <span>گەڕانەوە بۆ سەرەوە</span>
          <ArrowIcon />
        </a>
      </footer>

      {selectedProject ? (
        <ProjectDialog
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      ) : null}
    </>
  );
}
