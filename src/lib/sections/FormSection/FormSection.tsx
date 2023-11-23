export interface FormSectionProps {}
import "./FormSection.scss";

export const FormSection = ({ children }: React.PropsWithChildren) => {
  return <div className="p-form-section">{children}</div>;
};

const FormSectionTitle = ({ children }: React.PropsWithChildren) => {
  return (
    <h5 className="p-form-section__title u-no-padding--top">{children}</h5>
  );
};

const FormSectionDescription = ({ children }: React.PropsWithChildren) => {
  return <p className="p-form-help-text">{children}</p>;
};
const FormSectionContent = ({ children }: React.PropsWithChildren) => {
  return <div className="p-form-section__content">{children}</div>;
};

FormSection.Title = FormSectionTitle;
FormSection.Description = FormSectionDescription;
FormSection.Content = FormSectionContent;
