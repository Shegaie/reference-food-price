export type Price = {
    price: number
    unitOfMeasure: string
    perUnit: number
    perUnitLabel: string
}

export type CarrefourProduct = {
    attributes: {
        title: string
        ean: string
        offerServiceId: string,
        packaging: string,
        offers: {
            [ean: string]: {
                [id: string]: {
                    attributes: {
                        price: Price
                    }
                }
            }
        }
    }
}
export type CarrefourResponse = {
    data: {
        products: CarrefourProduct[]
    }
}