import { DocumentEditor } from "@onlyoffice/document-editor-react";

function onDocumentReady(event: any): void {
  console.log("Document is loaded");
}

function onLoadComponentError(errorCode: number, errorDescription: string): void {
  switch (errorCode) {
    case -1: // Unknown error loading component
      console.log(errorDescription);
      break;

    case -2: // Error load DocsAPI from http://documentserver/
      console.log(errorDescription);
      break;

    case -3: // DocsAPI is not defined
      console.log(errorDescription);
      break;
  }
}

export default function OfficeEditor() {
  return (
    <DocumentEditor
      id="docxEditor"
      documentServerUrl="https://office.techower.com/"
      config={{
        document: {
          fileType: "docx",
          key: "conv_unique_doc_key_123_65",
          title: "Example Document Title.docx",
          url: "https://s3web.techower.com/public/tmp/document_24.04.30%20-%20[Eng]%20NBIF%20-%20KFS%20-%20EMD%20LC.docx",
          permissions: {
            edit: true,
            download: true,
            print: true,
            copy: true,
          },
        },
        documentType: "word",
        editorConfig: {
          mode: "edit",
          callbackUrl: "https://office.techower.com",
        },
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb2N1bWVudCI6eyJmaWxlVHlwZSI6ImRvY3giLCJrZXkiOiJjb252X3VuaXF1ZV9kb2Nfa2V5XzEyM182NSIsInRpdGxlIjoiRXhhbXBsZSBEb2N1bWVudCBUaXRsZS5kb2N4IiwidXJsIjoiaHR0cHM6Ly9vZmZpY2UudGVjaG93ZXIuY29tL2NhY2hlL2ZpbGVzL2RhdGEvY29udl91bmlxdWVfZG9jX2tleV8xMjNfNjUvb3V0cHV0LmRvY3gvZG9jdW1lbnQuZG9jeD9tZDU9NGk4am5IQk9pTm15ckpWOGFwcnN0ZyZleHBpcmVzPTE3MzA3ODQ3MTcmc2hhcmRrZXk9MjIzLjY1LjE3My4yMjlfXzE3Mi4yNS4wLjF2MS5kb2N4MTczMDc4MDUyNjkyMyZmaWxlbmFtZT1kb2N1bWVudC5kb2N4IiwicGVybWlzc2lvbnMiOnsiZWRpdCI6dHJ1ZSwiZG93bmxvYWQiOnRydWUsInByaW50Ijp0cnVlLCJjb3B5Ijp0cnVlfX0sImRvY3VtZW50VHlwZSI6IndvcmQiLCJlZGl0b3JDb25maWciOnsibW9kZSI6ImVkaXQiLCJjYWxsYmFja1VybCI6Imh0dHBzOi8vb2ZmaWNlLnRlY2hvd2VyLmNvbSJ9fQ.xFe4a1_2nNWFQP7dxX6BCPHkQYcWuAvwMGKozIq8z3o",
      }}
      events_onDocumentReady={onDocumentReady}
      onLoadComponentError={onLoadComponentError}
    />
  );
}
