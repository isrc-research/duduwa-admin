"use client";

import React, { useEffect, useState } from "react";
import idCardSvg from "@/lib/assets/duduwa-id-card.svg";
import { api } from "@/trpc/react";
import { enumeratorWardWiseSchema } from "@/server/api/routers/enumwise/enumwise.schema";

interface Enumerator {
  id: string;
  name: string;
  userName: string;
  avatar: string | null;
  nepaliName: string | null;
  nepaliAddress: string | null;
  nepaliPhone: string | null;
}

interface IdCardGridProps {
  enumerators: Enumerator[];
}

const getBase64FromUrl = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export function IdCardGrid({ enumerators }: IdCardGridProps) {
  const [cardData, setCardData] = useState<
    Array<{ id: string; svgContent: string | null }>
  >([]);
  const [loading, setLoading] = useState(true);

  // Process each enumerator to generate their ID card
  // Get all avatar URLs at once
  const [enumeratorsWithAvatars, setEnumeratorsWithAvatars] =
    useState(enumerators);

  const avatarQueries = enumerators.map((enumerator) =>
    api.enumerator.getAvatarUrl.useQuery(enumerator.id, {
      enabled: true,
      staleTime: Infinity,
      onSuccess: (data) => {
        setEnumeratorsWithAvatars((prev) =>
          prev.map((e) =>
            e.id === enumerator.id ? { ...e, avatarUrl: data } : e,
          ),
        );
      },
    }),
  );

  useEffect(() => {
    const generateCards = async () => {
      setLoading(true);

      // Load SVG template once to reuse
      const response = await fetch(idCardSvg.src);
      if (!response.ok) {
        console.error("Failed to load SVG template");
        setLoading(false);
        return;
      }

      const templateSvg = await response.text();

      // Process each enumerator
      const generatedCards = await Promise.all(
        enumeratorsWithAvatars.map(async (enumerator, index) => {
          try {
            // console.log(enumerator);

            const avatarUrl = avatarQueries[index]?.data;

            // console.log(avatarUrl);

            // Make a copy of the template for this enumerator
            let svgContent = templateSvg;

            // Replace placeholders with actual data
            svgContent = svgContent.replace(
              /@नाम/g,
              enumerator.nepaliName || "",
            );
            svgContent = svgContent.replace(
              /@ठेगाना/g,
              enumerator.nepaliAddress || "",
            );
            svgContent = svgContent.replace(
              /@सम्पर्क नं\./g,
              enumerator.nepaliPhone || "",
            );

            // Replace photo layer with avatar image if available
            if (avatarUrl) {
              try {
                // Convert to base64 to ensure proper embedding in SVG
                const base64Image = await getBase64FromUrl(avatarUrl);
                const photoLayerRegex = /<rect[^>]*id="photo-layer"[^>]*\/>/;
                const imageElement = `<image id="photo-layer" x="114" y="179" width="135" height="155" href="${base64Image}" preserveAspectRatio="xMidYMid slice"/>`;
                svgContent = svgContent.replace(photoLayerRegex, imageElement);
              } catch (avatarErr) {
                console.error(
                  `Failed to load avatar for ${enumerator.id}:`,
                  avatarErr,
                );
              }
            }

            return { id: enumerator.id, svgContent };
          } catch (error) {
            console.error(`Error generating card for ${enumerator.id}:`, error);
            return { id: enumerator.id, svgContent: null };
          }
        }),
      );

      setCardData(generatedCards);
      setLoading(false);
    };

    generateCards();
  }, [enumerators]);

  if (loading) {
    return (
      <div className="flex justify-center p-8 print:hidden">
        Loading ID cards...
      </div>
    );
  }

  // Calculate how many pages we need (6 cards per page)
  const cardsPerPage = 6;
  const totalPages = Math.ceil(cardData.length / cardsPerPage);

  // Create array of pages
  const pages = Array.from({ length: totalPages }, (_, pageIndex) => {
    const startIdx = pageIndex * cardsPerPage;
    const pageCards = cardData.slice(startIdx, startIdx + cardsPerPage);
    return pageCards;
  });

  return (
    <div className="id-cards-container">
      {pages.map((pageCards, pageIndex) => (
        <div key={`page-${pageIndex}`} className="id-card-grid">
          {pageCards.map((card) =>
            card.svgContent ? (
              <div key={card.id} className="id-card">
                <div
                  dangerouslySetInnerHTML={{ __html: card.svgContent }}
                  className="id-card-content"
                />
              </div>
            ) : (
              <div key={card.id} className="id-card id-card-error">
                <p>Failed to generate ID card</p>
              </div>
            ),
          )}
          {/* Add empty placeholders for incomplete pages to maintain grid layout */}
          {Array.from(
            { length: cardsPerPage - pageCards.length },
            (_, index) => (
              <div
                key={`empty-${index}`}
                className="id-card id-card-empty"
              ></div>
            ),
          )}
        </div>
      ))}

      <style jsx global>{`
        .id-cards-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .id-card-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: repeat(3, 1fr);
          gap: 8mm;
          padding: 15mm 10mm;
          width: 190mm;
          height: 277mm; /* A4 height */
          box-sizing: border-box;
          page-break-after: always;
          page-break-inside: avoid;
          margin-bottom: 0;
        }

        .id-card {
          display: flex;
          justify-content: center;
          align-items: center;
          box-sizing: border-box;
          height: 80mm; /* Reduced from 85mm */
          width: 80mm; /* Reduced from 85mm */
        }

        .id-card-empty {
          visibility: hidden;
        }

        .id-card-content {
          width: 80mm; /* Reduced from 85mm */
          height: auto;
          max-height: 80mm; /* Reduced from 85mm */
        }

        .id-card-content svg {
          width: 100%;
          height: auto;
          display: block;
          max-height: 78mm; /* Reduced from 83mm */
        }

        .id-card-error {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 80mm; /* Reduced from 85mm */
          background-color: #f9e3e3;
          color: #a12222;
          text-align: center;
          border: 1px dashed #d32f2f;
        }

        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
            padding: 0;
          }

          body {
            margin: 0;
            padding: 0;
          }

          .id-cards-container {
            width: 210mm;
            padding: 0;
            margin: 0;
          }

          .id-card-grid {
            margin: 0;
            padding: 15mm 10mm; /* Increased vertical padding */
            height: 297mm; /* Exact A4 height */
            page-break-after: always;
          }

          .id-card {
            height: 80mm; /* Reduced from 85mm */
            overflow: hidden;
          }

          /* Ensure consistent sizing for SVG content */
          .id-card-content svg {
            height: 78mm; /* Reduced from 83mm */
            width: 78mm; /* Reduced from 83mm */
            object-fit: contain;
          }

          /* Force each page to have its own consistent styling */
          .id-card-grid:last-child {
            page-break-after: auto;
          }
        }
      `}</style>
    </div>
  );
}
