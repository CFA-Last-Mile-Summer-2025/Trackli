import React, { useState, useRef, useCallback } from "react";
import {
  User,
  Briefcase,
  Award,
  GraduationCap,
  Code,
  ChevronUp,
  ChevronDown,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import jsPDF from "jspdf";
import ResumeChat from "./Chatbox";

interface WorkExperience {
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  jobDescription: string;
}

interface Education {
  degree: string;
  major: string;
  school: string;
  graduationYear: string;
}

interface Project {
  title: string;
  description: string;
}

//Resumebuilder form resusable inputs

// Input component
const InputField: React.FC<{
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  className?: string;
}> = React.memo(({ label, placeholder, value, onChange, type = "text", className = "flex-1" }) => (
  <div className={`flex flex-col ${className}`}>
    <label className="font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      className="bg-[#cebff9]/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2 text-base placeholder-gray-500 focus:border-white/50 focus:ring-2 focus:ring-white/20 focus:bg-white/30 outline-none w-full transition-all duration-200"
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </div>
));

// Textarea component
const TextareaField: React.FC<{
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  minHeight?: string;
}> = React.memo(
  ({ label, placeholder, value, onChange, minHeight = "60px" }) => (
    <div className="flex flex-col">
      <label className="font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        className="bg-[#cebff9]/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2 text-base placeholder-gray-500 focus:border-white/50 focus:ring-2 focus:ring-white/20 focus:bg-white/30 outline-none w-full resize-y transition-all duration-200"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ minHeight }}
      />
    </div>
  )
);

// Section header component
const SectionHeader: React.FC<{
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  onEnhance?: () => void;
}> = React.memo(({ title, isOpen, onToggle, onEnhance }) => (
  <div className="flex items-center justify-between mb-0">
    <div
      className="flex items-center cursor-pointer font-semibold text-lg text-gray-800 group"
      onClick={onToggle}
    >
      <span>{title}</span>
      <span className="ml-2 transition-transform duration-200 group-hover:scale-110">
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </span>
    </div>
    <Button
      className="ml-4 px-3 py-1 rounded-md font-semibold flex text-sm"
      variant={"gradient"}
      onClick={onEnhance}
    >
      <span role="img" aria-label="stars">
        ✨
      </span>{" "}
      Enhance with AI
    </Button>
  </div>
));

// Section container component
const SectionContainer: React.FC<{
  children: React.ReactNode;
  id: string;
}> = React.memo(({ children, id }) => (
  <div
    id={id}
    className="bg-white/10 backdrop-blur-xl rounded-xl mb-5 p-5 shadow-lg border border-white/20"
  >
    {children}
  </div>
));

// Work experience item component
const WorkExperienceItem: React.FC<{
  experience: WorkExperience;
  index: number;
  onChange: (idx: number, field: keyof WorkExperience, value: string) => void;
  onDelete: (idx: number) => void;
  canDelete: boolean;
  isLast: boolean;
}> = React.memo(
  ({ experience, index, onChange, onDelete, canDelete, isLast }) => (
    <div className={`mb-4 pb-3 ${!isLast ? "border-b border-gray-200" : ""}`}>
      <div className="flex gap-4 mb-4">
        <InputField
          label="Job Title"
          placeholder="Enter job title"
          value={experience.jobTitle}
          onChange={(value) => onChange(index, "jobTitle", value)}
        />
        <InputField
          label="Company"
          placeholder="Enter company"
          value={experience.company}
          onChange={(value) => onChange(index, "company", value)}
        />
      </div>
      <div className="flex gap-4 mb-4">
        <InputField
          label="Start Date"
          placeholder="mm/dd/yyyy"
          value={experience.startDate}
          onChange={(value) => onChange(index, "startDate", value)}
        />
        <InputField
          label="End Date"
          placeholder="mm/dd/yyyy"
          value={experience.endDate}
          onChange={(value) => onChange(index, "endDate", value)}
        />
      </div>
      <TextareaField
        label="Job Description"
        placeholder="Describe your role"
        value={experience.jobDescription}
        onChange={(value) => onChange(index, "jobDescription", value)}
        minHeight="50px"
      />
      {canDelete && (
        <div className="flex justify-end mt-2">
          <button
            type="button"
            className="text-xs text-gray-400 hover:text-red-500 transition-all duration-200 hover:bg-red-50 px-2 py-1 rounded"
            onClick={() => onDelete(index)}
          >
            Remove
          </button>
        </div>
      )}
    </div>
  )
);

// Side navigation component
// const SideNavigation: React.FC<{
//   sections: Array<{ id: string; title: string; icon: React.ReactNode }>;
// }> = ({ sections }) => {
//   const scrollToSection = (sectionId: string) => {
//     const element = document.getElementById(sectionId);
//     if (element) {
//       element.scrollIntoView({ behavior: 'smooth', block: 'center' });
//     }
//   };

//   return (
//     <div className="fixed left-6 top-1/2 transform -translate-y-1/2 z-10 hidden lg:block">
//       <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 shadow-2xl border border-white/20 hover:shadow-2xl transition-all duration-300">
//         <div className="space-y-2">
//           {sections.map((section) => (
//             <button
//               key={section.id}
//               onClick={() => scrollToSection(section.id)}
//               className="flex items-center gap-3 text-sm text-gray-700 hover:text-slate-800 transition-all duration-200 p-2.5 rounded-lg hover:bg-white/20 hover:shadow-sm w-full text-left group"
//               title={section.title}
//             >
//               <span className="text-base group-hover:scale-110 transition-transform duration-200">{section.icon}</span>
//               <span className="font-medium whitespace-nowrap">{section.title}</span>
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

const ResumeBuilder: React.FC = () => {
  const [personalOpen, setPersonalOpen] = useState(true);
  const [workOpen, setWorkOpen] = useState(true);
  const [skillsOpen, setSkillsOpen] = useState(true);
  const [educationOpen, setEducationOpen] = useState(true);
  const [projectOpen, setProjectOpen] = useState(true);
   const [chatOpen, setChatOpen] = useState(false);

  const [personal, setPersonal] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    summary: "",
  });

  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([
    {
      jobTitle: "",
      company: "",
      startDate: "",
      endDate: "",
      jobDescription: "",
    },
  ]);

  const [skills, setSkills] = useState({
    technical: "",
    soft: "",
  });

  const [education, setEducation] = useState<Education>({
    degree: "",
    major: "",
    school: "",
    graduationYear: "",
  });

  const [project, setProject] = useState<Project>({
    title: "",
    description: "",
  });

  const handleWorkChange = useCallback(
    (idx: number, field: keyof WorkExperience, value: string) => {
      const updated = [...workExperiences];
      updated[idx][field] = value;
      setWorkExperiences(updated);
    },
    [workExperiences]
  );

  const addWorkExperience = useCallback(() => {
    setWorkExperiences((prev) => [
      ...prev,
      {
        jobTitle: "",
        company: "",
        startDate: "",
        endDate: "",
        jobDescription: "",
      },
    ]);
  }, []);

  const handleDeleteWorkExperience = useCallback((idx: number) => {
    setWorkExperiences((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const downloadPDF = useCallback(() => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    const rightMargin = 200;
    const maxLineWidth = pageWidth - margin * 2;

    // Header with name
    doc.setFontSize(24);
    doc.setFont("garamond", "bold");
    const fullName =
      `${personal.firstName} ${personal.lastName}`.trim() || "Your Name";
    doc.text(fullName, pageWidth / 2, 15, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("times", "normal");
    doc.text(
      `Email: ${personal.email} | Phone: ${personal.phone}`,
      pageWidth / 2,
      23,
      { align: "center" }
    );

    let y = 27;
    doc.setLineWidth(0.05);
    doc.line(margin, y, rightMargin, y);
    y += 6;

    // Summary section
    if (personal.summary) {
      doc.setFont("times", "bold");
      doc.text("Professional Summary", margin, y);
      doc.setLineWidth(0.3);
      y += 3;
      doc.line(margin, y, rightMargin, y);
      y += 6;
      doc.setFont("times", "normal");
      const wrappedSummary = doc.splitTextToSize(
        personal.summary,
        maxLineWidth
      );
      doc.text(wrappedSummary, margin, y);
      y += wrappedSummary.length * 4.5;
    }

    // Work Experience section
    if (workExperiences.some((exp) => exp.jobTitle || exp.company)) {
      doc.setLineWidth(0.05);
      doc.setFont("times", "bold");
      doc.line(margin, y, rightMargin, y);
      y += 6;
      doc.text("Work Experience", margin, y);
      y += 3;
      doc.setLineWidth(0.3);
      doc.line(margin, y, rightMargin, y);
      y += 6;
      doc.setFont("times", "normal");

      workExperiences.forEach((exp) => {
        if (exp.jobTitle || exp.company) {
          const dateRange = `${exp.startDate} - ${exp.endDate}`.replace(
            " - ",
            " - "
          );
          doc.text(
            `${exp.jobTitle} @ ${exp.company} | ${dateRange}`,
            margin,
            y
          );
          y += 6;
          if (exp.jobDescription) {
            const wrappedDesc = doc.splitTextToSize(
              exp.jobDescription,
              maxLineWidth
            );
            doc.text(wrappedDesc, margin, y);
            y += wrappedDesc.length * 4 + 5;
          }
        }
      });
    }

    // Education section
    if (education.degree || education.school) {
      doc.setLineWidth(0.05);
      doc.setFont("times", "bold");
      doc.line(margin, y, rightMargin, y);
      y += 6;
      doc.text("Education", margin, y);
      y += 3;
      doc.setLineWidth(0.3);
      doc.line(margin, y, rightMargin, y);
      y += 6;
      doc.setFont("times", "normal");

      const degreeText = `${education.degree}${
        education.major ? ` in ${education.major}` : ""
      } - ${education.school} | ${education.graduationYear}`;
      doc.text(degreeText, margin, y);
      y += 6;
    }

    // Skills section
    if (skills.technical || skills.soft) {
      doc.setLineWidth(0.05);
      doc.setFont("times", "bold");
      doc.line(margin, y, rightMargin, y);
      y += 6;
      doc.text("Skills", margin, y);
      y += 3;
      doc.setLineWidth(0.3);
      doc.line(margin, y, rightMargin, y);
      y += 6;
      doc.setFont("times", "normal");

      if (skills.technical) {
        doc.setFont("times", "bold");
        doc.text("Technical Skills:", margin, y);
        doc.setFont("times", "normal");
        y += 5;
        const wrappedTech = doc.splitTextToSize(
          skills.technical,
          maxLineWidth
        );
        doc.text(wrappedTech, margin, y);
        y += wrappedTech.length * 6;
      }

      if (skills.soft) {
        doc.setFont("times", "bold");
        doc.text("Soft Skills:", margin, y);
        doc.setFont("times", "normal");
        y += 5;
        const wrappedSoft = doc.splitTextToSize(skills.soft, maxLineWidth);
        doc.text(wrappedSoft, margin, y);
        y += wrappedSoft.length * 6;
      }
    }

    // Project section
    if (project.title || project.description) {
      doc.setLineWidth(0.05);
      doc.setFont("times", "bold");
      doc.line(margin, y, rightMargin, y);
      y += 6;
      doc.text("Projects", margin, y);
      y += 3;
      doc.setLineWidth(0.3);
      doc.line(margin, y, rightMargin, y);
      y += 6;
      doc.setFont("times", "normal");

      if (project.title) {
        doc.setFont("times", "bold");
        doc.text(project.title, margin, y);
        doc.setFont("times", "normal");
        y += 3;
      }
      if (project.description) {
        const wrappedProject = doc.splitTextToSize(
          project.description,
          maxLineWidth
        );
        doc.setLineWidth(0.05);
        doc.line(margin, y, rightMargin, y);
        y+=6
        doc.text(wrappedProject, margin, y);
      }
    }

    // Save the PDF
    const fileName = fullName.replace(/\s+/g, "_") + "_resume.pdf";
    doc.save(fileName);
  }, [personal, workExperiences, skills, education, project]);

  const handleGenerateResume = useCallback(async () => {
    const resumeData = {
      personal,
      workExperiences,
      skills,
      education,
      project,
    };

    try {
      // Filler for backend - edit to make functional!
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3002/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(resumeData),
      });
      console.log(token)
      if (response.ok) {
        downloadPDF();
        console.log("Resume generated successfully:");
      } else {
        console.error("Failed to generate resume");
      }
    } catch (error) {
      console.error("Error generating resume:", error);
    }
  }, [personal, workExperiences, skills, education, project]);

  const navigationSections = [
    { id: "personal", title: "Personal", icon: <User size={16} /> },
    { id: "work", title: "Experience", icon: <Briefcase size={16} /> },
    { id: "skills", title: "Skills", icon: <Award size={16} /> },
    { id: "education", title: "Education", icon: <GraduationCap size={16} /> },
    { id: "project", title: "Projects", icon: <Code size={16} /> },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Ignore for now -- messing around with how to make the background without using an image */}
      {/* <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-300 via-slate-400 to-slate-500"></div>
        
        <div className="absolute inset-0">
          <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
            <path d="M0,800 L0,600 Q200,550 400,600 T800,650 Q1000,700 1200,650 L1200,800 Z" 
                  fill="rgba(148, 163, 184, 0.4)" />
          </svg>
        </div>
        
        <div className="absolute inset-0">
          <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
            <path d="M0,800 L0,650 Q150,600 300,650 T600,700 Q900,750 1200,700 L1200,800 Z" 
                  fill="rgba(123, 142, 168, 0.5)" />
          </svg>
        </div>
        
        <div className="absolute inset-0">
          <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
            <path d="M0,800 L0,700 Q100,650 200,700 T500,750 Q800,800 1200,750 L1200,800 Z" 
                  fill="rgba(100, 116, 139, 0.6)" />
          </svg>
        </div>
        
        <div className="absolute inset-0">
          <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
            <path d="M0,800 L0,720 Q80,680 160,720 T400,770 Q700,820 1200,770 L1200,800 Z" 
                  fill="rgba(71, 85, 105, 0.7)" />
          </svg>
        </div>
        
        <div className="absolute inset-0">
          <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
            <path d="M0,800 L0,750 Q60,720 120,750 T300,780 Q600,830 1200,780 L1200,800 Z" 
                  fill="rgba(51, 65, 85, 0.8)" />
          </svg>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-600/20 via-transparent to-slate-200/10"></div>
      </div> */}

    {/* Resumebuilder form content (beyond background) beings here */}      
      <div className="relative z-10 backdrop-blur-lg bg-white/20 border border-white/30 rounded-2xl p-8 max-w-4xl mx-auto my-10 mt-20 shadow-2xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight text-left mb-2">
            Build Your Resume
          </h2>
          <p className="text-left text-gray-700 font-normal text-base mb-0">
            Fill out the sections below and enhance your content with AI
            assistance
          </p>
        </div>

        {/* Personal Information */}
        <SectionContainer id="personal">
          <SectionHeader
            title="Personal Information"
            isOpen={personalOpen}
            onToggle={() => setPersonalOpen((o) => !o)}
            onEnhance={() => setChatOpen(true)}
          />
          <div className="w-full h-px bg-white/30 rounded mt-2 mb-3"></div>
          {personalOpen && (
            <div>
              <div className="flex gap-4 mb-4">
                <InputField
                  label="First Name"
                  placeholder="Enter your first name"
                  value={personal.firstName}
                  onChange={(value) =>
                    setPersonal({ ...personal, firstName: value })
                  }
                />
                <InputField
                  label="Last Name"
                  placeholder="Enter your last name"
                  value={personal.lastName}
                  onChange={(value) =>
                    setPersonal({ ...personal, lastName: value })
                  }
                />
              </div>
              <div className="flex gap-4 mb-4">
                <InputField
                  label="Email"
                  placeholder="Enter your email"
                  value={personal.email}
                  onChange={(value) =>
                    setPersonal({ ...personal, email: value })
                  }
                  type="email"
                />
                <InputField
                  label="Phone"
                  placeholder="Enter your phone number"
                  value={personal.phone}
                  onChange={(value) =>
                    setPersonal({ ...personal, phone: value })
                  }
                  type="tel"
                />
              </div>
              <TextareaField
                label="Professional Summary"
                placeholder="Enter your professional summary"
                value={personal.summary}
                onChange={(value) =>
                  setPersonal({ ...personal, summary: value })
                }
              />
            </div>
          )}
        </SectionContainer>

        {/* Work Experience */}
        <SectionContainer id="work">
          <SectionHeader
            title="Work Experience"
            isOpen={workOpen}
            onToggle={() => setWorkOpen((o) => !o)}
            onEnhance={() => setChatOpen(true)}
          />
          <div className="w-full h-[1.5px] bg-[#E2E8F0] rounded mt-2 mb-3 opacity-100" />
          {workOpen && (
            <div>
              {workExperiences.map((exp, idx) => (
                <WorkExperienceItem
                  key={idx}
                  experience={exp}
                  index={idx}
                  onChange={handleWorkChange}
                  onDelete={handleDeleteWorkExperience}
                  canDelete={workExperiences.length > 1}
                  isLast={idx === workExperiences.length - 1}
                />
              ))}
              <button
                type="button"
                className="w-full border-2 border-dashed border-white/40 rounded-lg py-3 mt-3 text-gray-700 font-semibold bg-white/10 hover:bg-white/20 hover:border-white/60 transition-all duration-200 hover:shadow-sm backdrop-blur-sm"
                onClick={addWorkExperience}
              >
                + Add another experience
              </button>
            </div>
          )}
        </SectionContainer>

        {/* Skills */}
        <SectionContainer id="skills">
          <SectionHeader
            title="Skills"
            isOpen={skillsOpen}
            onToggle={() => setSkillsOpen((o) => !o)}
            onEnhance={() => setChatOpen(true)}
          />
          <div className="w-full h-[1.5px] bg-[#E2E8F0] rounded mt-2 mb-3 opacity-100" />
          {skillsOpen && (
            <div className="flex gap-4 mb-0">
              <InputField
                label="Technical Skills"
                placeholder="e.g. Python, React, SQL"
                value={skills.technical}
                onChange={(value) => setSkills({ ...skills, technical: value })}
              />
              <InputField
                label="Soft Skills"
                placeholder="e.g. Communication, Leadership"
                value={skills.soft}
                onChange={(value) => setSkills({ ...skills, soft: value })}
              />
            </div>
          )}
        </SectionContainer>

        {/* Education */}
        <SectionContainer id="education">
          <SectionHeader
            title="Education"
            isOpen={educationOpen}
            onToggle={() => setEducationOpen((o) => !o)}
            onEnhance={() => setChatOpen(true)}
          />
          <div className="w-full h-[1.5px] bg-[#E2E8F0] rounded mt-2 mb-3 opacity-100" />
          {educationOpen && (
            <div>
              <div className="flex gap-4 mb-4">
                <InputField
                  label="Degree"
                  placeholder="e.g. BSc, MSc"
                  value={education.degree}
                  onChange={(value) =>
                    setEducation({ ...education, degree: value })
                  }
                />
                <InputField
                  label="Major"
                  placeholder="e.g. Computer Science"
                  value={education.major}
                  onChange={(value) =>
                    setEducation({ ...education, major: value })
                  }
                />
              </div>
              <div className="flex gap-4 mb-0">
                <InputField
                  label="School/University"
                  placeholder="e.g. MIT"
                  value={education.school}
                  onChange={(value) =>
                    setEducation({ ...education, school: value })
                  }
                />
                <InputField
                  label="Graduation Year"
                  placeholder="e.g. 2025"
                  value={education.graduationYear}
                  onChange={(value) =>
                    setEducation({ ...education, graduationYear: value })
                  }
                />
              </div>
            </div>
          )}
        </SectionContainer>

        {/* Project */}
        <SectionContainer id="project">
          <SectionHeader
            title="Project"
            isOpen={projectOpen}
            onToggle={() => setProjectOpen((o) => !o)}
            onEnhance={() => setChatOpen(true)}
          />
          <div className="w-full h-[1.5px] bg-[#E2E8F0] rounded mt-2 mb-3 opacity-100" />
          {projectOpen && (
            <div>
              <div className="flex flex-col mb-4">
                <InputField
                  label="Project Title"
                  placeholder="Enter project title"
                  value={project.title}
                  onChange={(value) => setProject({ ...project, title: value })}
                  className="w-full"
                />
              </div>
              <TextareaField
                label="Project Description"
                placeholder="Describe your project"
                value={project.description}
                onChange={(value) =>
                  setProject({ ...project, description: value })
                }
                minHeight="50px"
              />
            </div>
          )}
        </SectionContainer>
        <Button
          className="w-full h-10 text-md mt-2"
          type="button"
          variant={"gradient"}
          onClick={handleGenerateResume}
        >
          Download PDF
        </Button>
      </div>

      {/* TEMP CHATBOX HERE, EDIT/REMOVE AS NEEDED FOR FUTURE DESIGN */}
      {chatOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className={`relative w-full sm:w-[300px] bg-white shadow-lg`}
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-semibold text-lg">AI Resume Assistant</h2>
              <button
                onClick={() => setChatOpen(false)}
                aria-label="Close AI chat"
              >
              <X/>
              </button>
            </div>

            <div>
              <ResumeChat />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeBuilder;
