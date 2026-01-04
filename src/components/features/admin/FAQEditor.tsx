"use client";

import { useAdmin } from "./AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from "./SortableItem";

type FAQItem = {
    id: string;
    question: string;
    answer: string;
};

export function FAQEditor() {
    const { state, updateSection } = useAdmin();
    const items = state.faq as FAQItem[];

    const setItems = (newItems: FAQItem[]) => {
        updateSection('faq', newItems);
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Prevent accidental drags
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);
            setItems(arrayMove(items, oldIndex, newIndex));
        }
    };

    const addItem = () => {
        const newItem = { id: crypto.randomUUID(), question: "新しい質問", answer: "" };
        setItems([...items, newItem]);
    };

    const deleteItem = (e: React.MouseEvent | React.TouchEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        // Temporary removal of confirm
        // if (!window.confirm("削除しますか？")) return;
        setItems(items.filter(i => i.id !== id));
    };

    const handleChange = (id: string, field: keyof FAQItem, value: string) => {
        setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex justify-end">
                <Button onClick={addItem}>+ 質問を追加</Button>
            </div>

            <DndContext
                id="faq-editor-dnd"
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={items.map(i => i.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-4">
                        {items && items.map((item) => (
                            <SortableItem key={item.id} id={item.id} className="bg-white border rounded p-4">
                                <div className="space-y-4">
                                    <Input
                                        value={item.question}
                                        onChange={(e) => handleChange(item.id, 'question', e.target.value)}
                                        placeholder="質問"
                                        className="font-bold"
                                    />
                                    <Textarea
                                        value={item.answer}
                                        onChange={(e) => handleChange(item.id, 'answer', e.target.value)}
                                        placeholder="回答"
                                    />
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            className="text-xs font-bold text-white bg-red-400 hover:bg-red-500 px-3 py-1.5 rounded shadow-sm transition-all cursor-pointer flex items-center gap-1"
                                            onPointerDown={(e) => e.stopPropagation()} // Stop drag start
                                            onClick={(e) => deleteItem(e, item.id)}
                                        >
                                            ✕ 削除
                                        </button>
                                    </div>
                                </div>
                            </SortableItem>
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}
