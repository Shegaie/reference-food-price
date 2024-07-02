import {PriceUpdater} from "./src/PriceUpdater";
import {CarrefourApiWrapper} from "./src/CarrefourApiWrapper";
import {SheetProductOut} from "./src/types/SheetProductOut";
import {Product} from "./src/types/Product";

function updatePricesInCsv() {
    const priceFinder = new PriceUpdater("csv/Planning quantités journalières.csv");
    priceFinder.updatePricesInCsv();
}

const carrefour = new CarrefourApiWrapper();

async function getAlimentsPrices(aliments: string[]) {
    const sheetProducts: SheetProductOut[] = [];
    for (const aliment of aliments) {
        const searchResults: Product[] = await carrefour.getPricesForProductName(aliment, 1);
        sheetProducts.push({
            aliment: aliment,
            nom: searchResults[0].nom,
            format: searchResults[0].format,
            prix: searchResults[0].prix,
            prix_unitaire_label: searchResults[0].prix_unitaire_label,
            unite: searchResults[0].unite,
            prix_unitaire: searchResults[0].prix_unitaire
        });
    }
    console.table(sheetProducts);
}

function findPricesForOneAliment(aliment: string, maxResults: number) {
    carrefour.getPricesForProductName(aliment, maxResults).then((products) => console.table(products));
}

findPricesForOneAliment("bananes", 5);