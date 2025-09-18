import { functionContext } from "../interfaces/function-context.interface";
import { responseObject } from "../interfaces/template-response.interface";

export function generateJs(context: functionContext): responseObject {
  const { functionName, params, returns, title, description } = context;
  const paramList = params.map((p: any) => p.name).join(", ");

  const code = `// ${title}
  // ${description}

  async function ${functionName}(${paramList}) {
    // TODO: implement
    ${
      returns.length === 0
        ? "return;"
        : returns.length === 1
        ? "return null;"
        : "return [];"
    }
  }

  if (require.main === module) {
    (async () => {
      let raw = "";
      process.stdin.setEncoding("utf8");
      for await (const chunk of process.stdin) raw += chunk;
      const data = raw ? JSON.parse(raw) : {};
      // expects params as top-level keys
      const result = await ${functionName}(${params
    .map((p: any) => `data["${p.name}"]`)
    .join(", ")});
      console.log(JSON.stringify(result));
    })();
  }

  module.exports = { ${functionName} };
`;
  return { template: code, language: context.language };
}
