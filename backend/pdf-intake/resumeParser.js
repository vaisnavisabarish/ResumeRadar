const {
    extractEmail,
    extractPhone,
    extractUrls,
    classifyUrls,
    extractSkills,
    extractEducation,
    extractProjects, 
    extractExperience,
    extractResearch
} = require("./parser");


const { verifyResearch } = require("./researchVerifier");


function cleanResumeText(text){

    return text
        .replace(/--\s*\d+\s*of\s*\d+\s*--/g, "")
        .replace(/\n\s*\n/g, "\n")
        .trim();

}


async function parseResume(text){

    text = cleanResumeText(text);


    const urls = extractUrls(text);


    const research = extractResearch(text);
    console.log("Research found:", research);


    for (let paper of research) {

        paper.verification =
            await verifyResearch(paper.title);

    }


    return {

        candidate: {

            name: text.split("\n")[0],

            email: extractEmail(text),

            phone: extractPhone(text),

            profile_links: classifyUrls(urls)

        },

        education: extractEducation(text),

        skills: extractSkills(text),

        projects: extractProjects(text),

        experience: extractExperience(text),

        research

    };

}


module.exports = {
    parseResume
};