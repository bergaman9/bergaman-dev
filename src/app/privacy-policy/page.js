import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/constants';
import PrivacyHeader from './PrivacyHeader';

export default function PrivacyPolicyPage() {
  const lastUpdated = '2024-06-01'; // Update this when you make changes to the policy
  
  return (
    <div className="pt-24 pb-12 px-4">
      <PrivacyHeader lastUpdated={lastUpdated} />

      <div className="prose prose-lg prose-invert max-w-4xl mx-auto">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#e8c547] mb-4">Introduction</h2>
          <p>
            {SITE_CONFIG.name} ("we", "our", or "us") is committed to protecting your privacy. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
            when you visit our website {SITE_CONFIG.url} (the "Site").
          </p>
          <p>
            Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, 
            please do not access the site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#e8c547] mb-4">Information We Collect</h2>
          
          <h3 className="text-xl font-medium text-white mt-6 mb-3">Information Automatically Collected</h3>
          <p>When you visit our Site, we automatically collect certain information about your device, including:</p>
          <ul className="list-disc pl-6 mt-2 mb-4">
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Referring website</li>
            <li>Time and date of your visit</li>
            <li>Pages you viewed</li>
            <li>Time spent on those pages</li>
          </ul>
          <p>
            This information helps us analyze trends, administer the site, track users' movements around the site, 
            and gather demographic information about our user base as a whole.
          </p>
          
          <h3 className="text-xl font-medium text-white mt-6 mb-3">Information You Provide</h3>
          <p>We may collect personal information that you voluntarily provide to us when you:</p>
          <ul className="list-disc pl-6 mt-2 mb-4">
            <li>Fill out forms on our Site (such as contact forms)</li>
            <li>Subscribe to our newsletter</li>
            <li>Leave comments on blog posts</li>
            <li>Correspond with us by email</li>
          </ul>
          <p>
            This information may include your name, email address, and any other information you choose to provide.
          </p>
          
          <h3 className="text-xl font-medium text-white mt-6 mb-3">Cookies and Similar Technologies</h3>
          <p>
            We use cookies and similar tracking technologies to track activity on our Site and hold certain information. 
            Cookies are files with small amounts of data which may include an anonymous unique identifier.
          </p>
          <p>
            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. 
            However, if you do not accept cookies, you may not be able to use some portions of our Site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#e8c547] mb-4">How We Use Your Information</h2>
          <p>We may use the information we collect from you for the following purposes:</p>
          <ul className="list-disc pl-6 mt-2 mb-4">
            <li>To provide and maintain our Site</li>
            <li>To improve our Site and user experience</li>
            <li>To respond to your inquiries, comments, or questions</li>
            <li>To send you newsletters or marketing communications (if you've opted in)</li>
            <li>To monitor the usage of our Site</li>
            <li>To detect, prevent, and address technical issues</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#e8c547] mb-4">Data Retention</h2>
          <p>
            We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. 
            We will retain and use your information to the extent necessary to comply with our legal obligations, 
            resolve disputes, and enforce our policies.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#e8c547] mb-4">Data Disclosure</h2>
          <p>We may disclose your information in the following situations:</p>
          <ul className="list-disc pl-6 mt-2 mb-4">
            <li><strong>Legal Requirements:</strong> To comply with applicable law, regulation, legal process, or governmental request.</li>
            <li><strong>Service Providers:</strong> To trusted third parties who assist us in operating our website and conducting our business.</li>
            <li><strong>Protection of Rights:</strong> To protect our rights, property, safety, or the rights, property, and safety of others.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#e8c547] mb-4">Third-Party Services</h2>
          <p>
            Our Site may use third-party services that collect, monitor, and analyze data. 
            These third parties have their own privacy policies addressing how they use such information.
          </p>
          <p>These third-party services may include:</p>
          <ul className="list-disc pl-6 mt-2 mb-4">
            <li>Google Analytics</li>
            <li>Newsletter service providers</li>
            <li>Comment system providers</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#e8c547] mb-4">Your Data Protection Rights</h2>
          
          <h3 className="text-xl font-medium text-white mt-6 mb-3">GDPR Rights (EU Residents)</h3>
          <p>If you are a resident of the European Union, you have the following data protection rights:</p>
          <ul className="list-disc pl-6 mt-2 mb-4">
            <li><strong>Right to Access:</strong> You have the right to request copies of your personal data.</li>
            <li><strong>Right to Rectification:</strong> You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</li>
            <li><strong>Right to Erasure:</strong> You have the right to request that we erase your personal data, under certain conditions.</li>
            <li><strong>Right to Restrict Processing:</strong> You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
            <li><strong>Right to Object to Processing:</strong> You have the right to object to our processing of your personal data, under certain conditions.</li>
            <li><strong>Right to Data Portability:</strong> You have the right to request that we transfer the data we have collected to another organization, or directly to you, under certain conditions.</li>
          </ul>
          
          <h3 className="text-xl font-medium text-white mt-6 mb-3">CCPA Rights (California Residents)</h3>
          <p>If you are a California resident, you have the following rights under the California Consumer Privacy Act (CCPA):</p>
          <ul className="list-disc pl-6 mt-2 mb-4">
            <li><strong>Right to Know:</strong> You have the right to request information about the personal information we collect, use, disclose, and sell.</li>
            <li><strong>Right to Delete:</strong> You have the right to request the deletion of your personal information that we have collected or maintained.</li>
            <li><strong>Right to Opt-Out:</strong> You have the right to opt-out of the sale of your personal information.</li>
            <li><strong>Right to Non-Discrimination:</strong> You have the right not to be discriminated against for exercising your CCPA rights.</li>
          </ul>
          
          <p className="mt-4">
            If you would like to exercise any of these rights, please contact us using the information provided in the "Contact Us" section below.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#e8c547] mb-4">Children's Privacy</h2>
          <p>
            Our Site is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. 
            If you are a parent or guardian and you are aware that your child has provided us with personal information, 
            please contact us so that we can take necessary actions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#e8c547] mb-4">Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page 
            and updating the "Last updated" date at the top of this Privacy Policy.
          </p>
          <p>
            You are advised to review this Privacy Policy periodically for any changes. 
            Changes to this Privacy Policy are effective when they are posted on this page.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#e8c547] mb-4">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <ul className="list-disc pl-6 mt-2 mb-4">
            <li>By email: {SITE_CONFIG.email || 'contact@bergaman.dev'}</li>
            <li>By visiting our <Link href="/contact" className="text-[#e8c547] hover:underline">contact page</Link></li>
          </ul>
        </section>
      </div>
    </div>
  );
} 