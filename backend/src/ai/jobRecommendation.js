const calculateJobRecommendations = (candidateSkills, jobs) => {
  const recommendations = jobs.map((job) => {
    let jobSkills = [];

    // If skills are already an array
    if (Array.isArray(job.skills)) {
      jobSkills = job.skills;
    }
    // If skills are stored as a string
    else if (typeof job.skills === "string") {
      jobSkills = job.skills
        .split(",")
        .map((skill) => skill.trim());
    }

  const matchedSkills = jobSkills.filter((skill) =>
  candidateSkills.some(
    (candidateSkill) =>
      candidateSkill.trim().toLowerCase() ===
      skill.trim().toLowerCase()
  )
);

console.log("Job Skills:", jobSkills);
console.log("Candidate Skills:", candidateSkills);
console.log("Matched Skills:", matchedSkills);

    const score =
      jobSkills.length > 0
        ? Math.round((matchedSkills.length / jobSkills.length) * 100)
        : 0;

    return {
      ...job.toObject(),
      score,
      matchedSkills,
    };
  });

  recommendations.sort((a, b) => b.score - a.score);

  return recommendations;
};

module.exports = calculateJobRecommendations;