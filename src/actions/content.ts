"use server";

import { promises as fs } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";

// Reuse existing types or define comprehensive one
type ContentState = {
    menu: any[];
    gallery: any[];
    staff: any[];
    faq: any[];
    siteInfo: any;
};

const DATA_DIR = path.join(process.cwd(), "public", "data");

async function writeJson(filename: string, data: any) {
    await fs.writeFile(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2), "utf-8");
}

export async function saveAllContent(data: ContentState) {
    // Parallelize writes for performance
    await Promise.all([
        writeJson("menu.json", data.menu),
        writeJson("gallery.json", data.gallery),
        writeJson("staff.json", data.staff),
        writeJson("faq.json", data.faq),
        writeJson("site-info.json", data.siteInfo),
    ]);

    revalidatePath("/");
    return { success: true };
}

// Keep getters for initial load
async function readJson(filename: string) {
    try {
        const data = await fs.readFile(path.join(DATA_DIR, filename), "utf-8");
        return JSON.parse(data);
    } catch {
        return []; // or {} depending on usage, but safe default
    }
}

export async function getGallery() { return readJson("gallery.json"); }
export async function getStaff() { return readJson("staff.json"); }
export async function getFAQ() { return readJson("faq.json"); }
export async function getSiteInfo() {
    try {
        const data = await fs.readFile(path.join(DATA_DIR, "site-info.json"), "utf-8");
        return JSON.parse(data);
    } catch {
        return {};
    }
}
// Menu is special (legacy file), but we treat it same here
export async function getMenu() { return readJson("menu.json"); }
