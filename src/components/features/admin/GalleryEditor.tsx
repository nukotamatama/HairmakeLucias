"use client";

import { useAdmin } from "./AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

type GalleryItem = {
    id: string;
    image: string;
    title: string;
    description: string;
};

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';

export function GalleryEditor() {
    const { state, updateSection } = useAdmin();
    const items = state.gallery as GalleryItem[];

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

    const setItems = (newItems: GalleryItem[]) => {
        updateSection('gallery', newItems);
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
            console.error("Upload failed", e);
            alert("アップロードに失敗しました");
        }
    };

    const addItem = () => {
        const newItem = { id: crypto.randomUUID(), image: "/images/hero.png", title: "New Style", description: "" };
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

    const handleChange = (id: string, field: keyof GalleryItem, value: string) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex justify-end">
                <Button onClick={addItem}>+ スタイル追加</Button>
            </div>

            <DndContext
                id="gallery-editor-dnd"
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={items.map(i => i.id)}
                    strategy={rectSortingStrategy}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {items && items.map((item) => (
                            <SortableItem key={item.id} id={item.id} className="border p-4 rounded-lg bg-white space-y-4">
                                <div className="relative aspect-[3/4] bg-stone-100 rounded overflow-hidden group">
                                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                                    <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-sm font-bold">
                                        画像を変更
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, item.id)} />
                                    </label>
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        value={item.title}
                                        onChange={(e) => handleChange(item.id, 'title', e.target.value)}
                                        placeholder="スタイル名"
                                    />
                                    <Textarea
                                        value={item.description}
                                        onChange={(e) => handleChange(item.id, 'description', e.target.value)}
                                        placeholder="説明文"
                                    />
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <button type="button" className="text-xs font-bold text-white bg-red-400 hover:bg-red-500 px-3 py-1.5 rounded shadow-sm transition-all cursor-pointer flex items-center gap-1" onClick={(e) => deleteItem(e, item.id)}>✕ 削除</button>
                                </div>
                            </SortableItem>
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}
