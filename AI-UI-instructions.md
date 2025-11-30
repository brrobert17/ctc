# Project: Car Trading Companion – UI Specification (Updated)

You are building a responsive web application called **“Car Trading Companion”**.

The app is a used car marketplace companion for novice buyers and novice sellers, plus a secondary “power user” audience. It:

- Aggregates used car listings from multiple external marketplaces (e.g. Bilbasen, DBA, etc.).
- Provides powerful but easy-to-use filters for browsing listings.
- Includes an AI-based price assessment and confidence indicator.
- Includes an AI helper to explain car attributes, advise users, and translate vague needs into concrete filters.
- Assesses whether a listing is **Underpriced / Fairly priced / Overpriced**, with a confidence indicator and a short explanation.

The visual design should be **dark theme**, clean, conservative, and trustworthy — think “fintech / insurance / comparison site”, not flashy startup.

---

## 1. Global Look & Feel

### 1.1 Design style (Dark Theme)

- **Theme:** Dark by default (no light mode required for now).
- **Backgrounds:**
  - Main app background: very dark gray / charcoal.
  - Cards and panels: slightly lighter dark gray.
- **Text:**
  - Primary text: off-white / light gray for good contrast.
  - Muted secondary text: mid-gray tones.
- **Accent color:**
  - A calm blue or teal used sparingly:
    - Primary buttons.
    - Key highlights like the “Fairly priced / Underpriced / Overpriced” badge.
    - Links and active states.
- **UI elements:**
  - Rounded corners on cards and inputs (medium radius).
  - Soft, subtle shadows (no heavy/glowy neon effects).
  - No strong gradients or overly vibrant colors.
- **Typography:**
  - One clear sans-serif font.
  - Hierarchy:
    - XL headings for main titles.
    - Medium for section headings.
    - Normal for body text.
    - Smaller for labels and helper text.
  - Emphasis on readability and clear alignment.

### 1.2 Layout & Responsiveness

- **Max content width:** ~1200–1440px on desktop, centered.
- **Top header:** Sticky, dark background, subtle border or shadow.
- **Standard layout patterns:**
  - Desktop:
    - Browse page: left-hand filters column, right-hand listing area.
  - Tablet:
    - Filters can be a collapsible left panel or slide-in drawer.
  - Mobile:
    - Single-column layout.
    - Filters in slide-up / slide-in panel.
    - Navigation in a hamburger menu.

### 1.3 Branding

- **Logo:** Text-only wordmark: `Car Trading Companion`.
  - Simple, clean typography, no icon required.
- **Brand tone:** Serious, trustworthy, helpful. Avoid playful or overly “startup-y” visuals.

---

## 2. Navigation & Information Architecture

### 2.1 Core pages (for this implementation)

Implement the following main pages/routes:

1. **Home** (root).
2. **Browse Cars** (listings).
3. **Car Detail** (for a specific listing).
4. **Login**.
5. **Sign Up**.

Other concepts (price explanation, AI helper, confidence meter, etc.) are integrated into these core pages instead of having separate dedicated pages.

### 2.2 Global Header (Desktop)

- **Left:**
  - Logo: **“Car Trading Companion”** (clickable → Home).
- **Center/Right navigation links:**
  - `Home`
  - `Browse cars`
  - `Log in`
  - `Sign up` (styled as primary button)
- **AI assistant entry point:**
  - A subtle icon button or text + icon in the header, e.g.:
    - “Ask the AI assistant”
  - This opens the AI chat drawer.

### 2.3 Mobile Navigation

- **Top bar:**
  - Left: Logo.
  - Right: Hamburger menu icon.
- **Hamburger menu (slide-in panel):**
  - `Home`
  - `Browse cars`
  - `Log in`
  - `Sign up`
  - “Ask the AI assistant” (or AI icon).
- Optionally, a **floating chat button** for the AI assistant on the bottom-right.

### 2.4 Global Footer

- Simple footer with:
  - Links: `About`, `Privacy`, `Terms`.
  - Small disclaimer text:
    - “Car Trading Companion provides advisory estimates only. Always verify details with the seller.”

---

## 3. Core Pages & Flows

### 3.1 Home Page (Dark, Very Scannable)

**Goal:**  
Make it immediately clear what the site does and guide the user quickly to **Browse Cars**. The page should be simple and scannable, with only a few key sections.

#### 3.1.1 Above the Fold

**Layout (desktop):**

- Left: Text content and primary actions.
- Right: A **single** visual mock of a car listing card.

**Content:**

- **Main heading (H1):**
  - “Check if a used car is fairly priced — across multiple marketplaces.”
- **Short subheading (1–2 lines):**
  - “Car Trading Companion aggregates listings from sites like Bilbasen and DBA and uses AI to highlight good-value cars for you.”
- **Primary CTA button:**
  - “Browse used cars”
  - Style: prominent, accent color, large.
- **Secondary text link (optional, smaller):**
  - “Learn how our price estimates work”
  - Scrolls down to a short explanation section on the same page (no separate route).

#### 3.1.2 Hero Visual (Right Side)

- A single **mock listing card** showing:
  - Car image thumbnail.
  - Car title: “[Year] [Make] [Model]”.
  - Price: e.g. “129,900 DKK”.
  - Badge: “Fairly priced”.
  - Confidence meter: a simple bar or segmented meter.
- Keep it simple and not cluttered. This is just a visual hint of what the app does.

#### 3.1.3 Quick Search Bar (Optional, Under Hero Text)

- A compact search bar below the main buttons:
  - Fields:
    - `Make` (dropdown or autocomplete)
    - `Model` (dependent dropdown or autocomplete)
    - `Max price` (input)
    - Small text link: “More filters” → goes to Browse Cars with the current fields pre-applied.
  - Button: “Search cars”
- On mobile, stack fields vertically but keep it visually compact.

#### 3.1.4 Section: “How it works” (3 Steps)

- A single row of **3 small cards** (stacked vertically on mobile):
  1. “We gather listings from multiple sites.”
  2. “Our AI estimates a fair price for each car.”
  3. “You quickly spot good-value deals.”
- Each card:
  - Icon or simple graphic.
  - Short title.
  - 1–2 short lines of description.

#### 3.1.5 Section: “Why people use Car Trading Companion”

- Row of **3 benefit cards**:
  - **Card 1: “See if a listing is underpriced”**
    - Short text: mentions Under/Fair/Over pricing labels and confidence.
  - **Card 2: “Compare cars from different sites in one place”**
    - Short text: emphasize aggregation from multiple marketplaces.
  - **Card 3: “Built for non-experts”**
    - Short text: mentions tooltips, plain-language explanations, and AI helper.

Keep these brief; avoid long paragraphs.

#### 3.1.6 Section: “Trust & transparency”

- A compact strip/band section:
  - Heading: “How our pricing works (in short)”
  - 3 bullet points:
    - “Trained on historical used car listings.”
    - “Shows which factors influence the price.”
    - “Explains everything in plain language.”
  - Link/Text button:
    - “Read the full explanation” → scrolls to a slightly longer explanation on the same page or opens a simple modal, not a separate route.

---

### 3.2 Browse Cars / Listings Page

**Goal:**  
Show aggregated listings with **novice-friendly filters** and **range sliders** for key numeric filters (price, year, mileage).

#### 3.2.1 Top Section

- **Page title:** “Browse used cars”
- **Subtitle:** “Listings from multiple marketplaces in one place.”
- Optional small tag near the title: “AI-assisted price assessment”.
- **Search bar (top of page):**
  - Make/Model keyword input.
  - Optional `Location` input.
  - Search button.

#### 3.2.2 Layout (Desktop)

- **Left column:** Filters panel (scrollable).
- **Right column:** Listing results.

On tablet/mobile:

- Filters collapsed behind a “Filters” button that opens a slide-in drawer or slide-up panel.

#### 3.2.3 Filters Panel (Dark Theme, Slider-Based Where Appropriate)

Focus on **range sliders** for numeric fields:

- **Range-based sliders (with min/max values visible):**
  - **Price range:** min and max, e.g. “0 DKK” – “500,000 DKK”.
  - **Year range:** from earliest to latest year.
  - **Mileage range:** min to max kilometers.
- **Other filters:**
  - Body type (multi-select chips or checkboxes: hatchback, sedan, SUV, etc.).
  - Fuel type (chips or checkboxes: petrol, diesel, hybrid, electric).
  - Transmission (chips: automatic, manual).
  - Optional:
    - Source marketplace (Bilbasen, DBA, etc.) as checkboxes.
    - Seller type (dealer vs private).
- Each filter group:
  - Clear label.
  - Optional small “info” icon with tooltip (e.g. “Lower mileage usually means less wear and tear.”).
- **Novice vs advanced (optional but allowed):**
  - A simple toggle near the top of the filters:
    - “Novice filters” / “Advanced filters”
  - In advanced mode, additional sliders/fields can appear:
    - Engine size / horsepower.
    - Number of owners.
    - Condition / damage history (if available).
  - This should not overcomplicate the UI; advanced filters appear *below* the core ones.

#### 3.2.4 Sorting & Result Controls

Above the listing list/grid:

- Text: e.g. “245 cars found”.
- Sorting dropdown:
  - “Best value (AI)”
  - “Lowest price”
  - “Highest price”
  - “Newest listings”
  - “Lowest mileage”
- Buttons:
  - “Reset filters”
  - (If logged in) “Save this search”

#### 3.2.5 Listing Cards

Each listing card should be compact but information-rich and consistent across dark theme:

- **Card container:**
  - Dark card background, slightly lighter than page background.
  - Soft shadow on hover, small “lift” effect.
- **Content:**
  - **Thumbnail image** of the car on the left or top.
  - **Title:** “[Year] [Make] [Model] [Trim]”.
  - **Subline:** Body type, fuel type, transmission.
  - **Key attributes row:**
    - Mileage.
    - Year.
    - Location (if available).
  - **Price + AI assessment:**
    - Asking price: “129,900 DKK”.
    - Badge: “Underpriced” / “Fairly priced” / “Overpriced”.
      - Use both color and text/icon (do NOT rely only on color).
    - Confidence indicator:
      - Either a bar meter or text like “Confidence: High / Medium / Low”.
    - Text: “AI-estimated fair price: 135,000 DKK” (when available).
    - Source: “Source: Bilbasen” or “Source: DBA”.
  - **Actions:**
    - Primary button: “View details” → Car Detail page.
    - Secondary link: “View on [Marketplace]” → opens original listing in new tab.
- On hover (desktop):
  - Slight raise/shadow.
  - Optional hint text such as “See full price explanation”.

On mobile:

- Cards stack vertically.
- Layout becomes vertical instead of side-by-side rows, but the same information should remain visible.

---

### 3.3 Car Detail Page

**Goal:**  
For a specific listing, clearly show car details, price assessment, and a clear link to the **original listing**.

#### 3.3.1 Layout

- **Top section (summary):**
  - Left: Title and key tags.
  - Right: Price and AI assessment.
- **Below:**
  - Image gallery / main image.
  - Price explanation.
  - Detailed specs.
  - AI advice for novices.
  - Seller & source information (with original listing link).

#### 3.3.2 Top Summary

- **Title:** “[Year] [Make] [Model] [Trim]”
- **Tags:**
  - Body type (e.g. “Hatchback”).
  - Fuel type (e.g. “Petrol”).
  - Transmission (e.g. “Manual”).
- **Seller type:** “Dealer” or “Private seller”.

On the right:

- **Asking price:** Large, prominent.
- **Price badge:** “Underpriced” / “Fairly priced” / “Overpriced”.
- **Confidence meter:** Text and/or visual meter.
- **AI-estimated fair price:** e.g. “Fair price: 135,000 DKK (Range: 120,000–140,000 DKK)”.

#### 3.3.3 Image Gallery

- A simple image carousel or main image area:
  - Large main image.
  - Thumbnails below (or dots for pagination).
- Works well in dark theme (dark background, light controls).

#### 3.3.4 Price Explanation Section

- A card titled: “Why we think this price is [Under/Fair/Over]”.
- Contents:
  - Short paragraph explanation aimed at novices (placeholder text is fine).
  - List or bar chart of top factors (3–5 items), e.g.:
    - “Mileage”
    - “Age of the car”
    - “Model popularity”
    - “Fuel type”
  - Each factor can include indication whether it pushed the price up or down compared to similar cars.
- A text link: “Learn more about how our pricing works”  
  - This can scroll to a short explanation block on the Home page or open a small modal. No separate “How pricing works” page is required for this implementation.

#### 3.3.5 Car Details Section

- Display the details in a two-column layout on desktop (stacked on mobile):

**Basic details:**

- Year  
- Make  
- Model  
- Trim  
- Body type  
- Color  

**Technical details:**

- Mileage  
- Engine size / power (if available)  
- Fuel type  
- Transmission  
- Drive type (if available)  

**Ownership & documentation (if available):**

- Number of owners  
- Inspection/MOT date  
- Service history (yes/no or brief text)

#### 3.3.6 AI Advice Panel

- Card titled: “AI advice for this car”.
- Content:
  - Bulleted list (novice-friendly):
    - “Things to check before buying this model”
    - “Questions to ask the seller”
    - “What to look for during a test drive”
- Button:
  - “Ask more questions about this car”  
    → opens the AI assistant drawer with context of this specific listing.

#### 3.3.7 Seller & Source Section

- Show seller info:
  - Seller name (if available) and seller type (Dealer/Private).
- **Link to original listing (required):**
  - Button: “View this car on [Marketplace]”
  - Opens the original listing URL in a new tab.
- Small note/disclaimer:
  - “We do not handle payments. Always verify the car and documents with the seller.”

---

### 3.4 AI Assistant (Global)

The AI assistant is a **global helper** accessible from:

- Header: “Ask the AI assistant” button/icon.
- Contextual buttons:
  - From Car Detail page: “Ask more questions about this car”.
- Optional floating button on mobile/desktop.

#### 3.4.1 Chat UI Pattern

- **Desktop:** Slide-in drawer from the right.
- **Mobile:** Full-screen modal.

#### 3.4.2 Chat Header

- Title: “Car Trading Companion Assistant”.
- Short description:
  - “Ask about car prices, what to look for, or help choosing between listings.”

#### 3.4.3 Conversation Area

- User and assistant messages as bubbles (dark theme-friendly).
- Support for **suggested quick actions** (chips) at the bottom, e.g.:
  - “Explain what affects car prices.”
  - “Help me choose between two cars.”
  - “Explain this term: ABS, horsepower, etc.”

#### 3.4.4 Context Awareness

- When opened from a **Car Detail** page:
  - Show a small context tag at top:
    - “Context: [Year] [Make] [Model] on [Marketplace]”.
- When opened from Browse or Home:
  - No specific context, or a generic tag like “Context: browsing used cars”.

---

### 3.5 Authentication Pages

Keep both **Login** and **Sign Up** pages clean and standard.

#### 3.5.1 Login

- Title: “Log in”.
- Fields:
  - Email.
  - Password.
- Buttons:
  - Primary: “Log in”.
  - Secondary text/link: “Don’t have an account? Sign up”.
- Optional placeholder for social login (e.g. “Continue with Google”).
- Clear, simple error messages (e.g. “Incorrect email or password.”).

#### 3.5.2 Sign Up

- Title: “Sign up”.
- Fields:
  - Email.
  - Password.
  - Confirm password (optional).
- Buttons:
  - Primary: “Create account”.
  - Secondary text/link: “Already have an account? Log in”.
- Highlight basic benefit:
  - “Save searches and favorite cars.”

---

## 4. General UX & Interaction Guidelines

### 4.1 Novice-First Copywriting

- Avoid jargon, or explain it via small tooltips.
- Prefer:
  - Short paragraphs.
  - Bullet lists.
  - Visual indicators (badges, meters).

### 4.2 Empty States

- **No listings match filters:**
  - Message: “No cars match these filters yet.”
  - Button: “Relax filters”.
  - Optional hint: “Ask the assistant to help adjust your filters.”
- **No saved searches / favorites (if implemented later):**
  - Encouragement: “Start by browsing cars and clicking the heart icon to save them.”

### 4.3 Loading States

- Use **skeleton cards** for listings and detail page sections.
- For AI/ML-related content:
  - Subtle inline spinner + text:
    - “Computing price estimate…”
    - “Generating explanation…”

### 4.4 Error States

- Clear, non-technical messages:
  - “We couldn’t load new listings right now. Please try again in a moment.”
- Provide a “Retry” button where appropriate.

### 4.5 Accessibility

- Adequate color contrast (especially in dark theme).
- Proper labels for all inputs and sliders.
- Keyboard-navigable modals and drawers.
- Do not rely only on color for Under/Fair/Over:
  - Use text labels and/or icons.

---

## 5. Implementation Notes for Windsurf

- **Frontend stack:** React + Tailwind CSS.
- **Theme:**
  - Implement a **dark theme** as default.
  - Use Tailwind’s dark-friendly colors (e.g. `bg-slate-900`, `bg-slate-800`, `text-slate-100`, etc.) plus a custom accent color.
- **High-level component structure:**
  - Layout:
    - `Header`, `Footer`, `MainContainer`.
  - Home:
    - `HeroSection`
    - `QuickSearchBar`
    - `HowItWorksSection`
    - `BenefitsSection`
    - `TrustSection`
  - Browse:
    - `FiltersSidebar` (with range sliders)
    - `ListingsGrid` or `ListingsList`
    - `ListingCard`
    - `SortBar`
  - Car Detail:
    - `CarDetailLayout`
    - `ImageGallery`
    - `PriceSummary`
    - `PriceExplanationCard`
    - `CarSpecsGrid`
    - `AIAdviceCard`
    - `SellerInfoCard`
  - AI Chat:
    - `ChatAssistantDrawer`
    - `ChatMessageList`
    - `ChatInput`
    - `QuickActionChips`
  - Auth:
    - `LoginForm`
    - `SignupForm`

- **Data & Logic (mock/placeholder is fine initially):**
  - Aggregated listings from multiple marketplaces.
  - ML/AI price estimate and Under/Fair/Over classification.
  - LLM responses for the AI assistant.
  - Original listing URLs for each car.

The UI should be modular and reusable. Components like the **price badge**, **confidence meter**, and **listing cards** should be used consistently across the Browse and Car Detail pages.
