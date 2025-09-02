import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Headphones, Mail, Phone, MessageCircle } from "lucide-react";

export default function PublicSupportForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/contact-support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Your support request has been submitted. We'll get back to you soon!",
        });
        setFormData({
          name: "",
          email: "",
          subject: "",
          category: "",
          message: "",
        });
      } else {
        throw new Error("Failed to submit");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cmc-dark py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-cmc-blue/10 p-4 rounded-full">
              <Headphones className="w-12 h-12 text-cmc-blue" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4" data-testid="text-support-title">
            Get Support
          </h1>
          <p className="text-xl text-cmc-gray max-w-2xl mx-auto">
            Need help? We're here to assist you. Fill out the form below and our support team will get back to you as soon as possible.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="md:col-span-1">
            <Card className="bg-cmc-card border-gray-700 h-fit" data-testid="card-contact-info">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-cmc-blue" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-cmc-blue mt-1" />
                  <div>
                    <p className="text-white font-medium">Email</p>
                    <p className="text-cmc-gray text-sm">support@cryptomine.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-cmc-blue mt-1" />
                  <div>
                    <p className="text-white font-medium">Phone</p>
                    <p className="text-cmc-gray text-sm">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="bg-cmc-blue/10 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Support Hours</h4>
                  <p className="text-cmc-gray text-sm">
                    Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                    Saturday - Sunday: 10:00 AM - 4:00 PM EST
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Support Form */}
          <div className="md:col-span-2">
            <Card className="bg-cmc-card border-gray-700" data-testid="card-support-form">
              <CardHeader>
                <CardTitle className="text-white">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-white">Full Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-cmc-dark border-gray-600 text-white mt-2"
                        placeholder="Your full name"
                        data-testid="input-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-white">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-cmc-dark border-gray-600 text-white mt-2"
                        placeholder="your@email.com"
                        data-testid="input-email"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="subject" className="text-white">Subject *</Label>
                      <Input
                        id="subject"
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="bg-cmc-dark border-gray-600 text-white mt-2"
                        placeholder="Brief description of your issue"
                        data-testid="input-subject"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category" className="text-white">Category</Label>
                      <Select onValueChange={(value) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger className="bg-cmc-dark border-gray-600 text-white mt-2" data-testid="select-category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent className="bg-cmc-dark border-gray-600">
                          <SelectItem value="general" className="text-white hover:bg-gray-700">General Inquiry</SelectItem>
                          <SelectItem value="account" className="text-white hover:bg-gray-700">Account Issues</SelectItem>
                          <SelectItem value="technical" className="text-white hover:bg-gray-700">Technical Support</SelectItem>
                          <SelectItem value="payment" className="text-white hover:bg-gray-700">Payment & Billing</SelectItem>
                          <SelectItem value="mining" className="text-white hover:bg-gray-700">Mining Plans</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-white">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="bg-cmc-dark border-gray-600 text-white mt-2 min-h-[120px]"
                      placeholder="Please provide details about your issue or question..."
                      data-testid="textarea-message"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-cmc-blue hover:bg-blue-600 text-white"
                    data-testid="button-submit-support"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}