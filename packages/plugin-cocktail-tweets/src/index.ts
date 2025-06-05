import { tweetCocktailRecipeAction } from './actions/tweetCocktailRecipeAction';
import { ServiceType, elizaLogger, type Action, type IAgentRuntime, type Memory, type State, type Plugin } from "@elizaos/core";

const CocktailTweetsPlugin: Plugin = {
  name: "CocktailTweetsPlugin",
  description: "A plugin to tweet random cocktail recipes with generated images.",
  actions: [tweetCocktailRecipeAction],
  // services: [], // Add if this plugin provides custom services
  // providers: [], // Add if this plugin provides custom providers
};

export default CocktailTweetsPlugin;