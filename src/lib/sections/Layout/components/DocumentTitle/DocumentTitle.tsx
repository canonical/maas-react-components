import { Children, useEffect } from "react";

const DocumentTitle = ({ children }: { children: string[] | string }) => {
  useEffect(() => {
    document.title = Children.toArray(children).join("");
  }, [children]);

  return null;
};

export default DocumentTitle;
