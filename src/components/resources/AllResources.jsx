import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { formatContentTypeLabel, getAllBlogs } from "../../api/blogsApi";
import StyledButton from "../../ui/StyledButton";

const getSecondParagraphFromMarkdown = (markdown) => {
  const text = String(markdown || "");
  const paragraphs = text
    .split(/\n\s*\n+/)
    .map((p) =>
      p
        .replace(/^#{1,6}\s+/gm, "")
        .replace(/^(-|\*)\s+/gm, "")
        .replace(/\*\*([^*]+)\*\*/g, "$1")
        .replace(/_([^_]+)_/g, "$1")
        .trim(),
    )
    .filter(Boolean);

  return paragraphs[1] || "";
};

const getFirstLineFromMarkdown = (markdown) => {
  const text = String(markdown || "");
  const firstParagraph = text
    .split(/\n\s*\n+/)[0]
    ?.replace(/^#{1,6}\s+/gm, "")
    ?.replace(/^(-|\*)\s+/gm, "")
    ?.replace(/\*\*([^*]+)\*\*/g, "$1")
    ?.replace(/_([^_]+)_/g, "$1")
    ?.trim();
  // Take only the first line of the first paragraph
  const firstLine = firstParagraph?.split('\n')[0]?.trim();
  return firstLine || "";
};

const getExcerptFromBlogDetail = (blog) => {
  const a = getSecondParagraphFromMarkdown(blog?.dark_content);
  if (a) return a;
  const b = getSecondParagraphFromMarkdown(blog?.faded_content);
  if (b) return b;
  const fromSections = Array.isArray(blog?.sub_sections)
    ? blog.sub_sections
        .map((s) => getSecondParagraphFromMarkdown(s?.content))
        .find(Boolean)
    : "";
  // Fallback: use first line of first paragraph from faded_content
  const fadedFirstLine = getFirstLineFromMarkdown(blog?.faded_content);
  if (fadedFirstLine) return fadedFirstLine;
  return fromSections || "";
};

const AllResources = ({
  types = ["blog"],
  heading = "Blogs",
} = {}) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Keep page in the URL so browser back restores the same listing page.
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);

  const setPage = (updater) => {
    const nextRaw = typeof updater === "function" ? updater(page) : updater;
    const nextPage = Math.max(1, Number(nextRaw) || 1);
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        if (nextPage <= 1) params.delete("page");
        else params.set("page", String(nextPage));
        return params;
      },
      { replace: true },
    );
  };

  // Scroll-triggered entrance
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const typesKey = Array.isArray(types) ? types.join(",") : String(types || "");

  useEffect(() => {
    let active = true;
    setLoading(true);
    const typeList = Array.isArray(types) ? types : [types].filter(Boolean);
    const filter = { status: "published", limit: 500 };
    if (typeList.length === 1) {
      filter.type = typeList[0];
    } else if (typeList.length > 1) {
      filter.types = typeList.join(",");
    }
    getAllBlogs(filter)
      .then((res) => {
        if (!active) return;
        let list = Array.isArray(res?.data) ? res.data : [];
        if (typeList.length) {
          list = list.filter((b) => {
            const t = b?.type || "blog";
            if (typeList.includes("blog") && (!b?.type || b.type === null)) {
              return true;
            }
            return typeList.includes(t);
          });
        }
        const withExcerpt = list.map((b) => ({
          id: b._id,
          slug: b.slug,
          type: formatContentTypeLabel(b.type),
          meta: b.createdAt
            ? `Published: ${new Date(b.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}`
            : "",
          title: b.title,
          desc: b.meta_description || b.description,
          image: b.image,
          image_alt: b.image_alt || b.title,
          excerpt:
            getExcerptFromBlogDetail(b) ||
            b.meta_description ||
            b.description ||
            "",
        }));

        if (!active) return;
        setBlogs(withExcerpt);
      })
      .catch(() => {
        if (!active) return;
        setBlogs([]);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [typesKey]);

  const featured = blogs[0];
  const others = blogs.slice(1, 4);
  const remainingBlogs = blogs.slice(4);

  const perPage = 9;
  const totalPages = Math.max(1, Math.ceil(remainingBlogs.length / perPage));
  // While blogs are still loading, totalPages is 1 — don't clamp URL page away yet.
  const safePage = loading ? page : Math.min(page, totalPages);
  const startIndex = (safePage - 1) * perPage;
  const pagedBlogs = remainingBlogs.slice(startIndex, startIndex + perPage);

  const handleArticleClick = (article) => {
    if (!article?.slug) return;
    navigate(`/resources/${article.slug}`);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (loading) return;
    if (page > totalPages) setPage(totalPages);
  }, [loading, page, totalPages]);

  return (
    <section
      ref={sectionRef}
      className={`bg-white px-4 md:px-16 py-12 md:py-16 lg:pb-32 resources-section ${
        isVisible ? "resources-section-visible" : ""
      }`}
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Section heading */}
        <h2 className="font-[Urania] font-bold text-[#132F2C] text-[32px] leading-[32px] md:text-[42px] md:leading-[49px] mb-6 md:mb-8 resources-heading">
          {heading}
        </h2>

        {loading ? null : null}

        {!loading && !featured ? null : null}

        <div className={safePage === 1 ? "" : "hidden xl:block"}>
          <div className="grid grid-cols-1 xl:grid-cols-[614px_650px] gap-8 lg:gap-8 items-start">
            {/* Featured article - desktop column 1 */}
            {featured && (
              <article
                className="cursor-pointer resources-featured w-full xl:w-[614px]"
                onClick={() => handleArticleClick(featured)}
              >
                <div className="w-full overflow-hidden rounded-md mb-3 md:mb-8">
                  <img
                    src={featured.image}
                    alt={featured.image_alt || featured.title}
                    className="w-full h-[200px] sm:h-[260px] md:h-[300px] lg:h-[382px] xl:w-[614px] object-cover"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                  />
                </div>

                <div className="font-[Urania] text-[14px] leading-[14px] text-[#868989] font-normal not-italic mb-4">
                  <span>{featured.type}</span>
                  <span className="mx-2">•</span>
                  <span>{featured.meta}</span>
                </div>

                <h2
                  className="font-[Urania] text-[#132F2C] text-[24px] leading-[32px] md:text-[32px] md:leading-[38px] mb-3 max-w-[660px]"
                  style={{ fontWeight: 500 }}
                >
                  {featured.title}
                </h2>

                <p className="font-[Urania] text-[#2F4F4A] text-[16px] leading-[22px] md:text-[18px] md:leading-[24px] md:text-[#132F2C] font-normal max-w-[550px] line-clamp-2" style={{ fontWeight: 400 }}>
                  {featured.excerpt || featured.desc}
                </p>
              </article>
            )}

            {/* Other articles */}
            <div className="space-y-6 resources-sidebar w-full">
              {/* Mobile / tablet: stacked full-width cards */}
              <div className="block xl:hidden space-y-6">
                {others.map((item) => (
                  <article
                    key={item.id}
                    className="w-full cursor-pointer resources-article"
                    onClick={() => handleArticleClick(item)}
                  >
                    <div className="w-full overflow-hidden rounded-md mb-3">
                      <img
                        src={item.image}
                        alt={item.image_alt || item.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-[200px] object-cover"
                      />
                    </div>

                    <div className="font-[Urania] text-[14px] leading-[14px] text-[#868989] font-normal mb-2">
                      <span>{item.type}</span>
                      <span className="mx-2">•</span>
                      <span>{item.meta}</span>
                    </div>

                    <h3 className="font-[Urania] text-[#132F2C] text-[24px] leading-[32px] font-medium mb-1" style={{ fontWeight: 500 }}>
                      {item.title}
                    </h3>

                    <p className="font-[Urania] text-[#2F4F4A] text-[16px] leading-[22px] line-clamp-2" style={{ fontWeight: 400 }}>
                      {item.excerpt || item.desc}
                    </p>
                  </article>
                ))}
              </div>

              {/* Desktop: compact side list */}
              <div className="hidden xl:block space-y-5">
                {others.map((item) => (
                  <article
                    key={item.id}
                    className="flex gap-4 border-b border-[#E3E7E6] pb-4 last:border-b-0 last:pb-0 cursor-pointer resources-article"
                    onClick={() => handleArticleClick(item)}
                  >
                    <div className="w-[240px] h-[180px] overflow-hidden rounded-md flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.image_alt || item.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <div
                        className="font-[Urania] text-[14px] leading-[14px] text-[#868989] font-normal not-italic mb-3"
                        style={{ fontWeight: 400 }}
                      >
                        <span>{item.type}</span>
                        <span className="mx-2">•</span>
                        <span>{item.meta}</span>
                      </div>

                      <h4 className="font-[Urania] text-[#132F2C] text-[24px] leading-[30px] font-medium mb-2">
                        {item.title}
                      </h4>

                  <p
                        className="font-[Urania] text-[#2F4F4A] text-[16px] leading-[20px] md:text-[16px] md:leading-[20px] md:text-[#868989] line-clamp-2"
                        style={{ fontWeight: 400 }}
                      >
                        {item.excerpt || item.desc}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* New Section - Additional Resources */}
        <div className="mt-6 md:mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {pagedBlogs.map((item) => (
              <div
                key={item.id}
                className="cursor-pointer hover:opacity-90 transition-opacity resources-article"
                onClick={() => handleArticleClick(item)}
              >
                <div className="w-full overflow-hidden rounded-md mb-5">
                  <img
                    src={item.image}
                    alt={item.image_alt || item.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-[220px] sm:h-[260px] md:h-[280px] object-cover"
                  />
                </div>
                <div className="font-[Urania] text-[14px] leading-[14px] text-[#868989] font-normal mb-3">
                  <span>{item.type}</span>
                  <span className="mx-2">•</span>
                  <span>{item.meta}</span>
                </div>
                <h3 className="font-[Urania] text-[#132F2C] text-[24px] leading-[32px] md:text-[24px] md:leading-[30px] font-medium mb-3 max-w-[95%]" style={{ fontWeight: 500 }}>
                  {item.title}
                </h3>
                {(item.excerpt || item.desc) && (
                  <p className="font-[Urania] text-[#2F4F4A] text-[16px] leading-[22px] md:text-[14px] md:leading-[20px] md:text-[#868989] font-normal line-clamp-2" style={{ fontWeight: 400 }}>
                    {item.excerpt || item.desc}
                  </p>
                )}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-10">
              <StyledButton
                name="Prev"
                variant="primary"
                disabled={safePage === 1}
                minWidth="auto"
                className="rounded-md !px-4 !py-2 !text-sm"
                onClick={() => {
                  setPage((p) => Math.max(1, p - 1));
                  setTimeout(() => {
                    const element = sectionRef.current;
                    if (element) {
                      const rect = element.getBoundingClientRect();
                      const scrollTop =
                        window.pageYOffset || document.documentElement.scrollTop;
                      const targetY = rect.top + scrollTop - 100; // 100px offset from top
                      window.scrollTo({ top: targetY, behavior: "smooth" });
                    }
                  }, 100);
                }}
              />
              <div className="text-[#132F2C]">
                {safePage} / {totalPages}
              </div>
              <StyledButton
                name="Next"
                variant="primary"
                disabled={safePage === totalPages}
                minWidth="auto"
                className="rounded-md !px-4 !py-2 !text-sm"
                onClick={() => {
                  setPage((p) => Math.min(totalPages, p + 1));
                  setTimeout(() => {
                    const element = sectionRef.current;
                    if (element) {
                      const rect = element.getBoundingClientRect();
                      const scrollTop =
                        window.pageYOffset || document.documentElement.scrollTop;
                      const targetY = rect.top + scrollTop - 100; // 100px offset from top
                      window.scrollTo({ top: targetY, behavior: "smooth" });
                    }
                  }, 100);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AllResources;
