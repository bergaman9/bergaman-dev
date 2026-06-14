// Shared branded email shell so every transactional email (contact
// notification, reply-to-visitor, etc.) carries the same on-theme
// "Dragon's Domain" chrome. Pass the inner body HTML; the shell wraps it
// with the gold header and dark footer. Keep all styling inline — email
// clients ignore <style> blocks.

const CURRENT_YEAR = () => new Date().getFullYear();

export function brandedEmailShell({
  preheaderText = '',
  headerTitle = 'Bergaman',
  headerSubtitle = "The Dragon's Domain",
  bodyHtml = '',
  footerNote = 'Electrical &amp; Electronics Engineer · Full Stack Developer',
} = {}) {
  return `
  <div style="background:#060d09;padding:24px 12px;">
    ${preheaderText ? `<span style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheaderText}</span>` : ''}
    <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:600px;margin:0 auto;background:linear-gradient(135deg,#0e1b12 0%,#1a2e1a 100%);color:#d1d5db;border-radius:14px;overflow:hidden;box-shadow:0 12px 34px rgba(0,0,0,0.35);border:1px solid rgba(62,80,62,0.4);">

      <!-- Header -->
      <div style="background:linear-gradient(135deg,#e8c547 0%,#d4b445 100%);padding:28px 40px;text-align:center;">
        <div style="font-size:30px;line-height:1;margin-bottom:6px;">🐉</div>
        <h1 style="margin:0;color:#0e1b12;font-size:26px;font-weight:800;letter-spacing:0.2px;">${headerTitle}</h1>
        <p style="margin:4px 0 0 0;color:#0e1b12;font-size:13px;opacity:0.8;">${headerSubtitle}</p>
      </div>

      <!-- Body -->
      <div style="padding:36px 40px;">
        ${bodyHtml}
      </div>

      <!-- Footer -->
      <div style="background:rgba(8,16,11,0.85);padding:22px 40px;text-align:center;border-top:1px solid rgba(62,80,62,0.3);">
        <p style="margin:0;font-size:12px;color:#9ca3af;">
          From <a href="https://bergaman.dev" style="color:#e8c547;text-decoration:none;font-weight:600;">bergaman.dev</a> · © ${CURRENT_YEAR()} Bergaman
        </p>
        <p style="margin:6px 0 0 0;font-size:11px;color:#6b7280;">${footerNote}</p>
      </div>
    </div>
  </div>`;
}

// Small helpers for consistent on-theme inner blocks.
export function emailButton(href, label) {
  return `<a href="${href}" style="display:inline-block;background:linear-gradient(135deg,#e8c547 0%,#d4b445 100%);color:#0e1b12;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:700;font-size:15px;">${label}</a>`;
}

export function emailPanel(innerHtml, { accent = true } = {}) {
  const border = accent ? 'border-left:4px solid #e8c547;' : 'border:1px solid rgba(62,80,62,0.3);';
  return `<div style="background:rgba(14,27,18,0.5);${border}padding:20px 22px;border-radius:8px;line-height:1.7;font-size:15px;color:#d1d5db;">${innerHtml}</div>`;
}
