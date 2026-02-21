import React from 'react';
import { Modal, Table } from 'antd';

import Title from 'antd/es/typography/Title';

import EditableTableProps from '../../types/editabletable';
import AddButton from './AddButton';
import SearchInput from '../SearchInput/SearchInput';

const EditableTable = ({
    handleBtnAdd,
    hasSearch,
    handleOnSearch,
    handleOnSearchClear,
    isLoading,
    source,
    columns,
    isDeleteModalVisible,
    handleOnDelete,
    handleDeleteModalCancel,
    handleDeleteModalTitle,
    handleDeleteModalText,
    allowedNumberOfUsers = 9999,
}: EditableTableProps) => {
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <AddButton
                    allowedNumberOfUsers={allowedNumberOfUsers}
                    sourceLength={source.length}
                    handleBtnAdd={handleBtnAdd}
                />

                {hasSearch && (
                    <SearchInput handleOnSearch={handleOnSearch} handleOnSearchClear={handleOnSearchClear} />
                )}
            </div>

            <Table
                loading={isLoading}
                className="editableTable"
                dataSource={source}
                columns={columns}
                scroll={{ x: 'max-content', y: 'auto' }}
                sticky
                tableLayout="fixed"
            />

            <Modal
                title={<Title level={2}>{handleDeleteModalTitle}</Title>}
                open={isDeleteModalVisible}
                onOk={handleOnDelete}
                onCancel={handleDeleteModalCancel}
                cancelText="ABBRECHEN"
                closable={false}
                centered
            >
                <p>{handleDeleteModalText}</p>
            </Modal>
        </>
    );
};

export default EditableTable;
