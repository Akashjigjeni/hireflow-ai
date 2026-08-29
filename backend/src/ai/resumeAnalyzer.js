const fs = require("fs");
const pdf = require("pdf-parse");

const analyzeResume = async (resumeSource, requiredSkills, fallbackText = "") => {
  try {
    let dataBuffer;
    if (Buffer.isBuffer(resumeSource)) {
      dataBuffer = resumeSource;
    } else if (typeof resumeSource === "string" && fs.existsSync(resumeSource)) {
      dataBuffer = fs.readFileSync(resumeSource);
    }

    let resumeText = fallbackText ? fallbackText.toLowerCase() : "";
    if (dataBuffer) {
      const pdfData = await pdf(dataBuffer);
      resumeText = (pdfData.text || "").toLowerCase() + " " + resumeText;
    }

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