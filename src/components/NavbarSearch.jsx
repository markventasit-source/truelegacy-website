import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBlogs, formatContentTypeLabel } from "../api/blogsApi";

/* ─── tiny debounce hook ───────────────────────────────────────────── */
function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debouncedValue;
}

/* ─── search icon SVG (no external dep) ────────────────────────────── */
const SearchIcon = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx={11} cy={11} r={8} />
    <line x1={21} y1={21} x2={16.65} y2={16.65} />
  </svg>
);

/* ─── close (×) icon ────────────────────────────────────────────────── */
const CloseIcon = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <line x1={18} y1={6} x2={6} y2={18} />
    <line x1={6} y1={6} x2={18} y2={18} />
  </svg>
);

/* ─── type badge colours ────────────────────────────────────────────── */
const TYPE_COLOURS = {
  Blog: "bg-emerald-100 text-emerald-800",
  Article: "bg-blue-100 text-blue-800",
  Event: "bg-amber-100 text-amber-800",
  News: "bg-rose-100 text-rose-800",
};

/* ─── highlight matched fragment ────────────────────────────────────── */
function Highlight({ text = "", query = "" }) {
  if (!query.trim()) return <>{text}</>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-[#F4D57E]/60 text-inherit rounded-[2px] not-italic">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

/* ─── main component ────────────────────────────────────────────────── */
const NavbarSearch = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [allBlogs, setAllBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const debouncedQuery = useDebounce(query, 250);

  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  /* Fetch all blogs once when the search panel opens */
  useEffect(() => {
    if (!isOpen || fetched) return;
    let active = true;
    setLoading(true);
    getAllBlogs({ status: "published", limit: 500 })
      .then((res) => {
        if (!active) return;
        const list = Array.isArray(res?.data) ? res.data : [];
        setAllBlogs(
          list.map((b) => ({
            id: b._id,
            slug: b.slug,
            title: b.title || "",
            type: formatContentTypeLabel(b.type),
            desc: b.meta_description || b.description || "",
            image: b.image || "",
            image_alt: b.image_alt || b.title || "",
          }))
        );
        setFetched(true);
      })
      .catch(() => {
        if (!active) return;
        setAllBlogs([]);
        setFetched(true);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => { active = false; };
  }, [isOpen, fetched]);

  /* Focus input when panel opens */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  /* Close on outside click */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        close();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  /* Close on Escape */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
  }, []);

  /* Filter results */
  const results = debouncedQuery.trim().length < 2
    ? []
    : allBlogs
        .filter((b) => {
          const q = debouncedQuery.toLowerCase();
          return (
            b.title.toLowerCase().includes(q) ||
            b.desc.toLowerCase().includes(q)
          );
        })
        .slice(0, 8);

  const handleResultClick = (slug) => {
    if (!slug) return;
    close();
    navigate(`/resources/${slug}`);
    window.scrollTo(0, 0);
  };

  /* "See all results" navigates to the resources listing filtered by q */
  const handleSeeAll = () => {
    if (!debouncedQuery.trim()) return;
    close();
    navigate(`/resources?q=${encodeURIComponent(debouncedQuery.trim())}`);
    window.scrollTo(0, 0);
  };

  return (
    <div ref={wrapperRef} className="relative flex items-center">
      {/* Search icon button (always visible) */}
      {!isOpen && (
        <button
          aria-label="Open search"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center justify-center w-9 h-9 rounded-full text-[#132F2C] hover:bg-[#132F2C]/8 transition-colors duration-150 cursor-pointer"
        >
          <SearchIcon className="w-5 h-5" />
        </button>
      )}

      {/* Expanded search bar */}
      {isOpen && (
        <div className="flex items-center gap-2 bg-white border border-[#132F2C]/20 rounded-full px-3 py-1.5 shadow-sm"
          style={{ width: "260px" }}
        >
          <SearchIcon className="w-4 h-4 text-[#132F2C]/50 flex-none" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSeeAll(); }}
            placeholder="Search blogs & resources…"
            className="flex-1 bg-transparent outline-none text-[13px] text-[#132F2C] placeholder:text-[#132F2C]/40"
            style={{ fontFamily: "Urania" }}
            aria-label="Search"
            autoComplete="off"
          />
          <button
            aria-label="Close search"
            onClick={close}
            className="flex-none text-[#132F2C]/40 hover:text-[#132F2C] transition-colors cursor-pointer"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Results dropdown */}
      {isOpen && debouncedQuery.trim().length >= 2 && (
        <div
          className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-[0_4px_32px_rgba(0,0,0,0.12)] border border-black/5 overflow-hidden z-50"
          style={{ width: "360px" }}
          role="listbox"
          aria-label="Search results"
        >
          {loading && (
            <div className="px-4 py-6 text-center text-sm text-[#132F2C]/50" style={{ fontFamily: "Urania" }}>
              Loading…
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-[#132F2C]/50" style={{ fontFamily: "Urania" }}>
              No results for "{debouncedQuery}"
            </div>
          )}

          {!loading && results.length > 0 && (
            <>
              <ul>
                {results.map((item) => (
                  <li key={item.id}>
                    <button
                      role="option"
                      onClick={() => handleResultClick(item.slug)}
                      className="w-full flex items-start gap-3 px-4 py-3 hover:bg-[#132F2C]/5 transition-colors duration-100 text-left cursor-pointer group"
                    >
                      {/* Thumbnail */}
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.image_alt}
                          className="w-12 h-12 rounded-lg object-cover flex-none"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-[#132F2C]/10 flex-none flex items-center justify-center">
                          <SearchIcon className="w-5 h-5 text-[#132F2C]/30" />
                        </div>
                      )}
                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span
                            className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${TYPE_COLOURS[item.type] || TYPE_COLOURS.Blog}`}
                            style={{ fontFamily: "Urania" }}
                          >
                            {item.type}
                          </span>
                        </div>
                        <p
                          className="text-[13px] font-medium text-[#132F2C] leading-snug line-clamp-2 group-hover:text-emerald-800 transition-colors"
                          style={{ fontFamily: "Urania" }}
                        >
                          <Highlight text={item.title} query={debouncedQuery} />
                        </p>
                        {item.desc && (
                          <p className="text-[11px] text-[#132F2C]/50 mt-0.5 line-clamp-1" style={{ fontFamily: "Urania" }}>
                            <Highlight text={item.desc} query={debouncedQuery} />
                          </p>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>

              {/* See all results footer */}
              <div className="border-t border-black/5">
                <button
                  onClick={handleSeeAll}
                  className="w-full px-4 py-2.5 text-[12px] text-emerald-800 font-medium hover:bg-emerald-50 transition-colors cursor-pointer"
                  style={{ fontFamily: "Urania" }}
                >
                  See all results for "{debouncedQuery}" →
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NavbarSearch;
