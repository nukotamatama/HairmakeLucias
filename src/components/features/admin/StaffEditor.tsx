"use client";

import { useAdmin } from "./AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

type StaffItem = {
    id: string;
    name: string;
    role: string;
    image: string;
    message: string;
};

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';

export function StaffEditor() {
    const { state, updateSection } = useAdmin();
    const items = state.staff as StaffItem[];

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const setItems = (newItems: StaffItem[]) => {
        updateSection('staff', newItems);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);
            setItems(arrayMove(items, oldIndex, newIndex));
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (data.success) {
                setItems(items.map(item => item.id === id ? { ...item, image: data.url } : item));
            }
        } catch (e) {
            console.error(e);
            alert("画像のアップロードに失敗しました");
        }
    };

    const addItem = () => {
        const newItem = { id: crypto.randomUUID(), name: "New Staff", role: "Stylist", image: "/images/hero.png", message: "" };
        setItems([...items, newItem]);
    };

    const deleteItem = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();

        const item = items.find(i => i.id === id);
        if (item?.image?.startsWith('/images/')) {
            try {
                await fetch('/api/delete-image', {
                    method: 'POST',
                    body: JSON.stringify({ url: item.image })
                });
            } catch (err) {
                console.error("Failed to delete image:", err);
            }
        }

        setItems(items.filter(i => i.id !== id));
    };

    const handleChange = (id: string, field: keyof StaffItem, value: string) => {
        setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex justify-end">
                <Button onClick={addItem}>+ スタッフ追加</Button>
            </div>

            <DndContext
                id="staff-editor-dnd"
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={items.map(i => i.id)}
                    strategy={rectSortingStrategy}
                >
                    <div className="grid grid-cols-1 gap-6">
                        {items && items.map((item) => (
                            <SortableItem key={item.id} id={item.id} className="border p-6 rounded-lg bg-white flex flex-col md:flex-row gap-6 items-start">
                                {/* Wrap the image (handle logic handled by SortableItem internal handle) or customized? */}
                                {/* SortableItem has a handle on top-right. For Staff card which is flex row, absolute top-right works fine. */}

                                <div className="relative w-32 h-32 md:w-40 md:h-40 bg-stone-100 rounded overflow-hidden group flex-shrink-0">
                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                    <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-xs text-center p-2">
                                        画像を<br />変更
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, item.id)} />
                                    </label>
                                </div>
                                <div className="flex-1 space-y-4 w-full">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            value={item.role}
                                            onChange={(e) => handleChange(item.id, 'role', e.target.value)}
                                            placeholder="役職 (例: Top Stylist)"
                                        />
                                        <Input
                                            value={item.name}
                                            onChange={(e) => handleChange(item.id, 'name', e.target.value)}
                                            placeholder="名前"
                                        />
                                    </div>
                                    <Textarea
                                        value={item.message}
                                        onChange={(e) => handleChange(item.id, 'message', e.target.value)}
                                        placeholder="メッセージ"
                                        className="h-24"
                                    />
                                    <div className="flex justify-end">
                                        <button type="button" className="text-xs font-bold text-white bg-red-400 hover:bg-red-500 px-3 py-1.5 rounded shadow-sm transition-all cursor-pointer flex items-center gap-1" onClick={(e) => deleteItem(e, item.id)}>✕ 削除</button>
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
