import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const res = await axios.get(
  "https://api.planet.com/data/v1/item-types",
  {
    auth: {
      username: process.env.PLANET_API_KEY,
      password: ""
    }
  }
);

console.log("✅ Planet API working");
