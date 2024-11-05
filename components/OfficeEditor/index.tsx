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
          callbackUrl: "https://office.techower.com/url-to-callback.ashx",
        },
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb2N1bWVudCI6eyJmaWxlVHlwZSI6ImRvY3giLCJrZXkiOiJjb252X3VuaXF1ZV9kb2Nfa2V5XzEyM182NSIsInRpdGxlIjoiRXhhbXBsZSBEb2N1bWVudCBUaXRsZS5kb2N4IiwidXJsIjoiaHR0cHM6Ly9zM3dlYi50ZWNob3dlci5jb20vcHVibGljL3RtcC9kb2N1bWVudF8yNC4wNC4zMCUyMC0lMjBbRW5nXSUyME5CSUYlMjAtJTIwS0ZTJTIwLSUyMEVNRCUyMExDLmRvY3giLCJwZXJtaXNzaW9ucyI6eyJlZGl0Ijp0cnVlLCJkb3dubG9hZCI6dHJ1ZSwicHJpbnQiOnRydWUsImNvcHkiOnRydWV9fSwiZG9jdW1lbnRUeXBlIjoid29yZCIsImVkaXRvckNvbmZpZyI6eyJtb2RlIjoiZWRpdCIsImNhbGxiYWNrVXJsIjoiaHR0cHM6Ly9vZmZpY2UudGVjaG93ZXIuY29tL3VybC10by1jYWxsYmFjay5hc2h4In19.uA8r6jK6JvIrrA5TxScTeGV1GVQD-e_5W7w2EUKQ0WE",
      }}
      events_onDocumentReady={onDocumentReady}
      onLoadComponentError={onLoadComponentError}
    />
  );
}
