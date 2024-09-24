function convertApiEndpointsToTiptapContent(apiEndpoint: any): any {
  const content: any[] = [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "API" }],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Swagger" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "You can find the Swagger documentation for this API ",
        },
        {
          type: "text",
          text: "here",
          marks: [
            { type: "link", attrs: { href: `${process.env.PLATFORM_API_URL}/docs` } },
          ],
        },
        { type: "text", text: "." },
      ],
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: "URL" }],
    },
    {
      type: "codeBlock",
      attrs: { language: null },
      content: [{ type: "text", text: apiEndpoint?.url }],
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: "File Template" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "You can download the file template for this API ",
        },
        {
          type: "text",
          text: "here",
          marks: [
            {
              type: "link",
              attrs: { href: `https://s3api.techower.com/public/uploadTemplate.xlsx` },
            },
          ],
        },
        { type: "text", text: "." },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "The file template is a CSV file with the following columns:",
        },
      ],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "text",
              text: "url: The URL of files to be downloaded and uploaded to library",
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "text",
              text: "source_url: The original URL indicating the true source of the file, such as a third-party website",
            },
          ],
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: "Method" }],
    },
    {
      type: "paragraph",
      content: [{ type: "text", text: apiEndpoint.method }],
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: "Parameters" }],
    },
    {
      type: "bulletList",
      content: apiEndpoint.parameters.map((param: any) => ({
        type: "listItem",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: `${param.name} (${param.type}): ${param.description}`,
              },
            ],
          },
        ],
      })),
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: "Request Body" }],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", text: `Content-Type: ${apiEndpoint.requestBody.contentType}` },
      ],
    },
    {
      type: "bulletList",
      content: apiEndpoint.requestBody.parameters.map((param: any) => ({
        type: "listItem",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: `${param.name} (${param.type}): ${param.description}`,
              },
            ],
          },
        ],
      })),
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: "Responses" }],
    },
    {
      type: "bulletList",
      content: apiEndpoint.responses.map((response: any) => ({
        type: "listItem",
        content: [
          {
            type: "paragraph",
            content: [
              { type: "text", text: `${response.code}: ${response.description}` },
            ],
          },
        ],
      })),
    },
  ];

  return {
    type: "doc",
    content: content,
  };
}

export default convertApiEndpointsToTiptapContent;
