import axios from "axios";

const JDOODLE_LANGUAGES = {
  javascript: { lang: "nodejs", versionIndex: "4" },
  python: { lang: "python3", versionIndex: "4" },
  java: { lang: "java", versionIndex: "4" },
  cpp: { lang: "cpp17", versionIndex: "1" },
};

export const runCodeLocally = async (req, res) => {
  const { language, code, testCases } = req.body;

  if (!code) return res.status(400).json({ message: "Code is required" });

  const config = JDOODLE_LANGUAGES[language];
  if (!config) return res.status(400).json({ message: "Unsupported language" });

  let scriptToRun = code;

  if (language === "javascript" && testCases && testCases.length > 0) {
    const match = code.match(/function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\(/);

    if (match) {
      const funcName = match[1];

      scriptToRun += `\n\n// --- HIDDEN TEST RUNNER ---\n`;
      scriptToRun += `console.log("---TEST_RESULTS_START---");\n`;

      testCases.forEach((tc) => {
        scriptToRun += `try { console.log(JSON.stringify(${funcName}(${tc.input}))); } catch(e) { console.log("RUNTIME_ERROR"); }\n`;
      });
    }
  }

  try {
    const response = await axios.post("https://api.jdoodle.com/v1/execute", {
      clientId: process.env.JDOODLE_CLIENT_ID,
      clientSecret: process.env.JDOODLE_CLIENT_SECRET,
      script: scriptToRun,
      language: config.lang,
      versionIndex: config.versionIndex,
    });

    let stdout = response.data.output;
    let stderr = response.data.error || "";
    let results = [];

    if (stdout.includes("---TEST_RESULTS_START---")) {
      const parts = stdout.split("---TEST_RESULTS_START---\n");
      const cleanStdout = parts[0];
      const hiddenOutput = parts[1].trim().split("\n");

      results = testCases.map((tc, index) => {
        const actual = hiddenOutput[index]?.trim() || "undefined";
        const expected = tc.expectedOutput.replace(/'/g, '"').trim();

        return {
          input: tc.input,
          expected: expected,
          actual: actual,
          passed: actual === expected,
        };
      });

      stdout = cleanStdout;
    }

    return res.status(200).json({
      run: { stdout, stderr },
      testResults: results,
    });
  } catch (error) {
    console.error(
      "Official JDoodle API Error:",
      error.response?.data || error.message,
    );
    return res.status(500).json({
      message: "Execution engine failed",
      error: error.response?.data?.error || error.message,
    });
  }
};
