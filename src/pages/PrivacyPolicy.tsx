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

We collect the following types of personal data:

Name and contact data: We collect your first and last name, email address, postal address, phone number, and other similar contact data when you register for our services.

Credentials: We collect passwords, password hints, and similar security information used for authentication and account access to our AI legal tools.

Payment data: We collect data necessary to process your payment if you make purchases, such as your payment instrument number (credit card, billing address) and the security code associated with your payment instrument.

Professional information: We collect information about your law firm, practice areas, bar admissions, professional certifications, and other legal practice-related data.

Device and Usage data: We collect data about your device and how you and your device interact with XenoraAI and our products. This includes IP addresses, device identifiers, browser type, and usage patterns.

Location data: We collect data about your location, which can be either precise or imprecise, to provide location-relevant legal resources and comply with jurisdictional requirements.

Legal content data: We collect and process legal documents, case information, research queries, and other legal content you input into our AI systems for analysis and processing.

Communications: We collect the content of messages you send to us, such as feedback, questions, or information you provide for customer support purposes.`
    },
    {
      id: "how-we-use-personal-data",
      title: "How we use personal data",
      content: `XenoraAI uses the data we collect to provide you with our AI-powered legal services and to operate our business. In particular, we use data to:

Provide our legal AI services: We use your data to deliver Nora AI Assistant, Halo Legal Suite, and other XenoraAI products, including processing your legal documents, providing research assistance, and generating legal insights.

Improve and develop our products: We analyze usage patterns and feedback to enhance our AI models, improve accuracy of legal analysis, and develop new features for legal professionals.

Personalize your experience: We use your professional information and usage patterns to customize our services to your practice areas and provide more relevant legal resources and recommendations.

Customer support: We use your contact information and communications to provide technical support, answer questions, and resolve issues with our services.

Business operations: We use data to operate our business, including billing and payment processing, fraud prevention, security monitoring, and compliance with legal obligations.

Marketing and communications: We may use your contact information to send you updates about new features, legal industry news, and promotional materials (with your consent where required).

Legal compliance: We process data as necessary to comply with applicable laws, regulations, and legal processes, including responding to government requests and legal investigations.

Research and analytics: We use aggregated and anonymized data to conduct research on legal trends, improve our AI algorithms, and generate insights about the legal industry.

In carrying out these purposes, we combine data we collect from different contexts to provide you with a more integrated and effective legal AI experience.`
    },
    {
      id: "reasons-we-share-personal-data",
      title: "Reasons we share personal data",
      content: `We share your personal data with your consent or as necessary to complete any transaction or provide any legal service you have requested or authorized. We also share data in the following circumstances:

With your consent: We share your personal data when you provide explicit consent for us to do so, such as when you authorize us to share information with third-party legal research platforms or court filing systems.

XenoraAI-controlled affiliates and subsidiaries: We may share your data with our corporate affiliates and subsidiaries to provide integrated legal services and support.

Service providers: We share data with vendors and service providers working on our behalf to provide IT services, payment processing, customer support, and other business functions under strict confidentiality agreements.

Legal requirements: We share personal data when required by law, legal process, litigation, or requests from public and government authorities, including to meet national security or law enforcement requirements.

Protection of rights and safety: We may disclose personal data if we believe in good faith that such action is necessary to protect and defend our rights or property, protect the safety of our users or the public, or prevent illegal activities.

Business transfers: In the event of a merger, acquisition, or sale of all or part of our business, personal data may be transferred to the acquiring organization, subject to continued privacy protection.

Professional obligations: As a service provider to legal professionals, we may be required to disclose information to comply with professional conduct rules, court orders, or legal discovery processes.

Aggregate and anonymized data: We may share aggregated, anonymized data that cannot identify you for research, industry analysis, and business development purposes.

We do not sell your personal information to third parties for their marketing purposes. Any sharing of data is conducted in accordance with applicable privacy laws and professional obligations.`
    },
    {
      id: "how-to-access-control-personal-data",
      title: "How to access and control your personal data",
      content: `You have several rights and options to access and control your personal data that XenoraAI processes:

Access your data: You can request a copy of the personal data we have about you. This includes your account information, usage history, and any legal content you have submitted to our AI systems.

Update and correct data: You can update your personal information through your account settings or by contacting us. We encourage you to keep your professional information current for the best service experience.

Delete your data: You can request deletion of your personal data, subject to certain limitations such as legal retention requirements, ongoing legal matters, or legitimate business needs.

Data portability: You can request that we provide your personal data in a structured, commonly used format so you can transfer it to another service provider.

Restrict processing: You can request that we limit how we process your personal data in certain circumstances, such as while we verify the accuracy of disputed information.

Object to processing: You have the right to object to certain types of processing, such as processing for direct marketing purposes.

Privacy settings: You can control various privacy settings through your XenoraAI account dashboard, including:
- Communication preferences for marketing emails and notifications
- Data sharing preferences for research and analytics
- AI model training preferences for your content
- Integration settings with third-party legal tools

Account management: You can manage your account through our user portal, including:
- Viewing your data processing history
- Managing connected applications and integrations
- Setting data retention preferences
- Downloading your data exports

Legal professional considerations: As our services are designed for legal professionals, some data retention and processing may be subject to professional conduct rules and legal obligations that may limit certain deletion or restriction requests.

To exercise these rights, please contact us at xenoraai@gmail.com with your specific request and verification of your identity.`
    },
    {
      id: "cookies-similar-technologies",
      title: "Cookies and similar technologies",
      content: `XenoraAI uses cookies and similar technologies to provide, secure, and improve our services, as well as to show you relevant information and advertisements.

What are cookies: Cookies are small text files stored on your device when you visit our website. They help us recognize your browser and capture certain information about your visit.

Types of cookies we use:

Essential cookies: These are necessary for our website and services to function properly. They enable core functionality such as user authentication, security features, and basic site operations. These cannot be disabled without affecting site functionality.

Performance and analytics cookies: We use these to understand how visitors interact with our website and services. They help us measure traffic, identify popular features, and improve our user experience. This includes Google Analytics and similar services.

Functional cookies: These enable enhanced functionality and personalization, such as remembering your language preferences, theme settings, and customized dashboard layouts.

Security cookies: We use these to detect suspicious activity, prevent fraud, and maintain the security of your account and our services.

Marketing cookies: With your consent, we may use cookies to deliver personalized advertisements and measure their effectiveness.

Similar technologies: We also use web beacons, pixel tags, and local storage technologies that function similarly to cookies for analytics, personalization, and security purposes.

Third-party cookies: Some cookies are placed by third-party services we use, such as analytics providers, customer support tools, and payment processors. These are governed by their respective privacy policies.

Managing cookies: You can control cookies through your browser settings:
- Most browsers allow you to view, delete, and block cookies
- You can set your browser to notify you when cookies are being placed
- You can opt out of certain analytics and advertising cookies through industry opt-out tools

Legal professional considerations: Some cookies are essential for providing legal AI services securely and in compliance with professional obligations, including maintaining audit trails and ensuring data integrity.

For more information about managing cookies in your specific browser, please visit the browser manufacturer's help pages. Disabling certain cookies may affect the functionality of our legal AI services.`
    }
  ];

  const sidebarItems = [
    { id: "personal-data-we-collect", title: "Personal data we collect" },
    { id: "how-we-use-personal-data", title: "How we use personal data" },
    { id: "reasons-we-share-personal-data", title: "Reasons we share personal data" },
    { id: "how-to-access-control-personal-data", title: "How to access and control your personal data" },
    { id: "cookies-similar-technologies", title: "Cookies and similar technologies" }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Auto-expand the section when navigating to it
      if (!expandedSections.includes(sectionId)) {
        setExpandedSections(prev => [...prev, sectionId]);
      }
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            XenoraAI Privacy Statement
          </h1>
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
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="block w-full text-left py-2 px-3 text-sm text-muted-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                  >
                    {item.title}
                  </button>
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
                  Email: <span className="font-medium text-foreground">xenoraai@gmail.com</span>
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