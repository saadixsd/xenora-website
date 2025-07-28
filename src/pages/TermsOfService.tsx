import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

const TermsOfService = () => {
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
      id: "acceptance-scope",
      title: "Acceptance and Scope",
      content: `By accessing or using XenoraAI services, you agree to be bound by these Terms of Service and all terms incorporated by reference. If you do not agree to these terms, do not use our services.

These terms apply to all XenoraAI products and services, including:
• XenoraAI legal AI platform and tools
• Nora AI Assistant and Halo Legal Suite
• API access and third-party integrations
• Professional support and consulting services
• Any future products, features, or services we may release

These terms constitute the entire agreement between you and XenoraAI regarding your use of our services, superseding any prior agreements between you and XenoraAI relating to your use of the services.`
    },
    {
      id: "permitted-use-restrictions",
      title: "Permitted Use and Restrictions",
      content: `You may use our services only for lawful purposes and in accordance with these terms. You agree not to use the services:

• For any unlawful purpose or to solicit others to take unlawful actions
• To violate any international, federal, provincial, or local laws or regulations
• To transmit, or procure the sending of, any advertising or promotional material
• To impersonate or attempt to impersonate XenoraAI, our employees, another user, or any other person or entity
• To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of our services

You also agree not to:
• Use our services in any manner that could disable, overburden, damage, or impair the service
• Use any robot, spider, or other automatic device to access our services
• Attempt to gain unauthorized access to our services, accounts, computer systems, or networks
• Reverse engineer, decompile, or disassemble any aspect of our AI models or proprietary technology`
    },
    {
      id: "professional-responsibility",
      title: "Professional Responsibility and AI Usage",
      content: `XenoraAI provides AI-powered tools to assist legal professionals, but users maintain full professional responsibility for all legal work and decisions. You acknowledge and agree that:

• Our AI tools are assistive technology and do not constitute legal advice
• You are solely responsible for all legal advice provided to clients
• You must supervise and review all AI-generated content before use
• You remain subject to all applicable professional conduct rules and ethical obligations
• You must maintain client confidentiality and attorney-client privilege
• You are responsible for meeting all deadlines and court requirements

You must ensure that your use of our AI tools complies with:
• Rules of professional conduct in your jurisdiction
• Client confidentiality requirements
• Court rules regarding AI-assisted legal work
• Any disclosure requirements for AI assistance in legal documents`
    },
    {
      id: "disclaimers-limitations",
      title: "Disclaimers and Limitations of Liability",
      content: `XenoraAI services are provided on an "as is" and "as available" basis without warranties of any kind, either express or implied.

To the fullest extent permitted by law, XenoraAI disclaims all warranties, express or implied, including:
• Warranties of merchantability, fitness for a particular purpose, and non-infringement
• Warranties that the services will be uninterrupted, secure, or error-free
• Warranties regarding the accuracy, reliability, or completeness of AI-generated content

Our liability is limited to:
• The amount you paid for services in the 12 months preceding the claim
• Direct damages only (excluding indirect, incidental, special, consequential, or punitive damages)
• Reasonable efforts to maintain service availability and security
• Professional liability insurance coverage where applicable

Nothing in these terms excludes or limits our liability for death or personal injury caused by negligence, fraud, or any other liability that cannot be excluded or limited under applicable law.`
    },
    {
      id: "data-privacy",
      title: "Data Privacy and Security",
      content: `Your privacy and the security of your data are important to us. Our collection, use, and protection of your personal information is governed by our Privacy Policy.

By using our services, you acknowledge that:
• We implement industry-standard security measures to protect your data
• You are responsible for maintaining the confidentiality of your account credentials
• You must notify us immediately of any unauthorized use of your account
• We may process your data as necessary to provide our services
• We comply with applicable data protection laws and regulations

For detailed information about how we handle your data, please review our Privacy Policy, which is incorporated into these terms by reference.`
    }
  ];

  const sidebarItems = [
    { id: "acceptance-scope", title: "Acceptance and Scope" },
    { id: "permitted-use-restrictions", title: "Permitted Use and Restrictions" },
    { id: "professional-responsibility", title: "Professional Responsibility and AI Usage" },
    { id: "disclaimers-limitations", title: "Disclaimers and Limitations of Liability" },
    { id: "data-privacy", title: "Data Privacy and Security" }
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
            XenoraAI <span className="bg-primary-gradient bg-clip-text text-transparent">Terms of Service</span>
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
              <h2 className="font-semibold text-foreground mb-4">XenoraAI Terms of Service</h2>
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
                Please read these Terms of Service carefully before using XenoraAI's legal AI solutions and services. These terms govern your use of our platform and establish important legal rights and obligations.
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
                <h3 className="text-lg font-semibold text-foreground mb-2">Questions About These Terms?</h3>
                <p className="text-muted-foreground mb-4">
                  If you have any questions about these Terms of Service, please contact our legal team.
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

export default TermsOfService;