import {Product} from "./types/Product";
import {CarrefourProduct, CarrefourResponse, Price} from "./types/CarrefourReponse";

export class CarrefourApiWrapper {
    private async callSearchApi(name: string, maxResults: number): Promise<Response> {
        const request = await fetch(`https://www.carrefour.fr/autocomplete?q=${name}&productCard=true&maxResults=${maxResults}`, {
            "headers": {
                "x-requested-with": "XMLHttpRequest",
                "cookie": "FRONTONE_ONLINE=1721379094; FRONTONE_SESSION_ID=9f93027968379e52a10dd66d53126690e30a2ea2; FRONTONE_SESSID=5feh3b189ol65m9ppmio67dah9; tc_cj_v2_cmp=; tc_cj_v2_med=; tc_ts=29; tc_ab=0; OptanonAlertBoxClosed=2024-06-19T08:51:36.906Z; eupubconsent-v2=CQAdCHAQAdCHAAcABBENA5EwAAAAAAAAAChQAAAAAAChIAYAygF5gTAHQAwBlALzAmAOAAgSEJQAQF5lIAYAygF5gTAA.YAAAAAAAAAAA; OneTrustGroupsConsent=%2CC0048%2CC0001%2C; sap-closed=1; tc_cj_v2=%5Ecl_%5Dny%5B%5D%5D_mmZZZZZZKQKRQRQLNSQPJZZZ%5D; pageCounterCrfOne=10; OptanonConsent=isGpcEnabled=0&datestamp=Wed+Jun+19+2024+10%3A54%3A09+GMT%2B0200+(heure+d%E2%80%99%C3%A9t%C3%A9+d%E2%80%99Europe+centrale)&version=202310.2.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=a4de89a6-a0b1-4a6b-ab9d-8f8a16b771e6&interactionCount=1&landingPath=NotLandingPage&groups=C0048%3A1%2CC0001%3A1%2CC0040%3A0%2CC0032%3A0%2CC0025%3A0%2CC0020%3A0%2CC0037%3A0%2CC0039%3A0%2CC0036%3A0%2CC0041%3A0%2CC0042%3A0%2CC0044%3A0%2CC0043%3A0%2CC0045%3A0%2CC0046%3A0%2CC0049%3A0%2CC0047%3A0%2CC0023%3A0%2CC0056%3A0%2CC0038%3A0%2CC0082%3A0%2CC0021%3A0%2CC0026%3A0%2CC0174%3A0%2CC0177%3A0%2CC0113%3A0%2CC0089%3A0%2CC0092%3A0%2CC0190%3A0%2CC0166%3A0%2CC0222%3A0%2CC0223%3A0%2CC0231%3A0%2CC0004%3A0%2CC0022%3A0%2CC0054%3A0%2CC0179%3A0%2CC0146%3A0%2CC0052%3A0%2CC0034%3A0%2CC0063%3A0%2CC0157%3A0%2CC0003%3A0%2CC0212%3A0%2CC0081%3A0%2CC0051%3A0%2CC0136%3A0%2CC0135%3A0%2CC0007%3A0%2CV2STACK42%3A0&geolocation=FR%3B&AwaitingReconsent=false; __cf_bm=ddcBgnd6fj8VtNi7qkTp157_9Ki229bjwk1qZLk4JQ0-1718791030-1.0.1.1-2jrD_8aI.3lw8vkK.buDGdI48FBSzkz5n4i15VigqkL4sb.pHp9pMHd3tpyCnqI3el.hKIQXwJYXK64n9yml6w; carrefour_counter=1718791713173%7C1069194540061%7Cp0%7Ce0%7Cv1%7Cc239.04%7CServerSide",
            },
        });
        if (request.status !== 200) {
            throw new Error(await request.json());
        }
        return request;
    }

    private async extractProductsPrices(request: Response): Promise<Product[]> {
        const searchResult: CarrefourResponse = await request.json();
        const products: Product[] = [];
        searchResult.data.products.forEach((product: CarrefourProduct) => {
            const ean = product.attributes.ean;
            const offerServiceId = product.attributes.offerServiceId;
            const price = product.attributes.offers[ean][offerServiceId].attributes.price;
            products.push({
                nom: product.attributes.title,
                format: product.attributes.packaging,
                prix: price.price,
                prix_unitaire_label: price.perUnitLabel,
                prix_unitaire: price.perUnit,
                unite: price.unitOfMeasure,
            });
        })
        return products;
    }

    async getPricesForProductName(name: string, maxResults: number): Promise<Product[]> {
        const request = await this.callSearchApi(name, maxResults);
        return await this.extractProductsPrices(request);
    }
}