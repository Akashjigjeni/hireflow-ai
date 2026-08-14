const generateCoverLetter = (
  name,
  jobTitle,
  company,
  skills
) => {
  return `
Dear Hiring Manager,

I am excited to apply for the ${jobTitle} position at ${company}.

I have experience in ${skills.join(", ")} and enjoy building efficient, user-friendly applications. My technical knowledge, problem-solving skills, and passion for software development make me a strong candidate for this role.

I am eager to contribute to your organization while continuing to learn and grow professionally.

Thank you for considering my application. I look forward to the opportunity to discuss how my skills can benefit ${company}.

Sincerely,

${name}
`;
};

module.exports = generateCoverLetter;