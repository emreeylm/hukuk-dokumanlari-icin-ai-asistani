'use client';

import React, { useState } from 'react';
import { FileText, ArrowRight, Save, Download, AlertCircle, Loader2 } from 'lucide-react';

export default function Wizard({ onComplete }: { onComplete: (data: { content: string; type: string; title: string }) => void }) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        docType: 'Dava Dilekçesi',
        parties: '',
        subject: '',
        facts: ''
    });

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (data.content) {
                onComplete({
                    content: data.content,
                    type: formData.docType,
                    title: formData.subject || `${formData.docType} - ${new Date().toLocaleDateString('tr-TR')}`
                });
            } else {
                alert("Üretim hatası: " + data.error);
            }
        } catch (err) {
            alert("Bir bağlantı hatası oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="wizard-modal glass" style={{
            maxWidth: '600px',
            margin: '2rem auto',
            padding: '2.5rem',
            borderRadius: 'var(--radius-lg)',
            animation: 'slideUp 0.5s ease'
        }}>
            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <Loader2 className="loading" size={48} color="var(--accent)" style={{ margin: '0 auto 1.5rem auto' }} />
                    <h2 className="legal-serif">AI Taslağı Hazırlıyor...</h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Hukuki dayanaklar analiz ediliyor ve döküman yapılandırılıyor.</p>
                </div>
            ) : (
                <>
                    <div style={{ marginBottom: '2rem' }}>
                        <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>Adım {step} / 2</span>
                        <div style={{ height: '4px', background: 'var(--card-border)', marginTop: '8px', borderRadius: '2px' }}>
                            <div style={{ height: '100%', background: 'var(--accent)', width: `${(step / 2) * 100}%`, transition: 'width 0.3s' }}></div>
                        </div>
                    </div>

                    {step === 1 && (
                        <div className="step-content">
                            <h2 className="legal-serif" style={{ marginBottom: '1.5rem' }}>Döküman Türünü Seçin</h2>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {['Dava Dilekçesi', 'Sözleşme', 'İhtarname'].map(type => (
                                    <div
                                        key={type}
                                        onClick={() => setFormData({ ...formData, docType: type })}
                                        style={{
                                            padding: '1rem',
                                            borderRadius: 'var(--radius-md)',
                                            border: `1px solid ${formData.docType === type ? 'var(--accent)' : 'var(--card-border)'}`,
                                            background: formData.docType === type ? 'var(--accent-glow)' : 'transparent',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem'
                                        }}
                                    >
                                        <FileText size={20} color={formData.docType === type ? 'var(--accent)' : 'var(--text-muted)'} />
                                        <span>{type}</span>
                                    </div>
                                ))}
                            </div>
                            <button
                                className="btn-primary"
                                style={{ width: '100%', marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                onClick={nextStep}
                            >
                                İLERLE <ArrowRight size={18} />
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="step-content">
                            <h2 className="legal-serif" style={{ marginBottom: '1.5rem' }}>İçerik Bilgileri</h2>
                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Taraflar (Davacı, Davalı vs.)</label>
                                    <input
                                        placeholder="Örn: Ahmet Yılmaz - Mehmet Demir"
                                        value={formData.parties}
                                        onChange={e => setFormData({ ...formData, parties: e.target.value })}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Konu / Talep</label>
                                    <input
                                        placeholder="Örn: Kira Alacağı ve Tahliye Talebi"
                                        value={formData.subject}
                                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Olay Özeti / Detaylar</label>
                                    <textarea
                                        rows={4}
                                        placeholder="Dökümana yön verecek temel olayları buraya yazın..."
                                        value={formData.facts}
                                        onChange={e => setFormData({ ...formData, facts: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button className="btn-secondary" style={{ flex: 1 }} onClick={prevStep}>GERİ</button>
                                <button className="btn-primary" style={{ flex: 2 }} onClick={handleGenerate}>TASLAK ÜRET</button>
                            </div>
                        </div>
                    )}
                </>
            )}

            <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
