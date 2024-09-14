"use client";

import SmartEditor from "@/components/SmartEditor";

export default function Blog() {
  return (
    <div className="h-full w-full p-10">
      <SmartEditor />
      {/* <CustomForm
        schema={schema}
        // validator={validator}
        onSubmit={(formData) => console.log("formData", formData)}
      /> */}
      {/* <JsonTreeRenderer jsonData={schema}></JsonTreeRenderer> */}
      {/* <JsonExpressionInput jsonData={schema}></JsonExpressionInput> */}
    </div>
  );
}
