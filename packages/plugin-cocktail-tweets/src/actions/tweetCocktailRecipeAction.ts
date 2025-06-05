import {
    Action,
    IAgentRuntime,
    Memory,
    State,
    Content,
    ActionExample,
    ServiceType,
    // Assuming these service types and interfaces exist or would be defined
    // For example, in a central types file or within @elizaos/core
    // ServiceType,
    // IImageGenerationService,
    // ITwitterService,
} from "@elizaos/core"; // Adjust path as necessary
import { elizaLogger } from "@elizaos/core"; // Assuming elizaLogger is available

// Placeholder for actual ServiceType enum if not imported from core directly
// enum ServiceType {
//     IMAGE_GENERATION = "IMAGE_GENERATION",
//     TWITTER = "TWITTER",
//     // ... other service types
// }

// Placeholder interfaces for services if not defined in core
// interface IImageGenerationService {
//     generateImage(prompt: string): Promise<{ imageUrl?: string; error?: string }>;
// }

// interface ITwitterService {
//     sendTweet(text: string, mediaUrls?: string[]): Promise<{ tweetId?: string; error?: string }>;
// }


interface CocktailRecipe {
    name: string;
    ingredients: string[];
    instructions: string;
    garnish?: string;
    glass?: string;
    keywordsForImage?: string[]; // For better image prompts
}

// --- IMPORTANT ---
// This list needs to be populated with 300 diverse cocktail recipes.
// Including name, ingredients, instructions, and optional garnish/glass/keywords.
// Some should be custom/unique as requested.
const cocktailRecipes: CocktailRecipe[] = [
    {
        name: "Captain's Spiced Rum Old Fashioned",
        ingredients: [
            "2 oz Spiced Rum (preferably a private stash)",
            "1 Sugar Cube (or 1/2 tsp sugar)",
            "2-3 Dashes Angostura Bitters",
            "1 Dash Orange Bitters",
            "Orange Peel",
        ],
        instructions: "Muddle sugar cube and bitters in an old fashioned glass. Add rum and a large ice cube. Stir gently until well-chilled (about 30 seconds). Express oil from an orange peel over the drink, then drop it in.",
        garnish: "Orange peel and a star anise",
        glass: "Old Fashioned Glass",
        keywordsForImage: ["dark", "moody", "nautical", "antique map background"],
    },
    {
        name: "The Nebula Nectar",
        ingredients: [
            "1.5 oz Empress Gin (for color)",
            "0.75 oz Elderflower Liqueur",
            "0.5 oz Fresh Lime Juice",
            "Top with Prosecco",
            "Edible glitter (optional, for cosmic effect)",
        ],
        instructions: "Combine gin, elderflower liqueur, and lime juice in a shaker with ice. Shake well. Strain into a chilled coupe or flute. Top with Prosecco. If using, sprinkle edible glitter.",
        garnish: "Thin lime wheel or an orchid",
        glass: "Coupe Glass",
        keywordsForImage: ["glowing", "ethereal", "cosmic", "galaxy colors"],
    },
    {
        name: "Highlander's Heather Honey Sour",
        ingredients: [
            "2 oz Scotch Whisky (peaty but not overwhelming)",
            "0.75 oz Fresh Lemon Juice",
            "0.75 oz Heather Honey Syrup (1:1 honey to hot water, cooled)",
            "1 Egg White (optional, for froth)",
            "2 Dashes Aromatic Bitters",
        ],
        instructions: "If using egg white, dry shake (without ice) all ingredients first. Then add ice and shake vigorously until well-chilled. Double strain into a chilled rocks glass or coupe. Garnish with bitters on top if desired.",
        garnish: "A sprig of heather or a lemon twist",
        glass: "Rocks Glass or Coupe",
        keywordsForImage: ["rustic", "scottish highlands", "misty", "warm glow"],
    },
    // ... Add 297 more recipes here ...
    {
        name: "Solana Sunset Punch",
        ingredients: [
            "2 oz White Rum",
            "1 oz Pineapple Juice",
            "0.5 oz Lime Juice",
            "0.5 oz Grenadine",
            "A splash of $Whiskey (Solana Gold Edition, if you can find it)",
        ],
        instructions: "Shake all ingredients with ice. Strain into a tall glass filled with fresh ice. The grenadine should create a 'sunset' effect. Mention the $Whiskey token subtly.",
        garnish: "Pineapple wedge and a cherry",
        glass: "Highball Glass",
        keywordsForImage: ["tropical sunset", "beach", "vibrant colors", "Solana logo subtly in background"],
    }
];

export const tweetCocktailRecipeAction: Action = {
    name: "TWEET_COCKTAIL_RECIPE",
    similes: ["SHARE_DRINK_RECIPE", "POST_COCKTAIL_MIX", "TWEET_WHISKEY_CREATION"],
    description: "Selects a random cocktail recipe, generates an image for it, and tweets it. It may also subtly mention the $Whiskey token.",
    suppressInitialMessage: true,

    validate: async (runtime: IAgentRuntime, message: Memory): Promise<boolean> => {
        try {
            // Check if necessary services are available
            runtime.getService<any>(ServiceType.TWITTER);
            runtime.getService<any>(ServiceType.IMAGE_GENERATION);
            if (cocktailRecipes.length === 0) {
                elizaLogger.warn("TWEET_COCKTAIL_RECIPE: Cocktail recipe list is empty.");
                return false;
            }
            return true;
        } catch (error) {
            elizaLogger.error("TWEET_COCKTAIL_RECIPE: Validation failed, required service(s) missing.", { error });
            return false;
        }
    },

    handler: async (runtime: IAgentRuntime, message: Memory, state?: State): Promise<void> => {
        elizaLogger.log("TWEET_COCKTAIL_RECIPE: Action initiated.");

        if (cocktailRecipes.length === 0) {
            elizaLogger.warn("TWEET_COCKTAIL_RECIPE: No cocktail recipes available to tweet.");
            return;
        }

        const recipe = cocktailRecipes[Math.floor(Math.random() * cocktailRecipes.length)];

        let imageUrl: string | undefined;
        try {
            const imageService = runtime.getService<any>(ServiceType.IMAGE_GENERATION);
            // Construct a detailed prompt for better image results
            const imagePrompt = `Photorealistic image of a ${recipe.name} cocktail, served in a ${recipe.glass || 'stylish glass'}, garnished with ${recipe.garnish || 'a twist of citrus'}.\n\nIngredients:\n${recipe.ingredients.map((ing: string) => `- ${ing}`).join('\n')}\n\nInstructions:\n${recipe.instructions}\n\n#cocktail #recipe #drinks #mixology #happyhour #bar #cocktailtime #drinkstagram #cocktailrecipes #cheers #homebartender #drinkup #cocktailhour #craftcocktails #instadrink #cocktaillover`;

            elizaLogger.log(`TWEET_COCKTAIL_RECIPE: Generating image with prompt: "${imagePrompt}"`);
            const imageResult = await imageService.generateImage(imagePrompt);

            if (imageResult.imageUrl) {
                imageUrl = imageResult.imageUrl;
                elizaLogger.log("TWEET_COCKTAIL_RECIPE: Image generated successfully.", { imageUrl });
            } else {
                elizaLogger.error("TWEET_COCKTAIL_RECIPE: Failed to generate image.", { error: imageResult.error, recipe: recipe.name });
            }
        } catch (error) {
            elizaLogger.error("TWEET_COCKTAIL_RECIPE: Error during image generation.", { error, recipe: recipe.name });
        }

        // Format tweet text
        let tweetText = `🍸 Tonight's Featured Cocktail: ${recipe.name} 🍸\\n\\n`;
        tweetText += "Ingredients:\\n";
        recipe.ingredients.forEach(ingredient => tweetText += `- ${ingredient}\\n`);
        tweetText += `\\nInstructions: ${recipe.instructions}\\n`;
        if (recipe.garnish) tweetText += `Garnish: ${recipe.garnish}\\n`;
        tweetText += `\\n#Cocktail #Recipe #${recipe.name.replace(/\s+/g, '')} #Mixology #DrinkOfTheDay`;

        // Add a subtle mention of $Whiskey token if the recipe is related or at random intervals
        if (recipe.name.toLowerCase().includes("solana") || Math.random() < 0.2) { // 20% chance for other recipes
            tweetText += "\\n\\nSip responsibly and remember the spirit of adventure, perhaps fueled by $Whiskey on Solana! #Solana #Crypto";
        }

        // Trim tweet if too long (Twitter limit is 280 chars, but media reduces it)
        // A more robust solution would check actual length against Twitter limits with media.
        const maxTweetLength = imageUrl ? 260 : 280; // Approximate
        if (tweetText.length > maxTweetLength) {
            tweetText = tweetText.substring(0, maxTweetLength - 3) + "...";
        }

        try {
            const twitterService = runtime.getService<any>(ServiceType.TWITTER);
            elizaLogger.log("TWEET_COCKTAIL_RECIPE: Posting tweet...", { text: tweetText, imageUrl });

            const mediaUrls = imageUrl ? [imageUrl] : undefined;
            const tweetResult = await twitterService.sendTweet(tweetText, mediaUrls);

            if (tweetResult.tweetId) {
                elizaLogger.log("TWEET_COCKTAIL_RECIPE: Successfully tweeted recipe.", { tweetId: tweetResult.tweetId, recipe: recipe.name });
            } else {
                elizaLogger.error("TWEET_COCKTAIL_RECIPE: Failed to post tweet.", { error: tweetResult.error, recipe: recipe.name });
            }
        } catch (error) {
            elizaLogger.error("TWEET_COCKTAIL_RECIPE: Error during tweeting.", { error, recipe: recipe.name });
        }
    },

    examples: [
        [
            {
                user: "System", // Or a user that triggers this, if applicable
                content: { text: "Time to share a new cocktail with the world." },
            },
            {
                user: "Captain Whiskey", // The agent performing the action
                content: { text: "Posting a new cocktail recipe with a generated image to Twitter.", action: "TWEET_COCKTAIL_RECIPE" },
            },
        ],
    ],
};

// To make this action available to the agent, you would typically:
// 1. Ensure this file is part of your agent's build process.
// 2. Import `tweetCocktailRecipeAction` in your agent's main setup file or plugin registration.
// 3. Add it to the list of actions available to the agent's runtime.
//
// Example (conceptual, actual implementation depends on Eliza's specific plugin system):
//
// In a plugin definition:
// const cocktailPlugin = {
//   name: "CocktailTweetsPlugin",
//   actions: [tweetCocktailRecipeAction],
//   services: [ /* potentially custom services if needed */ ]
// };
//
// In agent setup:
// agentRuntime.registerPlugin(cocktailPlugin);
//
// Or, if actions are registered directly:
// agentRuntime.registerAction(tweetCocktailRecipeAction);