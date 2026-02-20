import React from 'react';
import { Resizable, ResizeCallbackData } from 'react-resizable';

interface ResizableTitleProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
    onResize?: (e: React.SyntheticEvent, data: ResizeCallbackData) => void;
    width?: number;
}

const ResizableTitle = (props: ResizableTitleProps) => {
    const { onResize, width, ...restProps } = props;

    if (!width) {
        return <th {...restProps} />;
    }

    return (
        <Resizable
            width={width}
            height={0}
            handle={
                <span
                    role="columnheader"
                    tabIndex={0}
                    className="react-resizable-handle"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    onKeyDown={(e) => {
                        e.stopPropagation();
                    }}
                />
            }
            onResize={onResize}
            draggableOpts={{
                enableUserSelectHack: false,
            }}
            maxConstraints={[500, 500]}
            minConstraints={[50, 50]}
        >
            <th {...restProps} />
        </Resizable>
    );
};

export default ResizableTitle;
