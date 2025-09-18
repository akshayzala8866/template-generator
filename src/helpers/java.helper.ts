import { functionContext } from "../interfaces/function-context.interface";
import { responseObject } from "../interfaces/template-response.interface";

export function generateJava(context: functionContext): responseObject {
  const { functionName, params, returns, title, description } = context;

  // prepare parameter list
  const paramList = params.map((p: any) => `${p.mapped} ${p.name}`).join(", ");
  let retType = "void";
  if (returns.length === 1) retType = returns[0].mapped;
  else if (returns.length > 1) {
    // create a simple wrapper using List<Object> for multiple returns
    retType = "Object[]";
  }

  // Build class
  const classCode = `// ${title}
  // ${description}

  import java.util.*;
  import java.io.*;

  public class Solution {
      // Candidate implements this method
      public static ${retType} ${functionName}(${paramList}) {
          // TODO: implement
          return ${
            returns.length === 0
              ? "null"
              : returns.length === 1
              ? defaultValueFor(returns[0].mapped)
              : "new Object[0]"
          };
      }
  }

    // Minimal main that reads a single-line JSON object from stdin with parameter names as keys.
    // For simplicity this harness supports primitive and array inputs in a minimal way.
    class Main {
        public static void main(String[] args) throws Exception {
            Scanner sc = new Scanner(System.in);
            StringBuilder sb = new StringBuilder();
            while (sc.hasNextLine()) {
                sb.append(sc.nextLine());
            }
            String raw = sb.toString().trim();
            Map<String, Object> data = SimpleJson.parse(raw);

            // Pull parameters out (naively)
    ${params
      .map(
        (p: any) =>
          `        ${p.mapped} ${p.name} = (${simpleCast(
            p.mapped
          )}) data.get("${p.name}");`
      )
      .join("\n")}

            Object res = Solution.${functionName}(${params
    .map((p: any) => p.name)
    .join(", ")});
            // Very simple print via toString or arrays via Arrays.toString
            if (res instanceof Object[]) {
                System.out.println(Arrays.toString((Object[])res));
            } else {
                System.out.println(res == null ? "null" : res.toString());
            }
        }
    }

    // Very small JSON helper for extremely simple input (numbers, strings, and arrays of numbers/strings)
    // In real usage replace with a JSON library.
    class SimpleJson {
        public static Map<String, Object> parse(String s) {
            Map<String, Object> map = new HashMap<>();
            if (s == null || s.length() == 0) return map;
            s = s.trim();
            if (!s.startsWith("{")) return map;
            // naive parsing: { "a": 1, "b": [1,2] }
            s = s.substring(1, s.length()-1).trim();
            String[] entries = s.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");
            for (String e : entries) {
                String[] kv = e.split(":", 2);
                if (kv.length < 2) continue;
                String k = kv[0].trim().replaceAll("^\"|\"$", "");
                String v = kv[1].trim();
                if (v.startsWith("[")) {
                    // strip []
                    String inner = v.substring(1, v.length()-1).trim();
                    if (inner.length()==0) {
                        map.put(k, new Object[0]);
                    } else {
                        String[] parts = inner.split(",");
                        List<String> arr = new ArrayList<>();
                        for (String p2 : parts) arr.add(p2.trim().replaceAll("^\"|\"$", ""));
                        map.put(k, arr);
                    }
                } else {
                    String vs = v.replaceAll("^\"|\"$", "");
                    // try number
                    try {
                        if (vs.contains(".")) {
                            map.put(k, Double.parseDouble(vs));
                        } else {
                            map.put(k, Integer.parseInt(vs));
                        }
                    } catch (Exception ex) {
                        map.put(k, vs);
                    }
                }
            }
            return map;
        }
    }
    // helpers for defaults in stub return
  `;

  // helper functions for default representation inside TypeScript generator
  function defaultValueFor(t: string) {
    if (
      t.includes("List") ||
      t.includes("[]") ||
      t.startsWith("List<") ||
      t.startsWith("Array")
    )
      return "null";
    if (t === "int" || t === "long" || t === "double" || t === "float")
      return "0";
    if (t === "boolean") return "false";
    return "null";
  }
  function simpleCast(t: string) {
    if (t === "int") return "Integer";
    if (t === "long") return "Long";
    if (t === "double" || t === "float") return "Double";
    if (t === "boolean") return "Boolean";
    if (t.startsWith("List<")) return "List";
    return "Object";
  }

  return { template: classCode, language: context.language };
}
