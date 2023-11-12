import { ICategory } from "types/common";

export const useCategoriesHelper = () => {
    const { data: categories } = useNuxtData<ICategory[]>('categories')

    const getParentId = (id: string): string | null => {
        if (!categories.value) return null
        for (const category of categories.value) {
            if (category.id === id && category.parentId) {
                return category.parentId;
            }
        }
        return null
    }

    const getCategoryChildIds = (id: string) => {
        const list: string[] = []

        if (!categories.value) return list;

        for (const category of categories.value) {
            if (list.length === 5) break;
            if (category.parentId === id) {
                list.push(category.id)
            }
        }
        return list;
    }
    return { getParentId, getCategoryChildIds }
}