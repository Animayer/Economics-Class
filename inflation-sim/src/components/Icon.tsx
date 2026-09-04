type IconName = "film" | "gas" | "bread" | "pizza" | "milk" | "coffee" | "car" | "house" | "wage";

const paths: Record<IconName, string> = {
  film: "M4 6h16v12H4V6zm2 2v2h2V8H6zm10 0v2h2V8h-2zM6 14v2h2v-2H6zm10 0v2h2v-2h-2zM10 8h4v8h-4V8z",
  gas: "M7 4h8v12a3 3 0 0 1-3 3H10a3 3 0 0 1-3-3V4zm8 3h2.5A2.5 2.5 0 0 1 20 9.5V16a2 2 0 1 1-2-2v-4h-3M8 8h6",
  bread: "M5 10c0-3 3-5 7-5s7 2 7 5v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7zm3-1.2c.4-.5 1.4-.8 4-.8s3.6.3 4 .8",
  pizza: "M12 4c6 0 9 8 9 8s-3 8-9 8-9-8-9-8 3-8 9-8zm0 5a1.4 1.4 0 1 0 0 2.8A1.4 1.4 0 0 0 12 9zm-3.2 4.4a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2zm5.4 1.2a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2z",
  milk: "M8 4h8l1 3v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V7l1-3zm1 3h6M9 4h6",
  coffee: "M6 8h11v6a5 5 0 0 1-5 5H11a5 5 0 0 1-5-5V8zm11 1h1.5A2.5 2.5 0 0 1 21 11.5 2.5 2.5 0 0 1 18.5 14H17M7 21h10M9 5c.4-1 1-1.6 2-1.6S13 4 13.4 5",
  car: "M5 13h14l-1.2-4.2A2 2 0 0 0 15.9 7H8.1a2 2 0 0 0-1.9 1.8L5 13zm1 1a1.6 1.6 0 1 0 0 3.2A1.6 1.6 0 0 0 6 14zm12 0a1.6 1.6 0 1 0 0 3.2A1.6 1.6 0 0 0 18 14zM4 17h16",
  house: "M4 11.5 12 5l8 6.5V20H4v-8.5zM9 20v-6h6v6",
  wage: "M4 8h16v10H4V8zm2 0V6.5A2.5 2.5 0 0 1 8.5 4h7A2.5 2.5 0 0 1 18 6.5V8M12 11.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4z",
};

export function Icon({ name }: { name: string }) {
  const d = paths[name as IconName];
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      {d ? (
        <path d={d} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="1.7" />
      )}
    </svg>
  );
}
