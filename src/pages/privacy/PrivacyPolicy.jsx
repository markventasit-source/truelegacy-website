import { useState, useRef, useEffect } from "react";
import { useInView } from "react-intersection-observer";

const sections = [
  {
    id: "privacy-policy",
    title: "Privacy Policy",
    content: (
      <>
        <p className="mb-4">
          True Legacy (“we”, “our”, or “us”) together with its parent company,
          subsidiaries and affiliates are committed to safeguarding the privacy
          and confidentiality of our clients and visitors (“You”, “Your”) who
          accesses or uses our Website or engages our Services.
        </p>

        <p className="mb-4">
          We understand that information relating to Wills, Succession, Estate
          Planning and other related legal matters is highly sensitive. This
          Privacy Policy outlines how we collect, use, store and protect your
          personal information when you access or use our website, online tools
          and related services in compliance with applicable data protection
          laws.
        </p>

        <p className="mb-4">
          This Privacy Policy should be read in conjunction with our Terms of
          Service and applies to all users of our website and services.
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
          For the purpose of this Privacy Policy, the following terms shall have
          the meanings assigned below:
        </p>

        <ul className="list-disc ml-6 space-y-3">
          <li>
            <strong>a. “Company”, “We”, “Us”, “Our”</strong> – refers to
            True Legacy Solutions Private Limited operating through its venture True
            Legacy, its partners, employees, authorized representatives, and
            affiliates.
          </li>

          <li>
            <strong>b. “Website”</strong> – means the official online platform
            of True Legacy, accessible at{" "}
            <span className="break-words">truelegacy.in</span>, which
            provides information about our professional services in Wills,
            Trusts, Estate planning, Succession advisory, and related legal
            matters, and through which users may contact us to request
            consultations or further information.
          </li>

          <li>
            <strong>c. “User,” “You,” “Your”</strong> – means any person who
            accesses, browses, or interacts with the Website, whether as a
            client, prospective client, or visitor.
          </li>

          <li>
            <strong>d. “Services”</strong> – means the professional services
            offered by True Legacy in relation to wills, trusts, estate
            planning, succession planning, and related legal advisory work,
            whether provided online through direct communication or offline
            through in-person consultation.
          </li>

          <li>
            <strong>e. “Personal Data” or “Personal Information”</strong> –
            means any information that identifies or can be used to identify
            You, including but not limited to Your name, contact details, email
            address, city and state of residence, and any other information You
            choose to share with us for the purposes of obtaining our Services.
          </li>

          <li>
            <strong>f. “Sensitive Data”</strong> – shall include information
            relating to religious beliefs, marital status, family details,
            children, gender, and any other information that is specially
            protected under Applicable Laws.
          </li>

          <li>
            <strong>g. “Applicable Laws”</strong> – means all applicable laws,
            rules, regulations, and statutory instruments in force in India,
            including the Information Technology Act, 2000, and the Digital
            Personal Data Protection Act, 2023 (“DPDPA”), as may be amended from
            time to time, and, where applicable, foreign data protection laws
            such as the General Data Protection Regulation (EU) 2016/679
            (“GDPR”). Applicable Laws shall also include relevant data
            protection laws applicable to Non-Resident Indians (NRIs) and users
            accessing the Website or App from outside India, including but not
            limited to the UAE Federal Personal Data Protection Law (Federal
            Decree Law No. 45 of 2021) and Kingdom of Saudi Arabia Personal Data
            Protection Law (Royal Decree No. M/19 of 2021), and other
            international data protection statutes as applicable.
          </li>

          <li>
            <strong>h. “Cookies”</strong> – means small text files placed on
            Your device when You visit certain parts of the Website, used to
            store information about Your browsing activity and preferences.
          </li>
        </ul>
      </>
    ),
  },

  {
    id: "applicability",
    title: "Applicability",
    content: (
      <>
        <p className="mb-4">This Privacy Policy applies when:</p>

        <ul className="list-disc ml-6 mb-4 space-y-2">
          <li>You access or browse our Website;</li>
          <li>
            You submit an enquiry or request a consultation via the Website,
            email or telephone;
          </li>
          <li>
            You share any documents or personal data with us in connection with
            our Services.
          </li>
        </ul>

        <p className="mb-4">
          The terms of this Privacy Policy are applicable to all individuals
          including but not limited to our employees, board members, directors
          and other third-parties who have access to Your personal information
          collected or processed through this Website. For international users,
          local data protection laws may additionally apply within their
          jurisdiction.
        </p>

        <p className="mb-4">
          This Privacy Policy does not apply to third-party websites linked from
          the Website. We are not responsible for their privacy practices or
          content.
        </p>
      </>
    ),
  },

  {
    id: "collection",
    title: "Information We Collect",
    content: (
      <>
        <h4 className="font-semibold mb-2">Information You Provide</h4>

        <p className="mb-2">
          When You contact us through the Website, email, or phone, You may
          provide the following details:
        </p>

        <ul className="list-disc ml-6 mb-4 space-y-2">
          <li>a. Personal details including Name, Gender, Religion</li>
          <li>b. Email Address</li>
          <li>c. Contact Number</li>
          <li>d. City and State of Residence</li>
          <li>e. Nature of Your enquiry or legal requirement</li>
          <li>
            f. Any documents or details voluntarily shared for consultation
            purposes
          </li>
        </ul>

        <h4 className="font-semibold mb-2">Information Collected Automatically</h4>

        <p className="mb-2">
          When You visit the Website, We may automatically collect limited
          technical data, including:
        </p>

        <ul className="list-disc ml-6 mb-4 space-y-2">
          <li>a. IP address</li>
          <li>b. Browser type and device details</li>
          <li>c. Pages visited and time spent on the Website</li>
          <li>d. Cookie data (see Section on Cookies)</li>
        </ul>

        <p className="mb-4">
          We do not use automated decision-making or profiling that produces
          legal or similarly significant effects on individuals.
        </p>

        <h4 className="font-semibold mb-2">Sensitive Data</h4>

        <p className="mb-4">
          In connection with our online succession tool, we may collect
          sensitive personal information such as your gender, religion, marital
          status (including whether you are married under the Special Marriage
          Act), details of spouse, children (including their gender), and
          parents, solely for the limited purpose of generating legal heir and
          succession plans. We obtain your explicit consent prior to collecting
          or processing this information. As this is an automated process,
          please note the results are not definitive legal advice but a general
          guide to legal succession under relevant Indian laws.
        </p>

        <p className="mb-4">
          You are responsible for providing accurate and truthful personal
          information, including details of your nationality, residency, and
          family structure, which are essential for correct legal heir
          determination and compliance with applicable laws.
        </p>

        <p className="mb-4">
          If you provide personal information about minors, you affirm that you
          have the legal right to do so and understand this will be handled with
          additional safeguards as required under Applicable Laws.
        </p>

        <p className="mb-4">
          We strive to limit the collection of personal data to what is strictly
          necessary for the stated purpose.
        </p>
      </>
    ),
  },

  {
    id: "purpose",
    title: "Purpose and Lawful Basis of Processing",
    content: (
      <>
        <p className="mb-4">We process Your Personal Data solely for the purposes of:</p>

        <ul className="list-disc ml-6 mb-4 space-y-2">
          <li>a. Responding to Your enquiries and scheduling consultations;</li>
          <li>b. Providing legal advice and other requested Services;</li>
          <li>
            c. Communicating updates, confirmations, and service-related
            information;
          </li>
          <li>d. Complying with legal and regulatory obligations; and</li>
          <li>e. Improving the Website and our Services.</li>
        </ul>
      </>
    ),
  },

  {
    id: "withdrawal",
    title: "Consequence of Withdrawal",
    content: (
      <>
        <p className="mb-4">
          Withdrawal of consent may result in our inability to provide certain
          services or continue engagement, where such personal data is essential
          for service delivery or legal compliance.
        </p>
      </>
    ),
  },

  {
    id: "data-processing",
    title: "Data Processing",
    content: (
      <>
        <p className="mb-4">
          Personal data and sensitive personal information provided for the
          purpose of using the legal heir tool are not stored, retained, or used
          by us after the session ends, unless you choose to engage our services
          or explicitly request that we retain such information.
        </p>

        <p className="mb-4">
          We process Personal Data only on the basis of free, specific, informed
          and unambiguous consent or where such processing is necessary for the
          performance of a lawful obligation or for purposes permitted under the
          Digital Personal Data Protection Act, 2023.
        </p>

        <p className="mb-4">
          We do not process Your Personal Data for unsolicited marketing without
          Your consent. You have the right to withdraw this consent at any time
          by contacting us.
        </p>
      </>
    ),
  },

  {
    id: "confidentiality",
    title: "Confidentiality and Disclosure",
    content: (
      <>
        <p className="mb-4">
          We treat all information shared with us as strictly confidential.
          Disclosure will only occur:
        </p>

        <ul className="list-disc ml-6 mb-4 space-y-2">
          <li>a. With Your explicit written consent;</li>
          <li>
            b. Where required by Applicable Laws, court order, or legal process;
          </li>
          <li>
            c. To authorised personnel or service providers bound by
            confidentiality obligations, and only to the extent necessary for
            providing the Services.
          </li>
          <li>
            d. Where your personal data is stored or processed outside India, we
            ensure adequate safeguards in line with Applicable Laws.
          </li>
          <li>
            e. Cross-border transfer of personal data shall be undertaken in
            accordance with restrictions and conditions prescribed by the
            Central Government under Applicable Laws.
          </li>
        </ul>

        <p className="mb-4">
          We do not disclose Personal Data to government authorities except
          where required under Applicable Laws and only after due verification
          of the lawful request.
        </p>
      </>
    ),
  },

  {
    id: "retention",
    title: "Data Retention and Deletion Policy",
    content: (
      <>
        <p className="mb-4">
          We retain personal data only for as long as necessary to fulfil the
          purposes for which it was collected or as required by law. Upon
          expiration of the retention period, or upon your verified request,
          your personal data shall be securely deleted, anonymized, or destroyed
          in accordance with our data disposal protocols.
        </p>

        <p className="mb-4">
          We implement reasonable administrative, technical, and physical
          safeguards to protect Your Personal Data from unauthorized access,
          loss, misuse, alteration, or disclosure. However, no transmission or
          storage method is completely secure, and We cannot guarantee absolute
          security.
        </p>
      </>
    ),
  },

  {
    id: "cookies",
    title: "Cookies",
    content: (
      <>
        <p className="mb-4">
          The Website may use cookies and similar technologies to improve
          functionality, personalize your experience, and analyze usage across
          different geographies, including India, UAE, and Saudi Arabia. You can
          manage or disable cookies via your browser settings, though some
          features may not function properly without them.
        </p>
      </>
    ),
  },

  {
    id: "website-disclaimer",
    title: "Website Content Accuracy and Disclaimer",
    content: (
      <>
        <p className="mb-4">
          While we endeavour to ensure that all information made available on
          the Website is accurate, current, and reliable, the Website content is
          provided for general informational purposes only.
        </p>

        <p className="mb-4">
          True Legacy reserves the right to modify, update, correct, or remove
          any content on the Website at any time and without prior notice.
          However, we do not warrant or guarantee the accuracy, completeness,
          reliability, suitability, or timeliness of any information published
          on the Website.
        </p>

        <p className="mb-4">
          Information made available on the Website does not constitute legal
          advice and should not be relied upon as a substitute for professional
          consultation tailored to specific facts and circumstances.
        </p>
      </>
    ),
  },

  {
    id: "website-availability",
    title: "Website Availability and Technical Limitations",
    content: (
      <>
        <p className="mb-4">You acknowledge and accept that:</p>

        <ul className="list-disc ml-6 mb-4 space-y-2">
          <li>
            a. it is not technically feasible to provide uninterrupted,
            error-free access to the Website at all times;
          </li>
          <li>
            b. temporary disruptions, delays, or unavailability of the Website
            may occur due to maintenance, system upgrades, technical faults, or
            factors beyond our reasonable control; and
          </li>
          <li>
            c. the functioning of the Website may be affected by external
            systems, networks, internet service providers, or telecommunications
            infrastructure.
          </li>
        </ul>

        <p className="mb-4">
          True Legacy may, at its sole discretion, temporarily or permanently
          modify, suspend, restrict, or discontinue all or part of the Website
          for maintenance, improvement, security, or operational reasons, without
          liability.
        </p>
      </>
    ),
  },

  {
    id: "limitation-liability",
    title: "Limitation of Liability",
    content: (
      <>
        <p className="mb-4">
          The Website and all materials contained therein are provided on an “as
          is” and “as available” basis, without warranties of any kind, whether
          express or implied, including but not limited to warranties of
          merchantability, fitness for a particular purpose, non-infringement,
          or availability.
        </p>

        <p className="mb-4">
          To the fullest extent permitted by Applicable Laws, True Legacy shall
          not be liable for:
        </p>

        <ul className="list-disc ml-6 mb-4 space-y-2">
          <li>
            any interruption, suspension, unavailability, or malfunction of the
            Website;
          </li>
          <li>any loss, corruption, or damage to data;</li>
          <li>
            any viruses, malware, or other harmful technological elements
            arising from use of or access to the Website or linked websites;
          </li>
          <li>any errors, omissions, or inaccuracies in Website content;</li>
          <li>
            any unauthorised access, misuse, or alteration of information by
            third parties; or
          </li>
          <li>
            any direct, indirect, incidental, consequential, special, or
            economic loss, including loss of profits, business, goodwill, or
            data, arising from access to or use of the Website or reliance on
            Website content.
          </li>
        </ul>

        <p className="mb-4">
          Nothing in this clause shall exclude liability that cannot be excluded
          under Applicable Laws.
        </p>
      </>
    ),
  },

  {
    id: "intellectual-property",
    title: "Intellectual Property Rights",
    content: (
      <>
        <p className="mb-4">
          All content, materials, databases, text, graphics, logos, trademarks,
          service marks, domain names, designs, photographs, videos, software,
          and overall Website structure are owned by or licensed to True Legacy Solutions Private Limited
          or its affiliates and are protected under
          applicable intellectual property laws.
        </p>

        <p className="mb-4">
          No licence or right is granted to users except the limited right to
          access and view the Website for personal, non-commercial use.
        </p>

        <p className="mb-4">
          Reproduction, distribution, modification, transmission, storage, or
          commercial exploitation of any Website content, in whole or in part,
          without prior written authorisation, is strictly prohibited. Where
          limited copying is permitted for personal use, proper attribution to
          True Legacy must be maintained.
        </p>
      </>
    ),
  },

  {
    id: "tool-results",
    title: "Results Generated by the Online Succession Tool",
    content: (
      <>
        <p className="mb-4">
          The results generated by the online succession or legal heir
          determination tool available on the Website are based on information
          provided by you and predefined legal assumptions embedded within the
          tool.
        </p>

        <p className="mb-4">
          While reasonable care is taken in designing and maintaining the tool,
          the outputs generated may contain inadvertent inaccuracies, including
          but not limited to computational, typographical, logical, or technical
          errors, or may be affected by incomplete, incorrect, or inconsistent
          information provided by the user.
        </p>

        <p className="mb-4">
          Accordingly, the results produced by the tool are indicative in nature
          and intended solely as a general informational aid. They do not
          constitute final or binding legal advice, nor should they be relied
          upon as a substitute for independent professional consultation or
          verification.
        </p>

        <p className="mb-4">
          True Legacy expressly disclaims any liability arising from reliance on
          such results, to the extent permitted under Applicable Laws, and users
          are advised to seek formal legal review before acting upon or
          implementing any succession, estate, or heirship arrangement based on
          the tool’s output.
        </p>
      </>
    ),
  },

  {
    id: "rights",
    title: "Your Rights",
    content: (
      <>
        <p className="mb-4">Subject to Applicable Laws, You may have the right to:</p>

        <ul className="list-disc ml-6 mb-4 space-y-2">
          <li>a. Access the Personal Data We hold about You;</li>
          <li>b. Request correction or deletion of Your Personal Data;</li>
          <li>c. Withdraw consent for processing; and</li>
          <li>d. Restrict or object to certain processing activities.</li>
        </ul>

        <p className="mb-4">
          For users who are NRIs or who reside outside India, you may have
          additional rights under the data protection laws of your country of
          residence. These include rights to access, correct, erase, restrict,
          object to processing, or data portability as applicable. You may
          withdraw your consent at any time, subject to legal or contractual
          restrictions. Requests to exercise these rights should be sent to us
          via the contact details in Section 10.
        </p>
      </>
    ),
  },

  {
    id: "security",
    title: "Security Measures",
    content: (
      <>
        <p className="mb-4">
          We implement reasonable technical and organizational safeguards for
          the protection of Your Personal Data including encryption, restricted
          access, and secure servers. While we strive for robust protection, no
          electronic transmission or storage system is entirely secure. In case
          of a data breach, we will notify affected users and competent
          authorities in accordance with Applicable Laws.
        </p>
      </>
    ),
  },

  {
    id: "contact",
    title: "Contact Information",
    content: (
      <>
        <p className="mb-4">
          For questions, grievances or requests related to your privacy rights
          and concerns, please contact our Grievance Redressal Officer at{" "}
          <a
            href="mailto:abhirami@truelegacy.in"
            className="text-blue-600 underline"
          >
            abhirami@truelegacy.in
          </a>{" "}
          or{" "}
          <a
            href="mailto:info@truelegacy.in"
            className="text-blue-600 underline"
          >
            info@truelegacy.in
          </a>
          .
        </p>
      </>
    ),
  },

  {
    id: "children",
    title: "Children’s Data",
    content: (
      <>
        <p className="mb-4">
          We do not knowingly collect personal data from children below the age
          of 18 years without verifiable parental consent and We do not
          undertake tracking, behavioural monitoring, or targeted processing of
          children’s data. If you believe that a child has provided us with
          personal data without parental consent, please contact us, and we will
          take steps to delete such information.
        </p>
      </>
    ),
  },

  {
    id: "governing-law",
    title: "Governing Law",
    content: (
      <>
        <p className="mb-4">
          This Privacy Policy shall be governed by and construed in accordance
          with the laws of India, without regard to its conflict of law and
          principles.
        </p>

        <p className="mb-4">
          Any dispute, controversy, or claim arising out of or relating to this
          Privacy Policy, including any question regarding its existence,
          validity, interpretation, or termination, shall be resolved in the
          following manner:
        </p>

        <p className="mb-4">
          <strong>Amicable Resolution:</strong> The parties shall first attempt
          to resolve the dispute amicably through good faith negotiations within
          thirty (30) days of written notice of the dispute.
        </p>

        <p className="mb-4">
          <strong>Jurisdiction:</strong> Subject to the foregoing, the courts at
          Ernakulam, Kerala, India shall have exclusive jurisdiction in respect
          of all proceedings arising out of or in connection with this Privacy
          Policy.
        </p>

        <p className="mb-4">
          <strong>Arbitration:</strong> If the dispute is not resolved amicably
          within the said period, it shall be referred to and finally resolved
          by arbitration in accordance with the provisions of the Arbitration
          and Conciliation Act, 1996, as amended from time to time. The arbitral
          tribunal shall consist of a sole arbitrator, to be mutually appointed
          by the parties. In the event the parties are unable to agree on the
          appointment within fifteen (15) days, the arbitrator shall be
          appointed in accordance with the provisions of the Act. The seat and
          venue of arbitration shall be Ernakulam, Kerala, India and the
          proceedings shall be conducted in the English language. The arbitral
          award shall be final and binding on the parties.
        </p>

        <p className="mb-4">
          Nothing in this clause shall prevent a data principal from exercising
          statutory rights or remedies available under applicable data
          protection laws before the appropriate authority.
        </p>
      </>
    ),
  },

  {
    id: "injunctive-relief",
    title: "Injunctive Relief",
    content: (
      <>
        <p className="mb-4">
          Notwithstanding the foregoing, we retain the right to seek interim or
          injunctive relief before any competent court in India to prevent
          unauthorized access, misuse or disclosure of personal data.
        </p>
      </>
    ),
  },

  {
    id: "data-breach",
    title: "Data Breach Notification",
    content: (
      <>
        <p className="mb-4">
          In the event of any data breach likely to result in harm to you or a
          risk to your rights and freedoms, we will promptly notify you and the
          relevant data protection authority in accordance with applicable law
          and take reasonable remedial measures to mitigate such risks.
        </p>
      </>
    ),
  },

  {
    id: "controller-processor",
    title: "Data Fiduciary and Data Processor",
    content: (
      <>
        <p className="mb-4">
          For the purposes of applicable data protection laws, True Legacy
          (operating through True Legacy Solutions Private Limited) acts as the Data
          Fiduciary / Data Controller for all personal data collected through
          this Website.
        </p>

        <p className="mb-4">
          We may engage limited third-party service providers for essential
          operational purposes such as website hosting, maintenance, or secure
          storage of electronic records.
        </p>

        <p className="mb-4">
          Where such service providers process personal data on our behalf, they
          act as Data Processors and are bound by written or implied contractual
          obligations to handle such data only under our instructions, with
          appropriate confidentiality and security safeguards consistent with
          applicable data protection laws.
        </p>

        <p className="mb-4">
          We do not share or sell personal data to third parties for marketing,
          profiling, or unrelated commercial purposes.
        </p>
      </>
    ),
  },

  {
    id: "severability",
    title: "Severability and Non-Waiver",
    content: (
      <>
        <p className="mb-4">
          If any provision of this Privacy Policy is held to be invalid or
          unenforceable, the remaining provisions shall remain in full force and
          effect. No failure or delay by True Legacy in exercising any right
          shall constitute a waiver thereof.
        </p>
      </>
    ),
  },

  {
    id: "updates",
    title: "Updates to this Privacy Policy",
    content: (
      <>
        <p className="mb-4">
          We may amend this Privacy Policy from time to time to reflect changes
          in our practices, Applicable Laws, or Services. The updated version
          will be posted on the Website with the revised Effective date or Last
          Updated date indicated at the top of this page.
        </p>
      </>
    ),
  },
];

const Section = ({ id, title, content, onInView, scrollRef }) => {
  const [ref, inView] = useInView({ threshold: 0.35 });

  useEffect(() => {
    if (inView) onInView(id);
  }, [inView, id, onInView]);

  return (
    <section
      id={id}
      ref={(el) => {
        ref(el);
        if (scrollRef.current) {
          scrollRef.current[id] = el;
        }
      }}
      className="py-10 border-b border-gray-200"
    >
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="text-gray-700 leading-relaxed">{content}</div>
    </section>
  );
};

const PrivacyPolicy = () => {
  const [active, setActive] = useState("privacy-policy");
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
          <h1 className="text-4xl font-bold text-left mb-4">
            Privacy Policy for True Legacy
          </h1>
          <p className="mb-10 text-sm text-gray-500">
            Effective date / Last Updated:{" "}
            <span className="font-medium">20-11-2025</span>
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

export default PrivacyPolicy;
