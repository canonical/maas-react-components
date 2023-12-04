import { Icon as VanillaIcon } from "@canonical/react-components";

export interface NavigationIconProps {
  light?: boolean;
  name: string;
}

export const Icon = ({ light=true, name }: NavigationIconProps) => {
  
  return (
    <VanillaIcon className="p-side-navigation__icon" light={light} name={name}/>
  )
}
