import { PredictionService } from "../types";
import { err, ok, Result } from "neverthrow";

/**
 * HardcodedCompletions
 * 
 * This service provides simple hardcoded ghost text suggestions
 * for specific text patterns.
 */
class HardcodedCompletions implements PredictionService {
    
    constructor() {
        // No configuration needed for hardcoded completions
        console.log("Hardcoded completions service initialized");
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
        console.log("🔍 Checking for hardcoded completions...");
        
        // Check for our specific hardcoded pattern
        if (prefix.endsWith("My cat is")) {
            console.log("✅ Found hardcoded completion match: 'My cat is' → ' a madhouse'");
            return ok(" a madhouse");
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
