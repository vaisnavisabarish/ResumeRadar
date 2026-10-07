const axios = require("axios");

console.log("VERIFY FUNCTION CALLED");
async function verifyResearch(title) {
     console.log("Starting research verification:", title);
    try {

        const response = await axios.get(
            "https://api.semanticscholar.org/graph/v1/paper/search",
            {
                timeout: 5000,
                params: {
                    query: title,
                    limit: 1,
                    fields: "title,year,url,venue"
                }
            }
        );


        const papers = response.data.data;


        if(!papers || papers.length === 0){

            return {

                verified:false,

                source:"Semantic Scholar",

                url:null

            };

        }


        const paper = papers[0];

        console.log("Semantic Scholar response received");
        return {

            verified:true,

            source:"Semantic Scholar",

            url: paper.url,

            matchedTitle: paper.title,

            matchedYear: paper.year,

            venue: paper.venue

        };


    }
    catch(error){

        console.log("Verification error:", error.message);


        return {

            verified:false,

            source:"Semantic Scholar",

            url:null

        };

    }

}


module.exports = {
    verifyResearch
};