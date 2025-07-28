import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

const PrivacyPolicy = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const sections = [
    {
      id: "personal-data-we-collect",
      title: "Personal data we collect",
      content: `XenoraAI collects data from you, through our interactions with you and through our products. You provide some of this data directly, and we get some of it by collecting data about your interactions, use, and experiences with our products. The data we collect depends on the context of your interactions with XenoraAI and the choices you make, including your privacy settings and the products and features you use.

We also obtain data about you from third parties. We protect data obtained from third parties according to the practices described in this statement, plus any additional restrictions imposed by the source of the data. These third-party sources vary over time.

The data we collect can include the following:

• Name and contact data: We collect your first and last name, email address, postal address, phone number, and other similar contact data.
• Credentials: We collect passwords, password hints, and similar security information used for authentication and account access.
• Payment data: We collect data necessary to process your payment if you make purchases, such as your payment instrument number and the security code associated with your payment instrument.
• Device and Usage data: We collect data about your device and how you and your device interact with XenoraAI and our products.
• Location data: We collect data about your location, which can be either precise or imprecise.`
    },
    {
      id: "how-we-use-personal-data",
      title: "How we use personal data",
      content: `XenoraAI uses the data we collect to provide you with rich, interactive experiences. In particular, we use data to:

• Provide our products, which includes updating, securing, and troubleshooting, as well as providing support.
• Improve and develop our products.
• Personalize our products and make recommendations.
• Advertise and market to you, which includes sending promotional communications, targeting advertising, and presenting you with relevant offers.

We also use the data to operate our business, which includes analyzing our performance, meeting our legal obligations, developing our workforce, and doing research.

In carrying out these purposes, we combine data we collect from different contexts (for example, from your use of two XenoraAI products) or obtain from third parties to give you a more seamless, consistent, and personalized experience, to make informed business decisions, and for other legitimate purposes.`
    },
    {
      id: "reasons-we-share-personal-data",
      title: "Reasons we share personal data",
      content: `We share your personal data with your consent or as necessary to complete any transaction or provide any product you have requested or authorized. We also share data with XenoraAI-controlled affiliates and subsidiaries; with vendors working on our behalf; when required by law or to respond to legal process; to protect our customers; to protect lives; to maintain the security of our products; and to protect the rights or property of XenoraAI.

Please note that some of our products include links to or otherwise enable you to access third-party products whose privacy practices differ from those of XenoraAI. If you provide personal data to any of those products, your data is governed by their privacy policies.`
    },
    {
      id: "how-to-access-control-personal-data",
      title: "How to access and control your personal data",
      content: `You can also make choices about the collection and use of your data by XenoraAI. You can control your personal data that XenoraAI has obtained, and exercise your data protection rights, by contacting XenoraAI or using various tools we provide.

You can access and control your personal data through:
• Privacy dashboard for managing your privacy settings
• Account settings for updating your profile information
• Communication preferences for managing how we contact you
• Data portability options for downloading your data
• Deletion requests for removing your personal data`
    },
    {
      id: "cookies-similar-technologies",
      title: "Cookies and similar technologies",
      content: `Most XenoraAI sites use cookies, small text files placed on your device which web servers in the domain that placed the cookie can retrieve later. We use cookies to store your preferences and settings, help with sign-in, provide personalized ads, and analyze site operations.

You have a variety of tools to control the data collected by cookies, web beacons, and similar technologies. For example, you can use controls in your internet browser to limit how the websites you visit are able to use cookies and to withdraw your consent by clearing or blocking cookies.`
    }
  ];

  const sidebarItems = [
    { id: "personal-data-we-collect", title: "Personal data we collect" },
    { id: "how-we-use-personal-data", title: "How we use personal data" },
    { id: "reasons-we-share-personal-data", title: "Reasons we share personal data" },
    { id: "how-to-access-control-personal-data", title: "How to access and control your personal data" },
    { id: "cookies-similar-technologies", title: "Cookies and similar technologies" }
  ];

  return (
    <div className="min-h-screen pt-16 bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            XenoraAI Privacy Statement
          </h1>
          <p className="text-muted-foreground mb-2">
            Last Updated: January 2025
          </p>
          <button className="text-primary hover:underline text-sm">
            What's new?
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-80 flex-shrink-0">
            <div className="sticky top-24">
              <h2 className="font-semibold text-foreground mb-4">XenoraAI Privacy Statement</h2>
              <nav className="space-y-1">
                {sidebarItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block py-2 px-3 text-sm text-muted-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                  >
                    {item.title}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 max-w-4xl">
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-muted-foreground mb-8">
                Your privacy is important to us. This privacy statement explains the personal data XenoraAI processes, how XenoraAI processes it, and for what purposes.
              </p>

              <p className="text-muted-foreground mb-8">
                XenoraAI offers a wide range of AI-powered legal solutions, including tools that help legal professionals analyze documents, research case law, and streamline their workflows. References to XenoraAI products in this statement include XenoraAI services, websites, apps, software, servers, and devices.
              </p>

              <div className="space-y-8">
                {sections.map((section) => (
                  <div key={section.id} id={section.id} className="border-t border-border pt-8">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="flex items-center justify-between w-full text-left group"
                    >
                      <h2 className="text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {section.title}
                      </h2>
                      {expandedSections.includes(section.id) ? (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                    
                    {expandedSections.includes(section.id) && (
                      <div className="mt-4 text-muted-foreground leading-relaxed space-y-4">
                        {section.content.split('\n\n').map((paragraph, index) => (
                          <p key={index}>{paragraph}</p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Contact Section */}
              <div className="mt-16 p-6 bg-accent/50 rounded-lg border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-2">Contact us</h3>
                <p className="text-muted-foreground mb-4">
                  If you have a privacy concern, complaint, or question for the XenoraAI Chief Privacy Officer, please contact us using our web form.
                </p>
                <p className="text-muted-foreground">
                  Email: <span className="font-medium text-foreground">privacy@xenoraai.com</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;