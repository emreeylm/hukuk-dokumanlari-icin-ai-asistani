'use client';

import React from 'react';
import { Download, FileText, X, Printer } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';

export default function Editor({ content, onReset }: { content: string, onReset: () => void }) {
    const [editableContent, setEditableContent] = React.useState(content);

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = async (type: 'pdf' | 'word') => {
        // ... (omitted for brevity in replacement chunk, but it's identical to original lines 12-98)
        if (type === 'pdf') {
            const doc = new jsPDF();
            // Simple line splitting to fit page
            const splitText = doc.splitTextToSize(editableContent, 180);

            let y = 20;
            // Add title
            doc.setFontSize(16);
            doc.text("HUKUKİ TASLAK BELGE", 105, 20, { align: 'center' });

            doc.setFontSize(12);
            y += 20;

            // Add content
            // Note: jsPDF default fonts might struggle with some Turkish characters unless a custom font is added.
            // For MVP we use the standard font.
            for (let i = 0; i < splitText.length; i++) {
                if (y > 280) {
                    doc.addPage();
                    y = 20;
                }
                doc.text(splitText[i], 15, y);
                y += 7;
            }

            // Add Footer Check
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text("YASAL UYARI: Bu belge yapay zeka ile üretilmiştir. Hukuki tavsiye değildir.", 105, 290, { align: 'center' });

            doc.save('hukuk-belgesi.pdf');
        }
        else if (type === 'word') {
            const paragraphs = editableContent.split('\n').map(line =>
                new Paragraph({
                    children: [new TextRun({ text: line, font: "Calibri", size: 24 })], // size is in half-points
                    spacing: { after: 120 }
                })
            );

            const doc = new Document({
                sections: [{
                    properties: {},
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: "HUKUKİ TASLAK BELGE",
                                    bold: true,
                                    size: 32,
                                    font: "Calibri"
                                })
                            ],
                            alignment: "center",
                            spacing: { after: 400 }
                        }),
                        ...paragraphs,
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: "YASAL UYARI: Bu belge yapay zeka ile üretilmiştir. Hukuki tavsiye değildir.",
                                    italics: true,
                                    size: 16,
                                    color: "808080"
                                })
                            ],
                            spacing: { before: 800 },
                            alignment: "center"
                        })
                    ],
                }],
            });

            const blob = await Packer.toBlob(doc);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'hukuk-belgesi.docx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    return (
        <div className="editor-view" style={{ animation: 'fadeIn 0.5s ease' }}>
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <button className="btn-secondary" onClick={onReset} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <X size={18} /> KAPAT
                </button>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        className="btn-secondary"
                        onClick={() => handleDownload('word')}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <FileText size={18} /> WORD
                    </button>
                    <button
                        className="btn-secondary"
                        onClick={handlePrint}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Printer size={18} /> YAZDIR
                    </button>
                    <button
                        className="btn-primary"
                        onClick={() => handleDownload('pdf')}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Download size={18} /> İNDİR
                    </button>
                </div>
            </div>

            <div className="glass print-container" style={{
                background: 'white',
                padding: '0',
                borderRadius: 'var(--radius-md)',
                minHeight: '70vh',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                overflow: 'hidden'
            }}>
                <textarea
                    value={editableContent}
                    onChange={(e) => setEditableContent(e.target.value)}
                    style={{
                        width: '100%',
                        height: '70vh',
                        border: 'none',
                        resize: 'none',
                        padding: '3rem',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '1.1rem',
                        lineHeight: '1.6',
                        color: '#333',
                        outline: 'none'
                    }}
                />
            </div>

            <div className="no-print" style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(235, 87, 87, 0.1)', border: '1px solid var(--error)', borderRadius: 'var(--radius-sm)', color: 'var(--error)', fontSize: '0.8rem' }}>
                <strong>YASAL UYARI:</strong> Bu belge yapay zeka tarafından oluşturulmuş bir TASLAKTIR. Hiçbir şekilde hukuki danışmanlık yerine geçmez. Kullanmadan önce bir avukat tarafından incelenmelidir.
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @media print {
            .no-print {
                display: none !important;
            }
            .print-container {
                border: none !important;
                box-shadow: none !important;
                background: white !important;
                min-height: auto !important;
            }
            textarea {
                padding: 0 !important;
                height: auto !important;
                color: black !important;
            }
            :global(body) {
                background: white !important;
            }
            :global(.dashboard-wrapper) {
                background: white !important;
                padding: 0 !important;
            }
            :global(.legal-footer) {
                display: none !important;
            }
        }
      `}</style>
        </div>
    );
}
