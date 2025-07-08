import { useState } from "react";
import ExternalLink from "./ExternalLink";

export default function LinkWarning({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const [showModal, setShowModal] = useState(false);

  function isExternalLink(url: string): boolean { // compare passed url to current window
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
      setShowModal(true);
    }
  };

  return (
    <>
      <a href={href} onClick={handleClick}>
        {children}
      </a>
      {showModal && (
        <ExternalLink
          url={href}
          onCancel={() => setShowModal(false)}
          onConfirm={() => (window.location.href = href)}
        />
      )}
    </>
  );
}
