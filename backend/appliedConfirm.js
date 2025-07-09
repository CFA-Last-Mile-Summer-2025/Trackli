const handleJobClick = (jobSite) => { 
    const confirmed = confirm("You're about to leave this site. Continue?"); 
    if (confirmed) { 
        window.open(jobSite, '') 
        const appliedConfirmation = confirm("Did you apply for this job?"); 
        if (appliedConfirmation) { 
            console.log("User applied for job"); 

        } else { 
            console.log("User viewed the job"); 
        } 
    } else { 
        console.log("User did not want to leave the site") 
    } 
}