import JsonExpressionInput from "@/components/ui/json-expression-input";
import JsonSchemaTooltip from "@/components/ui/json-schema-tooltip";
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
import { ThemeProps, withTheme } from "@rjsf/core";
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
import React from "react";

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
      className="mb-2"
      isDisabled={disabled || readonly}
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
  return (
    <Card className="mb-2">
      <CardHeader>
        <h4 className="text-lg font-bold">{props.title}</h4>
        {/* {props.description && <p className="text-sm text-gray-500">{props.description}</p>} */}
      </CardHeader>
      <CardBody>
        {props.items.map((element, index) => (
          <Card key={element.key} className="mb-4">
            <CardBody>
              {element.children}
              <Button
                color="danger"
                size="md"
                onClick={element.onDropIndexClick(index)}
                className="mt-2">
                Remove
              </Button>
            </CardBody>
          </Card>
        ))}
        {props.canAdd && (
          <Button color="primary" onClick={props.onAddClick} className="mt-2">
            Add Item
          </Button>
        )}
      </CardBody>
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
    },
    hobbies: {
      type: "array",
      title: "Hobbies",
    },
  };

  const tooltipContent =
    name === "outputSchema" ? (
      <JsonSchemaTooltip
        title="outputSchema"
        content={taskOutputFormatIntro}
        format={JSON.stringify(outputSchemaDataExample)}
      />
    ) : (
      <JsonSchemaTooltip title="jsonSchema" content={jsonInputPrompt} />
    );

  if (schema.format === "json" || uiSchema?.["ui:field"] === "json") {
    return (
      <div className="flex max-w-full flex-col">
        <div className="flex flex-row items-center justify-start">
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
    <div>
      <label>
        {schema.title || "Expression"} {required ? "*" : ""}
      </label>
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
        onBlur={(id, e) => onBlur(id, e.target.value)}
        onFocus={(id, e) => onFocus(id, e.target.value)}
      />
    </div>
  );
};

// Define default widgets
const defaultWidgets: RegistryWidgetsType = {
  CheckboxWidget: CustomCheckbox,
  SwitchWidget: CustomSwitch,
  TextWidget: CustomTextareaWidget,
  SelectWidget: CustomSelectWidget,
};

// Create the theme object
const NextUITheme: ThemeProps = {
  widgets: defaultWidgets,
  templates: {
    ArrayFieldTemplate: CustomArrayFieldTemplate,
    ButtonTemplates: {
      SubmitButton: (props) => (
        <div className="flex w-full flex-row justify-end space-x-2">
          <Button
            color="danger"
            variant="bordered"
            onClick={props.registry.formContext.onClose}
            className="mt-4">
            Close
          </Button>
          <Button color="primary" type="submit" className="mt-4">
            Submit
          </Button>
        </div>
      ),
    },
  },
};

// Create the themed form
const ThemedForm = withTheme(NextUITheme);

// Main component
interface CustomFormProps {
  schema: RJSFSchema;
  uiSchema?: UiSchema;
  formData?: any; // Add this line to accept default values
  customWidgets?: RegistryWidgetsType;
  prevNodes?: Node[];
  workflowTestResult?: { [key: string]: any };
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
  onSubmit,
  onClose,
}) => {
  const widgets = { ...defaultWidgets, ...customWidgets };
  const fields: RegistryFieldsType = {
    json: CustomJsonField,
    expression: CustomExpressionInputField,
  };

  return (
    <ThemedForm
      schema={schema}
      uiSchema={uiSchema}
      formData={formData}
      validator={validator}
      widgets={widgets}
      fields={fields}
      formContext={{ onClose, prevNodes, workflowTestResult }}
      onSubmit={({ formData }) => {
        onSubmit(formData);
      }}
    />
  );
};

export default CustomForm;
