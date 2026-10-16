import { SiOpenai, SiClaude, SiGoogle } from "react-icons/si";

const CHATGPT_BASE = "https://chatgpt.com/";
const CLAUDE_BASE = "https://claude.ai/new";

const buildAiChatUrl = (base, prompt, pageUrl) =>
  `${base}?q=${encodeURIComponent(`${prompt}\n\n${pageUrl}`)}`;

const buildGoogleSearchUrl = (pageUrl) =>
  `https://www.google.com/search?q=${encodeURIComponent(`site:${pageUrl}`)}`;

const items = [
  { key: "chatgpt", label: "Ask ChatGPT", base: CHATGPT_BASE, Icon: SiOpenai },
  { key: "claude", label: "Ask Claude", base: CLAUDE_BASE, Icon: SiClaude },
  { key: "google", label: "Search on Google", base: null, Icon: SiGoogle },
];

const PILL_CLASSES = {
  light:
    "border-[#D9D9D9] bg-white hover:border-[#F4D57E] hover:bg-[#F4D57E]",
  dark: "border-white/40 bg-white/10 text-white backdrop-blur-sm hover:border-[#F4D57E] hover:bg-white/15",
};

/** Brand icon color — ChatGPT is white on the dark variant so it stays visible. */
const ICON_CLASSES = {
  light: { chatgpt: "text-[#412991]", claude: "text-[#D97757]", google: "text-[#4285F4]" },
  dark: { chatgpt: "text-white", claude: "text-[#D97757]", google: "text-[#4285F4]" },
};

/**
 * AskAiPills — circular icon-only buttons that open ChatGPT / Claude / Google
 * with the given prompt + page URL pre-filled.
 *
 * @param {string}  prompt  Text sent to ChatGPT / Claude.
 * @param {string}  pageUrl Absolute page URL included with the prompt (and used for the site: Google search).
 * @param {"light"|"dark"} variant light = white borders for light pages; dark = glassy outline for dark heroes.
 * @param {string}  [label] Optional lead-in text, e.g. "Discuss this article with:".
 */
const AskAiPills = ({
  prompt,
  pageUrl,
  variant = "light",
  label,
  className = "",
}) => {
  return (
    <div className={`flex flex-wrap items-center gap-2.5 ${className}`}>
      {label ? (
        <span
          className={`mr-1 font-[Urania] text-[13px] md:text-[14px] ${
            variant === "dark" ? "text-white/80" : "text-[#868989]"
          }`}
        >
          {label}
        </span>
      ) : null}
      {items.map(({ key, label: text, base, Icon }) => (
        <a
          key={key}
          href={
            base
              ? buildAiChatUrl(base, prompt, pageUrl)
              : buildGoogleSearchUrl(pageUrl)
          }
          target="_blank"
          rel="noopener noreferrer"
          title={text}
          aria-label={text}
          className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors ${PILL_CLASSES[variant]}`}
        >
          <Icon className={`text-[16px] ${ICON_CLASSES[variant][key]}`} />
        </a>
      ))}
    </div>
  );
};

export default AskAiPills;
