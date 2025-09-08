'use client';

import { useMemo, useState } from 'react';
import Header from '../header';

function cleanLine(s: string) {
  // trim, collapse spaces, keep dots in names, lowercase
  return s.trim().replace(/\s+/g, '').toLowerCase();
}

function parseLines(s: string) {
  return s
    .split('\n')
    .map(x => x.trim())
    .filter(Boolean);
}

export default function Page() {
  const [namesInput, setNamesInput] = useState(`Abigail.foster
Harper.collins
Ella.hayes
Scarlett.james`);
  const [domainsInput, setDomainsInput] = useState(`accessboostyourbenefits.org
accesspurelycovered.org
accesstotalbenefitsnow.org`);

  const emails = useMemo(() => {
    const rawNames = parseLines(namesInput);
    const rawDomains = parseLines(domainsInput);

    const names = rawNames.map(cleanLine);
    const domains = rawDomains.map(d => cleanLine(d).replace(/^@/, ''));

    const out: string[] = [];
    for (const domain of domains) {
      for (const name of names) {
        // basic guard: ensure looks like "x.y" or "word"
        const local = name.replace(/[^a-z0-9._-]/g, '');
        if (!local || !domain) continue;
        out.push(`${local}@${domain}`);
      }
    }
    return out;
  }, [namesInput, domainsInput]);

  const copyAll = async () => {
    await navigator.clipboard.writeText(emails.join('\n'));
    alert('Emails copied to clipboard.');
  };

  const downloadCSV = () => {
    const rows = emails.map(e => [e]);
    const csv = ['email', ...rows.map(r => r.join(',')).join('\n')].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emails.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main style={{ maxWidth: 1000, margin: '40px auto', padding: 16, fontFamily: 'system-ui, sans-serif' }}>
        <Header />
      <h1 className='pt-[20px]' style={{ fontSize: 26, fontWeight: 600, marginBottom: 8 }}>Bulk Email Generator</h1>
      <p style={{ color: '#555', marginBottom: 24 }}>
        Paste names (one per line) and domains (one per line). We’ll generate <i>name@domain</i> for all combinations.
      </p>

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
        <div>
          <label style={{ fontSize: 14, fontWeight: 600 }}>Names (one per line)</label>
          <textarea
            value={namesInput}
            onChange={(e) => setNamesInput(e.target.value)}
            placeholder={`Abigail.foster\nHarper.collins\nElla.hayes\nScarlett.james`}
            rows={14}
            className='bg-black'
            style={{
              width: '100%', marginTop: 8, padding: 12, borderRadius: 8, border: '1px solid #ddd',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace'
            }}
          />
          <small style={{ color: '#666' }}>
            Tip: Use <b>First.last</b> (e.g., <code>Harper.collins</code>). We’ll lowercase and remove spaces automatically.
          </small>
        </div>

        <div>
          <label style={{ fontSize: 14, fontWeight: 600 }}>Domains (one per line)</label>
          <textarea
            value={domainsInput}
            onChange={(e) => setDomainsInput(e.target.value)}
            placeholder={`accessboostyourbenefits.org\naccesspurelycovered.org\naccesstotalbenefitsnow.org`}
            rows={14}
            className='bg-black'
            style={{
              width: '100%', marginTop: 8, padding: 12, borderRadius: 8, border: '1px solid #ddd',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace'
            }}
          />
          <small style={{ color: '#666' }}>
            Don’t include <code>http://</code> or <code>@</code> — just the domain (e.g., <code>example.org</code>).
          </small>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 20 }}>
        <button
          onClick={copyAll}
          className='bg-gray-600 text-white px-4 py-2 rounded-full'
        >
          Copy All
        </button>
        <button
          onClick={downloadCSV}
          className='bg-gray-600 text-white px-4 py-2 rounded-full'
        >
          Download CSV
        </button>
        <div style={{ color: '#555' }}>
          Generated: <b>{emails.length}</b> emails
        </div>
      </div>

      <div style={{
        marginTop: 20, padding: 12, border: '1px solid #eee', borderRadius: 8,
        maxHeight: 300, overflow: 'auto', background: '#000'
      }}>
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
{emails.join('\n')}
        </pre>
      </div>
    </main>
  );
}
