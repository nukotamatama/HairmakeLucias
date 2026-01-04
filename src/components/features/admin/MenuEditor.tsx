"use client";

import { useAdmin } from "./AdminContext";
import { Button } from "@/components/ui/button";
import { MenuItem, Category } from "@/types";
import { Input } from "@/components/ui/input";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragStartEvent, DragOverEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';

const DEFAULT_CATEGORIES: Category[] = ["Cut", "Color", "Perm", "Treatment", "Spa", "Other"];

export function MenuEditor() {
    const { state, updateSection } = useAdmin();
    const items = state.menu as MenuItem[];
    // Use fixed categories as requested
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

        // Sorting Items
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        // Only allow reorder if both exist
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
                                    <div className="flex items-end justify-between border-b border-stone-300 pb-2 w-11/12 mx-auto">
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
                                        <div className="space-y-4 max-w-4xl mx-auto px-4">
                                            {categoryItems.map((item) => (
                                                <SortableItem key={item.id} id={item.id} className="group relative flex flex-col md:flex-row justify-between items-baseline gap-1 md:gap-8 p-4 bg-white hover:bg-stone-50 rounded transition-colors border border-stone-100 shadow-sm">

                                                    <div className="flex-1 w-full pl-8 md:pl-0">
                                                        <div className="flex justify-between items-baseline w-full gap-4">
                                                            <input
                                                                className="text-base md:text-lg font-medium text-stone-700 bg-transparent border-b border-transparent hover:border-stone-200 focus:border-stone-400 focus:outline-none w-full transition-colors"
                                                                value={item.name}
                                                                onChange={(e) => handleChange(item.id, 'name', e.target.value)}
                                                            />

                                                            <div className="md:hidden font-serif text-stone-800 text-sm flex items-center">
                                                                ¥ <input
                                                                    type="number"
                                                                    className="w-16 text-right bg-transparent border-b border-transparent hover:border-stone-200 focus:border-stone-400 focus:outline-none"
                                                                    value={item.price}
                                                                    onChange={(e) => handleChange(item.id, 'price', Number(e.target.value))}
                                                                />
                                                            </div>
                                                        </div>

                                                        <input
                                                            className="text-xs md:text-sm text-stone-500 mt-1 font-light leading-relaxed bg-transparent border-b border-transparent hover:border-stone-200 focus:border-stone-400 focus:outline-none w-full"
                                                            value={item.description}
                                                            onChange={(e) => handleChange(item.id, 'description', e.target.value)}
                                                            placeholder="説明文を入力..."
                                                        />
                                                    </div>

                                                    <div className="hidden md:flex flex-shrink-0 w-48 text-right items-center justify-end gap-4">
                                                        <div className="relative w-full">
                                                            <div className="absolute left-0 right-0 bottom-2 border-b border-dotted border-stone-300 -z-10 w-full" />
                                                            <span className="font-serif text-stone-800 bg-white/0 pl-2 relative z-10 flex justify-end items-center gap-1">
                                                                ¥
                                                                <input
                                                                    type="number"
                                                                    className="w-20 text-right bg-transparent border-b border-transparent hover:border-stone-200 focus:border-stone-400 focus:outline-none"
                                                                    value={item.price}
                                                                    onChange={(e) => handleChange(item.id, 'price', Number(e.target.value))}
                                                                />
                                                            </span>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={(e) => handleDelete(e, item.id)}
                                                            className="ml-4 text-xs font-bold text-white bg-red-400 hover:bg-red-500 px-3 py-1.5 rounded shadow-sm transition-all cursor-pointer z-20 flex items-center gap-1 opacity-100"
                                                            title="削除"
                                                        >
                                                            ✕ 削除
                                                        </button>
                                                    </div>
                                                    {/* Mobile Delete Button */}
                                                    <div className="md:hidden w-full flex justify-end mt-2 border-t border-stone-100 pt-2 relative z-20">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => handleDelete(e, item.id)}
                                                            className="text-xs text-red-400 hover:text-red-500 flex items-center gap-1 p-2 cursor-pointer"
                                                        >
                                                            ✕ 削除する
                                                        </button>
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
