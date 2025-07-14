import { useState } from "react";
import ExternalLink from "./ExternalLink";
import DidYouApply from "./DidYouApply";


export default function LinkWarning({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const [modalState, setModalState] = useState<"none" | "link" | "applied">("none");

  function isExternalLink(url: string): boolean {
    // compare passed url to current window
    try {
      const link = new URL(url, window.location.href);
      return link.origin !== window.location.origin;
    } catch {
      return false;
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    if (isExternalLink(href)) {
      e.preventDefault();
      setModalState("link");
    }
  };

 return (
    <>
      <a href={href} onClick={handleClick}>
        {children}
      </a>

      {modalState === "link" && (
        <ExternalLink
          url={href}
          onCancel={() => setModalState("none")}
          onConfirm={() => {
            window.open(href, "_blank");
            setModalState("applied");
          }}
        />
      )}

      {modalState === "applied" && (
        <DidYouApply
          onYes={() => {
            console.log("User confirmed they applied.");
            setModalState("none");
          }}
          onNo={() => {
            console.log("User did not apply.");
            setModalState("none");
          }}
        />
      )}
    </>
  );
}
