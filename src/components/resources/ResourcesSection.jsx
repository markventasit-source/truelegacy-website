import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ShareIcon from "../../assets/icon/share-08.webp";
import { formatContentTypeLabel, getAllBlogs, getBlogById } from "../../api/blogsApi";
import MarkdownContent, {
  normalizeBlogContent,
  slugifyHeading,
} from "./MarkdownContent";
import BlogFaqs from "./BlogFaqs";
import { toast } from "sonner";
import {
  FaWhatsapp,
  FaLinkedin,
  FaFacebook,
  FaXTwitter,
  FaEnvelope,
  FaLink,
  FaShareNodes,
} from "react-icons/fa6";

const getExcerptFromBlogDetail = (blog) => {
  if (!blog) return "";
  const fields = [
    blog.dark_content,
    blog.faded_content,
    ...(blog.sub_sections || []).map((s) => s.content),
  ];
  const paragraphs = [];
  fields.forEach((field) => {
    if (typeof field === "string") {
      const split = field.split("\n").filter((p) => p.trim());
      paragraphs.push(...split);
    }
  });
  return paragraphs[1] || paragraphs[0] || "";
};

const extractMarkdownHeadings = (markdown, idPrefix = "") => {
  const items = [];
  normalizeBlogContent(markdown)
    .split("\n")
    .forEach((line) => {
      const match = line.match(/^(#{1,3})\s+(.+)$/);
      if (!match) return;
      const title = match[2]
        .replace(/\*\*([^*]+)\*\*/g, "$1")
        .replace(/_([^_]+)_/g, "$1")
        .replace(/`([^`]+)`/g, "$1")
        .replace(/<[^>]+>/g, "")
        .trim();
      if (!title) return;
      const id = `${idPrefix ? `${idPrefix}-` : ""}${slugifyHeading(title)}`;
      items.push({ id, title, level: match[1].length });
    });
  return items;
};

const isMobileDevice = () =>
  typeof navigator !== "undefined" &&
  (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 1 && window.innerWidth < 1024));

const STICKY_TOP = 96;

const pinSidebar = (columnEl, panelEl, gridEl, minWidth = 1024) => {
  if (!columnEl || !panelEl || !gridEl) return;

  if (window.innerWidth < minWidth) {
    panelEl.style.cssText = "";
    columnEl.style.minHeight = "";
    return;
  }

  const gridRect = gridEl.getBoundingClientRect();
  const colRect = columnEl.getBoundingClientRect();
  const panelHeight = panelEl.offsetHeight;
  const top = STICKY_TOP;

  columnEl.style.minHeight = `${panelHeight}px`;

  // Above stick point — normal flow
  if (gridRect.top >= top) {
    panelEl.style.cssText = "";
    return;
  }

  // Past bottom of grid — dock to bottom of column
  if (gridRect.bottom <= top + panelHeight) {
    panelEl.style.position = "absolute";
    panelEl.style.top = "auto";
    panelEl.style.bottom = "0";
    panelEl.style.left = "0";
    panelEl.style.right = "0";
    panelEl.style.width = "100%";
    panelEl.style.zIndex = "20";
    return;
  }

  // Stick in viewport while scrolling article
  panelEl.style.position = "fixed";
  panelEl.style.top = `${top}px`;
  panelEl.style.left = `${colRect.left}px`;
  panelEl.style.width = `${colRect.width}px`;
  panelEl.style.bottom = "auto";
  panelEl.style.right = "auto";
  panelEl.style.zIndex = "20";
  panelEl.style.maxHeight = `calc(100vh - ${top + 24}px)`;
  panelEl.style.overflowY = "auto";
  panelEl.style.scrollbarWidth = "none";
  panelEl.style.msOverflowStyle = "none";
};

const ResourcesSection = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  const [blogData, setBlogData] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [latestWithExcerpts, setLatestWithExcerpts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [activeTocId, setActiveTocId] = useState("");
  const sectionRef = useRef(null);
  const shareMenuRef = useRef(null);
  const relatedScrollRef = useRef(null);
  const scrollDirRef = useRef(1);
  const contentGridRef = useRef(null);
  const tocColumnRef = useRef(null);
  const tocPanelRef = useRef(null);
  const relatedColumnRef = useRef(null);
  const relatedPanelRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    let active = true;
    const run = async () => {
      try {
        setLoading(true);
        const listRes = await getAllBlogs({ status: "published", limit: 500 });
        const list = Array.isArray(listRes?.data) ? listRes.data : [];
        const matched = list.find((b) => b?.slug === slug);

        if (!matched?._id) {
          if (!active) return;
          setBlogData(null);
          setRelatedBlogs([]);
          setLatestBlogs([]);
          return;
        }

        const detailRes = await getBlogById(matched._id);
        const blog = detailRes?.data?.blog || null;
        const latest = Array.isArray(detailRes?.data?.latest_blogs)
          ? detailRes.data.latest_blogs
          : [];

        if (!active) return;
        setBlogData(blog);
        setRelatedBlogs(
          Array.isArray(blog?.related_blogs)
            ? blog.related_blogs
            : Array.isArray(blog?.relatedBlogs)
              ? blog.relatedBlogs
              : []
        );
        setLatestBlogs(latest);

        const enriched = await Promise.all(
          latest.map(async (b) => {
            try {
              const detailRes = await getBlogById(b._id);
              const detail = detailRes?.data?.blog;
              const excerpt = getExcerptFromBlogDetail(detail);
              return {
                ...b,
                type: detail?.type || b.type,
                image_alt:
                  detail?.image_alt ||
                  detail?.imageAlt ||
                  b.image_alt ||
                  b.imageAlt ||
                  b.title ||
                  "",
                excerpt:
                  excerpt || detail?.meta_description || b.description || "",
                formattedDate: detail?.createdAt
                  ? `Published: ${new Date(detail.createdAt).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}`
                  : "",
              };
            } catch {
              return {
                ...b,
                excerpt: b.description || "",
                formattedDate: "",
              };
            }
          })
        );
        if (!active) return;
        setLatestWithExcerpts(enriched);
      } catch {
        if (!active) return;
        setBlogData(null);
        setRelatedBlogs([]);
        setLatestBlogs([]);
        setLatestWithExcerpts([]);
      } finally {
        if (!active) return;
        setLoading(false);
      }
    };

    if (!slug) {
      setBlogData(null);
      setRelatedBlogs([]);
      setLatestBlogs([]);
      setLatestWithExcerpts([]);
      setLoading(false);
      return;
    }

    run();
    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    const el = relatedScrollRef.current;
    if (!el) return;

    const mq = window.matchMedia("(max-width: 1023px)");
    if (!mq.matches) return;

    const tick = () => {
      const first = el.querySelector("[data-related-card='1']");
      if (!first) return;

      const cardWidth = first.getBoundingClientRect().width;
      const gap = 32;
      const step = cardWidth + gap;
      const maxScroll = el.scrollWidth - el.clientWidth;

      const current = el.scrollLeft;
      let next;
      if (scrollDirRef.current === 1) {
        if (current >= maxScroll - 2) {
          scrollDirRef.current = -1;
          next = Math.max(current - step, 0);
        } else {
          next = Math.min(current + step, maxScroll);
        }
      } else if (current <= 2) {
        scrollDirRef.current = 1;
        next = Math.min(current + step, maxScroll);
      } else {
        next = Math.max(current - step, 0);
      }
      if (next !== current) {
        el.scrollTo({ left: next, behavior: "smooth" });
      }
    };

    const id = window.setInterval(tick, 5000);
    return () => window.clearInterval(id);
  }, [latestBlogs.length]);

  useEffect(() => {
    if (!shareOpen) return;
    const onPointerDown = (e) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(e.target)) {
        setShareOpen(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setShareOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [shareOpen]);

  const heroTitle = blogData?.title || "";
  const heroImage = blogData?.image || "";
  /** Admin "Featured image alt text" → API field `image_alt` */
  const heroImageAlt =
    blogData?.image_alt ||
    blogData?.imageAlt ||
    heroTitle ||
    "Resource featured image";
  const heroMeta = blogData?.createdAt
    ? `Published: ${new Date(blogData.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}`
    : "";

  const tocItems = useMemo(() => {
    if (!blogData) return [];
    const items = [
      ...extractMarkdownHeadings(blogData.dark_content, "dark"),
      ...extractMarkdownHeadings(blogData.faded_content, "faded"),
    ];

    (blogData.sub_sections || []).forEach((section, idx) => {
      if (section?.title) {
        items.push({
          id: `section-${idx}`,
          title: section.title,
          level: 2,
        });
      }
      items.push(
        ...extractMarkdownHeadings(section?.content, `section-${idx}`)
      );
    });

    return items;
  }, [blogData]);

  const sidebarRelated = useMemo(() => {
    const fromRelated = (relatedBlogs || [])
      .filter((b) => b?.slug && b.slug !== slug)
      .map((b) => ({
        id: b._id,
        slug: b.slug,
        title: b.title,
        image: b.image,
        image_alt: b.image_alt || b.imageAlt || b.title || "",
        type: b.type,
      }));

    if (fromRelated.length) return fromRelated.slice(0, 5);

    return (latestWithExcerpts || [])
      .filter((b) => b?.slug && b.slug !== slug)
      .slice(0, 5)
      .map((b) => ({
        id: b._id,
        slug: b.slug,
        title: b.title,
        image: b.image,
        image_alt: b.image_alt || b.imageAlt || b.title || "",
        type: b.type,
        excerpt: b.excerpt,
      }));
  }, [relatedBlogs, latestWithExcerpts, slug]);

  useEffect(() => {
    if (!tocItems.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveTocId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.1, 0.4, 0.7] }
    );

    tocItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [tocItems, blogData]);

  useEffect(() => {
    const syncSidebars = () => {
      pinSidebar(
        tocColumnRef.current,
        tocPanelRef.current,
        contentGridRef.current
      );
      pinSidebar(
        relatedColumnRef.current,
        relatedPanelRef.current,
        contentGridRef.current,
        1280
      );
    };

    syncSidebars();
    const raf = requestAnimationFrame(syncSidebars);
    window.addEventListener("scroll", syncSidebars, { passive: true });
    window.addEventListener("resize", syncSidebars);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", syncSidebars);
      window.removeEventListener("resize", syncSidebars);
    };
  }, [blogData, tocItems, sidebarRelated, loading]);

  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";
  const shareText =
    getExcerptFromBlogDetail(blogData)?.replace(/[#*_`]/g, "").slice(0, 180) ||
    heroTitle;

  const handleBlogClick = (blog) => {
    if (!blog?.slug) return;
    navigate(`/resources/${blog.slug}`);
    window.scrollTo(0, 0);
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
      setShareOpen(false);
    } catch {
      toast.error("Could not copy link");
    }
  };

  const openShareWindow = (url) => {
    window.open(url, "_blank", "noopener,noreferrer,width=640,height=720");
    setShareOpen(false);
  };

  const handleNativeShare = async () => {
    const shareData = {
      title: heroTitle || "True Legacy Blog",
      text: shareText,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        if (navigator.canShare && !navigator.canShare(shareData)) {
          await navigator.share({ title: shareData.title, url: shareData.url });
        } else {
          await navigator.share(shareData);
        }
        setShareOpen(false);
        return;
      }
      await copyShareLink();
    } catch (err) {
      if (err?.name !== "AbortError") {
        await copyShareLink();
      }
    }
  };

  const handleShareClick = async () => {
    if (isMobileDevice() && typeof navigator.share === "function") {
      await handleNativeShare();
      return;
    }
    setShareOpen((prev) => !prev);
  };

  const scrollToHeading = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveTocId(id);
  };

  return (
    <section
      ref={sectionRef}
      className="bg-[#F6FFFF] pt-10 pb-16 md:pt-16 md:pb-24 lg:pb-28"
    >
      <div className="max-w-[1680px] mx-auto px-4 md:px-8 lg:px-10 xl:px-12">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 md:mb-8 font-[Urania] text-[13px] md:text-[14px] text-[#868989]"
        >
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link to="/" className="hover:text-[#132F2C] transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                to="/resources"
                className="hover:text-[#132F2C] transition-colors"
              >
                Resources
              </Link>
            </li>
            {heroTitle ? (
              <>
                <li aria-hidden="true">/</li>
                <li className="text-[#132F2C] font-medium line-clamp-1 max-w-[60vw] md:max-w-md">
                  {heroTitle}
                </li>
              </>
            ) : null}
          </ol>
        </nav>

        {/* Hero */}
        <div className="relative mb-6 md:mb-8 overflow-x-clip">
          <div
            className={`relative w-full max-w-[324px] h-[300px]
sm:h-[380px] md:h-[380px]
ml-auto mr-[-16px]
md:mr-0
md:max-w-[640px]
lg:max-w-[840px] lg:h-[460px]
xl:max-w-none xl:w-[968px] xl:h-[540px]
rounded-none overflow-hidden
xl:ml-auto xl:mr-[-40px]`}
          >
            {heroImage ? (
              <img
                src={heroImage}
                alt={heroImageAlt}
                className="w-full h-full object-cover object-[10%_50%] lg:object-center"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                />
            ) : null}
          </div>

          <div
            className={`bg-[#F4D57E] text-[#132F2C] rounded-[6px]
               w-[315px] max-w-[90%] px-6 py-4 ml-3 -mt-10 relative z-20
               md:w-[420px] md:ml-8 md:-mt-14
               lg:w-[560px] lg:px-10 lg:py-8 lg:-mt-16
               xl:absolute xl:mt-0 xl:ml-0 xl:left-0 xl:px-[69px] xl:py-[66px] xl:w-[640px]
               xl:top-1/2 xl:-translate-y-1/2 ${
                 isVisible ? "animate-fade-in" : ""
               }`}
            style={{ animationDelay: "400ms" }}
          >
            <div className="relative mb-[16px]" ref={shareMenuRef}>
              <button
                type="button"
                onClick={handleShareClick}
                className="flex items-center gap-2 font-[Urania] font-normal text-[14px] leading-[14px] cursor-pointer hover:opacity-80 transition-opacity"
                aria-haspopup="menu"
                aria-expanded={shareOpen}
              >
                <span>
                  {formatContentTypeLabel(blogData?.type)}
                  {blogData?.read_time && ` • ${blogData.read_time}`}
                  {heroMeta && (
                    <span className="hidden md:inline"> • {heroMeta}</span>
                  )}
                  {" • Share"}
                </span>
                <img src={ShareIcon} alt="" className="w-5 h-5"
  loading="lazy"
  decoding="async"
  />
              </button>

              {shareOpen ? (
                <div
                  role="menu"
                  className="absolute left-0 top-full mt-3 z-30 w-[240px] rounded-lg border border-[#E5E7EB] bg-white p-2 shadow-xl"
                >
                  {typeof navigator !== "undefined" && navigator.share ? (
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleNativeShare}
                      className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-[14px] text-[#132F2C] hover:bg-[#F6FFFF]"
                    >
                      <FaShareNodes className="text-[16px]" />
                      Share via device
                    </button>
                  ) : null}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() =>
                      openShareWindow(
                        `https://wa.me/?text=${encodeURIComponent(
                          `${heroTitle}\n${shareUrl}`
                        )}`
                      )
                    }
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-[14px] text-[#132F2C] hover:bg-[#F6FFFF]"
                  >
                    <FaWhatsapp className="text-[16px] text-[#25D366]" />
                    WhatsApp
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() =>
                      openShareWindow(
                        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                          shareUrl
                        )}`
                      )
                    }
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-[14px] text-[#132F2C] hover:bg-[#F6FFFF]"
                  >
                    <FaLinkedin className="text-[16px] text-[#0A66C2]" />
                    LinkedIn
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() =>
                      openShareWindow(
                        `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                          shareUrl
                        )}&text=${encodeURIComponent(heroTitle)}`
                      )
                    }
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-[14px] text-[#132F2C] hover:bg-[#F6FFFF]"
                  >
                    <FaXTwitter className="text-[16px]" />
                    X / Twitter
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() =>
                      openShareWindow(
                        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                          shareUrl
                        )}`
                      )
                    }
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-[14px] text-[#132F2C] hover:bg-[#F6FFFF]"
                  >
                    <FaFacebook className="text-[16px] text-[#1877F2]" />
                    Facebook
                  </button>
                  <a
                    role="menuitem"
                    href={`mailto:?subject=${encodeURIComponent(
                      heroTitle
                    )}&body=${encodeURIComponent(
                      `${shareText}\n\n${shareUrl}`
                    )}`}
                    onClick={() => setShareOpen(false)}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-[14px] text-[#132F2C] hover:bg-[#F6FFFF]"
                  >
                    <FaEnvelope className="text-[16px]" />
                    Email
                  </a>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={copyShareLink}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-[14px] text-[#132F2C] hover:bg-[#F6FFFF]"
                  >
                    <FaLink className="text-[16px]" />
                    Copy link
                  </button>
                </div>
              ) : null}
            </div>

            <h1
              className="font-[Urania] font-bold text-[26px] leading-[31px]
                 md:text-[26px] md:leading-[31px]
                 lg:text-[46px] lg:leading-[46px]"
            >
              {heroTitle}
            </h1>
          </div>
        </div>

        {/* Content grid: TOC | Article | Related
            lg: 2-col so the article isn’t squeezed; xl+: 3-col */}
        <div
          ref={contentGridRef}
          className="grid grid-cols-1 gap-8 lg:grid-cols-[200px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,720px)_240px] 2xl:grid-cols-[240px_minmax(0,760px)_260px] lg:gap-10 xl:gap-12 xl:justify-between items-start"
        >
          {/* Left TOC — desktop only */}
          <aside
            ref={tocColumnRef}
            className="hidden lg:block relative self-start"
          >
            <div
              ref={tocPanelRef}
              className="pr-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <h2 className="font-[Urania] text-[14px] font-semibold tracking-wide uppercase text-[#868989] mb-4">
                Table of contents
              </h2>
              {tocItems.length ? (
                <nav aria-label="Table of contents">
                  <ul className="space-y-2 border-l border-[#D9D9D9]">
                    {tocItems.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => scrollToHeading(item.id)}
                          className={`block w-full text-left font-[Urania] text-[14px] leading-[20px] transition-colors border-l-2 -ml-px pl-4 py-0.5 ${
                            activeTocId === item.id
                              ? "border-[#132F2C] text-[#132F2C] font-medium"
                              : "border-transparent text-[#868989] hover:text-[#132F2C]"
                          } ${item.level > 2 ? "pl-7 text-[13px]" : ""}`}
                        >
                          {item.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              ) : (
                <p className="font-[Urania] text-[14px] text-[#868989]">
                  No sections available
                </p>
              )}
            </div>
          </aside>

          {/* Main article */}
          <article
            className={`text-[#132F2C] font-[Urania] w-full min-w-0 max-w-[760px] ${
              isVisible ? "animate-fade-in" : ""
            }`}
            style={{ animationDelay: "600ms" }}
          >
            <div className="space-y-8 md:space-y-10">
              {blogData?.dark_content ? (
                <MarkdownContent
                  content={blogData.dark_content}
                  idPrefix="dark"
                />
              ) : null}
              {blogData?.faded_content ? (
                <MarkdownContent
                  content={blogData.faded_content}
                  idPrefix="faded"
                />
              ) : null}
              {Array.isArray(blogData?.sub_sections)
                ? blogData.sub_sections.map((s, idx) => {
                    if (!s?.title && !s?.content) return null;
                    return (
                      <section
                        key={`ss-${idx}`}
                        id={`section-${idx}`}
                        className="scroll-mt-28"
                      >
                        {s?.title ? (
                          <h2 className="text-[24px] leading-[32px] font-medium mb-3">
                            {s.title}
                          </h2>
                        ) : null}
                        <MarkdownContent
                          content={s?.content}
                          idPrefix={`section-${idx}`}
                        />
                      </section>
                    );
                  })
                : null}
              <BlogFaqs faqs={blogData?.faqs} />
            </div>
          </article>

          {/* Right related — xl+ only (keeps article readable on laptop widths) */}
          <aside
            ref={relatedColumnRef}
            className="hidden xl:block relative self-start"
          >
            <div
              ref={relatedPanelRef}
              className="pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <h2 className="font-[Urania] text-[14px] font-semibold tracking-wide uppercase text-[#868989] mb-4">
                Related blogs
              </h2>
              <div className="space-y-4">
                {sidebarRelated.length ? (
                  sidebarRelated.map((b) => (
                    <button
                      key={b.id || b.slug}
                      type="button"
                      onClick={() => handleBlogClick(b)}
                      className="group flex w-full gap-3 text-left rounded-md overflow-hidden hover:bg-white/70 transition-colors p-1 -m-1"
                    >
                      <div className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-md bg-[#E1E6E4]">
                        {b.image ? (
                          <img
                            src={b.image}
                            alt={b.image_alt || b.title || "Related article"}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0 py-0.5">
                        <p className="font-[Urania] text-[12px] text-[#868989] mb-1">
                          {formatContentTypeLabel(b.type)}
                        </p>
                        <p className="font-[Urania] text-[14px] leading-[18px] text-[#132F2C] font-medium line-clamp-3 group-hover:underline underline-offset-2">
                          {b.title}
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="font-[Urania] text-[14px] text-[#868989]">
                    No related articles yet
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>

        {/* Mobile / tablet related carousel */}
        {latestWithExcerpts.length ? (
          <section className="bg-white mt-16 w-full overflow-x-hidden xl:hidden -mx-4 md:-mx-10 px-4 md:px-10">
            <div className="pt-10 pb-16 md:py-16">
              <h3 className="font-[Urania] text-[#132F2C] text-[28px] md:text-[32px] font-semibold mb-8">
                Related articles
              </h3>

              <div
                ref={relatedScrollRef}
                className="overflow-x-auto overflow-y-hidden max-w-full"
              >
                <div className="flex gap-4 md:gap-8 snap-x snap-mandatory min-w-full">
                  {latestWithExcerpts.map((b, idx) => (
                    <article
                      key={b._id}
                      data-related-card={idx === 0 ? "1" : undefined}
                      className="bg-white rounded-md overflow-hidden cursor-pointer snap-start flex-shrink-0 w-[85vw] sm:w-[70%] md:w-[calc((100%-32px)/2)] max-w-full"
                      onClick={() => handleBlogClick(b)}
                    >
                      <div className="w-full h-[180px] md:h-[200px] overflow-hidden">
                        <img
                          src={b.image}
                          alt={b.image_alt || b.title || "Related article"}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="pt-1">
                        <p className="font-[Urania] text-[14px] leading-[14px] text-[#868989] mb-2">
                          {formatContentTypeLabel(b.type)}
                          {b.formattedDate && (
                            <>
                              <span className="mx-2">•</span>
                              <span>{b.formattedDate}</span>
                            </>
                          )}
                        </p>

                        <h4 className="font-[Urania] text-[#132F2C] text-[18px] md:text-[20px] font-medium mb-2">
                          {b.title}
                        </h4>

                        <p className="font-[Urania] text-[14px] leading-[20px] text-[#868989] line-clamp-2">
                          {b.excerpt}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </section>
  );
};

export default ResourcesSection;
