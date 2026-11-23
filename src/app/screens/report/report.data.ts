/** How one promise holds up across Promise → Proof → Echo (store values; display lives in VERDICT). */
export type Verdict = 'broken' | 'drifting' | 'unsupported' | 'holding';

export const VERDICT: Record<Verdict, { label: string; chip: string; border: string }> = {
  broken: { label: 'Broken', chip: 'red', border: 'var(--red)' },
  drifting: { label: 'Drifting', chip: 'amber', border: 'var(--sand)' },
  unsupported: { label: 'Unsupported', chip: 'amber', border: 'var(--sand)' },
  holding: { label: 'Holding', chip: 'teal', border: 'var(--teal)' },
};

/** One cell: what was found, and where. */
export interface Trace { text: string; source: string; }

/** One row of the Triad Connection Sheet. */
export interface ConnectionRow {
  topic: string;
  promise: Trace;
  proof: Trace;
  echo: Trace;
  verdict: Verdict;
  signals: string;
  /** Number in "What to fix first", if this row has a fix. */
  fix?: number;
  evidence: number;
}

/** FreshBox Kitchens' Triad Connection Sheet. Illustrative. */
export const CONNECTION_SHEET: ConnectionRow[] = [
  {
    topic: 'Delivery time',
    promise: { text: '“Delivered fresh in 30 minutes.”', source: 'Homepage hero · since Mar 2024' },
    proof: { text: 'Median 70 min. Checkout itself quotes 45–90 min.', source: '38 of 41 delivery reviews · checkout walk · on-time 58% (your data)' },
    echo: { text: 'Ads still say “30-minute delivery”. Reviews now joke about it.', source: '6 search ads · 14 reviews quoting the promise' },
    verdict: 'broken', signals: 'Reliability · Expectation', fix: 1, evidence: 112,
  },
  {
    topic: 'Price position',
    promise: { text: '“Premium, chef-designed meals.” Worth every rupee.', source: 'Homepage · pricing page' },
    proof: { text: 'Average order ₹349, top quartile for the city. Customers accept it when food is on time.', source: 'Business metrics · 64 reviews on price' },
    echo: { text: 'Founder posts: “the cheapest in Bengaluru”. Search summary calls it a budget service.', source: '15 of 27 posts · AI overview · sales lead’s intent answers' },
    verdict: 'broken', signals: 'Expectation', fix: 2, evidence: 96,
  },
  {
    topic: 'Portions',
    promise: { text: '“Generous, chef-plated portions.”', source: 'Menu page' },
    proof: { text: 'Portion complaints in 52 reviews, rising every month since July.', source: '52 of 412 reviews · support tags (your data)' },
    echo: { text: 'Instagram hero shots show full bowls; customer photos do not.', source: '18 brand posts · 9 customer photos' },
    verdict: 'drifting', signals: 'Emotional', fix: 3, evidence: 79,
  },
  {
    topic: 'Chef-designed',
    promise: { text: '“Designed by our chef.”', source: 'Homepage · about page' },
    proof: { text: 'No chef is named or shown anywhere. Menu unchanged for 14 months.', source: 'Site walk · website history' },
    echo: { text: 'No post, review or press mention names a chef.', source: '27 posts · 412 reviews · search results' },
    verdict: 'unsupported', signals: 'Expectation', fix: 4, evidence: 41,
  },
  {
    topic: 'Easy ordering',
    promise: { text: '“Order in seconds.”', source: 'Homepage · app store listing' },
    proof: { text: '11-field sign-up before checkout. 29% of carts abandoned there.', source: 'Analytics funnel (your data) · checkout walk' },
    echo: { text: 'Search ads repeat “order in seconds”. 9% of support chats are login help.', source: 'Search ads · support export' },
    verdict: 'drifting', signals: 'Experience', evidence: 64,
  },
  {
    topic: 'Regular customers',
    promise: { text: '“Your weeknight regular.”', source: 'Homepage · email sign-up' },
    proof: { text: '24% order again within 90 days. Referrals 3%.', source: 'Business metrics (your data)' },
    echo: { text: 'No loyalty or referral message anywhere customers look.', source: 'Site walk · 27 posts · emails' },
    verdict: 'drifting', signals: 'Commitment', evidence: 37,
  },
  {
    topic: 'Fresh and tasty',
    promise: { text: '“Delivered fresh.” Restaurant-quality ingredients.', source: 'Homepage · pricing page' },
    proof: { text: '“Fresh” or “tasty” in 61% of reviews, steady for 12 months.', source: '412 reviews · 4 quarters' },
    echo: { text: 'Customers repeat it in their own words; search summary agrees.', source: 'Reviews · AI overview · 31 customer posts' },
    verdict: 'holding', signals: 'Emotional', evidence: 302,
  },
];
