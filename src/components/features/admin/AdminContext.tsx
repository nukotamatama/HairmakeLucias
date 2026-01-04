"use client";

import React, { createContext, useContext, useState, useReducer, useCallback, useEffect } from "react";
import { saveAllContent } from "@/actions/content";
import { Button } from "@/components/ui/button";

// -- Types --
type ContentState = {
    menu: any[];
    gallery: any[];
    staff: any[];
    faq: any[];
    siteInfo: any;
};

type Action =
    | { type: 'INIT'; payload: ContentState }
    | { type: 'UPDATE_SECTION'; section: keyof ContentState; data: any }
    | { type: 'UNDO' }
    | { type: 'REDO' };

type HistoryState = {
    past: ContentState[];
    present: ContentState;
    future: ContentState[];
};

// -- Reducer for Undo/Redo --
const historyReducer = (state: HistoryState, action: Action): HistoryState => {
    switch (action.type) {
        case 'INIT':
            return {
                past: [],
                present: action.payload,
                future: []
            };
        case 'UPDATE_SECTION':
            const newPresent = {
                ...state.present,
                [action.section]: action.data
            };
            return {
                past: [...state.past, state.present], // Push current to past
                present: newPresent,
                future: [] // Clear future on new change
            };
        case 'UNDO':
            if (state.past.length === 0) return state;
            const previous = state.past[state.past.length - 1];
            const newPast = state.past.slice(0, state.past.length - 1);
            return {
                past: newPast,
                present: previous,
                future: [state.present, ...state.future]
            };
        case 'REDO':
            if (state.future.length === 0) return state;
            const next = state.future[0];
            const newFuture = state.future.slice(1);
            return {
                past: [...state.past, state.present],
                present: next,
                future: newFuture
            };
        default:
            return state;
    }
};

// -- Context --
type AdminContextType = {
    state: ContentState;
    updateSection: (section: keyof ContentState, data: any) => void;
    undo: () => void;
    redo: () => void;
    save: () => Promise<void>;
    canUndo: boolean;
    canRedo: boolean;
    isDirty: boolean;
    isSaving: boolean;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children, initialData }: { children: React.ReactNode, initialData: ContentState }) {
    const [history, dispatch] = useReducer(historyReducer, {
        past: [],
        present: initialData,
        future: []
    });

    const [lastSavedState, setLastSavedState] = useState<ContentState>(initialData);
    const [isSaving, setIsSaving] = useState(false);

    // Check if current state differs from last saved state
    const isDirty = JSON.stringify(history.present) !== JSON.stringify(lastSavedState);

    const updateSection = useCallback((section: keyof ContentState, data: any) => {
        dispatch({ type: 'UPDATE_SECTION', section, data });
    }, []);

    const undo = useCallback(() => dispatch({ type: 'UNDO' }), []);
    const redo = useCallback(() => dispatch({ type: 'REDO' }), []);

    const save = async () => {
        setIsSaving(true);
        try {
            await saveAllContent(history.present);
            setLastSavedState(history.present); // Update baseline
            alert("保存しました！サイトに反映されます。");
        } catch (e) {
            alert("保存に失敗しました");
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AdminContext.Provider value={{
            state: history.present,
            updateSection,
            undo,
            redo,
            canUndo: history.past.length > 0,
            canRedo: history.future.length > 0,
            save,
            isDirty,
            isSaving
        }}>
            {children}
        </AdminContext.Provider>
    );
}

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) throw new Error("useAdmin must be used within AdminProvider");
    return context;
};
