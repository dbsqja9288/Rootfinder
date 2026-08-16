/** 약관·방침 문서의 공통 틀. 본문은 읽기 편한 폭으로 좁힌다. */
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <article className="legal-doc space-y-6 leading-relaxed">{children}</article>
    </div>
  );
}
