module.exports = function (plop) {
  plop.setGenerator("component", {
    description: "Create a new component",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the component name?",
      },
      {
        type: "list",
        name: "category",
        message: "Select the category for the component:",
        choices: ["element", "component", "section"],
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/lib/{{category}}s/{{pascalCase name}}/index.ts",
        templateFile: "templates/index.ts.hbs",
      },
      {
        type: "add",
        path: "src/lib/{{category}}s/{{pascalCase name}}/{{pascalCase name}}.tsx",
        templateFile: "templates/component.tsx.hbs",
      },
      {
        type: "add",
        path: "src/lib/{{category}}s/{{pascalCase name}}/{{pascalCase name}}.test.tsx",
        templateFile: "templates/component.test.tsx.hbs",
      },
      {
        type: "append",
        path: "src/lib/{{category}}s/index.ts",
        template: 'export * from "./{{pascalCase name}}";',
      },
    ],
  });
};
