const fs = require("fs");
const path = require("path");

const svasthaLegalDir = "/Users/ying/Dev/svastha/docs/legal";
const outputLegalDir = path.join(__dirname, "..", "legal");

// Ensure output directory exists
if (!fs.existsSync(outputLegalDir)) {
  fs.mkdirSync(outputLegalDir, { recursive: true });
}

function parseMarkdownToHtml(md) {
  let html = md;

  // Replace headers
  html = html.replace(/^# (.*?)$/gm, '<h1 class="serif">$1</h1>');
  html = html.replace(/^## (.*?)$/gm, '<h2 class="serif">$1</h2>');
  html = html.replace(/^### (.*?)$/gm, '<h3 class="serif">$1</h3>');

  // Replace horizontal rules
  html = html.replace(/^---$/gm, '<hr />');

  // Replace bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Replace lists
  // Simple bullet lists
  html = html.replace(/^\s*-\s+(.*?)$/gm, '<li>$1</li>');
  // Group consecutive <li> items into <ul>
  html = html.replace(/(<li>.*?<\/li>)+/gs, (match) => {
    return `<ul>\n${match}</ul>`;
  });

  // Replace tables
  html = html.replace(/^\|(.*?)\|$/gm, (match, rowContent) => {
    const cells = rowContent.split('|').map(c => c.trim());
    const tag = match.includes('---') ? 'th' : 'td';
    // If it's a separator line, skip it
    if (cells.every(c => /^:-*:$/.test(c) || /^-+$/.test(c))) {
      return '';
    }
    return `<tr>${cells.map(c => `<${tag}>${c}</${tag}>`).join('')}</tr>`;
  });
  // Group consecutive <tr> items into <table>
  html = html.replace(/(<tr>.*?<\/tr>\n*)+/gs, (match) => {
    // If there are th's, wrap first row in thead, rest in tbody
    return `<div class="table-container"><table>\n${match}</table></div>`;
  });
  // Clean up any empty <table> or table elements that got doubled
  html = html.replace(/<\/table>\n*<div class="table-container"><table>/g, '');

  // Wrap paragraphs (avoid wrapping tags)
  const lines = html.split('\n');
  const parsedLines = lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('<h') || 
        trimmed.startsWith('<ul') || 
        trimmed.startsWith('</ul') || 
        trimmed.startsWith('<li') || 
        trimmed.startsWith('</li') || 
        trimmed.startsWith('<table') || 
        trimmed.startsWith('</table') || 
        trimmed.startsWith('<tr') || 
        trimmed.startsWith('</tr') || 
        trimmed.startsWith('<div') || 
        trimmed.startsWith('</div') || 
        trimmed.startsWith('<hr')) {
      return line;
    }
    return `<p>${line}</p>`;
  });

  return parsedLines.join('\n');
}

const template = (title, contentHtml) => `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Svastha — ${title}</title>
  <meta name="description" content="Svastha is your companion for exploring Hindu scriptures, deepening spiritual practice, and cultivating a lifestyle of total wellness." />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap"
    rel="stylesheet" />

  <style>
    /* ── Design Tokens ─────────────────────────────────────────── */
    :root {
      --gold: #B8860B;
      --gold-light: #D4A843;
      --gold-dark: #8B6914;
      --gold-pale: #F5ECD0;
      --cream: #FDFBF7;
      --cream-dark: #F0E9DC;
      --surface: #FFFFFF;
      --text: #2C2C2C;
      --text-sec: #6B6B6B;
      --text-tert: #9E9E9E;
      --border: #E8E2D6;
      --accent: #C4956A;

      --radius-sm: 8px;
      --radius-md: 12px;
      --radius-lg: 20px;
      --radius-xl: 32px;
      --radius-full: 9999px;

      --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
      --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.05);
      --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.10), 0 4px 12px rgba(0, 0, 0, 0.06);
      --shadow-gold: 0 4px 24px rgba(184, 134, 11, 0.25);

      --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* ── Reset & Base ──────────────────────────────────────────── */
    *,
    *::before,
    *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html {
      scroll-behavior: smooth;
    }

    body {
      font-family: 'Inter', system-ui, sans-serif;
      background: var(--cream);
      color: var(--text);
      line-height: 1.7;
      overflow-x: hidden;
    }

    img {
      max-width: 100%;
      display: block;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    .container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .gold {
      color: var(--gold);
    }

    .serif {
      font-family: 'EB Garamond', Georgia, serif;
    }

    /* ── Nav ───────────────────────────────────────────────────── */
    nav {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(253, 251, 247, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border);
    }

    .nav-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 24px;
      max-width: 1100px;
      margin: 0 auto;
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: 'EB Garamond', serif;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text);
    }

    .nav-om {
      width: 36px;
      height: 36px;
      object-fit: contain;
    }

    .nav-links {
      display: flex;
      gap: 8px;
      align-items: center;
      list-style: none;
    }

    .nav-links a {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-sec);
      padding: 6px 14px;
      border-radius: var(--radius-full);
      transition: color var(--transition), background var(--transition);
    }

    .nav-links a:hover {
      color: var(--gold);
      background: var(--gold-pale);
    }

    .nav-cta {
      background: var(--gold) !important;
      color: #fff !important;
      padding: 8px 20px !important;
      border-radius: var(--radius-full) !important;
      font-weight: 600 !important;
      transition: background var(--transition), box-shadow var(--transition) !important;
    }

    .nav-cta:hover {
      background: var(--gold-dark) !important;
      box-shadow: var(--shadow-gold) !important;
    }

    /* ── Content Layout ────────────────────────────────────────── */
    .legal-content {
      max-width: 800px;
      margin: 60px auto;
      background: var(--surface);
      padding: 48px;
      border-radius: var(--radius-lg);
      border: 1px solid var(--border);
      box-shadow: var(--shadow-sm);
    }

    .legal-content h1 {
      font-size: 2.7rem;
      font-weight: 600;
      color: var(--text);
      margin-bottom: 24px;
      line-height: 1.15;
    }

    .legal-content h2 {
      font-size: 1.8rem;
      font-weight: 600;
      color: var(--text);
      margin-top: 40px;
      margin-bottom: 16px;
      border-bottom: 1px solid var(--border);
      padding-bottom: 8px;
    }

    .legal-content h3 {
      font-size: 1.3rem;
      font-weight: 600;
      color: var(--text);
      margin-top: 24px;
      margin-bottom: 12px;
    }

    .legal-content p {
      margin-bottom: 16px;
      color: var(--text-sec);
    }

    .legal-content strong {
      color: var(--text);
    }

    .legal-content hr {
      border: 0;
      height: 1px;
      background: var(--border);
      margin: 32px 0;
    }

    .legal-content ul {
      margin-bottom: 24px;
      padding-left: 20px;
      color: var(--text-sec);
    }

    .legal-content li {
      margin-bottom: 8px;
    }

    /* Table styles */
    .table-container {
      overflow-x: auto;
      margin: 24px 0;
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.9rem;
    }

    th, td {
      padding: 14px 18px;
      border-bottom: 1px solid var(--border);
    }

    th {
      background: var(--cream);
      font-weight: 600;
      color: var(--text);
    }

    tr:last-child td {
      border-bottom: none;
    }

    /* ── Footer ────────────────────────────────────────────────── */
    footer {
      background: #1C1810;
      color: rgba(255, 255, 255, 0.6);
      padding: 48px 24px 32px;
    }

    .footer-inner {
      max-width: 1100px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 40px;
      flex-wrap: wrap;
    }

    .footer-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: 'EB Garamond', serif;
      font-size: 1.3rem;
      color: rgba(255, 255, 255, 0.9);
      font-weight: 600;
    }

    .footer-brand img {
      width: 32px;
      opacity: 0.9;
    }

    .footer-tagline {
      margin-top: 8px;
      font-size: 0.82rem;
      color: rgba(255, 255, 255, 0.4);
      max-width: 240px;
    }

    .footer-links h5 {
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.5);
      margin-bottom: 14px;
    }

    .footer-links ul {
      list-style: none;
    }

    .footer-links li {
      margin-bottom: 10px;
    }

    .footer-links a {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.6);
      transition: color var(--transition);
    }

    .footer-links a:hover {
      color: var(--gold-light);
    }

    .footer-bottom {
      max-width: 1100px;
      margin: 36px auto 0;
      padding-top: 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.35);
    }

    .footer-bottom a {
      color: rgba(255, 255, 255, 0.5);
      transition: color var(--transition);
    }

    .footer-bottom a:hover {
      color: var(--gold-light);
    }

    /* ── Twitter / X icon ──────────────────────────────────────── */
    .social-x {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.875rem;
      transition: color var(--transition);
    }

    .social-x:hover {
      color: var(--gold-light);
    }

    .social-x svg {
      width: 16px;
      height: 16px;
      fill: currentColor;
    }

    /* ── Responsive ────────────────────────────────────────────── */
    @media (max-width: 768px) {
      .nav-links {
        display: none;
      }
      .legal-content {
        padding: 24px;
        margin: 30px 16px;
      }
      .footer-inner {
        flex-direction: column;
        gap: 32px;
      }
    }
  </style>
</head>

<body>

  <!-- ── Navigation ───────────────────────────────────────────── -->
  <nav aria-label="Main navigation">
    <div class="nav-inner">
      <a class="nav-brand" href="../index.html" aria-label="Svastha home">
        <img class="nav-om" src="../om-symbol.svg" alt="" aria-hidden="true" />
        Svastha
      </a>
      <ul class="nav-links">
        <li><a href="../index.html#features">Features</a></li>
        <li><a href="../index.html#scriptures">Library</a></li>
        <li><a href="../index.html#about">About</a></li>
        <li>
          <a href="../index.html#download" class="nav-cta" id="nav-download-btn">Download</a>
        </li>
      </ul>
    </div>
  </nav>

  <!-- ── Main Content ─────────────────────────────────────────── -->
  <main class="container">
    <article class="legal-content">
      ${contentHtml}
    </article>
  </main>

  <!-- ── Footer ─────────────────────────────────────────────────── -->
  <footer>
    <div class="footer-inner">
      <div>
        <div class="footer-brand">
          <img src="../om-symbol.svg" alt="" aria-hidden="true" />
          Svastha
        </div>
        <p class="footer-tagline">Ancient wisdom for modern life. A companion for your spiritual journey.</p>
      </div>

      <div class="footer-links">
        <h5>App</h5>
        <ul>
          <li><a href="../index.html#features">Features</a></li>
          <li><a href="../index.html#scriptures">Scripture Library</a></li>
          <li><a href="../index.html#download">Download</a></li>
          <li><a href="https://svastha.expo.app" target="_blank" rel="noopener">Web App</a></li>
        </ul>
      </div>

      <div class="footer-links">
        <h5>Company</h5>
        <ul>
          <li><a href="../index.html#about">About</a></li>
          <li><a href="https://raoventures.net" target="_blank" rel="noopener">Rao Ventures LLC</a></li>
          <li><a href="mailto:contact@raoventures.net">Contact</a></li>
        </ul>
      </div>

      <div class="footer-links">
        <h5>Legal</h5>
        <ul>
          <li><a href="privacy-policy.html">Privacy Policy</a></li>
          <li><a href="terms-of-service.html">Terms of Service</a></li>
          <li><a href="eula.html">EULA</a></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <span>© 2026 Rao Ventures LLC. All rights reserved.</span>
      <a href="https://x.com/rao_ventures" target="_blank" rel="noopener" class="social-x"
        aria-label="Follow on X / Twitter">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.258 5.632 5.906-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        @rao_ventures
      </a>
    </div>
  </footer>

</body>

</html>
`;

// Read MD files
const privacyPolicyMd = fs.readFileSync(path.join(svasthaLegalDir, "privacy-policy.md"), "utf8");
const termsOfServiceMd = fs.readFileSync(path.join(svasthaLegalDir, "terms-of-service.md"), "utf8");
const eulaMd = fs.readFileSync(path.join(svasthaLegalDir, "eula.md"), "utf8");

// Parse and write Privacy Policy
const privacyHtmlContent = parseMarkdownToHtml(privacyPolicyMd);
const privacyHtml = template("Privacy Policy", privacyHtmlContent);
fs.writeFileSync(path.join(outputLegalDir, "privacy-policy.html"), privacyHtml, "utf8");
console.log("Generated legal/privacy-policy.html");

// Parse and write Terms of Service
const termsHtmlContent = parseMarkdownToHtml(termsOfServiceMd);
const termsHtml = template("Terms of Service", termsHtmlContent);
fs.writeFileSync(path.join(outputLegalDir, "terms-of-service.html"), termsHtml, "utf8");
console.log("Generated legal/terms-of-service.html");

// Parse and write EULA
const eulaHtmlContent = parseMarkdownToHtml(eulaMd);
const eulaHtml = template("EULA", eulaHtmlContent);
fs.writeFileSync(path.join(outputLegalDir, "eula.html"), eulaHtml, "utf8");
console.log("Generated legal/eula.html");
