import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getBlogs } from "../../api/blogsApi";

const API_BASE = (
  import.meta.env.VITE_APP_API_URL || "https://api.truelegacy.in"
).replace(/\/$/, "");

const CARD_GAP = 16;
const AUTOPLAY_MS = 4500;

const extractBlogList = (res) => {
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res?.blogs)) return res.blogs;
  if (Array.isArray(res?.blogs?.data)) return res.blogs.data;
  return [];
};

const resolveBlogImageUrl = (blog) => {
  const raw =
    blog?.image ||
    blog?.imageUrl ||
    blog?.coverImage ||
    blog?.thumbnail ||
    blog?.featuredImage ||
    blog?.cover_image ||
    "";
  const trimmed = String(raw).trim();
  if (!trimmed) return "";

  try {
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    if (trimmed.startsWith("//")) return `https:${trimmed}`;
    if (/^(www\.)?truelegacy\.in/i.test(trimmed)) {
      return `https://${trimmed.replace(/^\/\//, "")}`;
    }

    const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    return new URL(path, `${API_BASE}/`).href;
  } catch {
    return "";
  }
};

const formatBlogDate = (createdAt) => {
  if (!createdAt) return "";
  return new Date(createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const BlogCardImage = ({ src, title, date }) => {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <>
      {showImage ? (
        <img
          src={src}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#1a3d38] via-[#213d3a] to-[#132F2C]"
          aria-hidden="true"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/25 to-black/75 transition-opacity group-hover:from-black/70 group-hover:to-black/85" />
      <div className="relative z-10 flex h-full flex-col justify-between p-5 md:p-6">
        <h3 className="font-[Urania] font-bold text-[18px] md:text-[20px] leading-[24px] md:leading-[28px] text-white line-clamp-4 group-hover:underline underline-offset-2">
          {title}
        </h3>
        <p className="font-[Urania] text-[13px] md:text-[14px] leading-[18px] text-white/90">
     {date}
        </p>
      </div>
    </>
  );
};

const LatestBlogsCarousel = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const scrollRef = useRef(null);
  const scrollDirRef = useRef(1);
  const isPausedRef = useRef(false);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let active = true;

    getBlogs({ status: "published", type: "blog", limit: 12, page: 1 })
      .then((res) => {
        if (!active) return;
        const list = extractBlogList(res)
          .filter((b) => !b.type || b.type === "blog")
          .sort(
            (a, b) =>
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime()
          )
          .slice(0, 8)
          .map((b) => ({
            id: b._id,
            slug: b.slug,
            title: b.title,
            type: b.type,
            image: resolveBlogImageUrl(b),
            date: formatBlogDate(b.createdAt),
          }));
        setBlogs(list);
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
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || loading || blogs.length <= 1) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion) return;

    const tick = () => {
      if (isPausedRef.current || !isVisible) return;

      const first = el.querySelector("[data-blog-card='1']");
      if (!first) return;

      const cardWidth = first.getBoundingClientRect().width;
      const step = cardWidth + CARD_GAP;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;

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

    const id = window.setInterval(tick, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [blogs.length, loading, isVisible]);

  const handleArticleClick = (slug) => {
    if (!slug) return;
    navigate(`/resources/${slug}`);
    window.scrollTo(0, 0);
  };

  const pauseAutoplay = () => {
    isPausedRef.current = true;
  };

  const resumeAutoplay = () => {
    isPausedRef.current = false;
  };

  if (!loading && blogs.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className={`w-full overflow-x-hidden bg-[#F6FFFF] py-14 md:py-16 lg:py-20 latest-blogs-section ${
        isVisible ? "latest-blogs-section-visible" : ""
      }`}
    >
      <div className=" mx-auto px-4 md:px-8 lg:px-12 mb-8 md:mb-10">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-[Urania] font-bold text-[#132F2C] text-[32px] leading-[36px] md:text-[42px] md:leading-[49px] latest-blogs-heading">
            Our Latest Blogs & Articles
          </h2>
          <Link
            to="/resources"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#132F2C] px-5 py-2.5 md:px-8 md:py-3 font-[Urania] text-[14px] md:text-[16px] font-medium text-white transition-colors hover:bg-[#0D241E]"
          >
            View All
          </Link>
        </div>
      </div>

      <div className="w-full pl-4 md:pl-8 lg:pl-12">
        {loading ? (
          <div className="flex w-full gap-4 overflow-hidden">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="latest-blogs-card aspect-[335/400] w-[min(335px,88vw)] shrink-0 rounded-lg bg-[#E1E6E4] animate-pulse sm:h-[400px] sm:w-[335px] sm:aspect-auto"
              />
            ))}
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex w-full gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            onMouseEnter={pauseAutoplay}
            onMouseLeave={resumeAutoplay}
            onTouchStart={pauseAutoplay}
            onTouchEnd={resumeAutoplay}
          >
            {blogs.map((blog, index) => (
              <article
                key={blog.id}
                data-blog-card={index === 0 ? "1" : undefined}
                role="button"
                tabIndex={0}
                onClick={() => handleArticleClick(blog.slug)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleArticleClick(blog.slug);
                  }
                }}
                className="group relative aspect-[335/400] w-[min(335px,88vw)] shrink-0 snap-start cursor-pointer overflow-hidden rounded-lg latest-blogs-card sm:h-[400px] sm:w-[335px] sm:aspect-auto"
              >
                <BlogCardImage
                  src={blog.image}
                  title={blog.title}
                  date={blog.date}
                />
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestBlogsCarousel;
