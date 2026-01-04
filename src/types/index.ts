export type MenuItem = {
    id: string;
    category: string;
    name: string;
    price: number;
    description: string;
};

export type Category = "Cut" | "Color" | "Perm" | "Treatment" | "Spa" | "Other";
