// src/components/BuletinContent.jsx
import React from 'react';

function BuletinContent({ buletin }) {
    if (!buletin) return null;

    return (
        <div className="prose prose-sm sm:prose lg:prose-lg mx-auto">
            {/* Judul Artikel */}
            {buletin.title && (
                <h1 className="text-3xl font-bold mb-2">{buletin.title}</h1>
            )}

            {/* Subtitle */}
            {buletin.subtitle && (
                <p className="text-lg text-gray-600 mb-4">{buletin.subtitle}</p>
            )}

            {/* Konten HTML (bisa mengandung gambar, dsb) */}
            {buletin.content && (
                <div
                    className="mt-4"
                    dangerouslySetInnerHTML={{ __html: buletin.content }}
                />
            )}
        </div>
    );
}

export default BuletinContent;
