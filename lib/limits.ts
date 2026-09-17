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

function text(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value : null;
}

function count(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function protectionRow(value: unknown): ProtectionLimit | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const name = text(row.name);
  const group = text(row.group);
  const resource = text(row.resource);
  const scope = text(row.scope);
  const unit = text(row.unit);
  const window = text(row.window);
  const limit = count(row.value);
  if (
    name === null ||
    group === null ||
    resource === null ||
    scope === null ||
    unit === null ||
    window === null ||
    limit === null
  ) {
    return null;
  }
  return {
    name,
    group,
    resource,
    scope,
    unit,
    window,
    value: limit,
    configurable: row.configurable === true,
  };
}

export function publishedLimits(payload: unknown): PublishedLimits {
  const body = (payload ?? {}) as Record<string, unknown>;
  const delivery = (body.delivery ?? {}) as Record<string, unknown>;
  const perWorkspacePerMinute = count(delivery.perWorkspacePerMinute);
  const perIpPerMinute = count(delivery.perIpPerMinute);
  const rows = Array.isArray(body.protection) ? body.protection : [];
  const groups = Array.isArray(body.groups) ? body.groups : [];

  return {
    delivery:
      perWorkspacePerMinute !== null && perIpPerMinute !== null
        ? { perWorkspacePerMinute, perIpPerMinute }
        : null,
    groups: groups.filter((group): group is string => text(group) !== null),
    protection: rows
      .map(protectionRow)
      .filter((row): row is ProtectionLimit => row !== null),
  };
}
