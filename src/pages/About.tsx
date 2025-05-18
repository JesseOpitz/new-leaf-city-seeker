
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">About New Leaf</h1>
            <p className="text-xl text-gray-600">
              How we help you find your perfect city
            </p>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-2xl font-semibold text-leaf-dark">Our Data Sources</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                New Leaf uses data from multiple trusted sources to create comprehensive city profiles:
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>U.S. Census Bureau</strong> - For demographic information, population density, and diversity metrics</li>
                <li><strong>FBI Uniform Crime Report</strong> - For safety and crime statistics</li>
                <li><strong>Bureau of Labor Statistics</strong> - For employment data and job market health</li>
                <li><strong>Walk Score®</strong> - For walkability and transit accessibility metrics</li>
                <li><strong>Housing databases</strong> - For affordability and cost of living information</li>
                <li><strong>Election data</strong> - For political leaning statistics</li>
              </ul>
              
              <p>
                Our data is regularly updated to ensure accuracy and relevance in our recommendations.
              </p>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-2xl font-semibold text-leaf-dark">Our Matching Algorithm</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                New Leaf's recommendation engine works through a series of weighted comparisons:
              </p>
              
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  <strong>Preference Weighting</strong> - Your slider inputs determine how heavily each factor is weighted in the overall score
                </li>
                <li>
                  <strong>Ranking Inversion</strong> - We convert raw data rankings so that lower numbers are better (e.g., a crime_rank of 1 is the safest)
                </li>
                <li>
                  <strong>Score Calculation</strong> - Each city receives a score based on how well it matches your weighted preferences
                </li>
                <li>
                  <strong>Special Handling</strong> - Factors like density preference and political leaning use custom logic to find your ideal match
                </li>
                <li>
                  <strong>Sorting and Selection</strong> - Cities are sorted by total score, and we present the top matches (and optionally, bottom matches)
                </li>
              </ol>
              
              <p className="mt-4">
                Our algorithm is designed to be transparent and explainable, focusing on factors that genuinely impact quality of life.
              </p>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-2xl font-semibold text-leaf-dark">AI-Powered Descriptions</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                New Leaf offers two paths to find your ideal city:
              </p>
              
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  <strong>Structured Questionnaire</strong> - Answer specific questions about your preferences
                </li>
                <li>
                  <strong>Natural Language Description</strong> - Describe your ideal city in your own words, and our AI interprets your preferences
                </li>
              </ol>
              
              <p className="mt-4">
                Our AI analyzes your description for key phrases and sentiment to determine preference weights for each category.
                This feature uses advanced natural language processing to understand nuanced preferences about lifestyle and environment.
              </p>
              
              <p className="text-sm text-muted-foreground italic mt-4">
                Note: The AI description feature is currently in development and will be available soon.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold text-leaf-dark">Our Mission</h2>
            </CardHeader>
            <CardContent>
              <p>
                New Leaf was created to help people find places where they can truly thrive. We believe that finding the right community
                and environment can dramatically improve quality of life, happiness, and personal growth.
              </p>
              <p className="mt-4">
                Our goal is to provide objective, data-driven recommendations that consider the full range of factors that make a place livable,
                from practical concerns like safety and affordability to lifestyle preferences like walkability and cultural fit.
              </p>
              <p className="mt-4">
                We're committed to continuous improvement and expanding our data sources to provide even more personalized and accurate recommendations.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
