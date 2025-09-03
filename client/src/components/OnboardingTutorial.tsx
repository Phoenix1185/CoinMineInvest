import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Coins, 
  TrendingUp, 
  Wallet, 
  Settings, 
  HelpCircle,
  CheckCircle,
  Play,
  Zap
} from "lucide-react";

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  content: string;
  target?: string;
  position?: "top" | "bottom" | "left" | "right";
  icon: React.ComponentType<any>;
  action?: {
    text: string;
    href?: string;
    onClick?: () => void;
  };
}

interface OnboardingTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: "welcome",
    title: "Welcome to CryptoMine Pro!",
    description: "Let's get you started with cryptocurrency mining",
    content: "Welcome to the future of cryptocurrency mining! CryptoMine Pro makes it easy to start earning Bitcoin with our cloud-based mining platform. This quick tutorial will show you everything you need to know.",
    icon: Coins,
    action: {
      text: "Let's Begin!"
    }
  },
  {
    id: "dashboard",
    title: "Your Mining Dashboard",
    description: "Monitor your mining operations in real-time",
    content: "Your dashboard is your mission control center. Here you can see your active mining contracts, real-time earnings, current balance, and mining performance. Everything updates live as your miners work 24/7.",
    target: "mining-dashboard",
    position: "bottom",
    icon: TrendingUp,
    action: {
      text: "Explore Dashboard",
      href: "/"
    }
  },
  {
    id: "mining-plans",
    title: "Choose Your Mining Plan",
    description: "Select the perfect mining contract for your goals",
    content: "We offer three mining plans designed for different investment levels. Each plan provides different mining power (hashrate) and potential returns. Start small with our $10 Starter plan or go big with Enterprise for maximum earnings.",
    target: "mining-plans",
    position: "top",
    icon: Zap,
    action: {
      text: "View Plans"
    }
  },
  {
    id: "earnings",
    title: "Track Your Earnings",
    description: "Watch your Bitcoin accumulate every second",
    content: "Your earnings update in real-time! Watch as your miners generate Bitcoin 24/7. You can track daily, weekly, and monthly earnings. All earnings are automatically credited to your account balance.",
    target: "earnings-section",
    position: "left",
    icon: Coins,
    action: {
      text: "Check Earnings"
    }
  },
  {
    id: "withdrawals",
    title: "Withdraw Your Profits",
    description: "Cash out your earnings anytime",
    content: "Ready to cash out? Our withdrawal system supports multiple cryptocurrencies including Bitcoin, Ethereum, USDT, and more. Withdrawals are processed quickly and securely to your personal wallet.",
    target: "withdrawal-button",
    position: "top",
    icon: Wallet,
    action: {
      text: "Learn Withdrawals"
    }
  },
  {
    id: "support",
    title: "Get Help When You Need It",
    description: "24/7 support is always available",
    content: "Have questions? Our support team is here to help! You can create support tickets, browse our FAQ, or contact us directly. We're committed to making your mining experience smooth and profitable.",
    target: "support-section",
    position: "bottom",
    icon: HelpCircle,
    action: {
      text: "Contact Support"
    }
  },
  {
    id: "complete",
    title: "You're All Set!",
    description: "Ready to start your mining journey",
    content: "Congratulations! You now know how to use CryptoMine Pro. Start by purchasing your first mining contract, watch your earnings grow, and don't hesitate to reach out if you need help. Welcome to the mining community!",
    icon: CheckCircle,
    action: {
      text: "Start Mining!",
      href: "/"
    }
  }
];

export default function OnboardingTutorial({ isOpen, onClose, onComplete }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  const currentStepData = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete();
    onClose();
  };

  const handleSkip = () => {
    onClose();
  };

  const handleAction = () => {
    if (currentStepData.action?.onClick) {
      currentStepData.action.onClick();
    } else if (currentStepData.action?.href) {
      // In a real app, you'd use your router here
      window.location.hash = currentStepData.action.href;
    }
    handleNext();
  };

  if (!isOpen) return null;

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="bg-orange-500 hover:bg-orange-600 shadow-lg"
          data-testid="tutorial-restore-button"
        >
          <Play className="w-4 h-4 mr-2" />
          Resume Tutorial
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
      
      {/* Tutorial Card */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-gray-900/95 border-gray-700 shadow-2xl">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-500/20 p-2 rounded-lg">
                  <currentStepData.icon className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <CardTitle className="text-white text-xl">{currentStepData.title}</CardTitle>
                  <CardDescription className="text-gray-300">
                    {currentStepData.description}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(true)}
                  className="text-gray-400 hover:text-white"
                  data-testid="tutorial-minimize-button"
                >
                  _
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="text-gray-400 hover:text-white"
                  data-testid="tutorial-close-button"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Progress</span>
                <span className="text-orange-400 font-medium">
                  {currentStep + 1} of {tutorialSteps.length}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Content */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <p className="text-gray-300 leading-relaxed text-lg">
                {currentStepData.content}
              </p>
            </div>

            {/* Step Indicators */}
            <div className="flex justify-center space-x-2">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index <= currentStep 
                      ? 'bg-orange-500' 
                      : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center space-x-3">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    data-testid="tutorial-previous-button"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  className="text-gray-400 hover:text-gray-300"
                  data-testid="tutorial-skip-button"
                >
                  Skip Tutorial
                </Button>
              </div>

              <div className="flex items-center space-x-3">
                {currentStepData.action && (
                  <Button
                    onClick={handleAction}
                    className="bg-orange-500 hover:bg-orange-600"
                    data-testid="tutorial-action-button"
                  >
                    {currentStepData.action.text}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
                {!currentStepData.action && currentStep < tutorialSteps.length - 1 && (
                  <Button
                    onClick={handleNext}
                    className="bg-orange-500 hover:bg-orange-600"
                    data-testid="tutorial-next-button"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
                {currentStep === tutorialSteps.length - 1 && !currentStepData.action && (
                  <Button
                    onClick={handleComplete}
                    className="bg-green-600 hover:bg-green-700"
                    data-testid="tutorial-complete-button"
                  >
                    Complete
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}