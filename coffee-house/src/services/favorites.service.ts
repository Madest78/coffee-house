import { CoffeeProduct } from "../types/coffee";

const API_URL =
  "http://coffee-shop-be.eu-central-1.elasticbeanstalk.com/products/favorites";

export async function getFavoriteCoffees(): Promise<CoffeeProduct[]> {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: { accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const json = await response.json();

    if (!json.data || !Array.isArray(json.data)) {
      throw new Error("Invalid response structure");
    }

    return json.data as CoffeeProduct[];
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}
