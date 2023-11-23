import { createContext, useContext, useId } from "react";

import "./InputGroup.scss";

export interface InputGroupProps {
  label: string;
}

const InputGroupContext = createContext<ReturnType<typeof useId> | null>(null);

export const InputGroup = ({ children }: React.PropsWithChildren) => {
  const id = useId();
  return (
    <InputGroupContext.Provider value={id}>
      <div
        role="group"
        aria-labelledby={`${id}_label`}
        aria-describedby={`${id}_description`}
        className="p-input-group"
      >
        {children}
      </div>
    </InputGroupContext.Provider>
  );
};

const InputGroupLabel = ({ children }: React.PropsWithChildren) => {
  const id = useContext(InputGroupContext);
  return <label id={`${id}_label`}>{children}</label>;
};

const InputGroupDescription = ({ children }: React.PropsWithChildren) => {
  const id = useContext(InputGroupContext);
  return (
    <p className="p-form-help-text" id={`${id}_description`}>
      {children}
    </p>
  );
};

InputGroup.Label = InputGroupLabel;
InputGroup.Description = InputGroupDescription;
