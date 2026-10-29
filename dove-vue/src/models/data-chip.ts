export interface DataChipDefinition {
    id: string;
    label?: string | null;
    chips?: DataChipOption[];
}

export type DataChipOption = string | DataChipDefinition;

export function toDataChipDefinition(option: DataChipOption): DataChipDefinition & { label: string } {
    return typeof option === 'string'
        ? { id: option, label: option }
        : { ...option, label: option.label || option.id };
}

export function descendantIds(def: DataChipDefinition): string[] {
    return (def.chips ?? []).map(toDataChipDefinition)
        .flatMap(child => [child.id, ...descendantIds(child)]);
}
