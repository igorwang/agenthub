export const chunkingParamsSchema = {
  type: "object",
  properties: {
    chunk_size: { type: "integer" },
    chunk_overlap: { type: "integer" },
  },
  additionalProperties: false,
  minProperties: 0,
  maxProperties: 2,
};

export const defaultChunkingParams = {
  chunk_size: 2000,
  chunk_overlap: 0,
};

export const documentSchema = {
  type: "object",
  required: ["type", "title", "description", "properties"],
  properties: {
    type: {
      type: "string",
      const: "Document",
    },
    title: { type: "string" },
    description: { type: "string" },
    properties: {
      type: "object",
      required: ["title", "content"],
      properties: {
        title: {
          type: "object",
          required: ["type"],
          properties: {
            type: { const: "string" },
            label: { type: "string" },
          },
          additionalProperties: false,
        },
        content: {
          type: "object",
          required: ["type"],
          properties: {
            type: { const: "string" },
            label: { type: "string" },
          },
          additionalProperties: false,
        },
      },
      additionalProperties: {
        type: "object",
        required: ["type"],
        properties: {
          type: { type: "string" },
          label: { type: "string" },
        },
      },
    },
  },
  additionalProperties: false,
};

export const defaultDocumentSchemaExample = {
  type: "Document",
  title: "Minimal Schema",
  description: "A minimal schema description",
  properties: {
    title: {
      type: "string",
      label: "label",
    },
    content: {
      type: "string",
      label: "label",
    },
  },
};
