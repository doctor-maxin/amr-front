import { IBlock } from "./common";

export enum IIdeaType {
    news = 'news',
    project = 'project',
    idea = 'idea',
    all = '*'
}
export type IIdeaItem = {
    id: number
    type: IIdeaType;
    date_created: string;
    description: string;
    bloks: {
        time: string;
        blocks: IBlock[];
        version: string;
    }
    products?: number[];
    image: string;
    handle: string;
    name: string;
}