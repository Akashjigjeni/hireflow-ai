const fs = require("fs");
const pdf = require("pdf-parse");

const analyzeResume = async (resumePath, requiredSkills) => {
  try {
    const dataBuffer = fs.readFileSync(resumePath);

    const pdfData = await pdf(dataBuffer);

    const resumeText = pdfData.text.toLowerCase();

    const matchedSkills = [];
    const missingSkills = [];

    requiredSkills.forEach((skill) => {
      if (resumeText.includes(skill.toLowerCase())) {
        matchedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    });

    const score = Math.round(
      (matchedSkills.length / requiredSkills.length) * 100
    );

    return {
      score,
      matchedSkills,
      missingSkills,
    };
  } catch (err) {
    console.error(err);

    return {
      score: 0,
      matchedSkills: [],
      missingSkills: requiredSkills,
    };
  }
};

module.exports = analyzeResume;