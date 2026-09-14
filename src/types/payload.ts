export interface FieldBase {
  name?: string;
  type: string;
  label?: string;
  required?: boolean;
  unique?: boolean;
  defaultValue?: any;
  admin?: {
    description?: string;
    condition?: (data: any, siblingData: any) => boolean;
  };
  fields?: FieldBase[];
  options?: Array<{ label: string; value: string }>;
  relationTo?: string | string[];
  hasMany?: boolean;
  min?: number;
  max?: number;
}

export interface CollectionConfig {
  slug: string;
  labels?: {
    singular?: string;
    plural?: string;
  };
  admin?: {
    useAsTitle?: string;
    defaultColumns?: string[];
    group?: string;
    description?: string;
  };
  access?: {
    read?: (args: any) => boolean;
    create?: (args: any) => boolean;
    update?: (args: any) => boolean;
    delete?: (args: any) => boolean;
  };
  auth?: boolean;
  upload?: {
    staticDir?: string;
    imageSizes?: Array<{
      name: string;
      width: number;
      height: number;
      position?: string;
    }>;
    adminThumbnail?: string;
    mimeTypes?: string[];
  };
  fields: FieldBase[];
}
