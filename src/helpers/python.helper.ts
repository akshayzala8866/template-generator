import { functionContext } from "../interfaces/function-context.interface";
import { responseObject } from "../interfaces/template-response.interface";

export function generatePython(context: functionContext): responseObject {
  const { functionName, params, returns, title, description } = context;

  // imports required
  const needsList =
    params.some((p: any) => p.mapped.includes("List[")) ||
    returns.some((r: any) => r.mapped.includes("List["));
  const needsTuple = returns.length > 1;

  const imports: string[] = [];
  if (needsList || needsTuple)
    imports.push("from typing import List, Tuple, Optional, Dict");
  const header = `# ${title}\n# ${description}\n${
    imports.length ? imports.join(", ") + "\\n\\n" : ""
  }`;

  const paramList = params.map((p: any) => `${p.name}: ${p.mapped}`).join(", ");
  let retAnnotation = "None";
  if (returns.length === 0) retAnnotation = "None";
  else if (returns.length === 1) retAnnotation = returns[0].mapped;
  else retAnnotation = `Tuple[${returns.map((r: any) => r.mapped).join(", ")}]`;

  // function body stub
  const body = `class Solution:
    def ${functionName}(self, ${paramList}) -> ${retAnnotation}:
        # Write your solution below
        pass

    if __name__ == "__main__":
    import sys, json
    try:
        data = json.loads(sys.stdin.read() or "{}")
    except Exception:
        data = {}
    # Example: expect the JSON keys to match parameter names
    # call the solution
    sol = Solution()
    res = sol.${functionName}(${params.map((p: any) => p.name).join(", ")})
    print(json.dumps(res))
`;

  return { template: body, language: context.language };
}
