import { useRef, useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";

const sections = [
  {
    id: "introduction",
    title: "Terms and Conditions",
    content: (
      <>
        <p className="mb-4">Effective Date: {new Date().getFullYear()}</p>

        <p className="mb-4">
          These Terms of Service ("Terms") govern your access to and use of the
          website and services provided by True Legacy, an initiative of True Legacy Solutions Private Limited ("Company", "We", "Us", "Our"). By accessing
          or using our Website, online tools, or Services, you ("User", "You",
          "Your") acknowledge and agree to be bound by these Terms, together
          with our Privacy Policy. If you do not agree, you must refrain from
          using the Website or Services.
        </p>
      </>
    ),
  },

  {
    id: "definitions",
    title: "Definitions",
    content: (
      <>
        <p className="mb-4">
          Unless otherwise defined herein, capitalized terms shall have the
          meaning given in the Privacy Policy. Additionally:
        </p>

        <ul className="list-disc ml-6 space-y-3">
          <li>
            <strong>“Applicable Laws”</strong> means all applicable laws,
            regulations, rules, and governmental orders in force.
          </li>
          <li>
            <strong>“Content”</strong> means any text, graphics, images, music,
            software, audio, video, works of authorship, applications, or other
            materials.
          </li>
          <li>
            <strong>“Services”</strong> includes all tools, features,
            functionalities, and content provided through the Website.
          </li>
          <li>
            <strong>“Third-Party Services”</strong> means services, content, or
            applications provided by entities other than True Legacy.
          </li>
        </ul>
      </>
    ),
  },

  {
    id: "services",
    title: "Services",
    content: (
      <>
        <p className="mb-4">
          a. The Website provides general information regarding Wills, Trusts,
          Estate Planning, Succession, and related legal matters.
        </p>

        <p className="mb-4">
          b. We may provide certain online tools, including a legal heir
          determination tool, for general informational purposes only. These
          tools do not constitute definitive legal advice, legal representation,
          or create any attorney-client relationship. For professional advice,
          you must formally engage PravasiTax/True Legacy through a separate
          written agreement.
        </p>

        <p className="mb-4">
          c. No attorney-client, fiduciary, or professional relationship arises
          merely by accessing or using the Website. A formal engagement will be
          established only upon execution of a written agreement with True Legacy Solutions Private Limited/True Legacy.
        </p>

        <p className="mb-4">
          d. We reserve the right to modify, suspend, or discontinue any part of
          the Services at any time without prior notice.
        </p>
      </>
    ),
  },

  {
    id: "responsibilities",
    title: "User Responsibilities",
    content: (
      <>
        <p className="mb-4">
          a. You must be at least 18 years old and legally competent to enter
          into binding agreements to use our Website or Services.
        </p>

        <p className="mb-4">b. You represent and warrant that:</p>

        <ul className="list-disc ml-6 space-y-2 mb-4">
          <li>
            i. All information provided is accurate, current, and complete
          </li>
          <li>ii. You have the legal capacity to agree to these Terms</li>
          <li>iii. Your use complies with all Applicable Laws</li>
        </ul>

        <p className="mb-4">
          c. You agree to use the Website and Services only for lawful purposes
          and in compliance with Applicable Laws.
        </p>

        <p className="mb-4">d. Prohibited Conduct: You shall not:</p>

        <ul className="list-disc ml-6 space-y-2">
          <li>
            i. Misuse, disrupt, or interfere with the Website or its security
            features
          </li>
          <li>
            ii. Submit false, misleading, defamatory, or harmful information
          </li>
          <li>iii. Infringe upon any intellectual property rights</li>
          <li>
            iv. Use the Website for unauthorized, fraudulent, or illegal
            purposes
          </li>
          <li>v. Attempt to gain unauthorized access to systems or networks</li>
          <li>vi. Transmit viruses, malware, or harmful code</li>
          <li>
            vii. Engage in data mining, scraping, or automated data collection
          </li>
          <li>viii. Impersonate any person or entity</li>
          <li>ix. Violate any law or regulation</li>
        </ul>
      </>
    ),
  },

  {
    id: "account",
    title: "Account",
    content: (
      <>
        <p className="mb-4">
          a. Certain Services may require you to create an account.
        </p>

        <p className="mb-4">You are responsible for:</p>

        <ul className="list-disc ml-6 space-y-2 mb-4">
          <li>i. Ensuring accuracy of submitted information</li>
          <li>ii. Maintaining confidentiality of account credentials</li>
          <li>iii. All activities under your account</li>
        </ul>

        <p className="mb-4">
          b. You must notify us immediately of unauthorized access.
        </p>

        <p className="mb-4">
          c. We may suspend or terminate accounts for violations.
        </p>
      </>
    ),
  },

  {
    id: "ip-thirdparty",
    title: "Intellectual Property & Third-Party",
    content: (
      <>
        <h4 className="font-semibold mb-2">Intellectual Property</h4>

        <p className="mb-4">
          All content, trademarks, service marks, tools, logos, copyrights, and
          materials are the exclusive property of PravasiTax/True Legacy or its
          licensors.
        </p>

        <p className="mb-4">
          Users are granted a limited, revocable, non-exclusive license for
          personal, non-commercial use only.
        </p>

        <p className="mb-4">Restrictions include:</p>

        <ul className="list-disc ml-6 space-y-2 mb-4">
          <li>i. Copying or distributing content</li>
          <li>ii. Reverse engineering or decompiling software</li>
          <li>iii. Removing proprietary notices</li>
          <li>iv. Using trademarks without permission</li>
        </ul>

        <h4 className="font-semibold mb-2">Third-Party Services</h4>

        <p className="mb-4">
          The Website may contain links to external websites. We do not endorse
          or assume responsibility for third-party content, privacy practices,
          or policies.
        </p>
      </>
    ),
  },

  {
    id: "disclaimers",
    title: "Disclaimers & Liability",
    content: (
      <>
        <h4 className="font-semibold mb-2">Disclaimers</h4>

        <p className="mb-4">
          a. The Website is provided on an "as is" and "as available" basis
          without warranties of any kind.
        </p>

        <p className="mb-4">
          b. Information provided is general guidance only and not a substitute
          for professional advice.
        </p>

        <p className="mb-4">
          c. We disclaim liability for compliance with laws of jurisdictions
          outside India.
        </p>

        <p className="mb-4">
          d. Cross-border users acknowledge responsibility for compliance with
          their local laws.
        </p>

        <p className="mb-4">
          e. We do not warrant uninterrupted, error-free, or secure operation of
          the Website.
        </p>

        <p className="mb-4">
          f. Use of tools does not create a professional relationship.
        </p>

        <h4 className="font-semibold mb-2">Limitation of Liability</h4>

        <p className="mb-4">
          To the maximum extent permitted by law, True Legacy is not liable for
          indirect, incidental, or consequential damages.
        </p>

        <p className="mb-4">
          Total liability is limited to the lesser of INR 25,000 or the amount
          paid by you in the past 12 months.
        </p>

        <p className="mb-4">
          We are not liable for delays or failures due to circumstances beyond
          reasonable control.
        </p>

        <p className="mb-4">Claims must be brought within one (1) year.</p>
      </>
    ),
  },

  {
    id: "indemnification",
    title: "Indemnification",
    content: (
      <>
        <p className="mb-4">
          You agree to defend, indemnify, and hold harmless True Legacy,
          PravasiTax, and their officers, directors, employees, and agents from
          any claims, damages, losses, or expenses arising from:
        </p>

        <ul className="list-disc ml-6 space-y-2">
          <li>a. Your use of the Website or Services</li>
          <li>b. Your violation of these Terms</li>
          <li>c. Your violation of rights of third parties</li>
          <li>d. Your violation of Applicable Laws</li>
        </ul>
      </>
    ),
  },

  {
    id: "privacy",
    title: "Privacy",
    content: (
      <>
        <p className="mb-4">
          a. Your use of the Website is governed by our Privacy Policy,
          incorporated herein by reference.
        </p>

        <p className="mb-4">
          b. We may collect, use, and disclose your information as described in
          the Privacy Policy.
        </p>

        <p className="mb-4">
          c. You consent to the transfer and processing of your data in
          accordance with our Privacy Policy.
        </p>
      </>
    ),
  },

  {
    id: "termination",
    title: "Termination",
    content: (
      <>
        <p className="mb-4">
          a. We may suspend or terminate your access immediately for:
        </p>

        <ul className="list-disc ml-6 space-y-2 mb-4">
          <li>i. Violation of these Terms</li>
          <li>ii. Suspected fraudulent or illegal activity</li>
          <li>iii. Extended inactivity</li>
          <li>iv. Business reasons</li>
        </ul>

        <p className="mb-4">
          b. You may terminate your account at any time by contacting us.
        </p>

        <p className="mb-4">c. Upon termination:</p>

        <ul className="list-disc ml-6 space-y-2">
          <li>i. Your right to use the Website ceases immediately</li>
          <li>ii. Certain provisions survive termination</li>
          <li>iii. We may retain information as required by law</li>
        </ul>
      </>
    ),
  },

  {
    id: "dispute",
    title: "Dispute Resolution",
    content: (
      <>
        <p className="mb-4">
          a. These Terms are governed by the laws of India, subject to
          applicable laws in your jurisdiction.
        </p>

        <p className="mb-4">b. Disputes will be resolved as follows:</p>

        <ul className="list-disc ml-6 space-y-2 mb-4">
          <li>i. Good-faith negotiations for 30 days</li>
          <li>
            ii. Binding arbitration under the Arbitration and Conciliation Act,
            2015
          </li>
          <li>iii. Proceedings per arbitration institution rules</li>
          <li>iv. Seat & venue: Ernakulam, Kerala, India</li>
          <li>v. Language: English</li>
          <li>vi. Single arbitrator ( INR 10 lakhs), three otherwise</li>
          <li>vii. Each party bears their own costs unless awarded</li>
        </ul>

        <p className="mb-4">
          c. You waive the right to participate in class actions or
          representative proceedings.
        </p>

        <p className="mb-4">
          d. Either party may seek injunctive relief for IP infringement or
          breach of confidentiality.
        </p>
      </>
    ),
  },

  {
    id: "compliance",
    title: "Compliance",
    content: (
      <>
        <p className="mb-4">
          a. You will comply with all export and import laws.
        </p>

        <p className="mb-4">
          b. We may conduct identity verification as required by law.
        </p>

        <p className="mb-4">
          c. You confirm you are not subject to sanctions or export
          restrictions.
        </p>
      </>
    ),
  },

  {
    id: "accessibility",
    title: "Accessibility",
    content: (
      <>
        <p className="mb-4">
          We strive to make our Website accessible to users with disabilities
          and will make reasonable efforts to improve accessibility where
          feasible.
        </p>
      </>
    ),
  },

  {
    id: "updates",
    title: "Updates",
    content: (
      <>
        <p className="mb-4">
          a. We may amend these Terms at any time by posting updated versions.
        </p>

        <p className="mb-4">
          b. Material changes will be notified through the Website or email.
        </p>

        <p className="mb-4">
          c. Amendments take effect 30 days after posting unless required
          earlier by law.
        </p>

        <p className="mb-4">
          d. Continued use after amendments constitutes acceptance.
        </p>
      </>
    ),
  },

  {
    id: "miscellaneous",
    title: "Miscellaneous",
    content: (
      <>
        <p className="mb-4">
          a. If any provision is invalid, the remainder stays effective.
        </p>

        <p className="mb-4">b. Failure to enforce any right is not a waiver.</p>

        <p className="mb-4">
          c. We may assign rights without notice; you may not without consent.
        </p>

        <p className="mb-4">
          d. These Terms and the Privacy Policy form the entire agreement.
        </p>

        <p className="mb-4">
          e. Provisions that should survive termination remain in effect.
        </p>

        <p className="mb-4">f. Headings do not affect interpretation.</p>

        <p className="mb-4">
          g. In case of translation, the English version prevails.
        </p>
      </>
    ),
  },

  {
    id: "contact",
    title: "Contact",
    content: (
      <>
        <p className="mb-4">
          For questions about these Terms, please contact us at:
        </p>

        <p className="mb-2 font-semibold">
          True Legacy (True Legacy Solutions Private Limited)
        </p>

        <p className="mb-2">
          Email:{" "}
          <a
            href="mailto:info@truelegacy.in"
            className="text-blue-600 underline"
          >
            info@truelegacy.in
          </a>
        </p>

        <p className="mb-2">
          Address: Second floor, Imperial Amity, Chalikkavattom, NH Bypass,
          Vytilla, Kochi – 682019, Kerala, India
        </p>
      </>
    ),
  },

  {
    id: "acceptance",
    title: "Acceptance",
    content: (
      <>
        <p className="mb-4">
          By accessing the Website, creating an account, using any Services, or
          clicking "I Agree," you acknowledge that you have read, understood,
          and agree to be bound by these Terms of Service and our Privacy
          Policy.
        </p>
      </>
    ),
  },
];

const Section = ({ id, title, content, onInView, scrollRef }) => {
  const [ref, inView] = useInView({ threshold: 0.35 });

  useEffect(() => {
    if (inView) onInView(id);
  }, [inView]);

  return (
    <section
      id={id}
      ref={(el) => {
        ref(el);
        scrollRef.current[id] = el;
      }}
      className="py-10 border-b border-gray-200"
    >
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="text-gray-700 leading-relaxed">{content}</div>
    </section>
  );
};

const TermsOfService = () => {
  const [active, setActive] = useState("introduction");
  const scrollRef = useRef({});

  const handleClick = (id) => {
    const el = scrollRef.current[id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
  };

  return (
    <div className="bg-white px-4 md:px-16 pt-28 md:pt-32 pb-10 md:pb-16">
      <div className="max-w-[1300px] mx-auto flex flex-col md:flex-row gap-12">
        <aside className="w-full md:w-1/4">
          <div className="md:sticky md:top-50">
            <ul className="space-y-1">
              {sections.map((sec) => {
                const isActive = sec.id === active;
                return (
                  <li key={sec.id}>
                    <button
                      onClick={() => handleClick(sec.id)}
                      className={`w-full text-left px-3 py-2 rounded-md transition ${
                        isActive
                          ? "bg-gray-200 text-primary border-l-4 border-primary"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {sec.title}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        <main className="w-full md:w-3/4">
          <h1 className="text-3xl font-bold text-left mb-4">
            Terms and Conditions for True Legacy
          </h1>
          <p className="mb-10 text-sm text-gray-500">
            Last Updated:{" "}
            <span className="font-medium">{new Date().getFullYear()}</span>
          </p>
          {sections.map((sec) => (
            <Section
              key={sec.id}
              id={sec.id}
              title={sec.title}
              content={sec.content}
              onInView={setActive}
              scrollRef={scrollRef}
            />
          ))}
        </main>
      </div>
    </div>
  );
};

export default TermsOfService;
