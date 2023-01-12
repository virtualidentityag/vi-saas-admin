import React from 'react';
import classNames from 'classnames';
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
import styles from './styles.module.scss';

export interface EditButtonsProps extends Omit<React.HTMLAttributes<HTMLElement>, 'resource'> {
    handleEdit: (formData: EditableData) => void;
    handleDelete: (formData: EditableData) => void;
    record: Partial<CounselorData | AgencyData | BasicTenantData | TopicData>;
    isDisabled?: boolean;
    hide?: string[];
    resource: Resource;
    disabled?: { edit: boolean; delete: boolean };
}

export const EditButtons = ({
    handleEdit,
    handleDelete,
    record,
    isDisabled,
    hide = [],
    resource,
    disabled,
}: EditButtonsProps) => {
    const { can } = useUserPermissions();
    const disabledButtons = {
        edit: isDisabled || disabled?.edit,
        delete: isDisabled || disabled?.delete,
    };

    const handleEditAction = disabledButtons.edit ? () => {} : handleEdit;
    const handleDeleteAction = disabledButtons.delete ? () => {} : handleDelete;
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
                    className={classNames('editIcon saveIcon', { [styles.disabled]: disabledButtons?.edit })}
                    type="button"
                    disabled={disabledButtons?.edit}
                    onClick={() => handleEditAction(record)}
                >
                    <CustomPencilIcon color={errorColor} />
                </button>
            )}
            {!hiddenElements.includes('delete') && (
                <button
                    className={classNames('editIcon deleteIcon', { [styles.disabled]: disabledButtons?.delete })}
                    type="button"
                    disabled={disabledButtons?.delete}
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
