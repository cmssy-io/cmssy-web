export interface DeliveryLimits {
  perWorkspacePerMinute: number;
  perIpPerMinute: number;
}

export interface ProtectionLimit {
  name: string;
  group: string;
  resource: string;
  scope: string;
  unit: string;
  window: string;
  value: number;
  configurable: boolean;
}

export interface PublishedLimits {
  delivery: DeliveryLimits | null;
  groups: string[];
  protection: ProtectionLimit[];
}

export interface AuthoredLabel {
  key?: string;
  label?: string;
  description?: string;
}

export interface LimitGroup {
  key: string;
  label: string;
  description: string;
  limits: ProtectionLimit[];
}

export function wordFor(
  vocabulary: AuthoredLabel[] | undefined,
  key: string,
): string {
  const match = vocabulary?.find((entry) => entry.key === key);
  const label = match?.label?.trim();
  return label ? label : key;
}

export function limitGroups(
  published: PublishedLimits | null,
  authored: AuthoredLabel[] | undefined,
): LimitGroup[] {
  if (!published) return [];
  const declared = [...published.groups];
  for (const limit of published.protection) {
    if (!declared.includes(limit.group)) declared.push(limit.group);
  }
  return declared
    .map((key) => {
      const match = authored?.find((entry) => entry.key === key);
      return {
        key,
        label: match?.label?.trim() || key,
        description: match?.description?.trim() || "",
        limits: published.protection.filter((limit) => limit.group === key),
      };
    })
    .filter((group) => group.limits.length > 0);
}
