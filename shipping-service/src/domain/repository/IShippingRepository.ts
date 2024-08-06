import { Shipping } from "../entity/Shipping"

export interface IShippingRepository {
    
    create( shipping: Shipping): Promise<Shipping>

    save( shipping: Shipping): Promise<Shipping>

    findById(id: string): Promise<Shipping | null>
}