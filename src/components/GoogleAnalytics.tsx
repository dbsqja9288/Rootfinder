/**
 * 구글 애널리틱스(GA4).
 *
 * NEXT_PUBLIC_GA_ID 가 없으면 스크립트를 아예 내보내지 않는다.
 * 값을 넣기 전까지는 사이트에 아무 변화가 없고, 넣는 순간부터 집계가 시작된다.
 *
 * Vercel Web Analytics 대신 쓴다. 무료 한도(월 5만 이벤트)를 넘겨 수집이 멈췄고,
 * GA4는 이 규모에서 사실상 한도가 없다. 애드센스 승인 후 수익 분석도 GA 쪽이 붙는다.
 *
 * 개인정보: IP 익명화가 GA4에서는 기본이고, 여기서 광고 개인화 신호는 꺼 둔다.
 * 광고 자체는 애드핏·애드센스가 따로 하므로 GA에서까지 켤 이유가 없다.
 */
export default function GoogleAnalytics({ id }: { id?: string }) {
  if (!id) return null;

  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${id}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('consent', 'default', { ad_user_data: 'denied', ad_personalization: 'denied' });
gtag('config', '${id}');
          `.trim(),
        }}
      />
    </>
  );
}
