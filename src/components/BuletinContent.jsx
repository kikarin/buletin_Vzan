import React from "react";

function BuletinContent({ buletin }) {
  if (!buletin) return null;

  return (
    <div className="animate-fade-in max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <article className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Featured Image */}
        {buletin.image && (
          <div className="h-64 md:h-80 lg:h-96 w-full overflow-hidden">
            <img
              src={buletin.image}
              alt={buletin.title || "Featured"}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6 md:p-8 lg:p-10 text-left">
          {/* Title and Metadata */}
          <header className="mb-8">
            {buletin.category && (
              <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full mb-2 mx-auto">
                {buletin.category}
              </span>
            )}

            {buletin.title && (
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4 text-left">
                {buletin.title}
              </h1>
            )}

            {buletin.subtitle && (
              <p className="text-2xl text-gray-600 mb-1 text-left">
                {buletin.subtitle}
              </p>
            )}

            <div className="flex items-center justify-center text-gray-500 text-sm">
              {buletin.author && (
                <div className="flex items-center mr-6">
                  <div className="w-8 h-8 rounded-full bg-gray-300 mr-2 overflow-hidden">
                    {buletin.authorAvatar && (
                      <img
                        src={buletin.authorAvatar}
                        alt={buletin.author}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <span>{buletin.author}</span>
                </div>
              )}

              {buletin.date && (
                <span className="mr-6">
                  {new Date(buletin.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}

              {buletin.readingTime && (
                <span>{buletin.readingTime} min read</span>
              )}
            </div>
          </header>

          {/* Content */}
          {buletin.content && (
            <div className="text-xl prose prose-base md:prose-lg lg:prose-xl prose-gray max-w-none mx-auto text-left">
              <div
                className="buletin-content"
                dangerouslySetInnerHTML={{ __html: buletin.content }}
              />
            </div>
          )}

          {/* Tags */}
          {buletin.tags && buletin.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-gray-100">
              <div className="flex flex-wrap gap-2 justify-center">
                {buletin.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Author Bio (optional) */}
      {buletin.authorBio && (
        <div className="mt-12 bg-gray-50 rounded-xl p-6 md:p-8 text-center">
          <div className="flex flex-col items-center">
            {buletin.authorAvatar && (
              <div className="flex-shrink-0 mb-4">
                <img
                  src={buletin.authorAvatar}
                  alt={buletin.author}
                  className="w-16 h-16 rounded-full mx-auto"
                />
              </div>
            )}
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                About {buletin.author}
              </h3>
              <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
                {buletin.authorBio}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tambahkan CSS untuk styling konten */}
      <style jsx>{`
        .buletin-content {
          line-height: 1.8;
          text-align: left;
        }
        .buletin-content h1 {
          font-size: 2.25rem;
          font-weight: 700;
        }
        .buletin-content h2 {
          font-size: 1.875rem;
          font-weight: 600;
        }
        .buletin-content h3 {
          font-weight: 600;
          font-size: 1.7rem;
        }
        .buletin-content p {
          margin-bottom: 1em;
        }
        .buletin-content ul,
        .buletin-content ol {
          list-style-type: disc;
          margin: 1em 0;
          padding-left: 1.8em;
        }
        .buletin-content li {
          margin: 0.5em 0;
        }
        .buletin-content blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1em;
          margin: 1em 0;
          font-style: italic;
          color: #4b5563;
        }
        .buletin-content img {
          max-width: 100%;
          height: auto;
          margin: 1em 0;
          border-radius: 0.5rem;
        }
        .buletin-content a {
          color: #2563eb;
          text-decoration: underline;
        }
        .buletin-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1em 0;
        }
        .buletin-content th,
        .buletin-content td {
          border: 1px solid #e5e7eb;
          padding: 0.5em;
        }
        .buletin-content th {
          background-color: #f9fafb;
        }
      `}</style>
    </div>
  );
}

export default BuletinContent;
