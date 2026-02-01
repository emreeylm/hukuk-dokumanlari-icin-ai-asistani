'use client';

import React, { useState, useEffect } from 'react';
import Wizard from '@/components/Wizard';
import Editor from '@/components/Editor';
import { ArrowLeft, Clock, FileText } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  content: string;
  type: string;
  date: string;
}

export default function Dashboard() {
  const [quota, setQuota] = useState(50);
  const [view, setView] = useState<'dashboard' | 'wizard' | 'editor' | 'all-documents'>('dashboard');
  const [generatedContent, setGeneratedContent] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);

  // Load documents from localStorage on mount
  useEffect(() => {
    const savedDocs = localStorage.getItem('legal_documents');
    if (savedDocs) {
      try {
        setDocuments(JSON.parse(savedDocs));
      } catch (e) {
        console.error("Failed to load documents", e);
      }
    }
  }, []);

  const handleStartWizard = () => {
    if (quota <= 0) {
      alert("Kotanız dolmuştur. Lütfen planınızı yükseltin.");
      return;
    }
    setView('wizard');
  };

  const handleWizardComplete = (data: { content: string; type: string; title: string }) => {
    const newDoc: Document = {
      id: Date.now().toString(),
      title: data.title,
      content: data.content,
      type: data.type,
      date: new Date().toISOString()
    };

    const updatedDocs = [newDoc, ...documents];
    setDocuments(updatedDocs);
    localStorage.setItem('legal_documents', JSON.stringify(updatedDocs));

    setGeneratedContent(data.content);
    setQuota(prev => prev - 1);
    setView('editor');
  };

  const handleReset = () => {
    setView('dashboard');
    setGeneratedContent('');
  };

  const openDocument = (doc: Document) => {
    setGeneratedContent(doc.content);
    setView('editor');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return 'Az önce';
    if (hours < 24) return `${hours} saat önce`;
    if (hours < 48) return 'Dün';
    return date.toLocaleDateString('tr-TR');
  };

  return (
    <div className="dashboard-wrapper" style={{ minHeight: '100vh', padding: '2rem' }}>
      {view === 'dashboard' && (
        <div className="dashboard-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
            <div>
              <h1 className="legal-serif" style={{ fontSize: '3rem', color: 'var(--accent)', letterSpacing: '-1px' }}>LegalDoc AI</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Üst düzey hukuk asistanınız her an yanınızda.</p>
            </div>
            <div className="glass" style={{ padding: '1.2rem 2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-glow)' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Kalan Kullanım: </span>
              <span style={{ fontWeight: '800', color: 'var(--accent)', fontSize: '1.2rem' }}>{quota} / 50</span>
            </div>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem' }}>
            <div className="glass glass-hover" onClick={handleStartWizard} style={{ padding: '3rem', borderRadius: 'var(--radius-lg)', cursor: 'pointer', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
              <div style={{ background: 'var(--accent-glow)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2rem' }}>🖋️</span>
              </div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.8rem' }} className="legal-serif">Yeni Taslak Oluştur</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
                Yapay zeka motorumuzu kullanarak karmaşık dilekçe ve sözleşmeleri saniyeler içinde kurgulayın.
              </p>
              <button className="btn-primary" style={{ width: '100%', fontSize: '1rem' }}>SİHİRBAZI BAŞLAT</button>
            </div>

            <div className="glass" style={{ padding: '3rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem' }} className="legal-serif">Son Belgelerim</h3>
                <span
                  style={{ color: 'var(--accent)', cursor: 'pointer', fontSize: '0.9rem' }}
                  onClick={() => setView('all-documents')}
                >
                  Tümünü Gör
                </span>
              </div>
              <ul style={{ listStyle: 'none', color: 'var(--text-main)' }}>
                {documents.length > 0 ? (
                  documents.slice(0, 3).map((doc) => (
                    <li
                      key={doc.id}
                      onClick={() => openDocument(doc)}
                      className="doc-list-item"
                      style={{
                        padding: '1.2rem 0',
                        borderBottom: '1px solid var(--card-border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '500' }}>{doc.title}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> {formatDate(doc.date)}
                        </div>
                      </div>
                      <span style={{ fontSize: '0.7rem', padding: '4px 8px', background: 'var(--primary-light)', borderRadius: '4px', textTransform: 'uppercase' }}>{doc.type}</span>
                    </li>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>Henüz döküman oluşturulmadı.</p>
                )}
              </ul>
            </div>
          </div>

          <section style={{
            marginTop: '5rem',
            padding: '2.5rem',
            background: 'linear-gradient(90deg, rgba(212, 175, 55, 0.05) 0%, rgba(10, 17, 40, 0.5) 100%)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--accent-glow)',
            display: 'flex',
            alignItems: 'center',
            gap: '2rem'
          }}>
            <div style={{ fontSize: '2.5rem' }}>⚖️</div>
            <div>
              <h4 style={{ color: 'var(--accent)', marginBottom: '0.5rem', fontSize: '1.2rem' }} className="legal-serif">Yasal Sorumluluk Sınırı</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '800px' }}>
                Bu platform tarafından sağlanan içerikler tamamen yapay zeka tarafından türetilmiştir.
                Herhangi bir hukuki tavsiye teşkil etmez. Üretilen dökümanların nihai kullanımı ve hukuki denetimi
                tamamen kullanıcı sorumluluğundadır.
              </p>
            </div>
          </section>
        </div>
      )}

      {view === 'all-documents' && (
        <div className="dashboard-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <header style={{ marginBottom: '3rem' }}>
            <button
              className="btn-secondary"
              onClick={() => setView('dashboard')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem' }}
            >
              <ArrowLeft size={18} /> GERİ DÖN
            </button>
            <h1 className="legal-serif" style={{ fontSize: '2.5rem', color: 'var(--accent)' }}>Tüm Belgelerim</h1>
            <p style={{ color: 'var(--text-muted)' }}>Bugüne kadar oluşturduğunuz tüm hukuki taslaklar.</p>
          </header>

          <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
            <ul style={{ listStyle: 'none' }}>
              {documents.length > 0 ? (
                documents.map((doc, i) => (
                  <li
                    key={doc.id}
                    onClick={() => openDocument(doc)}
                    className="doc-list-item"
                    style={{
                      padding: '1.5rem',
                      borderBottom: i === documents.length - 1 ? 'none' : '1px solid var(--card-border)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      borderRadius: 'var(--radius-sm)',
                      transition: 'background 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <div style={{ background: 'var(--primary-light)', padding: '10px', borderRadius: '8px', color: 'var(--accent)' }}>
                        <FileText size={24} />
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '4px' }}>{doc.title}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={14} /> {formatDate(doc.date)}
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', padding: '6px 12px', background: 'var(--accent-glow)', color: 'var(--accent)', borderRadius: '20px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                      {doc.type}
                    </span>
                  </li>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                  <FileText size={48} color="var(--card-border)" style={{ margin: '0 auto 1rem auto' }} />
                  <p style={{ color: 'var(--text-muted)' }}>Henüz hiçbir belge oluşturmadınız.</p>
                </div>
              )}
            </ul>
          </div>
        </div>
      )}

      {view === 'wizard' && (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <button className="btn-secondary" onClick={handleReset} style={{ marginBottom: '2rem' }}>← İPTAL ET</button>
          <Wizard onComplete={handleWizardComplete} />
        </div>
      )}

      {view === 'editor' && (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <Editor content={generatedContent} onReset={handleReset} />
        </div>
      )}

      <style jsx>{`
        .dashboard-wrapper {
          background: radial-gradient(circle at top right, var(--primary-light) 0%, var(--bg-dark) 50%);
          animation: pageEnter 1s ease-out;
        }
        .doc-list-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        @keyframes pageEnter {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
