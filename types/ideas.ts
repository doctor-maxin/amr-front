import {IBlock} from "./common";

export type IIdeaItem = {
    id: number
    type: 'news' | 'project' | 'idea';
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