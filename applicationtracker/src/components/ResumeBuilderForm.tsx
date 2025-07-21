import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormEvent } from "react"

export default function ResumeBuilderForm() {
  const submit = (e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
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
        skillnum1: formData.get("skillnum1"),
        skill2: formData.get("skill2"),
        skillnum2: formData.get("skillnum2"),
        skill3: formData.get("skill3"),
        skillnum3: formData.get("skillnum3"),
        skill4: formData.get("skill4"),
        skillnum4: formData.get("skillnum4"),
        projecttitle1: formData.get("projecttitle1"),
        projectlink1: formData.get("projectlink1"),
        projecttitle2: formData.get("projecttitle2"),
        projectlink2: formData.get("projectlink2"),

    } 

    try{
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
    }catch(err){
        console.log(err)
    }
  }
  // const [formData, setFormData] = useState({
  //   name: '',
  //   email: '',
  //   phone: '',
  //   github: '',
  //   linkedin: '',
  //   company1: '',
  //   jobLocation1: '',
  //   title1: '',
  //   dates1: '',
  //   description1: '',
  //   description2: '',
  //   company2: '',
  //   jobLocation2: '',
  //   title2: '',
  //   dates2: '',
  //   description3: '',
  //   description4: '',
  //   schoolName: '',
  //   schoolLocation: '',
  //   degree: '',
  //   schoolDates: '',
  //   skill1: '',
  //   skillnum1: '',
  //   skill2: '',
  //   skillnum2: '',
  //   skill3: '',
  //   skillnum3: '',
  //   skill4: '',
  //   skillnum4: '',
  //   projecttitle1: '',
  //   projectlink1: '',
  //   projecttitle2: '',
  //   projectlink2: '',
  // });
  // const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]: value
  //   });
  // };
  // const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   try {
  //     const response = await fetch('http://localhost:5173/resumebuilder', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(formData),
  //     });
  //     if (!response.ok) {
  //       throw new Error('Failed to generate PDF');
  //     }
  //     const blob = await response.blob();
  //     const url = window.URL.createObjectURL(blob);
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.setAttribute('download', `${formData.name.replace(/\s+/g, "_")}.pdf`);
  //     document.body.appendChild(link);
  //     link.click();
  //     link.remove();
  //     window.URL.revokeObjectURL(url);
  //   } catch (error) {
  //     console.error('Error generating PDF:', error);
  //     alert('Failed to generate PDF. Please try again.');
  //   }
  // };
    return(
      <div className="flex justify-center w-full">
        <Card className="flex w-200 shadow-lg bg-card text-white font-lalezar py-5 mb-10">
        <CardHeader>
            <CardTitle className="text-center text-2xl">Build Your Resume</CardTitle>
        </CardHeader>
        <CardContent>
        <form className="w-full space-y-2 text-center" onSubmit={submit}>
        <CardTitle className="text-center text-xl">Contact Information</CardTitle>

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
            <CardTitle className="text-center text-xl mt-5">Professional Experience</CardTitle>
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

            <CardTitle className="text-center text-xl mt-5">Education</CardTitle>

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

            <CardTitle className="text-center text-xl mt-5">Technical Skills</CardTitle>
            <CardTitle className="text-center text-md mt-1">Ranked 1-5 (beginner-expert) based on skill level</CardTitle>
            <Label className="text-xl whitespace-nowrap">
            <Input
                name="skill1"
                type="text"
                placeholder="Skill #1"
                // value={formData.skill1}
                // onChange={handleChange}
                required
              />
            <Input
                name="skillnum1"
                type="number"
                placeholder="Experience Level (e.g. 1)"
                // value={formData.skillnum1}
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
            <Input
                name="skillnum2"
                type="number"
                placeholder="Experience Level (e.g. 1)"
                // value={formData.skillnum2}
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
            <Input
                name="skillnum3"
                type="number"
                placeholder="Experience Level (e.g. 1)"
                // value={formData.skillnum3}
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
            <Input
                name="skillnum4"
                type="number"
                placeholder="Experience Level (e.g. 1)"
                // value={formData.skillnum4}
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
              <Button className="w-full h-10 text-md mt-5" type="submit">Build Your Resume</Button>
            </CardFooter>
        </form>
        </CardContent>
        </Card>
      </div>

    )
}
