import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SortableItemProps {
    id: string;
    children: React.ReactNode;
    className?: string; // Class for the wrapper
    handleClassName?: string; // Class for the handle
}

export function SortableItem({ id, children, className, handleClassName }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
        setActivatorNodeRef
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 50 : 1,
        position: 'relative' as const,
    };

    return (
        <div ref={setNodeRef} style={style} className={cn("relative", className)}>
            {/* Drag Handle - Moved to Left */}
            <div
                ref={setActivatorNodeRef}
                {...attributes}
                {...listeners}
                className={cn(
                    "absolute top-3 left-3 p-2 cursor-grab active:cursor-grabbing text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded z-10 touch-none",
                    handleClassName
                )}
            >
                <GripVertical size={24} />
            </div>

            {/* Content - Add padding left to avoid overlap */}
            <div className="pl-8">
                {children}
            </div>
        </div>
    );
}
