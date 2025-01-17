import type { RenderInput } from "./template";
import * as F from "./expressions/fields";
import { Namespace } from "./expressions/namespace";
import {
  TypeDefinition,
  SavedTypeDefinition,
} from "./expressions/typedefinitions";
import type { FieldType } from "../kintone/clients/forms-client";

export const convertToTsExpression = ({
  namespace,
  typeName,
  fieldTypeGroups,
}: RenderInput): Namespace => {
  const fieldGroup = convertToFieldGroup(fieldTypeGroups);
  const subTableFields = fieldTypeGroups.subTableFields.map(
    (f) => new F.SubTableField(f.code, f.type, convertToFieldGroup(f.fields))
  );

  const typeDefinition = new TypeDefinition(
    typeName,
    fieldGroup,
    subTableFields
  );

  const userFields = fieldTypeGroups.userFieldsInSavedRecord.map(
    (f) => new F.TsDefinedField(f.code, f.type)
  );

  const stringFieldsInSavedRecord =
    fieldTypeGroups.stringFieldsInSavedRecord.map(
      (f) => new F.TsDefinedField(f.code, f.type)
    );

  const savedTypeDefinition = new SavedTypeDefinition(
    typeName,
    userFields,
    stringFieldsInSavedRecord
  );

  return new Namespace(namespace, typeDefinition, savedTypeDefinition);
};

interface ConvertToFieldGroupInput {
  stringFields: FieldType[];
  calculatedFields: FieldType[];
  stringFieldsInSavedRecord: FieldType[];
  stringListFields: FieldType[];
  entityListFields: FieldType[];
  fileTypeFields: FieldType[];
}
const convertToFieldGroup = (input: ConvertToFieldGroupInput): F.FieldGroup => {
  const stringFields = input.stringFields.map(
    (f) => new F.TsDefinedField(f.code, f.type)
  );

  const calculatedFields = input.calculatedFields.map(
    (f) => new F.TsDefinedField(f.code, f.type)
  );

  const stringListFields = input.stringListFields.map(
    (f) => new F.TsDefinedField(f.code, f.type)
  );

  const entityFields = input.entityListFields.map(
    (f) => new F.TsDefinedField(f.code, f.type)
  );

  const fileFields = input.fileTypeFields.map(
    (f) => new F.TsDefinedField(f.code, f.type)
  );

  return new F.FieldGroup(
    stringFields,
    calculatedFields,
    stringListFields,
    entityFields,
    fileFields
  );
};
