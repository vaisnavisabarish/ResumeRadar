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

        /(PUBLICATIONS?|RESEARCH(?:\s+PAPERS)?|RESEARCH\s+WORK|RESEARCH\s+EXPERIENCE)([\s\S]*?)(PROJECTS|EXPERIENCE|WORK EXPERIENCE|EDUCATION|SKILLS|CERTIFICATIONS|ACHIEVEMENTS|EXTRACURRICULARS|POSITIONS OF RESPONSIBILITY|$)/i

    );


    if (!match) {
        return [];
    }


    const section = match[2];


    const lines = section

        .split("\n")

        .map(line =>
            line
                .replace(/^[-•*]\s*/, "")
                .trim()
        )

        .filter(line =>
            line &&
            !line.startsWith("--")
        );


    if (lines.length === 0) {
        return [];
    }



    const research = [];


    let current = {

        title: "",
        journal: "",
        year: null

    };



    lines.forEach(line => {


        const yearMatch = line.match(/\b(19|20)\d{2}\b/);


        if (yearMatch) {

            current.year = yearMatch[0];

        }



        if (
            !current.title &&
            !/^(authors?|published|doi|journal)/i.test(line)
        ) {

            current.title = line
                .replace(/["']/g, "")
                .trim();

            return;

        }



        if (

            !current.journal &&
            (
                /published/i.test(line) ||
                /journal/i.test(line) ||
                /conference/i.test(line) ||
                /ieee/i.test(line) ||
                /acm/i.test(line) ||
                /springer/i.test(line) ||
                /elsevier/i.test(line)
            )

        ) {


            current.journal = line

                .replace(/published in/i, "")

                .replace(/\b(19|20)\d{2}\b/, "")

                .replace(/[.,]+$/, "")

                .trim();


        }



    });



    if (current.title) {

        research.push(current);

    }



    return research;

}
function extractProjects(text) {

    const match = text.match(
        /PROJECTS?([\s\S]*?)(EXPERIENCE|WORK EXPERIENCE|EDUCATION|CERTIFICATIONS|PUBLICATIONS|EXTRACURRICULARS|ACHIEVEMENTS|POSITIONS OF RESPONSIBILITY|$)/i
    );


    if (!match) {
        return [];
    }


    const section = match[1];


    const blocks = section.split(
        /\n(?=[A-Z][A-Za-z0-9\s&()\/-]{3,80}\n)/
    );


    const techDictionary = [

        "Python",
        "Java",
        "C++",
        "C",
        "JavaScript",
        "TypeScript",

        "React",
        "Next.js",
        "Node.js",
        "Express.js",
        "Tailwind CSS",

        "HTML",
        "CSS",

        "SQL",
        "SQLite",
        "PostgreSQL",
        "MongoDB",
        "Firebase",
        "Prisma",

        "FastAPI",
        "Flask",
        "Django",

        "PyTorch",
        "TensorFlow",

        "NumPy",
        "Pandas",
        "OpenCV",

        "Docker",
        "AWS",
        "Git",

        "spaCy",
        "PyMuPDF",

        "Semantic Scholar",
        "OpenAlex",
        "CrossRef",

        "Leaflet",
        "Shapely",
        "GeoJSON",

        "Machine Learning",
        "Deep Learning",
        "NLP",
        "XGBoost",
        "Random Forest"
    ];


    const projects = [];


    blocks.forEach(block => {


        const lines = block
            .split("\n")
            .map(line =>
                line
                    .replace(/^[-•*]\s*/, "")
                    .trim()
            )
            .filter(line =>
                line &&
                !line.startsWith("--")
            );


        if (lines.length === 0) {
            return;
        }


        let title = lines[0];


        // Remove unwanted headings
        if (
            /^(projects|project experience)$/i.test(title) ||
            title.length > 100
        ) {
            return;
        }


        const technologies = techDictionary.filter(skill =>
            block
                .toLowerCase()
                .includes(skill.toLowerCase())
        );


        projects.push({

            title,

            technologies: [...new Set(technologies)]

        });


    });


    return projects;

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