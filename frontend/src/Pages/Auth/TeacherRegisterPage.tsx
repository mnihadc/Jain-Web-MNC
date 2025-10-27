// src/pages/Teachers/TeacherRegisterPage.tsx
import React from "react";
import styled from "styled-components";
import TeacherRegisterForm from "../../Components/auth/TeacherRegisterForm/TeacherRegisterForm";

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a365d 0%, #2d3748 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;

  @media (max-width: 480px) {
    padding: 0.5rem;
    align-items: flex-start;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: center;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    max-width: 800px;
  }

  @media (max-width: 480px) {
    gap: 1rem;
  }
`;

const HeroSection = styled.div`
  color: white;
  padding: 1.5rem;

  @media (max-width: 968px) {
    text-align: center;
    padding: 1rem;
    order: 2;
  }

  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
  font-family: "Inter", sans-serif;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
    margin-bottom: 0.75rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.1rem;
  color: #cbd5e0;
  margin-bottom: 1.5rem;
  line-height: 1.5;
  font-family: system-ui, -apple-system, sans-serif;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    line-height: 1.4;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  margin-top: 1.5rem;

  @media (max-width: 480px) {
    gap: 0.5rem;
    margin-top: 1rem;
  }
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);

  @media (max-width: 480px) {
    padding: 0.5rem;
    gap: 0.5rem;
  }
`;

const FeatureIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #2563eb, #1e40af);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;

  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }
`;

const FeatureText = styled.div`
  flex: 1;
`;

const FeatureTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: white;
  font-family: "Inter", sans-serif;

  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 0.125rem;
  }
`;

const FeatureDescription = styled.p`
  font-size: 0.8rem;
  color: #a0aec0;
  line-height: 1.3;
  font-family: system-ui, -apple-system, sans-serif;

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

const FormContainerWrapper = styled.div`
  @media (max-width: 968px) {
    order: 1;
  }
`;

const TeacherRegisterPage: React.FC = () => {
  return (
    <PageContainer>
      <ContentWrapper>
        <HeroSection>
          <HeroTitle>Register New Teacher</HeroTitle>
          <HeroSubtitle>
            Create faculty accounts with comprehensive professional and academic
            information. Teachers will receive their login credentials upon
            successful registration.
          </HeroSubtitle>

          <FeaturesGrid>
            <FeatureItem>
              <FeatureIcon>👨‍🏫</FeatureIcon>
              <FeatureText>
                <FeatureTitle>Professional Management</FeatureTitle>
                <FeatureDescription>
                  Complete faculty and department management
                </FeatureDescription>
              </FeatureText>
            </FeatureItem>

            <FeatureItem>
              <FeatureIcon>📚</FeatureIcon>
              <FeatureText>
                <FeatureTitle>Subject Allocation</FeatureTitle>
                <FeatureDescription>
                  Assign main subjects and additional courses
                </FeatureDescription>
              </FeatureText>
            </FeatureItem>

            <FeatureItem>
              <FeatureIcon>🎓</FeatureIcon>
              <FeatureText>
                <FeatureTitle>Qualification Tracking</FeatureTitle>
                <FeatureDescription>
                  Manage academic qualifications and certifications
                </FeatureDescription>
              </FeatureText>
            </FeatureItem>

            <FeatureItem>
              <FeatureIcon>🔐</FeatureIcon>
              <FeatureText>
                <FeatureTitle>Secure Access</FeatureTitle>
                <FeatureDescription>
                  Automated password generation and secure login
                </FeatureDescription>
              </FeatureText>
            </FeatureItem>
          </FeaturesGrid>
        </HeroSection>

        <FormContainerWrapper>
          <TeacherRegisterForm />
        </FormContainerWrapper>
      </ContentWrapper>
    </PageContainer>
  );
};

export default TeacherRegisterPage;
