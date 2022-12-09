import React from 'react';
import { AgencyData } from '../../types/agency';
import { CounselorData } from '../../types/counselor';
import { EditableData } from '../../types/editabletable';
import { TopicData } from '../../types/topic';
import { BasicTenantData } from '../../types/tenant';
import CustomPencilIcon from '../CustomIcons/Pencil';
import CustomRecycleIcon from '../CustomIcons/RecycleBin';
import { Resource } from '../../enums/Resource';
import { useUserPermissions } from '../../hooks/useUserPermission';
import { PermissionAction } from '../../enums/PermissionAction';

export interface EditButtonsProps extends Omit<React.HTMLAttributes<HTMLElement>, 'resource'> {
    handleEdit: (formData: EditableData) => void;
    handleDelete: (formData: EditableData) => void;
    record: Partial<CounselorData | AgencyData | BasicTenantData | TopicData>;
    isDisabled?: boolean;
    hide?: string[];
    resource: Resource;
}

const EditButtons = ({ handleEdit, handleDelete, record, isDisabled, hide = [], resource }: EditButtonsProps) => {
    const { can } = useUserPermissions();
    const disabled = isDisabled ? 'disabled' : '';
    const handleEditAction = isDisabled ? () => {} : handleEdit;
    const handleDeleteAction = isDisabled ? () => {} : handleDelete;
    const errorColor = '#FF0000';
    const hiddenElements = hide || [];
    if (!can(PermissionAction.Delete, resource)) {
        hide.push('delete');
    }
    if (!can(PermissionAction.Update, resource)) {
        hide.push('edit');
    }

    return (
        <div className="editBtnWrapper">
            {!hiddenElements.includes('edit') && (
                <button
                    className={`editIcon saveIcon ${disabled}`}
                    type="button"
                    onClick={() => handleEditAction(record)}
                >
                    <CustomPencilIcon color={errorColor} />
                </button>
            )}
            {!hiddenElements.includes('delete') && (
                <button
                    className={`editIcon deleteIcon ${disabled}`}
                    type="button"
                    onClick={() => {
                        handleDeleteAction(record);
                    }}
                >
                    <CustomRecycleIcon style={{ color: errorColor }} />
                </button>
            )}
        </div>
    );
};

export default EditButtons;
