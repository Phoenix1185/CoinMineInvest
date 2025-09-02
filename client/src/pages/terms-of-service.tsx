import { Link } from "wouter";
import { ArrowLeft, FileText, AlertTriangle, DollarSign, Shield, Users, Gavel } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfService() {
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
              <FileText className="w-8 h-8 text-cmc-blue" />
              <h1 className="text-3xl font-bold" data-testid="text-terms-title">Terms of Service</h1>
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
              <FileText className="w-5 h-5 text-cmc-blue" />
              <span>Agreement to Terms</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-cmc-gray space-y-4">
            <p>
              Welcome to CryptoMine Pro. These Terms of Service ("Terms") govern your use of our cryptocurrency mining platform 
              and related services provided by CryptoMine Pro ("Company," "we," "us," or "our").
            </p>
            <p>
              By accessing or using our platform, you agree to be bound by these Terms. If you disagree with any part of these 
              terms, then you may not access the service. These Terms apply to all visitors, users, and others who access or use the service.
            </p>
            <div className="bg-cmc-dark rounded-lg p-4 border border-yellow-500/20">
              <p className="text-yellow-400 font-semibold">
                IMPORTANT: Cryptocurrency mining involves financial risk. Past performance does not guarantee future results. 
                Please read these terms carefully and consider your risk tolerance before participating.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Eligibility */}
        <Card className="bg-cmc-card border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Users className="w-5 h-5 text-cmc-blue" />
              <span>Eligibility and Account Requirements</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-cmc-gray space-y-4">
            <p>To use our services, you must:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Be at least 18 years old (or the age of majority in your jurisdiction)</li>
              <li>Have the legal capacity to enter into binding agreements</li>
              <li>Not be located in a prohibited jurisdiction</li>
              <li>Provide accurate and complete information during registration</li>
              <li>Complete identity verification (KYC) processes as required</li>
              <li>Maintain the security of your account credentials</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
            <p>
              We reserve the right to refuse service to anyone for any reason at any time, and to suspend or terminate 
              accounts that violate these Terms.
            </p>
          </CardContent>
        </Card>

        {/* Mining Services */}
        <Card className="bg-cmc-card border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <DollarSign className="w-5 h-5 text-cmc-blue" />
              <span>Mining Contracts and Services</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-cmc-gray space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-2">Contract Terms</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Mining contracts begin immediately upon payment confirmation</li>
                <li>Contract duration is specified at the time of purchase</li>
                <li>Earnings are calculated based on current mining difficulty and market conditions</li>
                <li>Maintenance fees may be deducted from mining earnings</li>
                <li>Contracts cannot be cancelled or refunded once activated</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">Mining Performance</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Actual returns may vary based on cryptocurrency market conditions</li>
                <li>Network difficulty adjustments may affect earnings</li>
                <li>Equipment maintenance may cause temporary service interruptions</li>
                <li>We do not guarantee specific returns or profitability</li>
                <li>Historical performance is not indicative of future results</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Financial Terms */}
        <Card className="bg-cmc-card border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <DollarSign className="w-5 h-5 text-orange-500" />
              <span>Payment and Financial Terms</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-cmc-gray space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-2">Payments</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>All payments must be made in accepted cryptocurrencies</li>
                <li>Prices are subject to change without notice</li>
                <li>Payment confirmations may take up to 6 blockchain confirmations</li>
                <li>Incorrect payments may result in service delays or loss of funds</li>
                <li>You are responsible for all transaction fees and taxes</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">Withdrawals</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Minimum withdrawal amounts apply for each cryptocurrency</li>
                <li>Withdrawal requests are processed within 1-3 business days</li>
                <li>Network fees are deducted from withdrawal amounts</li>
                <li>We reserve the right to require additional verification for large withdrawals</li>
                <li>Withdrawal addresses cannot be changed once submitted</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Prohibited Activities */}
        <Card className="bg-cmc-card border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span>Prohibited Activities</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-cmc-gray space-y-4">
            <p>You agree not to engage in any of the following prohibited activities:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Using our services for money laundering, terrorist financing, or other illegal activities</li>
              <li>Attempting to hack, compromise, or gain unauthorized access to our systems</li>
              <li>Creating multiple accounts to circumvent our terms or policies</li>
              <li>Using automated scripts, bots, or other unauthorized tools</li>
              <li>Providing false or misleading information during registration or verification</li>
              <li>Manipulating or attempting to manipulate our systems or algorithms</li>
              <li>Interfering with the operation of our platform or other users' access</li>
              <li>Violating any applicable laws, regulations, or third-party rights</li>
              <li>Using our services from prohibited jurisdictions</li>
            </ul>
          </CardContent>
        </Card>

        {/* Risk Disclosure */}
        <Card className="bg-cmc-card border-gray-700 border-red-500/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <span>Risk Disclosure</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-cmc-gray space-y-4">
            <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/20">
              <p className="text-red-400 font-semibold mb-2">IMPORTANT RISK WARNING</p>
              <p>Cryptocurrency mining involves substantial financial risk. You should carefully consider the following risks:</p>
            </div>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Market Volatility:</strong> Cryptocurrency prices are highly volatile and can result in significant losses</li>
              <li><strong>Mining Difficulty:</strong> Network difficulty adjustments can reduce mining profitability</li>
              <li><strong>Regulatory Risk:</strong> Changes in regulations may affect the legality or profitability of mining</li>
              <li><strong>Technology Risk:</strong> Equipment failures or technological changes may impact operations</li>
              <li><strong>No Guaranteed Returns:</strong> Mining profits are not guaranteed and may result in losses</li>
              <li><strong>Liquidity Risk:</strong> Withdrawal delays may occur during high market volatility</li>
              <li><strong>Operational Risk:</strong> Business interruptions may affect mining operations</li>
            </ul>
            <p className="text-yellow-400 font-semibold">
              Never invest more than you can afford to lose. Past performance does not guarantee future results.
            </p>
          </CardContent>
        </Card>

        {/* Platform Security */}
        <Card className="bg-cmc-card border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Shield className="w-5 h-5 text-cmc-blue" />
              <span>Platform Security and Availability</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-cmc-gray space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-2">Security Measures</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>We implement industry-standard security protocols</li>
                <li>Multi-factor authentication is required for all accounts</li>
                <li>Funds are stored in secure cold storage wallets</li>
                <li>Regular security audits and monitoring are conducted</li>
                <li>Suspected fraudulent activity will be investigated and reported</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">Service Availability</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>We strive for 99.9% uptime but cannot guarantee uninterrupted service</li>
                <li>Planned maintenance will be announced in advance when possible</li>
                <li>Emergency maintenance may be performed without notice</li>
                <li>Service interruptions may affect mining earnings temporarily</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card className="bg-cmc-card border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Intellectual Property Rights</CardTitle>
          </CardHeader>
          <CardContent className="text-cmc-gray space-y-4">
            <p>
              The platform and its original content, features, and functionality are owned by CryptoMine Pro and are protected 
              by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Copy, modify, or distribute our content without authorization</li>
              <li>Reverse engineer or attempt to extract source code</li>
              <li>Use our trademarks or branding without permission</li>
              <li>Create derivative works based on our platform</li>
            </ul>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card className="bg-cmc-card border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Gavel className="w-5 h-5 text-cmc-blue" />
              <span>Limitation of Liability</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-cmc-gray space-y-4">
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, CRYPTOMINE PRO SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, 
              SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY 
              OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
            </p>
            <p>
              Our total liability to you for any claims related to the service shall not exceed the amount you paid to us 
              in the twelve (12) months preceding the event giving rise to the claim.
            </p>
          </CardContent>
        </Card>

        {/* Dispute Resolution */}
        <Card className="bg-cmc-card border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Dispute Resolution</CardTitle>
          </CardHeader>
          <CardContent className="text-cmc-gray space-y-4">
            <p>
              Any disputes arising from these Terms or your use of our services shall be resolved through binding arbitration 
              in accordance with the rules of the American Arbitration Association. The arbitration shall be conducted in English 
              and take place in Delaware, United States.
            </p>
            <p>
              You waive any right to participate in a class action lawsuit or class-wide arbitration against us.
            </p>
          </CardContent>
        </Card>

        {/* Termination */}
        <Card className="bg-cmc-card border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Termination</CardTitle>
          </CardHeader>
          <CardContent className="text-cmc-gray space-y-4">
            <p>
              We may terminate or suspend your account and access to our services immediately, without prior notice or liability, 
              for any reason, including but not limited to breach of these Terms.
            </p>
            <p>
              Upon termination, your right to use the service will cease immediately. Active mining contracts will continue 
              until their natural expiration, and you will retain the right to withdraw any earned cryptocurrency.
            </p>
          </CardContent>
        </Card>

        {/* Changes to Terms */}
        <Card className="bg-cmc-card border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent className="text-cmc-gray space-y-4">
            <p>
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide 
              at least 30 days notice prior to any new terms taking effect. We will notify you of changes by posting on our 
              platform or sending an email to your registered address.
            </p>
            <p>
              Your continued use of our services after any changes constitute acceptance of the new Terms.
            </p>
          </CardContent>
        </Card>

        {/* Governing Law */}
        <Card className="bg-cmc-card border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Governing Law</CardTitle>
          </CardHeader>
          <CardContent className="text-cmc-gray space-y-4">
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, 
              without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms 
              will not be considered a waiver of those rights.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="bg-cmc-card border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="text-cmc-gray space-y-4">
            <p>If you have any questions about these Terms of Service, please contact us:</p>
            <ul className="space-y-1">
              <li><strong>Email:</strong> legal@cryptomine.pro</li>
              <li><strong>Address:</strong> CryptoMine Pro Legal Department</li>
              <li><strong>Phone:</strong> +1 (555) 123-4567</li>
            </ul>
            <p>
              These Terms of Service constitute the entire agreement between you and CryptoMine Pro regarding the use of our services.
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}