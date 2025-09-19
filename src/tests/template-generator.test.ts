import request from "supertest";
import app from "../app";
import { generateTemplate } from "../services/template-generator.service";
import { QuestionPayload } from "../validations/payload.validation";

describe("Template Generator", () => {
  it("should generate Python template for Two Sum", () => {
    const req: QuestionPayload = {
      question_id: "two-sum",
      title: "Two Sum",
      description: "Given an integer array nums and an integer target...",
      signature: {
        function_name: "twoSum",
        parameters: [
          { name: "nums", type: "int[]" },
          { name: "target", type: "int" },
        ],
        returns: { type: "int[]" },
      },
      language: "python",
    };

    const template = generateTemplate(req);
    expect(template).toMatchSnapshot();
  });

  it("should generate Java template with multiple parameters", () => {
    const req: QuestionPayload = {
      question_id: "gcd-problem",
      title: "Greatest Common Divisor",
      description: "Find GCD of two numbers",
      signature: {
        function_name: "gcd",
        parameters: [
          { name: "a", type: "int" },
          { name: "b", type: "int" },
        ],
        returns: { type: "int" },
      },
      language: "java",
    };

    const template = generateTemplate(req);
    expect(template).toMatchSnapshot();
  });

  it("should generate C++ template with array input", () => {
    const req: QuestionPayload = {
      question_id: "max-element",
      title: "Max Element",
      description: "Find maximum in array",
      signature: {
        function_name: "maxElement",
        parameters: [{ name: "arr", type: "int[]" }],
        returns: { type: "int" },
      },
      language: "cpp",
    };

    const template = generateTemplate(req);
    expect(template).toMatchSnapshot();
  });

  it("should generate JavaScript template with string params", () => {
    const req: QuestionPayload = {
      question_id: "concat",
      title: "String Concatenation",
      description: "Concatenate two strings",
      signature: {
        function_name: "concat",
        parameters: [
          { name: "s1", type: "string" },
          { name: "s2", type: "string" },
        ],
        returns: { type: "string" },
      },
      language: "javascript",
    };

    const template = generateTemplate(req);
    expect(template).toMatchSnapshot();
  });

  it("should generate Python template with multiple return types", () => {
    const req: QuestionPayload = {
      question_id: "divmod",
      title: "Division with Modulus",
      description: "Return quotient and remainder",
      signature: {
        function_name: "divMod",
        parameters: [
          { name: "a", type: "int" },
          { name: "b", type: "int" },
        ],
        returns: { type: "int,int" },
      },
      language: "python",
    };

    const template = generateTemplate(req);
    expect(template).toMatchSnapshot();
  });
});

describe("Tempate Generator - negative cases", () => {
  it("should return 400 if question_id is missing", async () => {
    const payload = {
      title: "Two Sum",
      description: "Find two numbers...",
      signature: {
        function_name: "twoSum",
        parameters: [{ name: "nums", type: "int[]" }],
        returns: { type: "int[]" },
      },
      language: "python",
    };

    const res = await request(app).post("/api/v1/template").send(payload);

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/question_id/i);
  });

  test("should fail if unsupported language is provided", async () => {
    const payload: QuestionPayload = {
      question_id: "two-sum",
      title: "Two Sum",
      description: "Find two numbers...",
      signature: {
        function_name: "twoSum",
        parameters: [{ name: "nums", type: "int[]" }],
        returns: { type: "int[]" },
      },
      language: "golang" as any,
    };

    const res = await request(app).post("/api/v1/template").send(payload);

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Validation failed => language/i);
  });

  test("should fail if function_name is missing", async () => {
    const payload = {
      question_id: "two-sum",
      title: "Two Sum",
      description: "Find two numbers...",
      signature: {
        parameters: [{ name: "nums", type: "int[]" }],
        returns: { type: "int[]" },
      },
      language: "python",
    } as unknown as QuestionPayload;

    const res = await request(app).post("/api/v1/template").send(payload);

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(
      /Validation failed => signature.function_name/i
    );
  });
});
