import * as csv from 'fast-csv';
import {SheetProductOut} from "./types/SheetProductOut";
import {SheetProductIn} from "./types/SheetProductIn";

export class CsvParser {

    constructor(private readonly file: string) {
    }

    extractValueFromColumn(targetColumn: string, next: (values: string[]) => void): void {
        let targetColumnValues: string[] = [];
        csv.parseFile(this.file, { headers: true })
            .on("data", (row: SheetProductIn) => {
                if (!row.hasOwnProperty(targetColumn)) {
                    throw new Error(`${targetColumn} not found in ${this.file}`);
                }
                targetColumnValues.push(row[targetColumn as keyof SheetProductOut]);
            })
            .on("end", () => {
                next(targetColumnValues);
            });
    }

    writeInCsvFile(sheetProducts: SheetProductOut[]) {
        csv.writeToPath(this.file, sheetProducts, { headers: true })
    }
}