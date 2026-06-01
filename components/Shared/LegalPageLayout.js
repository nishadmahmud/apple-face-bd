import { SITE_INFO } from "../../lib/siteInfo";
import PageHero from "./PageHero";

export default function LegalPageLayout({
  eyebrow = "Legal",
  title,
  highlight = "",
  description,
  meta,
  intro,
  sections = [],
  showContactFooter = true,
  footerNote,
}) {
  return (
    <div className="min-h-screen bg-card-bg pb-20 md:pb-10">
      <PageHero
        eyebrow={eyebrow}
        title={title}
        highlight={highlight}
        description={description}
        meta={meta}
      />

      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 -mt-4 md:-mt-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 md:p-10">
          {intro ? (
            <p className="text-sm text-gray-600 leading-relaxed mb-8">{intro}</p>
          ) : null}

          <div className="space-y-8 page-prose">
            {sections.map((section, i) => (
              <div key={i}>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 pb-2 border-b border-brand-primary/20">
                  {section.title}
                </h2>
                {section.content ? (
                  typeof section.content === "string" ? (
                    <p className="text-sm text-gray-600 leading-relaxed">{section.content}</p>
                  ) : (
                    section.content
                  )
                ) : null}
                {section.items ? (
                  <ul className="space-y-2 mt-2">
                    {section.items.map((item, j) => (
                      <li
                        key={j}
                        className="text-sm text-gray-600 leading-relaxed flex items-start gap-2"
                      >
                        <span className="text-brand-primary mt-1.5 shrink-0 font-bold">•</span>
                        {typeof item === "string" ? (
                          <span
                            dangerouslySetInnerHTML={{
                              __html: item.replace(
                                /\*\*(.*?)\*\*/g,
                                '<strong class="text-gray-900">$1</strong>'
                              ),
                            }}
                          />
                        ) : (
                          item
                        )}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>

          {footerNote ? (
            <div className="mt-10 p-5 bg-gray-50 rounded-lg border border-gray-100">
              {footerNote}
            </div>
          ) : null}

          {showContactFooter ? (
            <div className="mt-10 p-5 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-sm text-gray-600">
                Questions? Reach us at{" "}
                <span className="text-brand-primary font-semibold">{SITE_INFO.email}</span>
                {" or call "}
                <span className="text-brand-primary font-semibold">{SITE_INFO.callDisplay}</span>.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
