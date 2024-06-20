// import {PriceFinder} from "./src/PriceFinder";

import {PriceUpdater} from "./src/PriceUpdater";

function updatePricesInCsv() {
    const priceFinder = new PriceUpdater("csv/Planning quantités journalières.csv");
    priceFinder.updatePricesInCsv();
}

import {CarrefourApiWrapper} from "./src/CarrefourApiWrapper";
import {CsvParser} from "./src/CsvParser";
import {SheetProductOut} from "./src/types/SheetProductOut";
import {Product} from "./src/types/Product";

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

function findPricesForOneAliment() {
    carrefour.getPricesForProductName("fraise", 4).then((products) => console.table(products));
}

findPricesForOneAliment();