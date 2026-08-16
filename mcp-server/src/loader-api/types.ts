/** Loader API 摘要中的方法（JavaParser CST 还原，不是 JNI 描述符）。 */
export type MethodInfo = {
  name: string;
  returnType: string;
  parameters: { type: string; name: string }[];
  modifiers: string[];
  signature: string;
};

export type LoaderClassRecord = {
  fqcn: string;
  simpleName: string;
  pkg?: string;
  apiStatusInternal: boolean;
  environment: boolean;
  methods: MethodInfo[];
  modifiers?: string[];
  parseError?: string;
  file?: string;
};

export type LoaderApiSummary = {
  file?: string;
  key?: string;
  platform?: string;
  minecraftVersion?: string;
  mappingsVersion?: string | null;
  mappingsSource?: string;
  mapping?: string;
  sourceJarSha256?: string;
  sourceTreeMtime?: number;
  source?: "official" | "user_jar";
  skippedExpansion?: boolean;
  invalid?: boolean;
  classCount?: number;
  fqcnIndex?: string[];
  classes?: LoaderClassRecord[];
  note?: string;
  [extra: string]: unknown;
};

export type LoaderApiKeyMeta = {
  key: string;
  platform: string;
  minecraftVersion: string;
  source: "official" | "user_jar";
  overlay: boolean;
  mappingsVersion?: string | null;
  classCount: number;
  skippedExpansion?: boolean;
};
