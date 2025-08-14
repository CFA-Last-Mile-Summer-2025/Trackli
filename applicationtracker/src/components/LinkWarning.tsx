import { useState } from "react";
import ExternalLink from "./ExternalLink";
import DidYouApply from "./DidYouApply";
import { fetchWithAuth } from "@/utils/tokenChecker";
import { createPortal } from "react-dom";


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
    skills?: string;
    job_type?: string;
    url: string;
    date_expiration?: string;
    description_text?: string;
    location: string;
    _id?: string;
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
    const token = localStorage.getItem("token");
    if (!token) {
      return console.error("No token found");
    }
    if (!choice) {
      await fetchWithAuth("http://localhost:3002/viewed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(job),
      });
    } else {
      await fetchWithAuth("http://localhost:3002/applied", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(job),
      });

      await fetchWithAuth("http://localhost:3002/myjob", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...job, status: "applied" }),
      });
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isExternalLink(href)) {
      e.preventDefault();
      setModalState("link");
    }
  };

    const modalContent = (
    <>
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
            handlePromptChoice(true);
            setModalState("none");
          }}
          onNo={() => {
            handlePromptChoice(false);
            setModalState("none");
          }}
        />
      )}
    </>
  );

  return (
    <>
      <a href={href} onClick={handleClick}>
        {children}
      </a>

      {modalState !== "none" && 
        createPortal(modalContent, document.body)
      }
    </>
  );
}