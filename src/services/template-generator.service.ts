import { generateCpp } from "../helpers/cpp.helper";
import { generateJava } from "../helpers/java.helper";
import { generateJs } from "../helpers/javascript.helper";
import { generatePython } from "../helpers/python.helper";
import { functionContext } from "../interfaces/function-context.interface";
import { responseObject } from "../interfaces/template-response.interface";
import { mapType } from "../mappers/dsl-type.mapper";
import { QuestionPayload } from "../validations/payload.validation";

export function generateTemplate(payload: QuestionPayload): responseObject {
  const functionName = payload.signature.function_name;
  const returnsRaw = payload.signature.returns?.type?.trim() ?? "";
  const params = payload.signature.parameters;
  const mappedParams = params.map((p) => ({
    name: p.name,
    rawType: p.type,
    mapped: mapType(p.type, payload.language),
  }));

  const returnTypes =
    returnsRaw === ""
      ? []
      : returnsRaw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
  const mappedReturns = returnTypes.map((rt) => ({
    raw: rt,
    mapped: mapType(rt, payload.language),
  }));

  const context: functionContext = {
    functionName,
    title: payload.title,
    description: payload.description ?? "",
    params: mappedParams,
    returns: mappedReturns,
    language: payload.language,
  };

  switch (payload.language) {
    case "python":
      return generatePython(context);
    case "java":
      return generateJava(context);
    case "cpp":
      return generateCpp(context);
    case "javascript":
      return generateJs(context);
    default:
      throw {
        status: 400,
        message: `Unsupported language: ${payload.language}`,
      };
  }
}
