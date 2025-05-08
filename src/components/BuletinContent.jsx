// src/components/BuletinContent.jsx
import React from 'react';

function BuletinContent({ buletin }) {
    if (!buletin) return null;

    return (
        <div className="p-4">
            {/* Nama Buletin */}
            {buletin.buletinName && (
                <p className="text-sm text-blue-500 uppercase tracking-wide mb-1">
                    {buletin.buletinName}
                </p>
            )}

            {/* Judul Artikel */}
            {buletin.title && (
                <h1 className="text-4xl font-bold mb-2">{buletin.title}</h1>
            )}

            {/* Deskripsi */}
            {buletin.content && (
                <div
                    className="prose prose-sm sm:prose lg:prose-lg mt-4"
                    dangerouslySetInnerHTML={{ __html: buletin.content }}
                />
            )}

        </div>
    );
}

export default BuletinContent;
