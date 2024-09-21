import ApiDoc from "@/components/ApiDoc";
import convertApiEndpointsToTiptapContent from "@/lib/utils/parseToApiDoc";
import convertApiEndpointsToTestDoc from "@/lib/utils/parseToApiTestDoc";

export const apiEndpoint = {
  title: "Upload Files To Library",
  method: "POST",
  parameters: [
    {
      name: "library_id",
      type: "string",
      description: "The ID of the library where you want to upload the file.",
    },
  ],
  requestBody: {
    contentType: "multipart/form-data",
    parameters: [
      {
        name: "file",
        type: "file",
        description:
          "An Excel file containing URLs of the documents you want to upload to the library. Each row in the Excel file should include a URL pointing to a document to be processed.",
      },
    ],
  },
  responses: [
    { code: 200, description: "Successful Response" },
    { code: 401, description: "Unauthorized" },
    { code: 403, description: "Forbidden" },
    { code: 404, description: "Not found" },
    { code: 502, description: "Server error" },
  ],
};

function LibraryApiPage({ params }: { params: { id: string } }) {
  const apiData = {
    ...apiEndpoint,
    url: `${process.env.PLATFORM_API_URL}/v1/platform/library/${params.id}/run`,
  };
  const content = convertApiEndpointsToTiptapContent(apiData);
  const testDocContent = convertApiEndpointsToTestDoc(apiData);
  return (
    <div className="flex h-full w-full flex-row items-center justify-center">
      <ApiDoc content={content} />
      <ApiDoc content={testDocContent} />
    </div>
  );
}

export default LibraryApiPage;
