import JsonLd, { faqSchema } from "./JsonLd";

export type FaqItem = { q: string; a: string };

/**
 * 자주 묻는 질문 한 덩어리.
 *
 * ┌─ 왜 컴포넌트로 묶는가 ────────────────────────────────────────┐
 * │ 구글은 "구조화 데이터에 적은 답이 화면에도 그대로 있어야 한다"고 │
 * │ 요구한다. 화면 목록과 JSON-LD를 따로 관리하면 언젠가 어긋나고,   │
 * │ 어긋나는 순간 정책 위반이 된다.                                  │
 * │ 그래서 **같은 배열 하나**로 둘 다 만든다. 어긋날 수가 없다.      │
 * └──────────────────────────────────────────────────────────────┘
 *
 * 사람들이 검색창에 치는 건 "조선시대 신분"이 아니라
 * "조선시대 내 신분 뭐였을까" 같은 문장이다. 질문을 그 말투 그대로 적는다.
 */
export default function Faq({
  title,
  note,
  items,
}: {
  title: string;
  note?: string;
  items: FaqItem[];
}) {
  if (items.length === 0) return null;

  return (
    <section className="mt-12">
      <JsonLd data={faqSchema(items)} />
      <h2 className="serif mb-1 text-xl font-bold">{title}</h2>
      {note && <p className="mb-4 text-sm text-inksoft">{note}</p>}
      <div className={`space-y-3 ${note ? "" : "mt-4"}`}>
        {items.map((f) => (
          <div key={f.q} className="card p-5">
            <h3 className="font-medium text-ink">{f.q}</h3>
            <p className="mt-2 leading-loose text-inksoft">{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
