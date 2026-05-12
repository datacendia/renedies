/**
 * Renders one or more Schema.org JSON-LD objects as a `<script type="application/ld+json">`.
 * Safe for SSR: no client runtime needed.
 */
export function JsonLd({ data }: { data: unknown | unknown[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((obj, i) => (
        <script
          key={i}
          type="application/ld+json"
          // JSON.stringify is safe; we strip `</` just in case a field contains it.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(obj).replace(/</g, "\\u003c")
          }}
        />
      ))}
    </>
  );
}
