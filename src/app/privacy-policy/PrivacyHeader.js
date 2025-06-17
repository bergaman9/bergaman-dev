"use client";

import PageHeader from '../components/PageHeader';

export default function PrivacyHeader({ lastUpdated }) {
  return (
    <PageHeader
      title="Privacy Policy"
      subtitle={`Last updated: ${lastUpdated}`}
      icon="fas fa-shield-alt"
      backButton={true}
      backButtonText="Back to Home"
      onBackClick={() => window.location.href = '/'}
      maxWidth="max-w-4xl"
      centered={true}
      variant="large"
    />
  );
} 