import {defineStore} from "pinia";
import {IIdeaItem} from "../types/ideas";


type BlogState = {
    list: Map<string, IIdeaItem>
}
export const useBlogStore = defineStore('blog', {
    state: (): BlogState => ({
        list: new Map()
    }),
    actions: {
        setToList(items: IIdeaItem[]) {
            for (const item of items) {
                this.list.set(item.id, item)
            }
        },
        getNextArticle(id: string): null | IIdeaItem {
            console.log('t', this.list)
            if (this.list.has(id)) {
                const list = Array.from(this.list.entries())
                for (let i = 0; i < list.length; i++) {
                    if (list[i][0] === id && list[i + 1]) {
                        return list[i + 1][1]
                    }
                }
            }
            return null;
        }
    },
})