import { Link } from "wouter";
import { ArrowLeft, Shield, Eye, Lock, Database, UserCheck, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-cmc-dark text-white">
      {/* Header */}
      <div className="bg-cmc-card border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-cmc-blue hover:text-blue-400" data-testid="link-back">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-cmc-blue" />
              <h1 className="text-3xl font-bold" data-testid="text-privacy-title">Privacy Policy</h1>
            </div>
          </div>
          <p className="text-cmc-gray mt-2">Last updated: January 1, 2025</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Introduction */}
        <Card className="bg-cmc-card border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Eye className="w-5 h-5 text-cmc-blue" />
              <span>Introduction</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-cmc-gray space-y-4">
            <p>
              At CryptoMine Pro, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our cryptocurrency 
              mining platform and related services.
            </p>
            <p>
              By using our platform, you consent to the collection and use of information in accordance with this policy. 
              If you disagree with any part of this policy, please do not use our services.
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card className="bg-cmc-card border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Database className="w-5 h-5 text-cmc-blue" />
              <span>Information We Collect</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-cmc-gray space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-2">Personal Information</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Email address and account credentials</li>
                <li>Full name and contact information</li>
                <li>Cryptocurrency wallet addresses</li>
                <li>Payment and transaction information</li>
                <li>Identity verification documents (KYC/AML compliance)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">Technical Information</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>IP address and device information</li>
                <li>Browser type and operating system</li>
                <li>Mining performance and statistics</li>
                <li>Platform usage analytics</li>
                <li>Security logs and access records</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Information */}
        <Card className="bg-cmc-card border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <UserCheck className="w-5 h-5 text-cmc-blue" />
              <span>How We Use Your Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-cmc-gray space-y-4">
            <p>We use your information for the following purposes:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Service Provision:</strong> Process mining contracts, calculate earnings, and manage withdrawals</li>
              <li><strong>Account Management:</strong> Create and maintain your account, provide customer support</li>
              <li><strong>Security:</strong> Prevent fraud, unauthorized access, and ensure platform security</li>
              <li><strong>Compliance:</strong> Meet legal requirements including KYC/AML regulations</li>
              <li><strong>Communication:</strong> Send important updates, security alerts, and promotional offers</li>
              <li><strong>Platform Improvement:</strong> Analyze usage patterns to enhance our services</li>
              <li><strong>Financial Operations:</strong> Process payments, calculate profits, and manage taxation requirements</li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card className="bg-cmc-card border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Lock className="w-5 h-5 text-cmc-blue" />
              <span>Data Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-cmc-gray space-y-4">
            <p>We implement industry-standard security measures to protect your information:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Encryption:</strong> All sensitive data is encrypted in transit and at rest using AES-256</li>
              <li><strong>Access Controls:</strong> Strict access controls and multi-factor authentication for all accounts</li>
              <li><strong>Cold Storage:</strong> Cryptocurrency assets are stored in offline cold wallets</li>
              <li><strong>Regular Audits:</strong> Periodic security audits and penetration testing</li>
              <li><strong>Incident Response:</strong> 24/7 monitoring and rapid incident response protocols</li>
              <li><strong>Employee Training:</strong> Regular security training for all staff members</li>
            </ul>
          </CardContent>
        </Card>

        {/* Information Sharing */}
        <Card className="bg-cmc-card border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <span>Information Sharing and Disclosure</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-cmc-gray space-y-4">
            <p>We do not sell, trade, or rent your personal information. We may share information only in these circumstances:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Legal Compliance:</strong> When required by law, court order, or regulatory authority</li>
              <li><strong>Service Providers:</strong> With trusted third parties who assist in platform operations (payment processors, KYC providers)</li>
              <li><strong>Business Transfer:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>Fraud Prevention:</strong> To investigate and prevent fraudulent activities</li>
              <li><strong>Emergency:</strong> To protect the safety and security of users and the platform</li>
            </ul>
            <p>All third parties are contractually obligated to maintain the confidentiality of your information.</p>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="bg-cmc-card border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Your Privacy Rights</CardTitle>
          </CardHeader>
          <CardContent className="text-cmc-gray space-y-4">
            <p>You have the following rights regarding your personal information:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Access:</strong> Request access to your personal data</li>
              <li><strong>Correction:</strong> Request correction of inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your data (subject to legal requirements)</li>
              <li><strong>Portability:</strong> Request transfer of your data to another service</li>
              <li><strong>Restriction:</strong> Request limitation of data processing</li>
              <li><strong>Objection:</strong> Object to certain types of data processing</li>
              <li><strong>Withdrawal:</strong> Withdraw consent for data processing</li>
            </ul>
            <p>To exercise these rights, contact us at privacy@cryptomine.pro</p>
          </CardContent>
        </Card>

        {/* Cookies and Tracking */}
        <Card className="bg-cmc-card border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Cookies and Tracking</CardTitle>
          </CardHeader>
          <CardContent className="text-cmc-gray space-y-4">
            <p>We use cookies and similar technologies to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Maintain your login session</li>
              <li>Remember your preferences</li>
              <li>Analyze platform usage</li>
              <li>Improve security</li>
              <li>Provide personalized content</li>
            </ul>
            <p>You can control cookie settings through your browser, but disabling cookies may affect platform functionality.</p>
          </CardContent>
        </Card>

        {/* International Transfers */}
        <Card className="bg-cmc-card border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">International Data Transfers</CardTitle>
          </CardHeader>
          <CardContent className="text-cmc-gray space-y-4">
            <p>
              Your information may be transferred to and processed in countries other than your country of residence. 
              We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards 
              to protect your information.
            </p>
          </CardContent>
        </Card>

        {/* Retention */}
        <Card className="bg-cmc-card border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Data Retention</CardTitle>
          </CardHeader>
          <CardContent className="text-cmc-gray space-y-4">
            <p>
              We retain your personal information for as long as necessary to provide our services and comply with legal obligations. 
              Specific retention periods include:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Account information: Until account closure plus 7 years for regulatory compliance</li>
              <li>Transaction records: 7 years for tax and regulatory purposes</li>
              <li>KYC documents: 5 years after account closure</li>
              <li>Security logs: 2 years</li>
            </ul>
          </CardContent>
        </Card>

        {/* Changes to Policy */}
        <Card className="bg-cmc-card border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Changes to This Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="text-cmc-gray space-y-4">
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new 
              Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy 
              periodically for any changes.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="bg-cmc-card border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="text-cmc-gray space-y-4">
            <p>If you have any questions about this Privacy Policy or our privacy practices, please contact us:</p>
            <ul className="space-y-1">
              <li><strong>Email:</strong> privacy@cryptomine.pro</li>
              <li><strong>Address:</strong> CryptoMine Pro Legal Department</li>
              <li><strong>Phone:</strong> +1 (555) 123-4567</li>
            </ul>
            <p>We will respond to your inquiry within 30 days.</p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}