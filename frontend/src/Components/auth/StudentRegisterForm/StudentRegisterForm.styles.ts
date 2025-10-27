// src/components/students/StudentRegisterForm/StudentRegisterForm.styles.ts
import styled from "styled-components";

export const FormContainer = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;

  @media (max-width: 480px) {
    max-width: 100%;
  }
`;

export const FormCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 8px;
  }
`;

export const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  @media (max-width: 480px) {
    margin-bottom: 1.5rem;
  }
`;

export const FormTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 0.5rem;
  font-family: "Inter", sans-serif;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.25rem;
    margin-bottom: 0.25rem;
  }
`;

export const FormSubtitle = styled.p`
  color: #64748b;
  font-size: 1rem;
  font-family: system-ui, -apple-system, sans-serif;

  @media (max-width: 480px) {
    font-size: 0.9rem;
    line-height: 1.4;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (max-width: 480px) {
    gap: 1.5rem;
  }
`;

export const FormSection = styled.div`
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 10px;
  border: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    padding: 1.25rem;
    border-radius: 8px;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 6px;
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
`;

export const SectionIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #2563eb, #1e40af);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;

  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }
`;

export const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a365d;
  margin: 0;
  font-family: "Inter", sans-serif;

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

export const SectionDescription = styled.p`
  color: #64748b;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  font-family: system-ui, -apple-system, sans-serif;

  @media (max-width: 480px) {
    font-size: 0.85rem;
    margin-bottom: 1rem;
    line-height: 1.3;
  }
`;

export const InputGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

export const FullWidthGrid = styled.div`
  grid-column: 1 / -1;
`;

export const InputGroup = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-family: "Inter", sans-serif;

  @media (max-width: 480px) {
    font-size: 0.85rem;
    margin-bottom: 0.375rem;
  }
`;

export const RequiredStar = styled.span`
  color: #dc2626;
  margin-left: 2px;
`;

export const Input = styled.input<{ $hasError?: boolean }>`
  padding: 0.75rem 1rem;
  border: 2px solid ${(props) => (props.$hasError ? "#DC2626" : "#E2E8F0")};
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  background: white;
  color: #1f2937;
  width: 100%;
  font-family: system-ui, -apple-system, sans-serif;

  &:focus {
    outline: none;
    border-color: ${(props) => (props.$hasError ? "#DC2626" : "#2563EB")};
    box-shadow: 0 0 0 3px
      ${(props) =>
        props.$hasError ? "rgba(220, 38, 38, 0.1)" : "rgba(37, 99, 235, 0.1)"};
  }

  &::placeholder {
    color: #9ca3af;
    font-size: 0.9rem;
  }

  &:disabled {
    background: #f3f4f6;
    color: #6b7280;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    padding: 0.625rem 0.75rem;
    font-size: 0.9rem;
    border-radius: 6px;
  }
`;

export const Select = styled.select<{ $hasError?: boolean }>`
  padding: 0.75rem 1rem;
  border: 2px solid ${(props) => (props.$hasError ? "#DC2626" : "#E2E8F0")};
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  background: white;
  color: #1f2937;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1.25em 1.25em;
  width: 100%;
  font-family: system-ui, -apple-system, sans-serif;

  &:focus {
    outline: none;
    border-color: ${(props) => (props.$hasError ? "#DC2626" : "#2563EB")};
    box-shadow: 0 0 0 3px
      ${(props) =>
        props.$hasError ? "rgba(220, 38, 38, 0.1)" : "rgba(37, 99, 235, 0.1)"};
  }

  @media (max-width: 480px) {
    padding: 0.625rem 0.75rem;
    font-size: 0.9rem;
    border-radius: 6px;
    background-position: right 0.5rem center;
  }
`;

export const Textarea = styled.textarea<{ $hasError?: boolean }>`
  padding: 0.75rem 1rem;
  border: 2px solid ${(props) => (props.$hasError ? "#DC2626" : "#E2E8F0")};
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  background: white;
  color: #1f2937;
  resize: vertical;
  min-height: 80px;
  font-family: system-ui, -apple-system, sans-serif;
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${(props) => (props.$hasError ? "#DC2626" : "#2563EB")};
    box-shadow: 0 0 0 3px
      ${(props) =>
        props.$hasError ? "rgba(220, 38, 38, 0.1)" : "rgba(37, 99, 235, 0.1)"};
  }

  @media (max-width: 480px) {
    padding: 0.625rem 0.75rem;
    font-size: 0.9rem;
    border-radius: 6px;
    min-height: 70px;
  }
`;

export const PasswordInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const PasswordToggle = styled.button`
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #374151;
  }

  @media (max-width: 480px) {
    right: 0.625rem;
  }
`;

export const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;

  input[type="checkbox"] {
    width: 1.125rem;
    height: 1.125rem;
    border: 2px solid #d1d5db;
    border-radius: 4px;
    accent-color: #2563eb;
  }

  @media (max-width: 480px) {
    margin-top: 0.75rem;
    gap: 0.375rem;

    input[type="checkbox"] {
      width: 1rem;
      height: 1rem;
    }
  }
`;

export const CheckboxLabel = styled.label`
  color: #374151;
  font-size: 0.9rem;
  cursor: pointer;
  line-height: 1.3;
  font-family: system-ui, -apple-system, sans-serif;

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;

  @media (max-width: 640px) {
    flex-direction: column-reverse;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }
`;

export const SecondaryButton = styled.button`
  padding: 0.875rem 2rem;
  border: 2px solid #e5e7eb;
  background: white;
  color: #374151;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  font-family: "Inter", sans-serif;

  &:hover {
    border-color: #2563eb;
    color: #2563eb;
    background: #f8fafc;
  }

  @media (max-width: 480px) {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
    border-radius: 6px;
  }
`;

export const PrimaryButton = styled.button`
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-family: "Inter", sans-serif;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 480px) {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
    border-radius: 6px;

    .spinner {
      width: 14px;
      height: 14px;
    }
  }
`;

export const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 0.8rem;
  margin-top: 0.375rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-family: system-ui, -apple-system, sans-serif;

  @media (max-width: 480px) {
    font-size: 0.75rem;
    gap: 0.25rem;
    margin-top: 0.25rem;
  }
`;

export const SuccessMessage = styled.div`
  color: #059669;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: system-ui, -apple-system, sans-serif;

  @media (max-width: 480px) {
    font-size: 0.85rem;
    padding: 0.75rem;
    margin-bottom: 1rem;
    gap: 0.375rem;
    border-radius: 6px;
  }
`;

export const FormFooter = styled.div`
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;

  @media (max-width: 480px) {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
  }
`;

export const InfoText = styled.p`
  color: #6b7280;
  font-size: 0.85rem;
  font-family: system-ui, -apple-system, sans-serif;

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;
