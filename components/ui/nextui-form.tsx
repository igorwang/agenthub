import LibrarySearch from "@/components/Library/LibrarySearch";
import ModelSelect from "@/components/PromptFrom/model-select";
import JsonExpressionInput from "@/components/ui/json-expression-input";
import JsonSchemaTooltip from "@/components/ui/json-schema-tooltip";
import { Chunking_Strategy_Enum } from "@/graphql/generated/types";
import { Icon } from "@iconify/react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Select,
  SelectItem,
  Switch,
  Textarea,
} from "@nextui-org/react";
import { FormProps, ThemeProps, withTheme } from "@rjsf/core";
import {
  ArrayFieldTemplateProps,
  FieldProps,
  RegistryFieldsType,
  RegistryWidgetsType,
  RJSFSchema,
  UiSchema,
  WidgetProps,
} from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import { Node } from "@xyflow/react";
import { JsonEditor } from "json-edit-react";
import React, { useState } from "react";
import { useTranslations } from "use-intl";

// Custom Widgets
const CustomCheckbox: React.FC<WidgetProps> = (props) => {
  const {
    id,
    value,
    required,
    disabled,
    readonly,
    label,
    onChange,
    onBlur,
    onFocus,
    autofocus,
    options,
  } = props;
  return (
    <Checkbox
      id={id}
      isSelected={value}
      isDisabled={disabled || readonly}
      onValueChange={(isSelected) => onChange(isSelected)}>
      {label}
    </Checkbox>
  );
};

const CustomSwitch: React.FC<WidgetProps> = (props) => {
  const { id, value, disabled, readonly, onChange, label } = props;
  return (
    <Switch
      id={id}
      className="mb-2"
      isSelected={value}
      isDisabled={disabled || readonly}
      onValueChange={(isSelected) => {
        onChange(isSelected);
      }}>
      {label}
    </Switch>
  );
};

const CustomTextareaWidget: React.FC<WidgetProps> = (props) => {
  const {
    id,
    value,
    required,
    disabled,
    readonly,
    onChange,
    onBlur,
    onFocus,
    autofocus,
    options,
    formContext,
  } = props;

  return (
    <Textarea
      id={id}
      value={value || ""}
      isRequired={required}
      disabled={disabled || readonly}
      className="mb-2"
      autoFocus={autofocus}
      placeholder={options.placeholder}
      minRows={1}
      onChange={(event) => onChange(event.target.value)}
      onBlur={(event) => onBlur(id, event.target)}
      onFocus={(event) => onFocus(id, event.target)}
    />
  );
};

const CustomArrayFieldTemplate: React.FC<ArrayFieldTemplateProps> = (props) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const t = useTranslations();

  return (
    <Card className="mb-2">
      <CardHeader
        className="flex cursor-pointer items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}>
        <h4 className="text-lg font-bold">{props.title}</h4>
        <Icon
          icon={isExpanded ? "mdi:chevron-up" : "mdi:chevron-down"}
          width="24"
          height="24"
        />
      </CardHeader>
      {isExpanded && (
        <CardBody>
          {props.items.map((element, index) => (
            <Card key={element.key} className="mb-4">
              <CardBody>
                {element.children}
                <div className="mt-2 flex justify-between">
                  <div>
                    <Button
                      isIconOnly
                      variant="light"
                      onClick={() => element.onReorderClick(index, index - 1)()}
                      isDisabled={index === 0}
                      className="mr-1">
                      <Icon icon="mdi:arrow-up" width="20" height="20" />
                    </Button>

                    <Button
                      isIconOnly
                      variant="light"
                      onClick={() => element.onReorderClick(index, index + 1)()}
                      isDisabled={index === props.items.length - 1}>
                      <Icon icon="mdi:arrow-down" width="20" height="20" />
                    </Button>
                  </div>
                  <Button
                    color="danger"
                    variant="flat"
                    onPress={() => element.onDropIndexClick(index)()}>
                    {t("Remove")}
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
          {props.canAdd && (
            <Button
              color="primary"
              onClick={(e) => {
                e.preventDefault();
                props.onAddClick();
              }}
              className="mt-2">
              {t("Add Item")}
            </Button>
          )}
        </CardBody>
      )}
    </Card>
  );
};

const CustomSelectWidget: React.FC<WidgetProps> = (props) => {
  const { id, name, label, value, required, disabled, readonly, onChange, options } =
    props;
  return (
    <Select
      id={id}
      className="mb-2"
      value={value}
      aria-label={`Select-${id}`}
      isRequired={required}
      selectedKeys={new Set([value])}
      isDisabled={disabled || readonly}
      onChange={(e) => onChange(e.target.value)}>
      {(options.enumOptions || []).map((option: any) => (
        <SelectItem key={option.value} value={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </Select>
  );
};

const CustomJsonField: React.FC<FieldProps> = (props) => {
  const { name, schema, uiSchema, idSchema, formData, onChange, registry, formContext } =
    props;

  const taskOutputFormatIntro =
    "This field defines the output format for the current task node. Follow these principles:\n\n1. The output must be a JSON object.\n2. Define properties with appropriate types (string, number, boolean, object, array).\n3. Use 'title' to provide a human-readable name for each property.\n\nAdhering to this format ensures consistency and facilitates data processing in subsequent steps.";
  const jsonInputPrompt = `Please enter data that conforms to JSON standards.

    Example:
    {
      "name": "John Doe",
      "age": 30,
      "hobbies": ["reading", "traveling"],
      "isStudent": false
    }
    
    Note:
    1. Use double quotes for key names and string values
    2. Use square brackets [] for arrays, curly braces {} for objects
    3. Separate items with commas
    4. Use true or false for boolean values
    5. Write numbers directly, without quotes`;

  const outputSchemaDataExample = {
    type: "object",
    properties: {
      name: {
        type: "string",
        title: "Name",
      },
      age: {
        type: "number",
        title: "Age",
      },
      isStudent: {
        type: "boolean",
        title: "Is Student",
      },
      address: {
        type: "object",
        title: "Address",
        properties: {
          street: {
            type: "string",
            title: "Street",
          },
          city: {
            type: "string",
            title: "City",
          },
          zipCode: {
            type: "string",
            title: "Zip Code",
          },
        },
      },
      hobbies: {
        type: "array",
        title: "Hobbies",
        items: {
          type: "string",
        },
      },
    },
  };

  const tooltipContent =
    name === "outputSchema" ? (
      <JsonSchemaTooltip
        title="outputSchema"
        content={schema.description || taskOutputFormatIntro}
        format={JSON.stringify(outputSchemaDataExample)}
        iconSize={20}
      />
    ) : (
      <JsonSchemaTooltip
        title={schema.title || "document"}
        iconSize={20}
        content={schema.description || jsonInputPrompt}
      />
    );

  if (schema.format === "json" || uiSchema?.["ui:field"] === "json") {
    return (
      <div className="flex max-w-full flex-col">
        <div className="flex flex-row items-center justify-start gap-1">
          <label>{schema.title || "Schema"}</label>
          {tooltipContent}
        </div>
        <JsonEditor
          id={idSchema.$id}
          collapse={true}
          // maxWidth={400}
          data={formData || {}}
          onUpdate={({ newData }) => {
            onChange(newData);
          }}
          rootName={""}
        />
      </div>
    );
  }

  return <registry.fields.ObjectField {...props} />;
};

const CustomExpressionInputField: React.FC<FieldProps> = (props) => {
  const {
    id,
    formData,
    required,
    disabled,
    readonly,
    onChange,
    onBlur,
    onFocus,
    autofocus,
    schema,
    uiSchema,
    formContext,
  } = props;

  const { prevNodes, workflowTestResult } = formContext || {};
  const jsonData = prevNodes
    ? prevNodes.reduce((acc: { [key: string]: any }, item: Node) => {
        const key = (item.data.label as string) || "Node Label";
        acc[key] = item.data.outputSchema;
        return acc;
      }, {})
    : {};

  return (
    <div className="max-w-full overflow-auto">
      <div className="flex flex-row items-center gap-1">
        <label>
          {schema.title || "Expression"} {required ? "*" : ""}
        </label>
        {schema.description && (
          <JsonSchemaTooltip
            title={schema.title || "Document"}
            content={schema.description || "Document"}
            iconSize={20}></JsonSchemaTooltip>
        )}
      </div>

      <JsonExpressionInput
        id={id}
        value={formData || ""}
        jsonData={workflowTestResult}
        isRequired={required}
        className="mb-2"
        isDisabled={disabled || readonly}
        autoFocus={autofocus}
        placeholder={uiSchema?.["ui:placeholder"]}
        onChange={(value) => onChange(value)}
        onBlur={(id, e) => onBlur(id, e.target)}
        onFocus={(id, e) => onFocus(id, e.target)}
      />
    </div>
  );
};

const CustomChunkingSelectField: React.FC<FieldProps> = (props) => {
  const {
    id,
    formData,
    required,
    disabled,
    readonly,
    onChange,
    onBlur,
    onFocus,
    autofocus,
    schema,
    uiSchema,
  } = props;

  React.useEffect(() => {
    if (!formData && required) {
      onChange("length");
    }
  }, [formData, required, onChange]);

  return (
    <div className="max-w-full">
      <div className="flex flex-row items-center gap-1">
        <label htmlFor={id}>
          {schema.title || "Chunking Strategy"} {required ? "*" : ""}
        </label>
        {schema.description && (
          <JsonSchemaTooltip
            title={schema.title || "Chunking Strategy"}
            content={schema.description}
            iconSize={20}
          />
        )}
      </div>
      <Select
        id={id}
        aria-label="Chunking-Strategy-Select"
        // label="Chunking Strategy"
        // labelPlacement="outside"
        // placeholder={uiSchema?.["ui:placeholder"] || "Select your chunking strategy"}
        selectedKeys={formData ? [formData] : ["length"]}
        disallowEmptySelection={required}
        isDisabled={disabled || readonly}
        autoFocus={autofocus}
        onSelectionChange={(keys) => {
          const selectedValue = (Array.from(keys)[0] as string) || null;
          onChange(selectedValue);
        }}
        // onBlur={(e) => onBlur(id, e.target)}
        // onFocus={(e) => onFocus(id, e.target)}
      >
        {Object.values(Chunking_Strategy_Enum).map((strategy) => (
          <SelectItem key={strategy} value={strategy}>
            {strategy}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};

const CustomModelField: React.FC<FieldProps> = (props) => {
  const { name, schema, value, uiSchema, required, formData, onChange, registry } = props;

  if (schema.format === "model" || uiSchema?.["ui:field"] === "model") {
    return (
      <div className="mb-2">
        <label>
          {schema.title || "model"} {required ? "*" : ""}
        </label>
        <ModelSelect
          label=""
          defaultModel={formData || ""}
          modelType={schema.modelType || "llm"}
          onSelectionChange={(modelName, limit) => {
            // Update the form data with the new model name
            onChange(modelName);
          }}
        />
      </div>
    );
  }

  // Fall back to default ObjectField if not a model field
  return <registry.fields.ObjectField {...props} />;
};

const CustomLibrarySearchField: React.FC<FieldProps> = (props) => {
  const { name, schema, uiSchema, required, formData, onChange, registry } = props;

  if (schema.format === "librarySearch" || uiSchema?.["ui:field"] === "librarySearch") {
    return (
      <div className="mb-2">
        <label>
          {schema.title || "Libraries"} {required ? "*" : ""}
        </label>
        <LibrarySearch
          defaultSelectedLibraries={formData || []}
          onSelectChange={(selectedLibraries) => {
            onChange(selectedLibraries);
          }}
        />
      </div>
    );
  }

  return <registry.fields.ObjectField {...props} />;
};

// Define default widgets
const defaultWidgets: RegistryWidgetsType = {
  CheckboxWidget: CustomCheckbox,
  SwitchWidget: CustomSwitch,
  TextWidget: CustomTextareaWidget,
  SelectWidget: CustomSelectWidget,
};

const useNextUITheme = (): ThemeProps => {
  const t = useTranslations(); // 假设 'form' 是您的翻译命名空间

  return {
    widgets: defaultWidgets,
    templates: {
      ArrayFieldTemplate: CustomArrayFieldTemplate,
      ButtonTemplates: {
        SubmitButton: (props) => (
          <div className="mb-2 flex w-full flex-row justify-end space-x-2">
            <Button
              color="danger"
              variant="bordered"
              onClick={props.registry.formContext.onClose}
              className="mt-4">
              {t("close")}
            </Button>
            <Button color="primary" type="submit" className="mt-4">
              {t("submit")}
            </Button>
          </div>
        ),
      },
    },
  };
};

// Create the themed form
// const ThemedForm = withTheme(useNextUITheme());
type ThemedFormProps = Omit<FormProps<any, RJSFSchema, any>, "theme">;

const ThemedForm: React.FC<ThemedFormProps> = (props) => {
  const theme = useNextUITheme();
  const Form = withTheme(theme);
  if (props.disabled) {
    return <Form {...props} children={<></>} />;
  } else {
    return <Form {...props} />;
  }
};

// Main component
interface CustomFormProps {
  schema: RJSFSchema;
  uiSchema?: UiSchema;
  formData?: any; // Add this line to accept default values
  customWidgets?: RegistryWidgetsType;
  prevNodes?: Node[];
  workflowTestResult?: { [key: string]: any };
  disabled?: boolean;
  onSubmit: (formData: any) => void;
  onClose?: () => void;
}

const CustomForm: React.FC<CustomFormProps> = ({
  schema,
  uiSchema,
  prevNodes,
  customWidgets,
  workflowTestResult,
  formData = {},
  disabled = false,
  onSubmit,
  onClose,
}) => {
  const widgets = { ...defaultWidgets, ...customWidgets };
  const fields: RegistryFieldsType = {
    json: CustomJsonField,
    expression: CustomExpressionInputField,
    model: CustomModelField,
    librarySearch: CustomLibrarySearchField,
    chunkingStrategy: CustomChunkingSelectField,
  };

  return (
    <ThemedForm
      schema={schema}
      uiSchema={uiSchema}
      formData={formData}
      validator={validator}
      widgets={widgets}
      fields={fields}
      disabled={disabled}
      formContext={{ onClose, prevNodes, workflowTestResult }}
      onSubmit={({ formData }) => {
        onSubmit(formData);
      }}
    />
  );
};

export default CustomForm;
