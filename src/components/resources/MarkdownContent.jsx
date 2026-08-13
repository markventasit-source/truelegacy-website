import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export const slugifyHeading = (text) =>
  String(text || "")
    .toLowerCase()
    .trim()
    .replace(/<[^>]+>/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);

export const getNodeText = (children) => {
  if (children == null || typeof children === "boolean") return "";
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) return children.map(getNodeText).join("");
  if (children?.props?.children) return getNodeText(children.props.children);
  return "";
};

/**
 * Normalize CMS / pasted blog HTML+markdown so body copy lines up cleanly:
 * - bold-only paragraphs → headings
 * - "• item" / "· item" lines → real markdown lists
 */
export const normalizeBlogContent = (content) => {
  let text = String(content || "").replace(/\r\n/g, "\n");
  if (!text.trim()) return "";

  // <p><strong>Title</strong></p> → ## Title
  text = text.replace(
    /<p>\s*<strong>([\s\S]*?)<\/strong>\s*<\/p>/gi,
    (_, title) => `\n\n## ${String(title).replace(/<[^>]+>/g, "").trim()}\n\n`
  );

  // <p>• item</p> / <p>· item</p> → markdown list item
  text = text.replace(
    /<p>\s*[•·●]\s*([\s\S]*?)<\/p>/gi,
    (_, body) =>
      `\n- ${String(body)
        .replace(/<br\s*\/?>/gi, " ")
        .replace(/<\/?[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim()}\n`
  );

  // Plain-text bullet lines (incl. tab after bullet, common from Word/Docs)
  text = text.replace(/^[•·●][ \t]+(.+)$/gm, "- $1");

  // Tighten extra blank lines created by replacements
  text = text.replace(/\n{3,}/g, "\n\n");
  return text.trim();
};

const MediaImage = ({ src, alt }) => {
  const kind = String(alt || "").toLowerCase().trim();

  if (kind === "youtube" || kind === "vimeo") {
    return (
      <div className="my-5 w-full overflow-hidden rounded-md aspect-video">
        <iframe
          src={src}
          title={alt || "Video"}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (kind === "video") {
    return (
      <div className="my-5 w-full overflow-hidden rounded-md">
        <video src={src} controls className="w-full rounded-md" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || ""}
      className="my-5 w-full rounded-md object-cover"
      loading="lazy"
    />
  );
};

const Heading = ({ as: Tag, className, children, idPrefix }) => {
  const text = getNodeText(children);
  const id = `${idPrefix ? `${idPrefix}-` : ""}${slugifyHeading(text)}`;
  return (
    <Tag id={id} className={`scroll-mt-28 ${className}`}>
      {children}
    </Tag>
  );
};

const isBoldOnlyParagraph = (children) => {
  if (!Array.isArray(children) || children.length !== 1) {
    // single strong child without array wrap
    const only = children;
    if (
      only &&
      typeof only === "object" &&
      (only.type === "strong" || only.props?.node?.tagName === "strong")
    ) {
      return getNodeText(only).trim().length > 0;
    }
    return false;
  }
  const [only] = children;
  if (!only || typeof only !== "object") return false;
  const tag = only.type === "strong" || only.props?.node?.tagName === "strong";
  return tag && getNodeText(only).trim().length > 0;
};

const MarkdownContent = ({ content, className = "", idPrefix = "" }) => {
  const normalized = normalizeBlogContent(content);
  if (!normalized) return null;

  return (
    <div
      className={`blog-markdown text-[16px] leading-[28px] font-normal text-[#132F2C] ${className}`}
      style={{ fontFamily: 'Urania, "Segoe UI", system-ui, sans-serif' }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ children }) => (
            <Heading
              as="h2"
              idPrefix={idPrefix}
              className="text-[24px] leading-[32px] font-medium mb-3 mt-8 first:mt-0"
            >
              {children}
            </Heading>
          ),
          h2: ({ children }) => (
            <Heading
              as="h2"
              idPrefix={idPrefix}
              className="text-[24px] leading-[32px] font-medium mb-3 mt-8 first:mt-0"
            >
              {children}
            </Heading>
          ),
          h3: ({ children }) => (
            <Heading
              as="h3"
              idPrefix={idPrefix}
              className="text-[20px] leading-[28px] font-medium mb-2.5 mt-6 first:mt-0"
            >
              {children}
            </Heading>
          ),
          h4: ({ children }) => (
            <Heading
              as="h4"
              idPrefix={idPrefix}
              className="text-[18px] leading-[26px] font-medium mb-2 mt-5 first:mt-0"
            >
              {children}
            </Heading>
          ),
          h5: ({ children }) => (
            <Heading
              as="h5"
              idPrefix={idPrefix}
              className="text-[16px] leading-[24px] font-medium mb-2 mt-4 first:mt-0"
            >
              {children}
            </Heading>
          ),
          h6: ({ children }) => (
            <Heading
              as="h6"
              idPrefix={idPrefix}
              className="text-[15px] leading-[22px] font-medium mb-2 mt-4 first:mt-0"
            >
              {children}
            </Heading>
          ),
          p: ({ children }) => {
            // Fallback if bold-only paragraphs weren't normalized
            if (isBoldOnlyParagraph(children)) {
              return (
                <Heading
                  as="h2"
                  idPrefix={idPrefix}
                  className="text-[24px] leading-[32px] font-medium mb-3 mt-8 first:mt-0"
                >
                  {getNodeText(children)}
                </Heading>
              );
            }
            return <p className="mb-4 last:mb-0 text-pretty">{children}</p>;
          },
          ul: ({ children }) => (
            <ul className="list-disc list-outside pl-5 sm:pl-6 space-y-2 mb-4 marker:text-[#132F2C]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside pl-5 sm:pl-6 space-y-2 mb-4 marker:text-[#132F2C]">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="pl-1 [&>p]:mb-1 [&>p:last-child]:mb-0">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#F4D57E] bg-white/60 pl-4 py-3 italic mb-4 text-[#2F4F4A]">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="underline underline-offset-2 text-[#132F2C]"
              target="_blank"
              rel="noreferrer"
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) => <MediaImage src={src} alt={alt} />,
          iframe: ({ src, title }) => (
            <div className="my-5 w-full overflow-hidden rounded-md aspect-video">
              <iframe
                src={src}
                title={title || "Embedded video"}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ),
          table: ({ children }) => (
            <div className="my-5 w-full overflow-x-auto">
              <table className="w-full border-collapse border border-[#D9D9D9] text-left">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[#F6FFFF]">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="border border-[#D9D9D9] px-3 py-2 font-medium">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-[#D9D9D9] px-3 py-2">{children}</td>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold">{children}</strong>
          ),
        }}
      >
        {normalized}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownContent;
