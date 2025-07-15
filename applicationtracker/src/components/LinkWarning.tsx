import { useState } from "react";
import ExternalLink from "./ExternalLink";
import DidYouApply from "./DidYouApply";

export default function LinkWarning({
  href,
  children,
  job,
}: {
  href: string;
  children: React.ReactNode;
  job: {
    company: string;
    title: string;
    url: string;
    skills?: string;
    job_type?: string;
    date_expiration?: string | null;
  };
}) {
  const [modalState, setModalState] = useState<"none" | "link" | "applied">(
    "none"
  );

  function isExternalLink(url: string): boolean {
    // compare passed url to current window
    try {
      const link = new URL(url, window.location.href);
      return link.origin !== window.location.origin;
    } catch {
      return false;
    }
  }

  const handlePromptChoice = async (choice: boolean) => {
    if (choice) {
      await fetch("/viewed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job),
      });
    } else {
      await fetch("/applied", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job),
      });
    }
  };

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
            handlePromptChoice(true);
            setModalState("none");
          }}
          onNo={() => {
            console.log("User did not apply.");
            handlePromptChoice(false);
            setModalState("none");
          }}
        />
      )}
    </>
  );
}
