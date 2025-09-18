import { functionContext } from "../interfaces/function-context.interface";
import { responseObject } from "../interfaces/template-response.interface";

export function generateCpp(context: functionContext): responseObject {
  const { functionName, params, returns, title, description } = context;

  const paramList = params.map((p: any) => `${p.mapped} ${p.name}`).join(", ");
  let retType = "void";
  if (returns.length === 1) retType = returns[0].mapped;
  else if (returns.length > 1)
    retType =
      "std::tuple<" + returns.map((r: any) => r.mapped).join(", ") + ">";

  const code = `// ${title}
    // ${description}
    #include <bits/stdc++.h>
    using namespace std;

    struct Solution {
        ${retType} ${functionName}(${paramList}) {
            // TODO: implement
            ${
              returns.length === 0
                ? "return;"
                : returns.length === 1
                ? defaultCppReturn(returns[0].mapped)
                : "return {};"
            }
        }
    };

    int main() {
        ios::sync_with_stdio(false);
        cin.tie(nullptr);
        // Read entire stdin into a string (expecting JSON). For simplicity assume input provides variables in a simple form.
        string input; string line;
        while (getline(cin, line)) { input += line; }
        // TODO: parse JSON or use a library in production. For the template we assume the harness caller will replace this with real parsing.
        // Example usage placeholder:
        // call the function with placeholder values:
        Solution s;
        auto res = s.${functionName}(${params
    .map((p: any) => placeholderCpp(p.mapped))
    .join(", ")});
        // naive print
        // TODO: adapt for actual return type
        return 0;
    }
`;
  function defaultCppReturn(t: string) {
    if (t.includes("vector")) return "return {};";
    if (t === "int" || t === "long long" || t === "double" || t === "float")
      return "return 0;";
    if (t === "bool") return "return false;";
    return "return {};";
  }
  function placeholderCpp(t: string) {
    if (t.includes("vector")) return "{}";
    if (t === "int" || t === "long long") return "0";
    if (t === "double" || t === "float") return "0.0";
    if (t === "bool") return "false";
    if (t === "std::string") return '""';
    return "{}";
  }

  return { template: code, language: context.language };
}
