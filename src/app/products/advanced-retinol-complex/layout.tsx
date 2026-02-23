import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Advanced Retinol Complex | DermaAI",
  description: "Advanced Retinol Complex 2.5% - Clinical Grade Skincare",
};

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="font-display">
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
      {children}
    </div>
  );
}
