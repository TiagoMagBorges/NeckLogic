export type ModuleStatus = 'LOCKED' | 'CURRENT' | 'COMPLETED';

export interface ModuleDTO {
    id: number;
    title: string;
    orderIndex: number;
    status: ModuleStatus;
    percentage: number;
    sectionId: number;
    sectionTitle: string;
    sectionDescription: string;
}