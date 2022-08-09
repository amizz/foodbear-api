
export interface User {
    id: number;
    name: string
    cash_balance: number;
    created_at: Date;
    updated_at: Date;
}
export interface Restaurant {
    id: number;
    name: string
    cash_balance: number;
    created_at: Date;
    updated_at: Date;
}
export interface Menu {
    id: number;
    restaurant_id: number;
    dish_name: string
    price: number;
    created_at: Date;
    updated_at: Date;
}
export interface Purchase {
    id: number;
    restaurant_id: number;
    user_id: number;
    menu_id: number;
    amount: number;
    created_at: Date;
    updated_at: Date;
}