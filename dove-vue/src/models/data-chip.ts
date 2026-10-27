export interface DataChipDefinition {
    id: string;
    label: string;
}

export type DataChipOption = string | DataChipDefinition;

export function toDataChipDefinition(option: DataChipOption): DataChipDefinition {
    return typeof option === 'string' ? { id: option, label: option } : option;
}
