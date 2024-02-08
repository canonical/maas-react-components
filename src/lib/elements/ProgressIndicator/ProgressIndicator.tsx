import { Spinner } from "@canonical/react-components";
import "./ProgressIndicator.scss";

export interface ProgressIndicatorProps {
  percentComplete: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  percentComplete,
}: ProgressIndicatorProps) => {
  return (
    <small className="progress-indicator">
      {percentComplete}% <Spinner className="progress-indicator__spinner" />
    </small>
  );
};
