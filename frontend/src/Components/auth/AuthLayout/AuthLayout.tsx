// src/components/auth/AuthLayout/AuthLayout.tsx
import React from "react";
import styled from "styled-components";

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: white;

  @media (max-width: 768px) {
    display: none;
  }
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;

  @media (max-width: 768px) {
    flex: 1;
  }
`;

const UniversityInfo = styled.div`
  text-align: center;
  max-width: 500px;
`;

const UniversityName = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #fff, #e2e8f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Tagline = styled.p`
  font-size: 1.25rem;
  opacity: 0.9;
  line-height: 1.6;
`;

const FeaturesList = styled.ul`
  margin-top: 2rem;
  text-align: left;

  li {
    margin: 1rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <LeftSection>
        <UniversityInfo>
          <UniversityName>Jain University</UniversityName>
          <Tagline>Empowering Education Through Technology</Tagline>
          <FeaturesList>
            <li>🎓 Student Management</li>
            <li>📊 Attendance Tracking</li>
            <li>📚 Academic Records</li>
            <li>👨‍🏫 Teacher Portal</li>
            <li>👨‍👩‍👧‍👦 Parent Access</li>
          </FeaturesList>
        </UniversityInfo>
      </LeftSection>
      <RightSection>{children}</RightSection>
    </LayoutContainer>
  );
};

export default AuthLayout;
