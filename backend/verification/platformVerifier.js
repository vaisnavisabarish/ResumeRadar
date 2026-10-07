// Add this function to your backend
async function verifyLeetCodeEvidence(leetcodeUsername) {
    try {
        // Using the popular open community LeetCode stats API wrapper
        const response = await axios.get(`https://leetcode-stats-api.herokuapp.com/${leetcodeUsername}`);
        const data = response.data;

        if (data.status === "error") {
            return { skill: "LeetCode Problem Solving", score: 10, status: "Missing Evidence", sources: 0 };
        }

        // Calculate score based on total solved problems
        const totalSolved = data.totalSolved || 0;
        let score = Math.min(98, 40 + (totalSolved / 2)); // Scales up with solved problems
        let status = totalSolved > 50 ? "Verified" : "Partial Evidence";

        return {
            id: 99,
            skill: `LeetCode (${totalSolved} Problems Solved)`,
            score: Math.floor(score),
            status: status,
            sources: totalSolved,
            repos: [
                { name: `Easy: ${data.easySolved} | Medium: ${data.mediumSolved} | Hard: ${data.hardSolved}`, url: `https://leetcode.com/${leetcodeUsername}` }
            ]
        };
    } catch (error) {
        console.error("LeetCode fetch error:", error.message);
        return null;
    }
}