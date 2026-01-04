"use client";

import { useAdmin } from "./AdminContext";
import { Button } from "@/components/ui/button";
import { Undo, Redo, Save } from "lucide-react"; // Make sure to install lucide icons if not available, or use text

export function SaveBar() {
    const { save, undo, redo, canUndo, canRedo, isDirty, isSaving } = useAdmin();

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-stone-900 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-6 z-50 transition-transform duration-300 translate-y-0">
            <div className="flex items-center gap-2 border-r border-stone-700 pr-6">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={undo}
                    disabled={!canUndo}
                    className="text-stone-300 hover:text-white hover:bg-stone-800 disabled:opacity-30"
                    title="元に戻す"
                >
                    <Undo size={18} />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={redo}
                    disabled={!canRedo}
                    className="text-stone-300 hover:text-white hover:bg-stone-800 disabled:opacity-30"
                    title="やり直す"
                >
                    <Redo size={18} />
                </Button>
            </div>

            <Button
                onClick={save}
                disabled={isSaving || !isDirty} // Disable if saving OR not dirty
                className="bg-white text-stone-900 hover:bg-stone-200 font-serif min-w-[140px]"
            >
                {isSaving ? "保存中..." : "変更を公開する"}
            </Button>
        </div>
    );
}
