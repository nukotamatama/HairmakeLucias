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
                            <SortableItem key={item.id} id={item.id}>
                                <div className="p-4 pr-6 space-y-4">
                                    <div>
                                        <label className="text-xs text-stone-500 font-bold mb-1 block">質問</label>
                                        <Input
                                            value={item.question}
                                            onChange={(e) => handleChange(item.id, 'question', e.target.value)}
                                            placeholder="Q. 質問を入力"
                                            className="font-bold bg-stone-50 border-stone-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-stone-500 font-bold mb-1 block">回答</label>
                                        <Textarea
                                            value={item.answer}
                                            onChange={(e) => handleChange(item.id, 'answer', e.target.value)}
                                            placeholder="A. 回答を入力"
                                            className="min-h-[100px] bg-stone-50 border-stone-200"
                                        />
                                    </div>
                                    <div className="flex justify-end pt-2 border-t border-stone-100">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onPointerDown={(e) => e.stopPropagation()}
                                            onClick={(e) => deleteItem(e, item.id)}
                                            className="text-red-400 hover:text-red-500 hover:bg-red-50 text-xs h-8"
                                        >
                                            削除する
                                        </Button>
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
