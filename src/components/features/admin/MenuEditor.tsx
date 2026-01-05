"use client";

import { useAdmin } from "./AdminContext";
import { Button } from "@/components/ui/button";
import { MenuItem, Category } from "@/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';

const DEFAULT_CATEGORIES: Category[] = ["Cut", "Color", "Perm", "Treatment", "Spa", "Other"];

export function MenuEditor() {
    const { state, updateSection } = useAdmin();
    const items = state.menu as MenuItem[];
    const categories = DEFAULT_CATEGORIES;

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

    const setItems = (newItems: MenuItem[]) => {
        updateSection('menu', newItems);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;
        if (active.id === over.id) return;

        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
            setItems(arrayMove(items, oldIndex, newIndex));
        }
    };

    const handleCreate = (category: string) => {
        const newItem: MenuItem = {
            id: crypto.randomUUID(),
            category,
            name: "新規メニュー",
            price: 0,
            description: ""
        };
        setItems([...items, newItem]);
    };

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        setItems(items.filter(i => i.id !== id));
    };

    const handleChange = (id: string, field: keyof MenuItem, value: any) => {
        setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
    };

    return (
        <div className="space-y-16 pb-12">
            <DndContext
                id="menu-editor-dnd"
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div className="space-y-12">
                    {categories.map((category) => {
                        const categoryItems = items.filter(i => i.category === category) || [];

                        return (
                            <div
                                key={category}
                                className="pt-4 pb-8 bg-stone-50/50 rounded-xl border border-dashed border-stone-200"
                            >
                                <div className="space-y-6">
                                    <div className="flex items-end justify-between border-b border-stone-300 pb-2 px-8">
                                        <h3 className="text-xl font-serif text-stone-800 text-center pl-8">
                                            {category}
                                        </h3>
                                        <Button
                                            size="sm"
                                            className="bg-stone-800 text-white hover:bg-stone-700 text-xs px-4 shadow-sm"
                                            onClick={() => handleCreate(category)}
                                        >
                                            + 追加する
                                        </Button>
                                    </div>

                                    <SortableContext
                                        items={categoryItems.map(i => i.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className="space-y-4 px-4">
                                            {categoryItems.map((item) => (
                                                <SortableItem key={item.id} id={item.id}>
                                                    <div className="p-4 space-y-4">
                                                        <div>
                                                            <Label className="text-xs text-stone-500 font-bold mb-1 block">メニュー名</Label>
                                                            <Input
                                                                className="bg-stone-50 border-stone-200"
                                                                value={item.name}
                                                                onChange={(e) => handleChange(item.id, 'name', e.target.value)}
                                                                placeholder="メニュー名を入力"
                                                            />
                                                        </div>

                                                        <div>
                                                            <Label className="text-xs text-stone-500 font-bold mb-1 block">価格 (税込)</Label>
                                                            <div className="relative">
                                                                <span className="absolute left-3 top-2.5 font-serif text-stone-500 text-sm">¥</span>
                                                                <Input
                                                                    type="number"
                                                                    className="pl-8 bg-stone-50 border-stone-200 font-serif w-full md:w-48"
                                                                    value={item.price}
                                                                    onChange={(e) => handleChange(item.id, 'price', Number(e.target.value))}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <Label className="text-xs text-stone-500 font-bold mb-1 block">説明文</Label>
                                                            <Textarea
                                                                className="text-xs md:text-sm text-stone-800 font-light leading-relaxed bg-stone-50 border-stone-200 hover:border-stone-300 focus:border-stone-400 focus:outline-none w-full min-h-[80px] rounded-md resize-y"
                                                                value={item.description}
                                                                onChange={(e) => handleChange(item.id, 'description', e.target.value)}
                                                                placeholder="説明文を入力..."
                                                            />
                                                        </div>

                                                        <div className="flex justify-end pt-2 border-t border-stone-100">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={(e) => handleDelete(e, item.id)}
                                                                className="text-red-400 hover:text-red-500 hover:bg-red-50 text-xs h-8"
                                                            >
                                                                削除する
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </SortableItem>
                                            ))}
                                            {categoryItems.length === 0 && (
                                                <div className="text-center text-xs text-stone-300 py-4">
                                                    （メニューなし）
                                                </div>
                                            )}
                                        </div>
                                    </SortableContext>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </DndContext>
        </div>
    );
}
