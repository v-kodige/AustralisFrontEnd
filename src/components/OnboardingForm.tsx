
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Share, Building, Upload, ArrowRight, ArrowLeft, Check } from "lucide-react";

interface OnboardingFormProps {
  user: any;
  onComplete: () => void;
}

const OnboardingForm = ({ user, onComplete }: OnboardingFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nickname: "",
    organizationName: "",
    organizationDescription: "",
    logo: null as File | null,
  });

  const totalSteps = 4;

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      updateFormData("logo", file);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Here you would typically save the data to your database
      // For now, we'll just show a success message
      console.log("Form data:", formData);
      
      toast({
        title: "Welcome aboard!",
        description: "Your profile and organization have been set up successfully.",
      });
      
      onComplete();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Personal Information";
      case 2: return "Organization Setup";
      case 3: return "Customize Your Brand";
      case 4: return "Share with Your Team";
      default: return "";
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <User className="w-12 h-12 text-australis-blue mx-auto mb-3" />
              <p className="text-gray-600">Let's start by getting to know you better</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateFormData("firstName", e.target.value)}
                  placeholder="Enter your first name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateFormData("lastName", e.target.value)}
                  placeholder="Enter your last name"
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="nickname">Nickname (Optional)</Label>
              <Input
                id="nickname"
                value={formData.nickname}
                onChange={(e) => updateFormData("nickname", e.target.value)}
                placeholder="What should we call you?"
                className="mt-1"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Building className="w-12 h-12 text-australis-teal mx-auto mb-3" />
              <p className="text-gray-600">Tell us about your organization</p>
            </div>
            <div>
              <Label htmlFor="organizationName">Organization Name</Label>
              <Input
                id="organizationName"
                value={formData.organizationName}
                onChange={(e) => updateFormData("organizationName", e.target.value)}
                placeholder="Enter your organization name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="organizationDescription">Description (Optional)</Label>
              <Textarea
                id="organizationDescription"
                value={formData.organizationDescription}
                onChange={(e) => updateFormData("organizationDescription", e.target.value)}
                placeholder="Brief description of your organization"
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Upload className="w-12 h-12 text-australis-indigo mx-auto mb-3" />
              <p className="text-gray-600">Upload your organization logo for custom reports</p>
            </div>
            <div>
              <Label htmlFor="logo">Organization Logo</Label>
              <div className="mt-2 border-2 border-dashed border-australis-blue/20 rounded-lg p-6 text-center hover:border-australis-blue/40 transition-colors">
                <input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="logo" className="cursor-pointer">
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 text-australis-gray mx-auto" />
                    <p className="text-sm text-australis-gray">
                      {formData.logo ? formData.logo.name : "Click to upload logo"}
                    </p>
                    <p className="text-xs text-australis-gray/60">PNG, JPG, SVG up to 5MB</p>
                  </div>
                </label>
              </div>
            </div>
            {formData.logo && (
              <div className="bg-australis-lightBlue/10 p-4 rounded-lg">
                <p className="text-sm text-australis-blue">✓ Logo uploaded successfully!</p>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Share className="w-12 h-12 text-australis-aqua mx-auto mb-3" />
              <p className="text-gray-600">Share your organization with teammates</p>
            </div>
            <div className="bg-australis-lightBlue/10 p-6 rounded-lg">
              <h4 className="font-semibold text-australis-blue mb-3">Organization Link</h4>
              <div className="flex gap-2">
                <Input
                  value={`${window.location.origin}/join/${formData.organizationName?.toLowerCase().replace(/\s+/g, '-')}`}
                  readOnly
                  className="bg-white"
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/join/${formData.organizationName?.toLowerCase().replace(/\s+/g, '-')}`);
                    toast({ title: "Link copied!", description: "Share this link with your teammates." });
                  }}
                >
                  Copy
                </Button>
              </div>
              <p className="text-sm text-australis-gray mt-2">
                Share this link with your teammates to invite them to your organization.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <h4 className="font-semibold text-gray-800 mb-3">What's Next?</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Create and customize reports with your logo
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Collaborate with your team members
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Track progress and analytics
                </li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-australis-background via-white to-australis-lightBlue/20 flex items-center justify-center px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step <= currentStep
                        ? "bg-australis-blue text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step}
                  </div>
                  {step < 4 && (
                    <div
                      className={`w-8 h-px ${
                        step < currentStep ? "bg-australis-blue" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <CardTitle className="text-2xl text-australis-blue">
            {getStepTitle()}
          </CardTitle>
          <p className="text-sm text-gray-500">
            Step {currentStep} of {totalSteps}
          </p>
        </CardHeader>
        <CardContent>
          {renderStep()}
          
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>
            
            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                className="flex items-center gap-2 bg-australis-blue hover:bg-australis-blue/90"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 bg-australis-teal hover:bg-australis-teal/90"
              >
                {loading ? "Setting up..." : "Complete Setup"}
                <Check className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingForm;
