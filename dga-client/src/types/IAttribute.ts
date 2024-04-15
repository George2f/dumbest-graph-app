export default interface IAttribute {
    key: string;
    value: string;
}

export type NewAttribute = Omit<IAttribute, 'id'>;
