"use server";

import { promises as fs } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { MenuItem } from "@/types";
import { auth } from "@/lib/auth";

const DATA_PATH = path.join(process.cwd(), "public", "data", "menu.json");

async function checkAuth() {
    if (process.env.SKIP_AUTH === "true") return;

    const session = await auth();
    if (!session?.user) {
        throw new Error("Unauthorized");
    }
}

async function getMenu(): Promise<MenuItem[]> {
    try {
        const data = await fs.readFile(DATA_PATH, "utf-8");
        return JSON.parse(data);
    } catch {
        return [];
    }
}

async function saveMenu(items: MenuItem[]) {
    await fs.writeFile(DATA_PATH, JSON.stringify(items, null, 2), "utf-8");
}

export async function addMenuItem(formData: FormData) {
    await checkAuth();

    const name = formData.get("name") as string;
    const price = Number(formData.get("price"));
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;

    if (!name || isNaN(price)) {
        throw new Error("Invalid input");
    }

    const items = await getMenu();
    const newItem: MenuItem = {
        id: crypto.randomUUID(),
        category,
        name,
        price,
        description: description || "",
    };

    await saveMenu([...items, newItem]);
    revalidatePath("/");
    return { success: true };
}

export async function updateMenuItem(formData: FormData) {
    await checkAuth();

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const price = Number(formData.get("price"));
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;

    if (!id || !name || isNaN(price)) {
        throw new Error("Invalid input");
    }

    const items = await getMenu();
    const index = items.findIndex(item => item.id === id);
    if (index === -1) throw new Error("Item not found");

    const updatedItem: MenuItem = {
        id,
        name,
        price,
        category,
        description: description || ""
    };

    const newItems = [...items];
    newItems[index] = updatedItem;

    await saveMenu(newItems);
    revalidatePath("/");
    return { success: true };
}

export async function deleteMenuItem(id: string) {
    await checkAuth();

    const items = await getMenu();
    const updated = items.filter((item) => item.id !== id);

    await saveMenu(updated);
    revalidatePath("/");
    return { success: true };
}

export async function updateMenuOrder(items: MenuItem[]) {
    await checkAuth();
    // Validating basic structure
    if (!Array.isArray(items)) throw new Error("Invalid format");

    await saveMenu(items);
    revalidatePath("/");
    return { success: true };
}
