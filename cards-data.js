// BioZabb Pitching Flashcards Dataset
const FLASHCARDS_DATA = [
  {
    "id": 1,
    "category": "general",
    "categoryName": "คำถามทั่วไป",
    "question": "จุดเด่น ความแปลกใหม่??",
    "answer": "Most seasonings use synthetic MSG, but BioZabb is 100% natural. We use fermentation to create natural umami and lactic acid from surplus vegetables with zero chemicals.",
    "keywords": [
      "100% natural",
      "synthetic MSG",
      "fermentation",
      "natural umami",
      "lactic acid",
      "surplus vegetables",
      "zero chemicals"
    ]
  },
  {
    "id": 2,
    "category": "general",
    "categoryName": "คำถามทั่วไป",
    "question": "อุปสรรคหรือความท้าทายที่ใหญ่??",
    "answer": "Our challenge was drying the product without losing color and taste. We tested different times and found that 60°C for 24 hours gives the best powder and safe moisture.",
    "keywords": [
      "drying without losing color/taste",
      "60°C for 24 hours",
      "best powder",
      "safe moisture"
    ]
  },
  {
    "id": 3,
    "category": "general",
    "categoryName": "คำถามทั่วไป",
    "question": "ถ้ามีเวลาหรือมีงบประมาณเพิ่มขึ้น ต่อไปจะทำอะไร??",
    "answer": "We want to test shelf life for 6 months, analyze amino acids in detail, and scale up production for real market sales.",
    "keywords": [
      "shelf life for 6 months",
      "analyze amino acids in detail",
      "scale up production for market"
    ]
  },
  {
    "id": 4,
    "category": "general",
    "categoryName": "คำถามทั่วไป",
    "question": "กลุ่มเป้าหมายคือใคร??",
    "answer": "Our main targets is customer who don’t want MSG too much or health consumers, and home cooks looking for natural seasonings whoever there are they gonna love our veggies seasoning.",
    "keywords": [
      "people avoiding MSG",
      "health-conscious consumers",
      "home cooks looking for natural seasonings"
    ]
  },
  {
    "id": 5,
    "category": "general",
    "categoryName": "คำถามทั่วไป",
    "question": "ขยายการผลิตไปสู่ระดับโรงงานอุตสาหกรรมอย่างไร??",
    "answer": "For factory production, we can use dehydrator or spray dryer instead of a small tray dryer to save time and energy while keeping quality stable.",
    "keywords": [
      "dehydrator or spray dryer",
      "replaces small tray dryer",
      "saves time & energy",
      "stable quality"
    ]
  },
  {
    "id": 6,
    "category": "general",
    "categoryName": "คำถามทั่วไป",
    "question": "ช่วยในเรื่องความยั่งยืนยังไง",
    "answer": "BioZabb supports sustainability by upcycling surplus vegetables into a valuable product. This directly reduces food waste and cuts greenhouse gas emissions from landfills. Also, our process uses natural fermentation with zero synthetic chemicals, making it 100% eco-friendly.",
    "keywords": [
      "upcycling surplus vegetables",
      "reduces food waste",
      "cuts greenhouse gas emissions",
      "zero synthetic chemicals",
      "100% eco-friendly"
    ]
  },
  {
    "id": 7,
    "category": "general",
    "categoryName": "คำถามทั่วไป",
    "question": "เหมาะกับการกินกับอะไร และทำไมวันนี้ถึงเสิฟคลุกกับไก่ทอด????????",
    "answer": "BioZabb has a savory, tangy, and slightly spicy profile like Larb or Zaab seasoning. It is perfect for:\n• Fried foods & snacks\n• Everyday cooking",
    "keywords": [
      "savory, tangy, slightly spicy",
      "Larb / Zaab profile",
      "fried foods & snacks",
      "everyday cooking"
    ]
  },
  {
    "id": 8,
    "category": "general",
    "categoryName": "คำถามทั่วไป",
    "question": "กี่บาทททททท????",
    "answer": "Our price is 69 Baht. It offers great value for 100% natural seasoning.",
    "keywords": [
      "69 Baht",
      "great value",
      "100% natural seasoning"
    ]
  },
  {
    "id": 9,
    "category": "general",
    "categoryName": "คำถามทั่วไป",
    "question": "มีเชื้ออะไรเกี่ยวกับหมัก+ประโยชน์??",
    "answer": "During fermentation, they produce lactic acid and natural umami, while lowering the pH to keep the product safe. For consumers, these organic acids help support gut health and digestion, making it a healthy choice.",
    "keywords": [
      "lactic acid",
      "natural umami",
      "lowering the pH",
      "keep the product safe",
      "organic acids",
      "support gut health and digestion",
      "healthy choice"
    ]
  },
  {
    "id": 10,
    "category": "indepth",
    "categoryName": "คำถามเจาะลึก",
    "question": "ทั้งหมดใช้เวลาทำกี่วัน",
    "answer": "The process takes about 4 to 5 days:\n• Day 1: Washing, cutting, and mixing with salt.\n• Days 1 to 4: Fermentation for 3 to 4 days.\n• Day 5: Tray-drying for 24 hours followed by milling and blending.",
    "keywords": [
      "4 to 5 days total",
      "Day 1: prep & salt",
      "Days 1-4: fermentation",
      "Day 5: tray-drying (24h), milling & blending"
    ]
  },
  {
    "id": 11,
    "category": "indepth",
    "categoryName": "คำถามเจาะลึก",
    "question": "อบที่อุณหภูมิ 60°C นาน 24 ชั่วโมง เชื้อโพรไบโอติกยังมีชีวิตอยู่จริงไหม?",
    "answer": "The heat reduces live bacteria, but the organic acids and fermented compounds are still there to give gut health benefits and great taste.",
    "keywords": [
      "heat reduces live bacteria",
      "organic acids & postbiotic compounds remain",
      "gut health benefits & great taste"
    ]
  },
  {
    "id": 12,
    "category": "indepth",
    "categoryName": "คำถามเจาะลึก",
    "question": "เลือกผักอะไร ทำไมถึงเลือกผัก 4 ชนิดนี้??",
    "answer": "They are easy to find as surplus vegetables. Onion and carrot give natural sweetness and color, while radish and spinach give minerals and rich savory taste.",
    "keywords": [
      "Onion & Carrot: sweetness and color",
      "Radish & Spinach: minerals and savory taste",
      "easy to find surplus"
    ]
  },
  {
    "id": 13,
    "category": "indepth",
    "categoryName": "คำถามเจาะลึก",
    "question": "ควบคุมคุณภาพผักในแต่ละวันให้คงที่อย่างไร?",
    "answer": "We use a fixed weight ratio of each vegetable and salt. We also control the fermentation by checking that the final pH is below 4.2 before drying.",
    "keywords": [
      "fixed weight ratio of vegetable and salt",
      "quality threshold: final pH below 4.2 before drying"
    ]
  },
  {
    "id": 14,
    "category": "indepth",
    "categoryName": "คำถามเจาะลึก",
    "question": "สูตร สัดส่วนเป็นยังไง??",
    "answer": "For the base fermentation, we use 2,000 grams of mixed surplus vegetables to 50 grams of salt, which is a 2.5% salt.\n\nAfter drying, we blend this vegetable powder with natural spices—chili powder, toasted rice, and sugar—to create Formula A and Formula B.",
    "keywords": [
      "Base: 2,000g mixed veggies : 50g salt (2.5%)",
      "Blended with chili powder, toasted rice, sugar"
    ]
  },
  {
    "id": 15,
    "category": "indepth",
    "categoryName": "คำถามเจาะลึก",
    "question": "แต่ละสูตรต่างกันไง ??",
    "answer": "We have two formulas: Formula A and Formula B.\nThey use the same fermented vegetable, but have different taste. Formula B is darker, but Formula A won because 58% of testers preferred its balanced flavor.",
    "keywords": [
      "Formula A vs Formula B",
      "same fermented vegetable base",
      "Formula B darker",
      "Formula A won with 58% preference"
    ]
  },
  {
    "id": 16,
    "category": "indepth",
    "categoryName": "คำถามเจาะลึก",
    "question": "ทำไมสูตร A ถึงดีกว่าสูตร B ในการทดสอบทางประสาทสัมผัส?",
    "answer": "Formula A has a better balance of spices and fermented powder. 58% of testers chose it because the flavor is not too strong and tastes great.",
    "keywords": [
      "better balance of spices & fermented powder",
      "58% consumer preference",
      "flavor not too strong, tastes great"
    ]
  },
  {
    "id": 17,
    "category": "indepth",
    "categoryName": "คำถามเจาะลึก",
    "question": "pH ที่ aw ที่ต่ำ รักษาความปลอดภัยของผลิตภัณฑ์ได้อย่างไร?",
    "answer": "Bacteria and mold cannot grow when water activity is under 0.5 and pH is low. This keeps our product safe naturally without adding preservatives.",
    "keywords": [
      "water activity under 0.5",
      "low pH",
      "bacteria and mold cannot grow",
      "naturally safe without preservatives"
    ]
  },
  {
    "id": 18,
    "category": "indepth",
    "categoryName": "คำถามเจาะลึก",
    "question": "ค่า PH ควรอยู่ที่เท่าไหร่",
    "answer": "For safety, water activity must be below 0.60, and our product is under 0.50, which stops all bacteria and mold growth.\n\nAlso, the pH must be below 4.6, and ours is 3.6 to 4.2, which naturally prevents food poisoning bacteria.",
    "keywords": [
      "Water activity: standard < 0.60, BioZabb < 0.50",
      "pH: standard < 4.6, BioZabb 3.6 - 4.2",
      "prevents food poisoning bacteria"
    ]
  },
  {
    "id": 19,
    "category": "indepth",
    "categoryName": "คำถามเจาะลึก",
    "question": "เคลมว่า ปราศจาก Msg ได้จริงไหม?",
    "answer": "Yes, we can claim 'No Added MSG' and 'Clean-label' because all umami flavor comes naturally from fermented vegetables, not from added synthetic MSG.\n\nThat is a great question. We do not add any synthetic MSG to our recipe. The umami taste comes from natural glutamate produced during fermentation. So, strictly speaking, our product is 'No Added MSG' and 100% natural, not synthetically enhanced.",
    "keywords": [
      "'No Added MSG'",
      "'Clean-label'",
      "natural glutamate from fermentation",
      "zero synthetic MSG added"
    ]
  },
  {
    "id": 20,
    "category": "indepth",
    "categoryName": "คำถามเจาะลึก",
    "question": "การเก็บรักษา?????????",
    "answer": "Our water activity is very low, under 0.5. To keep it dry, we use moisture-barrier packaging like aluminum foil pouches and can add a food-grade silica gel pack.",
    "keywords": [
      "water activity under 0.5",
      "moisture-barrier aluminum foil pouches",
      "food-grade silica gel pack"
    ]
  },
  {
    "id": 21,
    "category": "indepth",
    "categoryName": "คำถามเจาะลึก",
    "question": "กินแค่เครื่องปรุงก็ได้!!!!!!!",
    "answer": "But BioZabb is different. When you eat, you also get natural nutrients and color from real vegetables, with organic acids from fermentation that support health. And every spoon helps reduce food waste, better for the planet.",
    "keywords": [
      "real vegetable nutrients & color",
      "organic acids support health",
      "reduces food waste",
      "better for the planet"
    ]
  }
];
