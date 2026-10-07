const TECHNICAL_SKILLS = [
    "Python",
    "Java",
    "C++",
    "JavaScript",
    "React",
    "Node.js",
    "Express.js",
    "SQL",
    "MongoDB",
    "Docker",
    "AWS"
];


const CORE_SKILLS = [
    "Data Structures",
    "Algorithms",
    "DBMS",
    "Computer Networks",
    "Operating Systems",
    "Machine Learning"
];

function extractEmail(text) {

    const emailRegex =
        /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;

    const match = text.match(emailRegex);

    return match ? match[0] : null;
}


function extractPhone(text) {

    const phoneRegex =
        /(?:\+91[-\s]?)?[6-9]\d{9}/;

    const match = text.match(phoneRegex);

    return match ? match[0] : null;
}


function extractUrls(text) {

    const urls =
        text.match(/https?:\/\/[^\s]+/g);

    return urls || [];
}




function classifyUrls(urls) {

    const profiles = {
        github: null,
        linkedin: null,
        portfolio: null,
        leetcode: null,
        hackerrank: null
    };


    urls.forEach(url => {

        const lowerUrl = url.toLowerCase();


        if (lowerUrl.includes("github.com")) {

            profiles.github = url;

        } 
        
        else if (lowerUrl.includes("linkedin.com")) {

            profiles.linkedin = url;

        } 
        
        else if (lowerUrl.includes("leetcode.com")) {

            profiles.leetcode = url;

        } 
        
        else if (lowerUrl.includes("hackerrank.com")) {

            profiles.hackerrank = url;

        } 
        
        else {

            profiles.portfolio = url;

        }

    });


    return profiles;
}

function extractSkills(text){

    return {

        technical:
            TECHNICAL_SKILLS.filter(skill =>
                text.toLowerCase()
                .includes(skill.toLowerCase())
            ),


        core:
            CORE_SKILLS.filter(skill =>
                text.toLowerCase()
                .includes(skill.toLowerCase())
            )

    };

}
function extractEducation(text) {

    const educationSection = text.split(/EDUCATION/i)[1];

    if (!educationSection) {
        return {
            degree: null,
            institution: null
        };
    }


    const lines = educationSection
        .split("\n")
        .map(line => line.trim())
        .filter(line => line);


    return {
        degree: lines[0] || null,
        institution: lines[1] || null
    };

}
function extractProjects(text) {

    const match = text.match(
        /PROJECTS([\s\S]*?)(EXPERIENCE|EDUCATION|CERTIFICATIONS|PUBLICATIONS|$)/i
    );


    if (!match) {
        return [];
    }


    const section = match[1];


    const blocks = section.split(/\n(?=[A-Z][A-Za-z ]+\n)/);


    const projects = [];


    blocks.forEach(block => {

        const lines = block
            .split("\n")
            .map(line => line.trim())
            .filter(line =>
                line &&
                !line.startsWith("--")
            );


        if(lines.length === 0){
            return;
        }


        const title = lines[0];


        // Ignore non-project lines
        if(
            title.length > 60 ||
            title.includes(":") ||
            title.includes(",")
        ){
            return;
        }


        const techLine = block.match(
            /Technologies used:\s*([\s\S]*?)(Features|$)/i
        );


        let technologies=[];


        if(techLine){

            technologies = techLine[1]
                .split(",")
                .map(t=>t.trim())
                .filter(Boolean);

        }


        projects.push({

            title,

            technologies

        });


    });


    return projects;

}
function extractExperience(text) {

    const match = text.match(
        /EXPERIENCE([\s\S]*?)(PUBLICATIONS|CERTIFICATIONS|ACHIEVEMENTS|PROJECTS|$)/i
    );


    if(!match){
        return [];
    }


    const section = match[1];


    const lines = section
        .split("\n")
        .map(line => line.trim())
        .filter(line =>
            line &&
            !line.startsWith("--")
        );


    const experiences = [];


    if(lines.length >= 2){

        experiences.push({

            role: lines[0],

            company: lines[1]

        });

    }


    return experiences;

}
function extractResearch(text) {

    const match = text.match(
        /PUBLICATIONS([\s\S]*?)(CERTIFICATIONS|ACHIEVEMENTS|PROJECTS|EXPERIENCE|$)/i
    );


    if (!match) {
        return [];
    }


    const lines = match[1]
        .split("\n")
        .map(line => line.trim())
        .filter(line =>
            line &&
            !line.startsWith("--")
        );


    if (lines.length < 2) {
        return [];
    }


    const title = lines[0]
        .replace(/["']/g, "")
        .trim();


    const publicationText = lines[1];


    // Extract year
    const yearMatch = publicationText.match(/\b(19|20)\d{2}\b/);

    const year = yearMatch 
        ? yearMatch[0] 
        : null;


    // Clean journal name
    const journal = publicationText
        .replace(/Published in/i, "")
        .replace(/\b(19|20)\d{2}\b/, "")
        .replace(/^[,\s]+|[,\s]+$/g, "")
        .trim();


    return [
        {
            title,
            journal,
            year
        }
    ];

}

module.exports = {

    extractEmail,
    extractPhone,
    extractUrls,
    classifyUrls,
    extractSkills,
    extractEducation,
    extractProjects,
    extractExperience,
    extractResearch

};