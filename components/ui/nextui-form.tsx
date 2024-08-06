import JsonExpressionInput from "@/components/ui/json-expression-input";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Select,
  SelectItem,
  Switch,
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
      onValueChange={(isSelected) => onChange(isSelected)}>
      {label}
    </Switch>
  );
};

const CustomTextWidget: React.FC<WidgetProps> = (props) => {
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
  } = props;
  return (
    <JsonExpressionInput
      id={id}
      value={value || ""}
      isRequired={required}
      className="mb-2"
      isDisabled={disabled || readonly}
      autoFocus={autofocus}
      placeholder={options.placeholder}
      onChange={(value) => onChange(value)}
      onBlur={(id, e) => onBlur(id, e)}
      onFocus={(id, e) => onFocus(id, e)}
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
  const { id, value, required, disabled, readonly, onChange, options } = props;
  return (
    <Select
      id={id}
      className="mb-2"
      value={value}
      isRequired={required}
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
  const { schema, uiSchema, idSchema, formData, onChange, registry } = props;

  if (schema.format === "json" || uiSchema?.["ui:field"] === "json") {
    return (
      <div className="flex flex-col">
        <label>{schema.title || "Schema"}</label>
        <JsonEditor
          id={idSchema.$id}
          collapse={true}
          maxWidth={400}
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

// Define default widgets
const defaultWidgets: RegistryWidgetsType = {
  CheckboxWidget: CustomCheckbox,
  SwitchWidget: CustomSwitch,
  TextWidget: CustomTextWidget,
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
  customWidgets?: RegistryWidgetsType;
  onSubmit: (formData: any) => void;
  onClose?: () => void;
}

const CustomForm: React.FC<CustomFormProps> = ({
  schema,
  uiSchema,
  customWidgets,
  onSubmit,
  onClose,
}) => {
  const widgets = { ...defaultWidgets, ...customWidgets };

  const fields: RegistryFieldsType = { json: CustomJsonField };

  return (
    <ThemedForm
      schema={schema}
      uiSchema={uiSchema}
      validator={validator}
      widgets={widgets}
      fields={fields}
      formContext={{ onClose }}
      onSubmit={({ formData }) => {
        console.log(formData);
        onSubmit(formData);
      }}
    />
  );
};

export default CustomForm;
