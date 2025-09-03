import { useState, useEffect } from "react";

const ONBOARDING_STORAGE_KEY = "cryptomine_onboarding_completed";

export interface OnboardingState {
  isCompleted: boolean;
  shouldShow: boolean;
  currentStep: number;
}

export function useOnboarding() {
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    isCompleted: false,
    shouldShow: false,
    currentStep: 0
  });

  useEffect(() => {
    const stored = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    const isCompleted = stored === "true";
    
    setOnboardingState(prev => ({
      ...prev,
      isCompleted,
      shouldShow: !isCompleted
    }));
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
    setOnboardingState({
      isCompleted: true,
      shouldShow: false,
      currentStep: 0
    });
  };

  const resetOnboarding = () => {
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    setOnboardingState({
      isCompleted: false,
      shouldShow: true,
      currentStep: 0
    });
  };

  const hideOnboarding = () => {
    setOnboardingState(prev => ({
      ...prev,
      shouldShow: false
    }));
  };

  const showOnboarding = () => {
    setOnboardingState(prev => ({
      ...prev,
      shouldShow: true
    }));
  };

  const setCurrentStep = (step: number) => {
    setOnboardingState(prev => ({
      ...prev,
      currentStep: step
    }));
  };

  return {
    onboardingState,
    completeOnboarding,
    resetOnboarding,
    hideOnboarding,
    showOnboarding,
    setCurrentStep
  };
}