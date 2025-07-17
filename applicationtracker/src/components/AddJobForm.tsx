import { useState } from "react";

export default function AddJobForm() {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    skills: "",
    job_type: "",
    url: "",
    date_expiration: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:3002/createjob", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const job = await res.json();
      console.log("job added", job);
    } catch (e) {
      console.error("failed to add job", e);
    }
  };

  return (
    <div>
      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Job Title"
      />
      <input
        name="company"
        value={formData.company}
        onChange={handleChange}
        placeholder="Company"
      />
      <input
        name="skills"
        value={formData.skills}
        onChange={handleChange}
        placeholder="Skills"
      />
      <input
        name="job_type"
        value={formData.job_type}
        onChange={handleChange}
        placeholder="Job Type"
      />
      <input
        name="url"
        value={formData.url}
        onChange={handleChange}
        placeholder="Job URL"
      />
      <input
        type="date"
        name="date_expiration"
        value={formData.date_expiration}
        onChange={handleChange}
        placeholder="Expiration Date"
      />
      <button onClick={handleSubmit}>Save Job</button>
    </div>
  );
}
