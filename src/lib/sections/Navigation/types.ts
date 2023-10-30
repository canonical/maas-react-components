import { ElementType } from "react";

export interface AsProp<C extends ElementType> {
  as?: C;
}
