import fs from "fs";
import { parse } from "csv-parse/sync";
import * as XLSX from "xlsx";

export class DataProvider {

    /**
     * Reads and parses a JSON test data file.
     */
    static readJson(filePath: string) {
        const fileData = fs.readFileSync(filePath, "utf8");
        return JSON.parse(fileData);
    }

    /**
     * Reads and parses a CSV test data file.
     */
    static readCsv(filePath: string) {
        const fileData = fs.readFileSync(filePath);
        return parse(fileData, {
            columns: true,
            skip_empty_lines: true,
        });
    }

    /**
     * Reads an Excel workbook and returns the first worksheet
     * as an array of row arrays.
     */
    static readExcel(filePath: string) {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        return XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    }
}