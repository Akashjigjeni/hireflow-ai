const generateInterviewQuestions = (skills = []) => {
  const questions = [];

  skills.forEach((skill) => {
    switch (skill.toLowerCase()) {
      case "react":
        questions.push(
          "Explain the Virtual DOM in React."
        );
        questions.push(
          "What are React Hooks?"
        );
        break;

      case "node":
      case "node.js":
        questions.push(
          "Explain the Event Loop in Node.js."
        );
        break;

      case "express":
      case "express.js":
        questions.push(
          "Why do we use Express.js?"
        );
        break;

      case "mongodb":
        questions.push(
          "Difference between SQL and MongoDB?"
        );
        break;

      case "javascript":
        questions.push(
          "Explain closures in JavaScript."
        );
        questions.push(
          "Difference between var, let and const."
        );
        break;

      case "java":
        questions.push(
          "Explain OOP concepts in Java."
        );
        break;

      case "html":
        questions.push(
          "What is Semantic HTML?"
        );
        break;

      case "css":
        questions.push(
          "Difference between Flexbox and Grid."
        );
        break;

      default:
        questions.push(
          `Explain your experience with ${skill}.`
        );
    }
  });

  questions.push("Tell me about yourself.");
  questions.push("Why should we hire you?");
  questions.push(
    "Explain your final year project."
  );

  return [...new Set(questions)];
};

module.exports = generateInterviewQuestions;