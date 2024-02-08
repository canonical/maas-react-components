import { Spinner } from "@canonical/react-components";

export interface ProgressIndicatorProps {
  percentComplete: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  percentComplete,
}: ProgressIndicatorProps) => {
  return (
    <small>
      {percentComplete}% <Spinner />
    </small>
  );
};
