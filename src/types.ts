export interface Recipe {
    title: string
    total_time: string
    serving_size: number
    spice_index: 'none' | 'mild' | 'medium' | 'hot' | 'extra hot'
    tags: string[]
    components: Component[]
    plating?: string[]
}

export interface Component {
    name: string
    ingredients: Ingredient[]
    method: string[]
}

export interface Ingredient {
    item: string
    quantity: string
}

export type RecipeCollection = Record<string, Recipe>