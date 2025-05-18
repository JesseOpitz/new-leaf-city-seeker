
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const Policy = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-gray-600">
              How we handle your data
            </p>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-2xl font-semibold text-leaf-dark">Our Privacy Commitment</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                New Leaf is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website.
              </p>
              
              <h3 className="text-xl font-medium mt-6">Information We Collect</h3>
              
              <p><strong>We do not collect personal information</strong> such as names, emails, or addresses.</p>
              
              <p>The only data we collect includes:</p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Questionnaire responses</strong> - Your preference settings on various lifestyle factors</li>
                <li><strong>Free-form descriptions</strong> - If you use our AI feature, the text you enter describing your ideal city</li>
                <li><strong>Anonymous usage data</strong> - General information about site traffic and interaction</li>
              </ul>
              
              <h3 className="text-xl font-medium mt-6">How We Use Your Information</h3>
              
              <p>We use the information collected solely to:</p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Generate city recommendations based on your stated preferences</li>
                <li>Improve our algorithm and user experience</li>
                <li>Analyze general usage patterns to enhance our service</li>
              </ul>
              
              <p>Your questionnaire responses and city descriptions are:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Stored only in your browser's local storage (localStorage)</li>
                <li>Not permanently stored on our servers</li>
                <li>Not linked to any identifiable information</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold text-leaf-dark">Cookie Policy</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                New Leaf uses minimal cookies that are necessary for the website to function properly. We do not use cookies for tracking or advertising purposes.
              </p>
              
              <h3 className="text-xl font-medium mt-6">Types of Cookies We Use</h3>
              
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Essential cookies</strong> - Required for basic website functionality</li>
                <li><strong>Analytics cookies</strong> - Help us understand how visitors interact with our website through anonymized data collection</li>
              </ul>
              
              <h3 className="text-xl font-medium mt-6">Your Control Over Cookies</h3>
              
              <p>
                Most web browsers allow you to control cookies through their settings preferences. However, limiting cookies may impact the functionality of our website.
              </p>
              
              <h3 className="text-xl font-medium mt-6">Contact Information</h3>
              
              <p>
                If you have any questions about our Privacy or Cookie Policy, please contact us at:<br />
                <span className="text-leaf-dark">privacy@newleaf-cities.example.com</span>
              </p>
              
              <p className="text-sm text-muted-foreground mt-6">
                Last updated: May 15, 2025
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Policy;
