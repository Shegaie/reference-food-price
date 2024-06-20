import {CarrefourApiWrapper} from "./CarrefourApiWrapper";
import {SheetProductOut} from "./types/SheetProductOut";
import {Product} from "./types/Product";
import {CsvParser} from "./CsvParser";

export class PriceUpdater {
    private csvParser: CsvParser;
    private carrefour: CarrefourApiWrapper;

    constructor(file: string) {
        this.csvParser = new CsvParser(file);
        this.carrefour = new CarrefourApiWrapper();
    }

    private async getAlimentsPrices(aliments: string[]): Promise<SheetProductOut[]> {
        const sheetProducts: SheetProductOut[] = [];
        for (const aliment of aliments) {
            const searchResults: Product[] = await this.carrefour.getPricesForProductName(aliment, 1);
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
        return sheetProducts;
    }

    public updatePricesInCsv() {
        this.csvParser.extractValueFromColumn("aliment", async (aliments: string[]) => {
            const sheetProducts: SheetProductOut[] = await this.getAlimentsPrices(aliments);
            this.csvParser.writeInCsvFile(sheetProducts);
        });
    }
}