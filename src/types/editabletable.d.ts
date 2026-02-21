import { Dispatch, SetStateAction } from 'react';
import { CounselorData } from './counselor';
import { BasicTenantData } from './tenant';
import { BasicTopicData } from './topic';
import { AgencyData } from './agency';

export type EditableData = CounselorData | BasicTenantData | BasicTopicData | AgencyData | undefined;

export default interface EditableTableProps {
    handleBtnAdd: () => void;
    isLoading: boolean;
    source: EditableData[];
    columns: Record<string, unknown>[];
    isDeleteModalVisible: boolean;
    handleOnDelete: (formData: EditableData) => void;
    handleDeleteModalCancel: (formData?: EditableData) => void;
    handleDeleteModalTitle: string;
    handleDeleteModalText: string;
    handlePagination: Dispatch<SetStateAction<number>>;
    page: number;
    allowedNumberOfUsers: number | false;
    hasSearch?: boolean;
    handleOnSearch?: (query: string) => void;
    handleOnSearchClear?: () => void;
}
