import { QuestionPayload } from "../validations/payload.validation";

export function mapType(
  dslType: string,
  language: QuestionPayload["language"]
): any {
  const simple = dslType.trim();

  // arrays like T[] or int[] or string[] conversions according to DSL.
  const arrayMatch = simple.match(/^(.+)\[\]$/);
  if (arrayMatch) {
    const inner = arrayMatch[1].trim();
    return mapArray(inner, language);
  }

  // List<T> or Tree<T> conversion according to DSL.
  const genericMatch = simple.match(/^([A-Za-z]+)<(.+)>$/);
  if (genericMatch) {
    const outer = genericMatch[1];
    const inner = genericMatch[2].trim();
    return mapGeneric(outer, inner, language);
  }

  // primitives conversions according to DSL.
  switch (simple.toLowerCase()) {
    case "int":
      return primitive("int", language);
    case "long":
      return primitive("long", language);
    case "float":
      return primitive("float", language);
    case "double":
      return primitive("double", language);
    case "bool":
    case "boolean":
      return primitive("bool", language);
    case "string":
      return primitive("string", language);
    case "graph":
      return graphType(language);
    case "tree":
      return treeType(language);
    default:
      if (language === "java") return capitalize(simple);
      if (language === "cpp") return simple;
      if (language === "python") return simple;
      return simple;
  }
}

function mapArray(inner: string, language: QuestionPayload["language"]) {
  const innerMapped = mapType(inner, language);
  switch (language) {
    case "python":
      return `List[${innerMapped}]`;
    case "java": {
      const boxed = java(inner);
      return `List<${boxed}>`;
    }
    case "cpp":
      return `std::vector<${innerMapped}>`;
    case "javascript":
      return `${jsType(inner)}[]`;
  }
}

function jsType(p: string) {
  return primitive(p, "javascript");
}

function primitive(p: string, language: QuestionPayload["language"]) {
  switch (language) {
    case "python":
      // python typing names
      switch (p) {
        case "int":
          return "int";
        case "long":
          return "int";
        case "float":
          return "float";
        case "double":
          return "float";
        case "bool":
          return "bool";
        case "string":
          return "str";
        default:
          return p;
      }
    case "java":
      switch (p) {
        case "int":
          return "int";
        case "long":
          return "long";
        case "float":
          return "float";
        case "double":
          return "double";
        case "bool":
          return "boolean";
        case "string":
          return "String";
        default:
          return p;
      }
    case "cpp":
      switch (p) {
        case "int":
          return "int";
        case "long":
          return "long long";
        case "float":
          return "float";
        case "double":
          return "double";
        case "bool":
          return "bool";
        case "string":
          return "std::string";
        default:
          return p;
      }
    case "javascript":
      // JS is untyped; but we return primitive names for comments
      switch (p) {
        case "int":
        case "long":
        case "float":
        case "double":
          return "number";
        case "bool":
          return "boolean";
        case "string":
          return "string";
        default:
          return p;
      }
  }
}

function java(p: string) {
  switch (p.toLowerCase()) {
    case "int":
      return "Integer";
    case "long":
      return "Long";
    case "float":
      return "Float";
    case "double":
      return "Double";
    case "bool":
    case "boolean":
      return "Boolean";
    case "string":
      return "String";
    default:
      return capitalize(p);
  }
}

function capitalize(s: string) {
  if (!s) return s;
  return s[0].toUpperCase() + s.slice(1);
}

function graphType(language: QuestionPayload["language"]) {
  switch (language) {
    case "python":
      return "Dict[int, List[int]]";
    case "java":
      return "Map<Integer, List<Integer>>";
    case "cpp":
      return "std::unordered_map<int, std::vector<int>>";
    case "javascript":
      return "Record<number, number[]>";
  }
}

function treeType(language: QuestionPayload["language"]) {
  switch (language) {
    case "python":
      return "Optional[TreeNode]";
    case "java":
      return "TreeNode";
    case "cpp":
      return "TreeNode*";
    case "javascript":
      return "TreeNode | null";
  }
}

function mapGeneric(
  outer: string,
  inner: string,
  language: QuestionPayload["language"]
) {
  switch (outer.toLowerCase()) {
    case "list":
      return mapArray(inner, language);
    case "tree":
      return language === "java"
        ? `TreeNode<${mapType(inner, language)}>`
        : `Tree<${mapType(inner, language)}>`;
    default:
      // default case.
      return `${outer}<${mapType(inner, language)}>`;
  }
}
