const fs = require("fs");
const pdf = require("pdf-parse");

const SKILL_ALIASES = {
  react: [/\breact(\.js|js)?\b/i, /\breact\s+native\b/i],
  javascript: [/\b(javascript|js|es6|es7|ecmascript)\b/i],
  typescript: [/\b(typescript|ts)\b/i],
  html: [/\bhtml5?\b/i],
  css: [/\b(css3?|tailwind|tailwindcss|bootstrap|sass|scss)\b/i],
  node: [/\bnode(\.js|js)?\b/i],
  "node.js": [/\bnode(\.js|js)?\b/i],
  nodejs: [/\bnode(\.js|js)?\b/i],
  express: [/\bexpress(\.js|js)?\b/i],
  "express.js": [/\bexpress(\.js|js)?\b/i],
  mongodb: [/\b(mongodb|mongo|mongoose)\b/i],
  sql: [/\b(sql|mysql|postgresql|postgres|sqlite|mariadb)\b/i],
  python: [/\b(python|django|flask|fastapi)\b/i],
  java: [/\bjava\b(?!script)/i],
  git: [/\b(git|github|gitlab)\b/i],
  docker: [/\b(docker|kubernetes|k8s|container)\b/i],
  aws: [/\b(aws|amazon\s+web\s+services|cloud)\b/i],
  redux: [/\b(redux|zustand|recoil)\b/i],
  nextjs: [/\bnext(\.js|js)?\b/i],
  "next.js": [/\bnext(\.js|js)?\b/i],
  vue: [/\bvue(\.js|js)?\b/i],
  "vue.js": [/\bvue(\.js|js)?\b/i],
  angular: [/\bangular(js)?\b/i],
  rest: [/\b(rest|restful|api|apis)\b/i],
  "rest api": [/\b(rest|restful|api|apis)\b/i],
};

function checkSkillMatch(skillName, text) {
  if (!skillName || !text) return false;
  const normalized = skillName.trim().toLowerCase();

  // Check aliases
  if (SKILL_ALIASES[normalized]) {
    return SKILL_ALIASES[normalized].some((regex) => regex.test(text));
  }

  // Generic word-boundary match
  const escaped = normalized.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(^|[^a-zA-Z0-9#+])${escaped}([^a-zA-Z0-9#+]|$)`, "i");
  return regex.test(text) || text.toLowerCase().includes(normalized);
}

const analyzeResume = async (resumeSource, requiredSkills = [], fallbackText = "") => {
  try {
    let dataBuffer = null;
    if (Buffer.isBuffer(resumeSource)) {
      dataBuffer = resumeSource;
    } else if (typeof resumeSource === "string" && fs.existsSync(resumeSource)) {
      dataBuffer = fs.readFileSync(resumeSource);
    }

    let resumeText = fallbackText || "";
    if (dataBuffer) {
      try {
        const pdfData = await pdf(dataBuffer);
        resumeText = `${pdfData.text || ""} ${resumeText}`;
      } catch (pdfErr) {
        console.error("PDF parse warning in resumeAnalyzer:", pdfErr.message);
      }
    }

    const matchedSkills = [];
    const missingSkills = [];

    const skillsToCheck =
      Array.isArray(requiredSkills) && requiredSkills.length > 0
        ? requiredSkills
        : ["React", "JavaScript", "HTML", "CSS", "Node.js", "MongoDB"];

    skillsToCheck.forEach((skill) => {
      if (checkSkillMatch(skill, resumeText)) {
        matchedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    });

    const total = skillsToCheck.length;
    const score =
      total > 0 ? Math.round((matchedSkills.length / total) * 100) : 100;

    return {
      score,
      matchedSkills,
      missingSkills,
      extractedSkillsCount: matchedSkills.length,
    };
  } catch (err) {
    console.error("Resume analysis error:", err);
    return {
      score: 0,
      matchedSkills: [],
      missingSkills: requiredSkills || [],
    };
  }
};

module.exports = analyzeResume;