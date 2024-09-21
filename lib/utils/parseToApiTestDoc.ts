function convertApiEndpointsToTestDoc(apiEndpoint: any) {
  const content: any[] = [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: `Test` }],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Setup" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "To get started, export your API key in your terminal. You can generate a key ",
        },
        {
          type: "text",
          text: "here",
          marks: [
            { type: "link", attrs: { href: `${process.env.APP_HOST}/key-management` } },
          ],
        },
        { type: "text", text: "." },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "cURL" }],
    },
    {
      type: "paragraph",
      content: [{ type: "text", text: "Use this cURL command to send your request:" }],
    },
    {
      type: "codeBlock",
      attrs: { language: "bash" },
      content: [
        {
          type: "text",
          text: generateCurlCommand(apiEndpoint),
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Python" }],
    },
    {
      type: "paragraph",
      content: [{ type: "text", text: "Here's a Python script to call the API:" }],
    },
    {
      type: "codeBlock",
      attrs: { language: "python" },
      content: [{ type: "text", text: generatePythonScript(apiEndpoint) }],
    },
  ];

  return {
    type: "doc",
    content: content,
  };
}

function generateCurlCommand(apiEndpoint: any): string {
  const method = apiEndpoint.method;
  const contentType = apiEndpoint.requestBody.contentType;

  let command = `curl -X ${method} '${apiEndpoint.url}' \\
    -H 'X-API-Key: YOUR_API_KEY' \\
    -H 'Content-Type: ${contentType}' \\
    -F 'file=@path/to/your/file.xlsx'`;

  return command;
}

function generatePythonScript(apiEndpoint: any): string {
  const method = apiEndpoint.method.toLowerCase();
  const contentType = apiEndpoint.requestBody.contentType;

  return `import requests

url = "${apiEndpoint.url}"
headers = {
    "X-API-Key": "YOUR_API_KEY",
    "Content-Type": "${contentType}"
}

# Prepare the file for upload
files = {
    'file': ('your_file.xlsx', open('path/to/your/file.xlsx', 'rb'))
}

# Send the request
response = requests.${method}(url, headers=headers, files=files)

# Check the response
if response.status_code == 200:
    print("Success!")
    print(response.json())
else:
    print(f"Error: {response.status_code}")
    print(response.text)
`;
}

export default convertApiEndpointsToTestDoc;
