import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent } from "react";
import { jsPDF } from "jspdf";

export default function ResumeBuilderForm() {
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const submitButton = e.currentTarget.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;
    if (submitButton) submitButton.disabled = true;
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      github: formData.get("github"),
      linkedin: formData.get("linkedin"),
      company1: formData.get("company1"),
      jobLocation1: formData.get("jobLocation1"),
      title1: formData.get("title1"),
      dates1: formData.get("dates1"),
      description1: formData.get("description1"),
      description2: formData.get("description2"),
      company2: formData.get("company2"),
      jobLocation2: formData.get("jobLocation2"),
      title2: formData.get("title2"),
      dates2: formData.get("dates2"),
      description3: formData.get("description3"),
      description4: formData.get("description4"),
      schoolName: formData.get("schoolName"),
      schoolLocation: formData.get("schoolLocation"),
      degree: formData.get("degree"),
      schoolDates: formData.get("schoolDates"),
      skill1: formData.get("skill1"),
      skill2: formData.get("skill2"),
      skill3: formData.get("skill3"),
      skill4: formData.get("skill4"),
      projecttitle1: formData.get("projecttitle1"),
      projectlink1: formData.get("projectlink1"),
      projecttitle2: formData.get("projecttitle2"),
      projectlink2: formData.get("projectlink2"),
    };

    try {
      const token = localStorage.getItem("token");
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const raw = JSON.stringify(data);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
      };
      fetch("http://localhost:3002/submit", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
    } catch (err) {
      console.log(err);
    }
  };

  const downloadPDF = () => {
    const form = document.querySelector("form") as HTMLFormElement;
    if (!form) return;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const doc = new jsPDF();

    doc.setFontSize(24);
    doc.setFont("garamond", "bold");
    doc.text((data.name as string) || "Your Name", 10, 15);
    doc.setFontSize(12);
    doc.setFont("times", "normal");
    doc.text(`Email: ${data.email} | Phone: ${data.phone} | GitHub: ${data.github} | LinkedIn: ${data.linkedin}`, 10, 23);
    doc.setLineWidth(0.3);
    doc.line(10, 27, 200, 27); // doc.line(x1, y1, x2, y2)
    doc.setFont("times", "bold");
    doc.text("Work experience", 10, 33);
    doc.setLineWidth(0.3);
    doc.line(10, 36, 200, 36); // doc.line(x1, y1, x2, y2)

    let y = 45;
    doc.setFont("times", "normal");
    doc.setFontSize(12);

    doc.text(`${data.title1} @ ${data.company1} (${data.dates1})`, 10, y);
    y += 8;
    doc.text(`${data.jobLocation1}`, 10, y);
    y += 8;
    doc.text(`\u2022 ${data.description1}`, 10, y); // \u2022 is bullet point 
    y += 8;
    doc.text(`\u2022 ${data.description2}`, 10, y);
    y += 10;

    doc.text(`${data.title2} @ ${data.company2} (${data.dates2})`, 10, y);
    y += 8;
    doc.text(`${data.jobLocation2}`, 10, y);
    y += 8;
    doc.text(`\u2022 ${data.description3}`, 10, y);
    y += 8;
    doc.text(`\u2022 ${data.description4}`, 10, y);
    y += 10;

    doc.setFontSize(16);
    doc.text("Education", 10, y);
    y += 8;
    doc.setFontSize(12);
    doc.text(
      `${data.degree} - ${data.schoolName} (${data.schoolDates})`,
      10,
      y
    );
    y += 8;
    doc.text(`${data.schoolLocation}`, 10, y);
    y += 10;

    doc.setFontSize(16);
    doc.text("Skills", 10, y);
    y += 8;
    doc.setFontSize(12);
    for (let i = 1; i <= 4; i++) {
      const skill = data[`skill${i}`];
      if (skill) {
        doc.text(`${skill}`, 10, y);
        y += 8;
      }
    }

    doc.setFontSize(16);
    doc.text("Projects", 10, y);
    y += 8;
    doc.setFontSize(12);
    doc.text(`${data.projecttitle1}: ${data.projectlink1}`, 10, y);
    y += 8;
    doc.text(`${data.projecttitle2}: ${data.projectlink2}`, 10, y);
    y += 8;

    doc.save(`${(data.name as string)?.replace(/\s+/g, "_") || "resume"}.pdf`);
  };

  return (
    <div className="flex justify-center w-full">
      <Card className="flex w-200 shadow-lg bg-card text-white font-lalezar py-5 mb-10">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Build Your Resume
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="w-full space-y-2 text-center" onSubmit={submit}>
            <CardTitle className="text-center text-xl">
              Contact Information
            </CardTitle>
            <Label className="text-md whitespace-nowrap">
              Full Name:
              <Input
                name="name"
                type="text"
                placeholder="Full Name"
                // value={formData.name}
                // onChange={handleChange}
                required
              />
            </Label>
            <Label className="text-md whitespace-nowrap">
              Email:
              <Input
                name="email"
                type="email"
                placeholder="Email"
                // value={formData.email}
                // onChange={handleChange}
                required
              />
            </Label>
            <Label className="text-md whitespace-nowrap">
              Phone Number:
              <Input
                name="phone"
                type="tel"
                placeholder="Phone Number"
                // value={formData.phone}
                // onChange={handleChange}
                required
              />
            </Label>
            <Label className="text-md whitespace-nowrap">
              Github URL:
              <Input
                name="github"
                type="url"
                placeholder="Github"
                // value={formData.github}
                // onChange={handleChange}
                required
              />
            </Label>
            <Label className="text-md whitespace-nowrap">
              LinkedIn URL:
              <Input
                name="linkedin"
                type="url"
                placeholder="LinkedIn"
                // value={formData.linkedin}
                // onChange={handleChange}
                required
              />
            </Label>
            <CardTitle className="text-center text-xl mt-5">
              Professional Experience
            </CardTitle>
            Experience #1
            <Label className="text-xl whitespace-nowrap">
              <Input
                name="company1"
                type="text"
                placeholder="Company"
                // value={formData.company1}
                // onChange={handleChange}
                required
              />
              <Input
                name="jobLocation1"
                type="text"
                placeholder="City, State"
                // value={formData.jobLocation1}
                // onChange={handleChange}
                required
              />
            </Label>
            <Label className="text-xl whitespace-nowrap">
              <Input
                name="title1"
                type="text"
                placeholder="Title"
                // value={formData.title1}
                // onChange={handleChange}
                required
              />
              <Input
                name="dates1"
                type="text"
                placeholder="mm/yyyy - mm/yyyy"
                // value={formData.dates1}
                // onChange={handleChange}
                required
              />
            </Label>
            <Label className="text-xl whitespace-nowrap">
              <Input
                name="description1"
                type="text"
                placeholder="Description"
                // value={formData.description1}
                // onChange={handleChange}
                required
              />
              <Input
                name="description2"
                type="text"
                placeholder="Description"
                // value={formData.description2}
                // onChange={handleChange}
                required
              />
            </Label>
            Experience #2
            <Label className="text-xl whitespace-nowrap">
              <Input
                name="company2"
                type="text"
                placeholder="Company"
                // value={formData.company2}
                // onChange={handleChange}
                required
              />
              <Input
                name="jobLocation2"
                type="text"
                placeholder="City, State"
                // value={formData.jobLocation2}
                // onChange={handleChange}
                required
              />
            </Label>
            <Label className="text-xl whitespace-nowrap">
              <Input
                name="title2"
                type="text"
                placeholder="Title"
                // value={formData.title2}
                // onChange={handleChange}
                required
              />
              <Input
                name="dates2"
                type="text"
                placeholder="mm/yyyy - mm/yyyy"
                // value={formData.dates2}
                // onChange={handleChange}
                required
              />
            </Label>
            <Label className="text-xl whitespace-nowrap">
              <Input
                name="description3"
                type="text"
                placeholder="Description"
                // value={formData.description3}
                // onChange={handleChange}
                required
              />
              <Input
                name="description4"
                type="text"
                placeholder="Description"
                // value={formData.description4}
                // onChange={handleChange}
                required
              />
            </Label>
            <CardTitle className="text-center text-xl mt-5">
              Education
            </CardTitle>
            <Label className="text-xl whitespace-nowrap">
              <Input
                name="schoolName"
                type="text"
                placeholder="School"
                // value={formData.schoolName}
                // onChange={handleChange}
                required
              />
              <Input
                name="schoolLocation"
                type="text"
                placeholder="City, State"
                // value={formData.schoolLocation}
                // onChange={handleChange}
                required
              />
            </Label>
            <Label className="text-xl whitespace-nowrap">
              <Input
                name="degree"
                type="text"
                placeholder="Degree, Field"
                // value={formData.degree}
                // onChange={handleChange}
                required
              />
              <Input
                name="schoolDates"
                type="text"
                placeholder="mm/yyyy - mm/yyyy"
                // value={formData.schoolDates}
                // onChange={handleChange}
                required
              />
            </Label>
            <CardTitle className="text-center text-xl mt-5">
              Technical Skills
            </CardTitle>
            
            <Label className="text-xl whitespace-nowrap">
              <Input
                name="skill1"
                type="text"
                placeholder="Skill #1"
                // value={formData.skill1}
                // onChange={handleChange}
                required
              />
              
            </Label>
            <Label className="text-xl whitespace-nowrap">
              <Input
                name="skill2"
                type="text"
                placeholder="Skill #2"
                // value={formData.skill2}
                // onChange={handleChange}
                required
              />
              
            </Label>
            <Label className="text-xl whitespace-nowrap">
              <Input
                name="skill3"
                type="text"
                placeholder="Skill #3"
                // value={formData.skill3}
                // onChange={handleChange}
                required
              />
              
            </Label>
            <Label className="text-xl whitespace-nowrap">
              <Input
                name="skill4"
                type="text"
                placeholder="Skill #4"
                // value={formData.skill4}
                // onChange={handleChange}
                required
              />
              
            </Label>
            <CardTitle className="text-center text-xl mt-5">Projects</CardTitle>
            Project #1
            <Label className="text-xl whitespace-nowrap">
              <Input
                name="projecttitle1"
                type="text"
                placeholder="Project Title"
                // value={formData.projecttitle1}
                // onChange={handleChange}
                required
              />
              <Input
                name="projectlink1"
                type="url"
                placeholder="Project URL"
                // value={formData.projectlink1}
                // onChange={handleChange}
                required
              />
            </Label>
            Project #2
            <Label className="text-xl whitespace-nowrap">
              <Input
                name="projecttitle2"
                type="text"
                placeholder="Project Title"
                // value={formData.projecttitle2}
                // onChange={handleChange}
                required
              />
              <Input
                name="projectlink2"
                type="url"
                placeholder="Project URL"
                // value={formData.projectlink2}
                // onChange={handleChange}
                required
              />
            </Label>
            <CardFooter>
              <Button className="w-full h-10 text-md mt-5" type="submit">
                Build Your Resume
              </Button>
            </CardFooter>
              <Button
                className="w-full h-10 text-md mt-2 bg-green-600 hover:bg-green-700"
                type="button"
                onClick={downloadPDF}
              >
                Download PDF
              </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
