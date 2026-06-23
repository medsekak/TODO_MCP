import { createClient } from "@supabase/supabase-js";
import { supabase } from "../../packages/db/supabase.js";


export const startServer = (app) => {
  const PORT = process.env.PORT;

  async function testSupabase() {
    const { error } = await supabase.from("test_connection").select("*").limit(1);

    if (error) {
      console.error("❌ Supabase connection failed:", error.message);
    } else {
      console.log("✅ Supabase is connected");
    }
  }

  testSupabase();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
