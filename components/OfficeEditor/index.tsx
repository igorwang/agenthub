import { DocumentEditor } from "@onlyoffice/document-editor-react";
import * as jose from "jose";
import { useEffect, useState } from "react";

function onDocumentReady(event: any): void {
  console.log("Document is loaded");
}

async function encodePayload(payload: any) {
  try {
    // Generate a secret key for signing
    const secretKey = new TextEncoder().encode("bdddBS0hnEqA7lEtV2BcfSeG8iDY4dnz");

    // Create a new JWT and sign it
    const jwt = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2h") // Token expires in 2 hours
      .sign(secretKey);

    return jwt;
  } catch (error) {
    console.error("Error encoding payload:", error);
    throw error;
  }
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
  const [token, setToken] = useState("");

  const config = {
    document: {
      fileType: "docx",
      key: "cDovLzEyNy4wLjAuMTo512321M",
      title: "Example Document Title.docx",
      url: "http://s3web.techower.com/api/v1/download-shared-object/aHR0cDovLzEyNy4wLjAuMTo5MDAwL2NoYXQvdG1wL3JldmlzZWRfMjAyNDEwMTExN18lRTUlOTUlODYlRTklOTMlQkElRTclQTclOUYlRTglQjUlODElRTUlOTAlODglRTUlOTAlOEMuZG9jeD9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPTNNM0c1SFVUWVFYWUxVM0k2WTZWJTJGMjAyNDExMTAlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQxMTEwVDAxMTgzMVomWC1BbXotRXhwaXJlcz00MzIwMCZYLUFtei1TZWN1cml0eS1Ub2tlbj1leUpoYkdjaU9pSklVelV4TWlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKaFkyTmxjM05MWlhraU9pSXpUVE5ITlVoVlZGbFJXRmxNVlROSk5sazJWaUlzSW1WNGNDSTZNVGN6TVRJME1UTXdOU3dpY0dGeVpXNTBJam9pU0dKd2JtUkJialpqUWlKOS5LUDZlaGVsWTNIeFlhVjZpSzJiQzh6VFI0X2YxRTZWU3kzcjZHRk9aZlZLY1R2QTF1UFpXUE5qcE9UT0l2MloxNE9IYll3VklwbXVYY2U1OFFIakxwZyZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmdmVyc2lvbklkPW51bGwmWC1BbXotU2lnbmF0dXJlPWJkN2QxNTJhMmMyZjc1MDE3ZDcyOTZiNzdkYjY0ZTY5MGRmNjAyYTlhNjVmNmE2YTJmZDBkOTIyNjQ1MDAxNjM=",
      permissions: {
        edit: true,
        download: true,
        print: true,
        copy: true,
      },
    },
    editorConfig: {
      mode: "edit",
      callbackUrl: "https://office.techower.com",
    },
  };

  useEffect(() => {
    const fetchToken = async () => {
      const token = await encodePayload(config);
      setToken(token);
    };
    fetchToken();
  }, []);

  console.log("token", token);

  if (!token) return <div>Loading...</div>;

  return (
    <DocumentEditor
      id="docxEditor"
      documentServerUrl="https://office.techower.com"
      // documentServerUrl="http://localhost:9980"
      config={{ ...config, token }}
      events_onDocumentReady={onDocumentReady}
      onLoadComponentError={onLoadComponentError}
    />
  );
}
