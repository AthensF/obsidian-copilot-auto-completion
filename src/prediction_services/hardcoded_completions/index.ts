import { PredictionService } from "../types";
import { err, ok, Result } from "neverthrow";

/**
 * HardcodedCompletions
 * 
 * This service provides ghost text suggestions based on data from
 * a Google Sheets document as well as hardcoded patterns.
 */
class HardcodedCompletions implements PredictionService {
    // Store for our completions data
    private completionsData: { userInput: string; output: string }[] = [];
    
    // Google Sheets configuration
    private readonly sheetId = '1ys8qYpzYnLUNk744AYGj4e46H3v-mefvuDRsClxI2Js';
    private readonly sheetsUrl: string;
    
    constructor() {
        // Set up Google Sheets URL
        this.sheetsUrl = `https://docs.google.com/spreadsheets/d/${this.sheetId}/export?format=csv`;
        console.log("Hardcoded completions service initialized");
        console.log("Google Sheets URL:", this.sheetsUrl);
        
        // Load data from Google Sheets
        this.loadCompletionsData();
    }
    
    /**
     * Load completion data from Google Sheets
     */
    private async loadCompletionsData(): Promise<void> {
        try {
            console.log('Fetching data from Google Sheets...');
            const response = await fetch(this.sheetsUrl);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
            }
            
            const csvText = await response.text();
            console.log('Received CSV data:', csvText.substring(0, 100) + '...');
            
            // Parse CSV
            const lines = csvText.split('\n');
            const headers = lines[0].split(',');
            
            // Clear existing data before loading new data
            this.completionsData = [];
            
            for (let i = 1; i < lines.length; i++) {
                if (!lines[i].trim()) continue;
                
                const values = lines[i].split(',');
                if (values.length >= 2) {
                    const entry = {
                        userInput: values[0], //deliberately not trimmed
                        output: values[1].trim()
                    };
                    
                    this.completionsData.push(entry);
                }
            }
            
            console.log(`Loaded ${this.completionsData.length} completions from Google Sheets`);
            console.log('Sample completions:', this.completionsData.slice(0, 3));
        } catch (error) {
            console.error('Error loading completions data:', error);
            
            // Note: We're no longer adding a fallback hardcoded entry if loading fails
        }
    }

    /**
     * Checks if there are any hardcoded completions for the given text
     * @param prefix - The text before cursor
     * @param suffix - The text after cursor
     * @returns A Result containing the completion string or an error
     */
    async fetchPredictions(
        prefix: string,
        suffix: string
    ): Promise<Result<string, Error>> {
        console.log("🔍 Checking for completions...");
        
        // Check Google Sheets data
        if (this.completionsData.length > 0) {
            for (const entry of this.completionsData) {
                if (prefix.endsWith(entry.userInput)) {
                    console.log(`✅ Found Google Sheets match: '${entry.userInput}' → '${entry.output}'`);
                    return ok(entry.output);
                }
            }
        }
        
        // Return an empty string if no match is found
        // This signals to the calling code that no hardcoded completion was found
        return ok("");
    }

    /**
     * Create a new instance of HardcodedCompletions
     */
    public static create(): PredictionService {
        console.log("🔧 Creating HardcodedCompletions service!");
        return new HardcodedCompletions();
    }
}

export default HardcodedCompletions;
