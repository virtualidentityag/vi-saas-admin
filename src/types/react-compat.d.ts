/**
 * Type augmentation to restore onPointerEnterCapture and onPointerLeaveCapture
 * which were removed from @types/react@18 but are referenced in pre-compiled
 * type declarations of @ant-design/icons@4.x
 */
declare module 'react' {
    interface DOMAttributes<T> {
        onPointerEnterCapture?: React.PointerEventHandler<T> | undefined;
        onPointerLeaveCapture?: React.PointerEventHandler<T> | undefined;
    }
}

export {};
